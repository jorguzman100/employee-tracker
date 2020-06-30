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

const selectOptions = async (crud, table) => {
    let fields
    if (crud === 'Create' && table === 'Employees') {
        fields = await promptEmployeesFields();
        console.log('fields: ', fields);
    }
    const query2 = await new Query(crud, table, [fields], '*').buildQuery();
}

const promptEmployeesFields = async () => {
    return await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'first_name: '
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'last_name: '
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'role_id: '
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'manager_id: '
        }
    ]);
}

const displayAllEmployees = async () => {
    // R - Display all employee DB
    const query1 = await new Query('Read', 'Employees', [{}], '*').buildQuery();

    // Define the CRUD action
    selectCRUD();
}

displayAllEmployees();


/*

// U
const query3 = await new Query('Update', 'Employees', [{ first_name: 'Maggi' }, { first_name: '2nd test' }]).buildQuery();


// D
const query4 = await new Query('Delete', 'Employees', [{ first_name: 'Maggi' }]).buildQuery();

 */




