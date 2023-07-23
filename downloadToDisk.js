const fs = require('fs');
const axios = require('axios');

const urlsFilePath = 'urls.txt';

const downloadedLocations = [];

async function downloadUrlContent(url) {
  try {
    const response = await axios.get(url);
    const content = response.data;

    // Save the content to a file
    const filename = url.split('/').pop();
    const location = `./downloaded/${filename}`;
    fs.writeFileSync(location, content);

    downloadedLocations.push(location.replace(/.*\//, 'http://localhost/'));
    console.log(`Downloaded: ${url} => Saved to: ${location}`);
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
  }
}

(async () => {
  // Read the URLs from the file
  const urls = fs.readFileSync(urlsFilePath, 'utf-8').split('\n').filter(url => url.trim() !== '');

  // Create the "downloaded" folder if it doesn't exist
  if (!fs.existsSync('./downloaded')) {
    fs.mkdirSync('./downloaded');
  }

  // Download content of each URL
  for (const url of urls) {
    await downloadUrlContent(url);
  }

  // Write the downloaded locations to a new file
  fs.writeFileSync('./downloaded_locations.txt', downloadedLocations.join('\n'));
  console.log('Downloaded locations written to "downloaded_locations.txt"');
})();
