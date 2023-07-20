const { execSync } = require('child_process');

try {
  console.log("Running Script...");
  execSync('node script.js', { stdio: 'inherit' });

  console.log("Running filter-results...");
  execSync('node filter-results.js', { stdio: 'inherit' });

  console.log("Running filter coloumns...");
  execSync('node filter-colomns.js', { stdio: 'inherit' });

  console.log("Running makeGrid...");
  execSync('node makeGrid.js', { stdio: 'inherit' });

  console.log("All scripts completed.");
} catch (error) {
  console.error("An error occurred:", error);
}
