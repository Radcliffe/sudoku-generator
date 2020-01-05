var sudoku = require('sudoku');
var mysql = require('mysql');
var secrets = require('./secrets');
var connection = mysql.createConnection(secrets.db);


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

function createPuzzle() {
    const puzzle = sudoku.makepuzzle();
    const solution = sudoku.solvepuzzle(puzzle);
    const difficulty = sudoku.ratepuzzle(puzzle, 10);
    const clues = countClues(puzzle);
    return {
        puzzle: stringify(puzzle),
        solution: stringify(solution),
        clues: clues,
        difficulty: difficulty,
    }
}

function savePuzzle(p) {
    connection.query('INSERT INTO sudoku (puzzle, solution, clues, difficulty) VALUES (?, ?, ?, ?)',
        [p.puzzle, p.solution, p.clues, p.difficulty],
        function (error, results, fields) {
            if (error) throw error;
        }
    );
}

function generatePuzzles(n, batchSize = 1000) {
    batchSize = Math.min(batchSize, n);
    console.log(`Puzzles remaining: ${n}`)
    connection.beginTransaction(function (err) {
        for (let i = 0; i < batchSize; i++) {
            let p = createPuzzle();
            savePuzzle(p);
        }
        connection.commit(function (err) {
            if (err) {
                connection.rollback(function () {
                    throw err;
                });
            }
            if (n > batchSize) {
                generatePuzzles(n - batchSize, batchSize);
            } else {
                connection.end();
            }
        });
    });
}

module.exports = {
    stringify: stringify,
    countClues: countClues,
    createPuzzle: createPuzzle,
    savePuzzle: savePuzzle,
    generatePuzzles: generatePuzzles,
};