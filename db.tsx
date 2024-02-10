const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config()

// Create connection
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST||'localhost',
    user: process.env.MYSQL_USER||'root',
    password: process.env.MYSQL_PASSWORD||'root',
    database: process.env.MYSQL_DATABASE||'bitespeed'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

// Export connection for use in other modules
module.exports = connection;
