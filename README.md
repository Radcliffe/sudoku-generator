# Sudoku Puzzle Generator

This project contains Node.js scripts to generate a database of Sudoku puzzles with solutions.
Each puzzle includes a difficulty rating, and the number of clues (or givens) is also included.

The difficulty rating is open-ended, and is based on the search depth required to solve the puzzle.
Since the difficulty is estimated by an algorithm, it does not always reflect the difficulty for a
human solver. Most puzzles have difficulties between 0 and 2, but a few puzzles have difficulty
ratings of 7 or higher.

Most puzzles have between 23 and 26 clues, but I have encountered puzzles with as few as 20 clues and
as many as 29 clues. It is known that 17 is the least possible number of clues for a proper Sudoku
puzzle having a unique solution, but these are hard to generate.

It is not possible with these scripts to specify the difficulty level or the number of clues when
generating a Sudoku puzzle. The scripts generate Sudoku puzzles completely at random, and then estimate
the difficulty afterwards.

## Getting started

### Prerequisites

This project requires Node.js and MySQL. I am using Node.js version 8.10.0 and MySQL version 5.7.28.
Later versions of Node.js and MySQL (or MariaDB) should also work. Some earlier versions will also work,
but I do not know the minimum requirements.

### Installing

1. Clone this repository.

2. Make a copy of the file `secrets.template.js` and name it `secrets.js`.

3. Edit `secrets.js` to include your MySQL database credentials.

4. Enter the command `npm install` on the command line.

5. Enter the command `node create-table.js` to create the table. Only run this script once, because it will drop the table if it already exists.

### Running

To run the script, type the command

     $ node generate-puzzles.js [number] [batchSize]

where [number] is the number of puzzles to generate, and [batchSize] is the number of puzzles that are saved
in each commit. The default values are 1000000 and 1000. With these values, the script runs for about 12 hours
on my computer. The script can be safely interrupted by pressing Control-C, and the script can be run repeatedly
to enlarge the database.

**Note:** The script uses recursion to process the batches, so you may experience a stack overflow if the number
of batches is greater than 10,000. The number of batches is equal to the number of puzzles divided by the batch
size, rounded up to the nearest integer. If you don't like this, please submit a pull request to fix it.

## Built with

## Contributing

Contributions are welcome. Please read the Code of Conduct before contributing.

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code-of-conduct.md) 
## Authors

David Radcliffe (dradcliffe@gmail.com)

## License

This project is licensed under the terms of the MIT license.

## Acknowledgements

This project is based on the excellent `sudoku` project by Blagovest Dachev.

