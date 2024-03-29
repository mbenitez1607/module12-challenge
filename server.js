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

const topMenu = ["View All Departments","View All Roles", "View All Employees", 
                "Add a Department", "Add a Role", "Add an Employee", 
                "Delete a Department", "Quit"];

function queryTable(option, sqlQuery) {
    return new Promise((resolve, reject) => {
        db.query({ sql: sqlQuery, rowsAsArray: false }, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                if (option < 3) {
                    displayTable(option, rows);
                }
                resolve(rows);
            }
        });
    });
}

// Print MySQL rows to the console
function displayTable(option, data) {
    // Print table with title in magenta
    console.table(`\n\n\x1B[35m${topMenu[option]}\x1b[0m\n`, data);
}

// Get role ID
function getRoleID(role) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT id FROM role WHERE role.title = "${role}";`, function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        })
    });
}

// Get manager ID
function getEmployeeID(first, last) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT id FROM employee WHERE (employee.first_name = "${first}" AND employee.last_name = "${last}");`, function (err, results) {
            if (err) {
                reject(err);
            } else {
                //('results length: ' + results.length)
                resolve(results);
            }
        })
    });
}

// Main function
async function employeeTracker() {
    let index, result, roleId, deptID, employeeId;
    let quit = 0;
    let sql = ``;
    let secondChoice;

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
            switch (mainChoice.topSelection) {
                // View All Departments
                case topMenu[0]:
                    sql = `SELECT * FROM department`;
                    result = await queryTable(0, sql);
                    console.log("");
                    break;
                // View All Roles
                case topMenu[1]:
                    sql = `SELECT role.id, role.title, department.name AS department, role.salary
                    FROM role 
                    JOIN department
                    ON department.id=role.department_id
                    ORDER BY role.id;`;
                    result = await queryTable(1, sql);
                    console.log("");
                    break;
                // View All Employees
                case topMenu[2]:
                    sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id
                    FROM employee 
                    JOIN role ON employee.role_id=role.id
                    JOIN department ON  role.department_id=department.id
                    ORDER BY employee.id;`
                    result = await queryTable(2, sql);
                    console.log("");
                    break;
                // Add a Department
                case topMenu[3]:
                    secondChoice = await inquirer.prompt([{
                        type: 'input',
                        message: 'What is the name of the department?',
                        name: 'newDepartment'
                    }]);
                    sql = `INSERT INTO department (name)
                    VALUES ("${secondChoice.newDepartment}");`
                    result = await queryTable(3, sql);
                    break;
                // Add a Role
                case topMenu[4]:
                    sql = `SELECT name FROM department`;
                    result = await queryTable(4, sql);
                    secondChoice = await inquirer.prompt([
                        {
                            type: 'input',
                            message: 'What is the name of the role?',
                            name: 'newRole'
                        },
                        {
                            type: 'input',
                            message: 'What is the salary of the role?',
                            name: 'newSalary'
                        },
                        {
                            type: 'list',
                            message: 'Which department does the role belong to?',
                            choices: result,
                            name: 'newDepartment'
                        }
                    ]);
                    // Get department ID
                    sql = `SELECT id FROM department WHERE department.name="${secondChoice.newDepartment}";`;
                    deptID = await queryTable(4, sql);
                    // Update table with new role
                    sql = `INSERT INTO role (title, salary, department_id)
                    VALUES ("${secondChoice.newRole}", "${secondChoice.newSalary}", ${deptID[0].id});`
                    result = await queryTable(4, sql);
                    break;
                // Add an Employee
                case topMenu[5]:
                    sql = `SELECT title FROM role`;
                    result = await queryTable(5, sql);
                    let titles = result.map(({ title }) => title);
                    sql = `SELECT CONCAT (first_name, " ", last_name) AS manager FROM employee`
                    result = await queryTable(5, sql);
                    let managers = result.map(({ manager }) => manager);
                    secondChoice = await inquirer.prompt([
                        {
                            type: 'input',
                            message: 'What is the employee\'s first name?',
                            name: 'firstName'
                        },
                        {
                            type: 'input',
                            message: 'What is the employee\'s last name?',
                            name: 'lastName'
                        },
                        {
                            type: 'list',
                            message: 'What is the employee\'s role?',
                            choices: titles,
                            name: 'newRole'
                        },
                        {
                            type: 'list',
                            message: 'Who is the employee\'s manager?',
                            choices: managers,
                            name: 'Manager'
                        }
                    ]);
                    // Get role ID
                    roleId = await getRoleID(secondChoice.newRole);
                    // Get manager ID
                    let names = (secondChoice.Manager).split(' ');
                    employeeId = await getEmployeeID(names[0], names[1]);
                    // Update table with new role
                    sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES ("${secondChoice.firstName}", "${secondChoice.lastName}", "${roleId[0].id}", "${employeeId[0].id}");`
                    result = await queryTable(4, sql);
                    break;
                // Delete a Department
                case  topMenu[7]:
                    secondChoice = await inquirer.prompt([{
                        type: 'input',
                        message: 'What is the name of the department?',
                        name: 'newDepartment'
                    }]);
                    sql = `DELETE FROM department WHERE id IN (
                        SELECT temp.id FROM(
                        SELECT id FROM department WHERE department.name="${secondChoice.newDepartment}") AS temp
                       );`
                    result = await queryTable(5, sql);
                    break;
            }
        // else: user decided to exit the program
        } else {     
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
