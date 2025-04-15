const sudoku = require('sudoku');

require('dotenv').config()
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

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

function generatePuzzles(n, batchSize = 1000) {
    batchSize = Math.min(batchSize, n);
    console.log(`Puzzles remaining: ${n}`);

    function processBatch(remaining) {
        return new Promise((resolve, reject) => {
            connection.beginTransaction(function (err) {
                if (err) return reject(err);

                for (let i = 0; i < Math.min(batchSize, remaining); i++) {
                    let p = createPuzzle();
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
        let remaining = n;
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

module.exports = {
    generatePuzzles: generatePuzzles,
};