# Data-Cleaning-and-Statistical-Analysis

`csv_stats_analyser` is an NPM package designed for analyzing CSV files. It provides functions for parsing CSV data, cleaning it, and performing various statistical calculations, making it easier to manage and extract statistical insights from your data.

Add the following code to get the basic statistical info about your CSV Dataset

```
const { processCSV, mean, median, mode, standardDeviation, quartiles } = require('csv_stats_analyser');

const filePath = '/path/to/your/csv'; 
const data = processCSV(filePath);
```
The above code will console the measures of central tendency (like mean, median, mode, standard deviationa and quartiles)

To access the variables used follow the code below:-
```
console.log('Processed Data:', data);
console.log('Mean:', mean(data, 'value'));
console.log('Median:', median(data, 'value'));
console.log('Mode:', mode(data, 'value'));
console.log('Standard Deviation:', standardDeviation(data, 'value'));
console.log('Quartiles:', quartiles(data, 'value'));
```

Tip : Try to attach a relative path in ```FilePath``` for your CSV File
