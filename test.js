const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://exagri.info/mkt/2019/26.02.2019.html';

axios.get(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    // Find all tables on the page
    const tables = $('table');

    // Check if at least one table exists
    if (tables.length > 0) {
      // Get the first table
      const firstTable = tables.eq(8);

      // Get the last row of the first table
      const lastRow = firstTable.find('tr').last();

      // Extract the cell values of the last row
      const rowData = lastRow.find('td').map((index, element) => $(element).text().trim()).get();

      console.log(rowData);
    } else {
      console.log('No tables found on the page.');
    }
  })
  .catch(error => {
    console.error('Error fetching the page:', error);
  });
