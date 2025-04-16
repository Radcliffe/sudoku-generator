import sudoku from 'sudoku';
import connection from "./database.js";

function stringify(puzzle) {
    return puzzle.map(x => {
        return x === null ? '.' : x + 1;
    }).join('');
}

function countClues(puzzle) {
    return puzzle.filter(x => {
        return x !== null;
    }).length;
}

function createPuzzle(minimumDifficulty = 0,
                      maximumDifficulty = Infinity,
                      minimumClues = 0,
                      maximumClues = 81) {
    let puzzle, clues, difficulty;
    while (true) {
        puzzle = sudoku.makepuzzle();
        clues = countClues(puzzle);
        difficulty = sudoku.ratepuzzle(puzzle, 10);
        if (clues >= minimumClues && clues <= maximumClues &&
            difficulty >= minimumDifficulty && difficulty <= maximumDifficulty) {
            break;
        }
    }

    const solution = sudoku.solvepuzzle(puzzle);
    return {
        puzzle: stringify(puzzle),
        solution: stringify(solution),
        clues,
        difficulty
    }
}

function savePuzzle(p) {
    connection.query('INSERT INTO sudoku (puzzle, solution, clues, difficulty) VALUES (?, ?, ?, ?)',
        [p.puzzle, p.solution, p.clues, p.difficulty],
        function (error) {
            if (error) throw error;
        }
    );
}

function generatePuzzles(numberOfPuzzles,
                         batchSize = 1000,
                         minimumDifficulty = 0,
                         maximumDifficulty = Infinity,
                         minimumClues = 0,
                         maximumClues = 81) {
    batchSize = Math.min(batchSize, numberOfPuzzles);
    console.log(`Puzzles remaining: ${numberOfPuzzles}`);

    function processBatch(remaining) {
        return new Promise((resolve, reject) => {
            connection.beginTransaction(function (err) {
                if (err) return reject(err);

                for (let i = 0; i < Math.min(batchSize, remaining); i++) {
                    let p = createPuzzle(minimumDifficulty, maximumDifficulty,
                        minimumClues, maximumClues);
                    savePuzzle(p);
                }

                connection.commit(function (err) {
                    if (err) {
                        return connection.rollback(function () {
                            reject(err);
                        });
                    }
                    resolve();
                });
            });
        });
    }

    async function processAll() {
        let remaining = numberOfPuzzles;
        while (remaining > 0) {
            await processBatch(remaining);
            remaining -= batchSize;
            console.log(`Puzzles remaining: ${remaining}`);
        }
        connection.end();
    }

    processAll().catch(err => {
        console.error('Error generating puzzles:', err);
        connection.end();
    });
}

export default generatePuzzles;
