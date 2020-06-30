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

    // C
    let fields;
    let where = '';
    let updateAnswer;
    if (crud === 'Create' && table === 'Employees') {
        fields = await promptEmployeesFields();
    } else if (crud === 'Create' && table === 'Roles') {
        fields = await promptRolesFields();
    } else if (crud === 'Create' && table === 'Departments') {
        fields = await promptDepartmentsFields();
    }

    // R
    else if (crud === 'Read') {
        fields = {};
    }

    // U
    if (crud === 'Update' && table === 'Employees') {
        updateAnswer = await promptUpdateEmployeesFields();
        fields = updateAnswer.fields;
        where = updateAnswer.where;
    } else if (crud === 'Update' && table === 'Roles') {
        // fields = await promptRolesFields();
    } else if (crud === 'Update' && table === 'Departments') {
        // fields = await promptDepartmentsFields();
    }

    const query2 = await new Query(crud, table, [ fields ], where, '*').buildQuery();
}

const promptUpdateEmployeesFields = async () => {
    let answer1 = await inquirer.prompt([
        {
            type: 'input',
            name: 'employee_id',
            message: 'employee_id: '
        }
    ]);
    const query3 = await new Query('Read Where', 'Employees', [{ employee_id: answer1.employee_id }], '', '*').buildQuery();
    console.log('query3: ', query3);
    console.log('first_name: ', query3[0].first_name);
    let answer2 = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'first_name:',
            default: query3[0].first_name
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'last_name:',
            default: query3[0].last_name
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'role_id:',
            default: query3[0].role_id
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'manager_id:',
            default: query3[0].manager_id
        }
    ]);
    return { where: `employee_id=${answer1.employee_id}`, fields: answer2}
}

// U
/* const query3 = await new Query('Update', 'Employees', [{ first_name: 'Maggi' }, { first_name: '2nd test' }]).buildQuery(); */



const promptDepartmentsFields = async () => {
    return await inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: 'department_name: '
        }
    ]);
}

const promptRolesFields = async () => {
    return await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'title: '
        },
        {
            type: 'input',
            name: 'salary',
            message: 'salary: '
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'department_id: '
        },
    ]);
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
    const query1 = await new Query('Read', 'Employees', [{}], '', '*').buildQuery();

    // Define the CRUD action
    selectCRUD();
}

displayAllEmployees();


/*

// D
const query4 = await new Query('Delete', 'Employees', [{ first_name: 'Maggi' }]).buildQuery();

 */




