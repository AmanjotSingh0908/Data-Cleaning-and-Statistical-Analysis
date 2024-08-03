const fs = require('fs');

function parseCSV(filePath, delimiter = ','){
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.trim().split('\n');
    const headers = lines[0].split(delimiter).map(header => header.trim());
    const rows = lines.slice(1).map(line => {
        const values = line.split(delimiter).map(value=> value.trim());
        return headers.reduce((acc, header, idx) => {
            acc[header] = values[idx];
            return acc;
        }, {})
    })
    return rows;
}

// Function to clean data by removing rows with null
function cleanData(data) {
    return data.filter((row) =>
      Object.values(row).every((value) => value !== null && value !== "")
    );
  }
  
  // Function to calculate the mean
  function mean(data, field) {
    const values = data
      .map((row) => parseFloat(row[field]))
      .filter((value) => !isNaN(value));
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }
  
  // calculate the median of either a direct array of values or from a specific field in data
  function median(values, field) {
    if (field) {
      values = values
        .map((row) => parseFloat(row[field]))
        .filter((value) => !isNaN(value));
    } else {
      values = values.slice();
    }
  
    const sortedValues = values.sort((a, b) => a - b);
    const len = sortedValues.length;
    const mid = Math.floor(len / 2);
    return len % 2 === 0
      ? (sortedValues[mid - 1] + sortedValues[mid]) / 2
      : sortedValues[mid];
  }
  
  //calculate the mode
  function mode(data, field) {
    const values = data
      .map((row) => parseFloat(row[field]))
      .filter((value) => !isNaN(value));
    const frequency = {};
    values.forEach((val) => (frequency[val] = (frequency[val] || 0) + 1));
    const maxFreq = Math.max(...Object.values(frequency));
    return Object.keys(frequency)
      .filter((key) => frequency[key] === maxFreq)
      .map(Number);
  }
  
  //to calculate  standard deviation of field
  function standardDeviation(data, field) {
    const values = data
      .map((row) => parseFloat(row[field]))
      .filter((value) => !isNaN(value));
    const avg = mean(data, field);
    const squareDiffs = values.map((value) => (value - avg) ** 2);
    const avgSquareDiff =
      squareDiffs.reduce((acc, val) => acc + val, 0) / (values.length - 1); // For sample standard deviation
    return Math.sqrt(avgSquareDiff);
  }
  
  // calculate quartiles (Q1, Q2, Q3)
  function quartiles(data, field) {
    const values = data
      .map((row) => parseFloat(row[field]))
      .filter((value) => !isNaN(value))
      .sort((a, b) => a - b);
    const len = values.length;
    const mid = Math.floor(len / 2);
  
    // Median (Q2)
    const q2 = median(values);
  
    const lowerHalf = values.slice(0, mid);
    const upperHalf = len % 2 === 0 ? values.slice(mid) : values.slice(mid + 1);
  
    // Q1 and Q3
    const q1 = median(lowerHalf);
    const q3 = median(upperHalf);
  
    return { q1, q2, q3 };
  }
  
function processCSV(filePath) {
    const data = parseCSV(filePath);
    const cleanedData = cleanData(data);

    console.log('Data:', cleanedData);
    console.log('Mean:', mean(cleanedData, 'value'));
    console.log('Median:', median(cleanedData, 'value'));
    console.log('Mode:', mode(cleanedData, 'value'));
    console.log('Standard Deviation:', standardDeviation(cleanedData, 'value'));
    console.log('Quartiles:', quartiles(cleanedData, 'value'));

    return cleanData(data);
}



module.exports = { processCSV, mean, median, mode, standardDeviation, quartiles };