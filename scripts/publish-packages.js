import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGES_DIR = path.join(__dirname, '..', 'packages');

async function getPackages() {
  return Promise.all(
    fs.readdirSync(PACKAGES_DIR)
      .filter(file => {
        const dirPath = path.join(PACKAGES_DIR, file);
        const packageJsonPath = path.join(dirPath, 'package.json');
        return fs.statSync(dirPath).isDirectory() && fs.existsSync(packageJsonPath);
      })
      .map(async dir => ({
        name: dir,
        path: path.join(PACKAGES_DIR, dir),
        pkg: JSON.parse(fs.readFileSync(path.join(PACKAGES_DIR, dir, 'package.json'), 'utf8'))
      }))
  );
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      ...options
    });

    const timeout = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`Command timed out: ${command} ${args.join(' ')}`));
    }, 120000); // 2 minute timeout

    child.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}: ${command} ${args.join(' ')}`));
      }
    });

    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

function publishPackage(packagePath) {
  return new Promise(async (resolve) => {
    try {
      // Check if there are uncommitted changes in the package directory
      try {
        execSync('git diff --quiet', { cwd: packagePath });
      } catch (error) {
        console.error(`Uncommitted changes detected in ${packagePath}. Please commit or stash changes before publishing.`);
        resolve(false);
        return;
      }

      const packageName = path.basename(packagePath);
      
      // Increment patch version with --no-git-tag-version to avoid git operations
      console.log(`Bumping version for ${packageName}...`);
      await runCommand('npm', ['version', 'patch', '--no-git-tag-version'], { cwd: packagePath });

      // Publish package - simplified command that works manually
      console.log(`Publishing ${packageName}...`);
      await runCommand('npm', ['publish', '--access', 'public'], { cwd: packagePath });

      resolve(true);
    } catch (error) {
      console.error(`Failed to publish package at ${packagePath}:`, error.message);
      resolve(false);
    }
  });
}

async function main() {
  // Verify npm login status
  try {
    execSync('npm whoami', { stdio: 'inherit' });
  } catch (error) {
    console.error('You must be logged in to npm. Run npm login first.');
    process.exit(1);
  }

  // Check if there are uncommitted changes in the root directory
  try {
    execSync('git diff --quiet', { cwd: path.join(__dirname, '..') });
  } catch (error) {
    console.error('Uncommitted changes detected in the root directory. Please commit or stash changes before publishing.');
    process.exit(1);
  }

  const packages = await getPackages();
  console.log('Publishing packages:', packages.map(p => p.name).join(', '));

  let success = true;
  for (const pkg of packages) {
    console.log(`\nPublishing ${pkg.name}...`);
    const result = await publishPackage(pkg.path);
    if (!result) {
      success = false;
      break;
    }
  }

  if (success) {
    console.log('\nAll packages published successfully!');
  } else {
    console.error('\nFailed to publish all packages');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});