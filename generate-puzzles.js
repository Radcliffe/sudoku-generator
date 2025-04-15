const g = require('./index.js');
const args = process.argv.slice(2);
const numberOfPuzzles = args[0] ? +args[0] : 1000000;
const batchSize = args[1] ? +args[1] : 1000;

if (numberOfPuzzles <= 0 || !Number.isInteger(numberOfPuzzles)) {
	console.error('Number of puzzles must be a positive integer');
	process.exit(1);
}
if (batchSize <= 0 || !Number.isInteger(batchSize)) {
	console.error('Batch size must be a positive integer');
	process.exit(1);
}

g.generatePuzzles(numberOfPuzzles, batchSize);
