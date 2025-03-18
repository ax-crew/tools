import { execSync } from 'child_process';
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

function publishPackage(packagePath) {
  try {
    // Increment patch version
    execSync('npm version patch', {
      cwd: packagePath,
      stdio: 'inherit'
    });

    // Publish package with legacy peer deps flag
    execSync('npm publish --access public --legacy-peer-deps', {
      cwd: packagePath,
      stdio: 'inherit'
    });

    return true;
  } catch (error) {
    console.error(`Failed to publish package at ${packagePath}:`, error.message);
    return false;
  }
}

async function main() {
  // Verify npm login status
  try {
    execSync('npm whoami', { stdio: 'inherit' });
  } catch (error) {
    console.error('You must be logged in to npm. Run npm login first.');
    process.exit(1);
  }

  const packages = await getPackages();
  console.log('Publishing packages:', packages.map(p => p.name).join(', '));

  let success = true;
  for (const pkg of packages) {
    console.log(`\nPublishing ${pkg.name}...`);
    if (!publishPackage(pkg.path)) {
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