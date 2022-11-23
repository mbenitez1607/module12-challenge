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
                "Add a Department", "Add a Role", "Add an Employee", "Update an Employee's Role", "Quit"];

function displayTable(option){
    let sql = ``;
    switch (option) {
        case topMenu[0]:
            sql = `SELECT * FROM department`;
            db.query(sql, (err, rows) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.table(`\n\x1B[36m${option}\x1b[0m\n`, rows);
            });
            //break;
        case topMenu[1]:
            sql = `SELECT * FROM role`;
            db.query(sql, (err, rows) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.table(`\n\x1B[36m${option}\x1b[0m\n`, rows);
            });
            break;
        case topMenu[2]:
            sql = `SELECT * FROM employee`;
            db.query(sql, (err, rows) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.table(`\n\x1B[36m${option}\x1b[0m\n`, rows);
            });
            break;
    }
    console.log('Press any key to continue');
    return 0;
}

// Main function
async function employeeTracker() {
    let quit = 0;
    // Show main menu until the user decides to quit
    do {
        const mainChoice = await inquirer.prompt([{
            type: 'list',
            message: 'What would you like to do?',
            choices: topMenu,
            name: 'topSelection'
        }]);
        // If user selected an action display the corresponding information
        if (mainChoice.topSelection != "Quit") {
            quit = displayTable(mainChoice.topSelection);
        } else { // user decided to exit the program    
            console.log(`Exiting the program`);
            process.exit(0);
        }
    } while (!quit);
}

// Start server on PORT
app.listen(PORT, () => {
    //console.log(`Server running on port ${PORT}`);
});

// Start employeeTracker app
employeeTracker();
