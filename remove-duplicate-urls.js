const fs = require('fs');


const urlsFilePath = './urls.txt';
const urls = fs.readFileSync(urlsFilePath, 'utf-8').split('\n').filter(url => url.trim() !== '');

// Remove duplicate URLs
const uniqueUrls = Array.from(new Set(urls));

//clear the contents of urls.txt
fs.writeFile('./urls.txt', '', function(){console.log('content cleard in url.txt')})


// Save the unique URLs back to the file
fs.writeFileSync("urls.txt", uniqueUrls.join('\n'));
console.log("wrote new urls of lines "+uniqueUrls.length);