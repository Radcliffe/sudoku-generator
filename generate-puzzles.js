var sudoku = require('sudoku');

var mysql = require('mysql');
var secrets = require('./secrets');
var connection = mysql.createConnection(secrets.db);

var g = require('./index.js');

var args = process.argv.slice(2);
var numberOfPuzzles = args[0] ? +args[0] : 1000000;
var batchSize = args[1] ? +args[1] : 1000;
g.generatePuzzles(numberOfPuzzles, batchSize);
