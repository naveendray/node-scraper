const fs = require('fs');

// Read the data from the file
fs.readFile('columns-removed.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Split the data into individual lines
  const lines = data.trim().split('\n');

  // Create an object to store the data in a grid format
  const grid = {};

  // Loop through the lines to populate the grid object
  lines.forEach(line => {
    const columns = line.split('\t');
    const dateParts = columns[0].split('-');
    const month = dateParts[0];
    const year = dateParts[2];

    if (!grid[month]) {
      grid[month] = {};
    }

    grid[month][year] = columns[2];
  });

  // Get the unique years for the column headings
  const years = [...new Set(lines.map(line => line.split('\t')[0].split('-')[2]))];

  // Create the column headings
  const columnHeadings = ['', ...years];

  // Create the grid data
  const gridData = [columnHeadings.join('\t')];

  // Loop through the months and add the data for each month to the gridData array
  for (let month = 1; month <= 12; month++) {
    const monthString = month.toString().padStart(2, '0');
    const rowValues = [monthString];

    for (const year of years) {
      rowValues.push(grid[monthString]?.[year] || '');
    }

    gridData.push(rowValues.join('\t'));
  }

  // Write the grid data to the file
  fs.writeFile('grid.txt', gridData.join('\n'), 'utf8', err => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Grid data has been written to "grid.txt"');
    }
  });
});
