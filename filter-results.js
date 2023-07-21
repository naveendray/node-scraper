const fs = require('fs');
// const config = require('./config');

// Load the configuration file
const configData = fs.readFileSync('config.json');
const config = JSON.parse(configData);

const currentConfig = config.globle.currentConfiguration;

// Read the data from output.txt
fs.readFile(config[currentConfig].folderpath+config[currentConfig].spice+'output.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Split the data into individual lines
  const lines = data.trim().split('\n');

  // Initialize variables
  const collectedRecords = [];
  let previousMonth = '';

  // Iterate over each line
  lines.forEach(line => {
    const [date] = line.split('\t');
    const currentMonth = date.split('-')[0];

    // Check if it's a new month
    if (currentMonth !== previousMonth) {
        console.log(currentMonth);
      collectedRecords.push(line);
      previousMonth = currentMonth;
    }
  });

  // Join the collected records with newline characters
  const collectedData = collectedRecords.join('\n');

  // Write the collected data to a new file called collected.txt
  fs.writeFile(config[currentConfig].folderpath+config[currentConfig].spice+'collected.txt', collectedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing the file:', err);
      return;
    }
    console.log('Collected records saved to '+config[currentConfig].spice+'collected.txt');
  });
});
