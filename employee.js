// Requiere dependencies
const inquirer = require("inquirer");
const Query = require("./lib/query");


// CLI 
// constructor (crud, table, options, ...columns)

const selectCRUD = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'crud',
            message: 'What action do you want to take?',
            choices: ['Create', 'Read', 'Update', 'Delete', 'Exit'],
        }
    ]).then((answer) => {
        console.log(answer.crud);
        selectTable(answer.crud);
    });
}

const selectTable = (crud) => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'table',
            message: 'What table do you want to work with?',
            choices: ['Employees', 'Roles', 'Departments', 'Exit'],
        }
    ]).then((answer) => {
        console.log(answer.table);
        selectOptions(crud, answer.table);
    });
}

const selectOptions = (crud, table) => {
    console.log('In selectOptions()');
    console.log(`crud: ${crud}, table: ${table}`);
}

const displayAllEmployees = async () => {
    // R - Display all employee DB
    const query1 = await new Query('Read', 'employee', [{}], '*').buildQuery();

    // Define the CRUD action
    selectCRUD();
}

displayAllEmployees();


/* 

// C
const query2 = await new Query('Create', 'employee', [{
    first_name: "2nd test",
    last_name: "Man",
    role_id: 1,
    manager_id: 4
}], '*').buildQuery();

// U
const query3 = await new Query('Update', 'employee', [{ first_name: 'Maggi' }, { first_name: '2nd test' }]).buildQuery();


// D
const query4 = await new Query('Delete', 'employee', [{ first_name: 'Maggi' }]).buildQuery();

 */




