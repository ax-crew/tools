const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PACKAGES_DIR = path.join(__dirname, '..', 'packages');

function getPackages() {
  return fs.readdirSync(PACKAGES_DIR)
    .filter(file => fs.statSync(path.join(PACKAGES_DIR, file)).isDirectory())
    .map(dir => ({
      name: dir,
      path: path.join(PACKAGES_DIR, dir),
      pkg: require(path.join(PACKAGES_DIR, dir, 'package.json'))
    }));
}

function publishPackage(packagePath) {
  try {
    // Increment patch version
    execSync('npm version patch', {
      cwd: packagePath,
      stdio: 'inherit'
    });

    // Publish package
    execSync('npm publish --access public', {
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

  const packages = getPackages();
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