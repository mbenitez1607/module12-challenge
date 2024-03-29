// Import and require mysql2
const mysql = require('mysql2');
// Require dotenv to store DB configuration locally
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`\n\x1B[35mConnected to the ${process.env.DB_NAME} database\n`) 
);

module.exports = db;
