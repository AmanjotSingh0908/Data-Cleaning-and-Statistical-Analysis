const fs = require('fs');

function parseCSV(filePath, delimiter = ',') {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.trim().split('\n');
    const headers = lines[0].split(delimiter).map(header => header.trim());
    const rows = lines.slice(1).map(line => {
        const values = line.split(delimiter).map(value => value.trim());
        return headers.reduce((acc, header, idx) => {
            acc[header] = values[idx];
            return acc;
        }, {});
    });
    return rows;
}

// Func. to clean data by removing rows with null
function cleanData(data) {
    return data.filter(row =>
        Object.values(row).every(value => value !== null && value !== "")
    );
}

// Func to cal the mean of a specific field
function mean(data, field) {
    const values = data
        .map(row => parseFloat(row[field]))
        .filter(value => !isNaN(value));
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
}

// Func to cal. the median of a specific field
function median(data, field) {
    const values = data
        .map(row => parseFloat(row[field]))
        .filter(value => !isNaN(value))
        .sort((a, b) => a - b);

    const len = values.length;
    const mid = Math.floor(len / 2);

    return len % 2 === 0 ? (values[mid - 1] + values[mid]) / 2 : values[mid];
}

// Func to cal. the mode of a specific field
function mode(data, field) {
    const values = data
        .map(row => parseFloat(row[field]))
        .filter(value => !isNaN(value));
    const frequency = {};
    values.forEach(val => frequency[val] = (frequency[val] || 0) + 1);
    const maxFreq = Math.max(...Object.values(frequency));
    return Object.keys(frequency)
        .filter(key => frequency[key] === maxFreq)
        .map(Number);
}

// Func to calculate the standard deviation of a specific field
function standardDeviation(data, field) {
    const values = data
        .map(row => parseFloat(row[field]))
        .filter(value => !isNaN(value));
    const avg = mean(data, field);
    const squareDiffs = values.map(value => (value - avg) ** 2);
    const avgSquareDiff = squareDiffs.reduce((acc, val) => acc + val, 0) / (values.length - 1);
    return Math.sqrt(avgSquareDiff);
}

// Func to calculate quartiles (Q1, Q2, Q3) of a specific field
function quartiles(data, field) {
    const values = data
        .map(row => parseFloat(row[field]))
        .filter(value => !isNaN(value))
        .sort((a, b) => a - b);

    const len = values.length;
    const mid = Math.floor(len / 2);

    // Median (Q2)
    const q2 = median(data, field);

    const lowerHalf = values.slice(0, mid);
    const upperHalf = len % 2 === 0 ? values.slice(mid) : values.slice(mid + 1);

    // Q1 and Q3
    const q1 = median(lowerHalf);
    const q3 = median(upperHalf);

    return { q1, q2, q3 };
}

function processCSV(filePath, field) {
    const data = parseCSV(filePath);
    const cleanedData = cleanData(data);

    console.log('Data:', cleanedData);
    console.log(`Mean of ${field}:`, mean(cleanedData, field));
    console.log(`Median of ${field}:`, median(cleanedData, field));
    console.log(`Mode of ${field}:`, mode(cleanedData, field));
    console.log(`Standard Deviation of ${field}:`, standardDeviation(cleanedData, field));
    console.log(`Quartiles of ${field}:`, quartiles(cleanedData, field));

    return cleanedData;
}

module.exports = { processCSV, mean, median, mode, standardDeviation, quartiles };
