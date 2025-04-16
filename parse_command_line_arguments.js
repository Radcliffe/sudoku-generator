import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const parseCommandLineArguments = () => {
	const argv = yargs(hideBin(process.argv)).parse()
	const numberOfPuzzles = argv._[0] ? +argv._[0] : 1000000;
	const batchSize = argv._[1] ? +argv._[1] : 1000;
	const minimumDifficulty = argv.minimumDifficulty ? +argv.minimumDifficulty : 0;
	const maximumDifficulty = argv.maximumDifficulty ? +argv.maximumDifficulty : Infinity;
	const minimumClues = argv.minimumClues ? +argv.minimumClues : 0;
	const maximumClues = argv.maximumClues ? +argv.maximumClues : 81;
	const minimumCluesValid = minimumClues >= 0 && minimumClues <= 81;
	const maximumCluesValid = maximumClues >= 0 && maximumClues <= 81;
	if (numberOfPuzzles <= 0 || !Number.isInteger(numberOfPuzzles)) {
		console.error('Number of puzzles must be a positive integer');
		process.exit(1);
	}
	if (batchSize <= 0 || !Number.isInteger(batchSize)) {
		console.error('Batch size must be a positive integer');
		process.exit(1);
	}
	if (minimumCluesValid && maximumCluesValid && minimumClues > maximumClues) {
		console.error('Minimum clues must be less than or equal to maximum clues');
		process.exit(1);
	}
	if (minimumDifficulty < 0) {
		console.error('Minimum difficulty must be 0 or greater');
		process.exit(1);
	}
	if (maximumDifficulty < 0) {
		console.error('Maximum difficulty must be 0 or greater');
		process.exit(1);
	}
	if (minimumDifficulty > maximumDifficulty) {
		console.error('Minimum difficulty must be less than or equal to maximum difficulty');
		process.exit(1);
	}
	return {
		numberOfPuzzles,
		batchSize,
		minimumDifficulty,
		maximumDifficulty,
		minimumClues,
		maximumClues
	}
}

export default parseCommandLineArguments;
