const g = require('./index.js');
const args = process.argv.slice(2);
const numberOfPuzzles = args[0] ? +args[0] : 1000000;
const batchSize = args[1] ? +args[1] : 1000;
g.generatePuzzles(numberOfPuzzles, batchSize);
