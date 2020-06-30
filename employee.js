// Requiere dependencies
const inquirer = require("inquirer");
const Query = require("./lib/query");


const selectCRUD = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'crud',
            message: 'What action do you want to take?',
            choices: ['Create', 'Read', 'Update', 'Delete', 'Exit'],
        }
    ]).then((answer) => {
        if (answer.crud === 'Exit') {
            process.exit();
        } else {
            selectTable(answer.crud);
        }
    });
}

const selectTable = async (crud) => {
    let answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'table',
            message: 'What table do you want to work with?',
            choices: ['Employees', 'Roles', 'Departments', '<- Go back'],
        }
    ]);

    if (answer.table === '<- Go back') {
        selectCRUD();
    } 
    
    // Display the working table as reference 
    else if (crud === 'Read') {
        await selectOptions(crud, answer.table);
    } else {
        await displayTable(answer.table);
        await selectOptions(crud, answer.table);
    }
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
        updateAnswer = await promptUpdateRolesFields();
        fields = updateAnswer.fields;
        where = updateAnswer.where;
    } else if (crud === 'Update' && table === 'Departments') {
        updateAnswer = await promptUpdateDepartmentsFields();
        fields = updateAnswer.fields;
        where = updateAnswer.where;
    }

    // Run main query
    runMainQuery(crud, table, fields, where, '*');
}

const promptUpdateDepartmentsFields = async () => {
    let answer1 = await inquirer.prompt([
        {
            type: 'input',
            name: 'department_id',
            message: 'department_id: '
        }
    ]);
    const query5 = await new Query('Read Where', 'Departments', [{ department_id: answer1.department_id }], '', '*').buildQuery();
    console.log('query5: ', query5);
    console.log('department_name: ', query5[0].department_name);
    let answer2 = await inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: 'department_name:',
            default: query5[0].department_name
        }
    ]);
    return { where: `department_id=${answer1.department_id}`, fields: answer2 }
}


const promptUpdateRolesFields = async () => {
    let answer1 = await inquirer.prompt([
        {
            type: 'input',
            name: 'role_id',
            message: 'role_id: '
        }
    ]);
    const query4 = await new Query('Read Where', 'Roles', [{ role_id: answer1.role_id }], '', '*').buildQuery();
    console.log('query4: ', query4);
    console.log('title: ', query4[0].title);
    let answer2 = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'title:',
            default: query4[0].title
        },
        {
            type: 'input',
            name: 'salary',
            message: 'salary:',
            default: query4[0].salary
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'department_id:',
            default: query4[0].department_id
        }
    ]);
    return { where: `role_id=${answer1.role_id}`, fields: answer2 }
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
    return { where: `employee_id=${answer1.employee_id}`, fields: answer2 }
}



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

const runMainQuery = async (crud, table, fields, where, ...columns) => {
    const query2 = await new Query(crud, table, [fields], where, columns).buildQuery();
    selectCRUD();
}

const displayTable = async (table) => {
    // (crud, table, [fields], where, columns)
    const query1 = await new Query('Read', table, [{}], '', '*').buildQuery();
}

const displayAll = async () => {
    // (crud, table, [fields], where, columns)
    // const query3 = await new Query('Read Where', 'Employees', [{ employee_id: answer1.employee_id }], '', '*').buildQuery();
    const query0 = await new Query('Read Where', 'Employees, Roles, Departments', [{}], 'Employees.role_id = Roles.role_id AND Roles.department_id = Departments.department_id', '*').buildQuery();
}

const init = async () => {
    await displayAll();
    await selectCRUD();
}

init();


/*

// D
const query4 = await new Query('Delete', 'Employees', [{ first_name: 'Maggi' }]).buildQuery();

 */




