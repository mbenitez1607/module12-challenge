# Module 12: SQL Challenge - Employee Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

Employee Tracker is a command-line application to manage a company's employee database. 

The application uses: `MySQL2` to connect to a database and perform queries, `Inquirer` to interact with the user via the command line, and `console.table` to print MySQL rows to the console.

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Tests](#tests)

## Installation

To run your own version of the app do the following:
1. Clone this git repo to your computer
2. Create a MySQL database in your `localhost` using the data in the `db` directory (`employee_tracker.sql`, `seeds.sql`)
3. Rename `.env.EXAMPLE` as `.env` and add your DB credentials 
4. Inside a terminal run `npm install` to get all the necessary dependencies

## Usage

- To start the app type: `node server.js`
- When the application starts, a menu is presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role.
- `VIEW` options present a formatted table showing the corresponding details:
    departments - names, ids
    roles - job title, role id, department id, salary
    employees - ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
- `ADD` options for department | role | employee show a prompt asking to enter the necessary information
    department - department name
    role - name, salary, and department
    employee - first name, last name, role, and manager
- `UPDATE` employee role shows a prompt to select an employee to update and their new role

[![Video of Employee Tracker in action](./Employee-Tracker.png)](https://drive.google.com/file/d/17ah4z1WieL5UQBBKyGuxuYXLiZNYw-cm/view?usp=share_link)

## License

MIT License

## Tests

N/A
