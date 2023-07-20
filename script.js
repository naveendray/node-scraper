const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');
const fs = require('fs');
const config = require('./config');

const urlsFilePath = './urls.txt';
const research = config.spice;
const keyw = 'Arecanut(Rs./100 nuts)';

fs.writeFileSync(config.folderpath+research+'output.txt', '');
fs.writeFileSync(config.folderpath+research+'failed.txt', '');
console.log(config.folderpath+research+'output.txt');
// Create the output folder if it doesn't exist
if (!fs.existsSync(config.folderpath)) {
  fs.mkdirSync(config.folderpath);
}

(async function () {
  await loopUrls(urlsFilePath, config.folderpath+config.spice+'failed.txt');
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

        // Find the table under the heading "Arecanut(Rs./100 nuts)"
        const heading = $('h3').filter((index, element) => $(element).text() === keyw);
        const table = heading.next('table');

        // Get the last row of the table
        const rows = table.find('tr');
        const lastRow = rows.last();

        // Extract the cell values of the last row
        const rowData = lastRow.find('td').filter((index) => index !== 0) // Remove second column data (index 1)
          .map((index, element) => $(element).text().trim()).get();

        // Extract the date from the URL
        const urlObject = new URL(url);
        const dateMatch = urlObject.pathname.match(/\/(\d{2}\.\d{2}\.\d{4})/);
        const date = dateMatch ? dateMatch[1] : 'Fucked';

        const dateParts = date.split('.');
        const modifiedDate = `${dateParts[1]}-${dateParts[0]}-${dateParts[2]}`;

        rowData.unshift(dateParts[1]);
        rowData.unshift(modifiedDate.replace(/\./g, '-'));

        // Prepare the text to be appended to the file
        const rowString = rowData.join('\t');
        const text = `${rowString}\n`;

        // Generate the output file path based on the URL
        const fileName = research+'output.txt';
        const filePath = `${config.folderpath}/${fileName}`;

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
