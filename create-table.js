var mysql = require('mysql');
var secrets = require('./secrets');
var connection = mysql.createConnection(secrets.db);

var sql_drop_table = `DROP TABLE IF EXISTS sudoku`;

var sql_create_table = `CREATE TABLE sudoku (
    id int(11) NOT NULL AUTO_INCREMENT,
    puzzle char(81) NOT NULL,
    solution char(81) NOT NULL,
    clues tinyint(1) NOT NULL,
    difficulty decimal(3, 1) DEFAULT NULL,
    PRIMARY KEY(id),
    KEY clues_idx(clues),
    KEY diff_idx(difficulty)
)`;

connection.beginTransaction(function (err) {
    connection.query(sql_drop_table,
        function (error, results, fields) {
            if (error) throw error;
        }
    );
    connection.query(sql_create_table,
        function (error, results, fields) {
            if (error) throw error;
        }
    );
    connection.commit(function (error) {
        if (error) {
            connection.rollback(function () {
                throw error;
            });
        }
        console.log('Sudoku table created.');
        connection.end();
    });
});
