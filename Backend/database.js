const keys = require('./DATABASECONNECTIONKEYS');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: keys.HOST,
    user: keys.USER,
    database: keys.QUESTIONS_DATABASE,
    password: keys.PASS
});

connection.connect((error) => {
    if(error) {
        console.log(error);
    }
});

module.exports = connection;

