import generatePuzzles from "./index.js";
import parseCommandLineArguments from "./parse_command_line_arguments.js";

const { numberOfPuzzles,
	batchSize,
	minimumDifficulty,
	maximumDifficulty,
	minimumClues,
	maximumClues} = parseCommandLineArguments();

generatePuzzles(numberOfPuzzles, batchSize, minimumDifficulty, maximumDifficulty,
	minimumClues, maximumClues);
