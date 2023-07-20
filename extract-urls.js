const fs = require('fs');

fs.readFile('code_sample.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  const regex = /https:\/\/.*?\.html/g;
  const urls = data.match(regex) || [];

  const urlsString = urls.join('\n');

  fs.writeFile('urls.txt', urlsString, 'utf8', (err) => {
    if (err) {
      console.error('Error writing the file:', err);
      return;
    }

    console.log('URLs extracted and saved to "urls.txt"');
  });
});

const urlsFilePath = './urls.txt';
const urls = fs.readFileSync(urlsFilePath, 'utf-8').split('\n').filter(url => url.trim() !== '');

// Remove duplicate URLs
const uniqueUrls = Array.from(new Set(urls));

//clear the contents of urls.txt
fs.writeFile('./urls.txt', '', function(){console.log('content cleard in url.txt')})


// Save the unique URLs back to the file
fs.writeFileSync("urls.txt", uniqueUrls.join('\n'));
console.log("wrote new urls of lines "+uniqueUrls.length);
