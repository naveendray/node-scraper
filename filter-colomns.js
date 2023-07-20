const fs = require('fs');

// Read the data from output.txt
fs.readFile('collected.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Split the data into individual lines
  const lines = data.trim().split('\n');

  // Map each line to remove the desired columns
  const modifiedLines = lines.map(line => {
    const columns = line.split('\t');

    // Indices of the columns you want to keep
    const keepColumns = [0, 1, 2];

    // Filter out the unwanted columns
    const newColumns = columns.filter((col, index) => keepColumns.includes(index));

    return newColumns.join('\t');
  });

  // Join the modified lines with newline characters
  const modifiedData = modifiedLines.join('\n');

  // Write the modified data to a new file called modified.txt
  fs.writeFile('columns-removed.txt', modifiedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing the file:', err);
      return;
    }
    console.log('Modified data saved to "modified.txt"');
  });
});
