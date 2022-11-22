// Require cTable to print MySQL rows to the console
const cTable = require('console.table');
// Require express to connect to the database
const express = require('express');
// Require inquirer to interact with the user via the command line
const inquirer = require('inquirer');
// Import DB connection
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;
// Express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const topMenu = ["View All Departments","View All Roles", "View All Employess", 
                "Add a Department", "Add a Role", "Add an Employee", "Update an Employee's Role"];

function displayTable(option){
    console.log(`displayTable: ${option}`);
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(rows);
    });
}

function init() {
    inquirer
        .prompt ([
            {
                type: 'list',
                message: 'What would you like to do?',
                choices: topMenu,
                name: 'topSelection'
            }
        ])
        .then((answers) => {
            console.log(answers.topSelection);
            displayTable(answers.topSelection);
        })
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Function call to initialize app
init();
