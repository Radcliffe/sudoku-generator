const mysql = require('mysql');
const secrets = require('./secrets');
const connection = mysql.createConnection(secrets.db);

const sql_drop_table = `DROP TABLE IF EXISTS sudoku`;

const sql_create_table = `CREATE TABLE sudoku (
    id int(11) NOT NULL AUTO_INCREMENT,
    puzzle char(81) NOT NULL,
    solution char(81) NOT NULL,
    clues tinyint(1) NOT NULL,
    difficulty decimal(3, 1) DEFAULT NULL,
    PRIMARY KEY(id),
    KEY clues_idx(clues),
    KEY diff_idx(difficulty)
)`;

connection.beginTransaction(function () {
    connection.query(sql_drop_table,
        function (error) {
            if (error) throw error;
        }
    );
    connection.query(sql_create_table,
        function (error) {
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
