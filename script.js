const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');
const fs = require('fs');

const urlsFilePath = './urls.txt';

// Load the configuration file
const configData = fs.readFileSync('config.json');
const config = JSON.parse(configData);

const currentConfig = config.globle.currentConfiguration;

// Create the output folder if it doesn't exist
if (!fs.existsSync(config[currentConfig].folderpath)) {
  fs.mkdirSync(config[currentConfig].folderpath);
}

fs.writeFileSync(config[currentConfig].folderpath + config[currentConfig].spice + 'output.txt', '');
fs.writeFileSync(config[currentConfig].folderpath + config[currentConfig].spice + 'failed.txt', '');

(async function () {
  await loopUrls(urlsFilePath, config[currentConfig].folderpath + config[currentConfig].spice + 'failed.txt');
})();

// Loop through the URLs
async function loopUrls(urlsFilePath, fileOutput) {
  try {
    const urls = fs.readFileSync(urlsFilePath, 'utf-8').split('\n').filter(url => url.trim() !== '');

    for (const url of urls) {
      try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        // Find all tables on the page
        const tables = $('table');

        // Pick the first table
        const table = $(tables[config[currentConfig].tableIndex]);

        // Get the last row of the table
        const rows = table.find('tr');
        const lastRow = rows.last();

        // Extract the cell values of the last row
        const rowData = lastRow.find('td').filter((index) => index !== 0) // Remove second column data (index 1)
          .map((index, element) => $(element).text().trim()).get();

        // Find the exact <p> element containing the date
        const dateElement = $('p').filter((index, element) => {
          const text = $(element).text();
          return /\d{2}\.\d{2}\.\d{4}/.test(text); // Check if the text contains the date pattern
        });

        const dateText = dateElement.text();
        const dateMatch = dateText.match(/(\d{2})\.(\d{2})\.(\d{4})/);
        const date = dateMatch ? `${dateMatch[2]}-${dateMatch[1]}-${dateMatch[3]}` : 'N/A';


        const dateParts = date.split('-');
        const modifiedDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;

        rowData.unshift(dateParts[0]);
        rowData.unshift(modifiedDate.replace(/\./g, '-'));

        rowData.push(url);

        // Prepare the text to be appended to the file
        const rowString = rowData.join('\t');
        const text = `${rowString}\n`;

        // Generate the output file path based on the URL
        const fileName = config[currentConfig].spice + 'output.txt';
        const filePath = `${config[currentConfig].folderpath}/${fileName}`;

        // Append the text to the file
        fs.appendFileSync(filePath, text);
        console.log(`The modified last row of the table for ${url} has been appended to: ${filePath}`);
      } catch (error) {
        console.error(`An error occurred while fetching data from ${url}:`, error);
        fs.appendFileSync(fileOutput, url + '\n');
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

function extractDateFromUrl(url) {
  const dateMatch = url.match(/\/(\d{4}).*?([a-zA-Z]+).*?(\d{1,2})/i);
  if (dateMatch) {
    const year = dateMatch[1];
    const month = dateMatch[2];
    const day = dateMatch[3];

    // Find the closest number to the month on the left side (less than 32)
    const numbers = url.substring(0, dateMatch.index).match(/\d+/g);
    const closestNumber = numbers ? Math.max(...numbers.filter(num => num < 32)) : null;

    const formattedDay = closestNumber || day;
    const formattedDate = `${formattedDay}-${month}-${year}`;
    return formattedDate;
  } else {
    return "N/A";
  }
}
