// Requiere dependencies
const inquirer = require("inquirer");
const Query = require("./lib/query");

// ASCII-LOGO
const logo = require('asciiart-logo');
const config = require('./package.json');


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
    let choices = [];
    if (crud === 'Read') {
        choices = ['Employees', 'Employees by Manager', 'Roles', 'Departments', 'Departments with Total Budget', '<- Go back'];
    } else {
        choices = ['Employees', 'Roles', 'Departments', '<- Go back'];
    }

    let answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'table',
            message: 'What table do you want to work with?',
            choices: choices
        }
    ]);

    if (answer.table === '<- Go back') {
        selectCRUD();
    }

    // Display the working table as reference 
    else if (crud === 'Read') {
        // await selectOptions(crud, answer.table); FOR TEST
        selectOptions(crud, answer.table);
    } else {
        await displayTable(answer.table);
        await selectOptions(crud, answer.table);
    }
}

const selectOptions = async (crud, table) => {
    // CHECK AWAITS
    // C
    let fields;
    let where = '';
    let updateAnswer;
    let columns = '*';
    if (crud === 'Create' && table === 'Employees') {
        fields = await promptEmployeesFields();
    } else if (crud === 'Create' && table === 'Roles') {
        fields = await promptRolesFields();
    } else if (crud === 'Create' && table === 'Departments') {
        fields = await promptDepartmentsFields();
    }

    // R
    else if (crud === 'Read' && table !== 'Employees by Manager' && table !== 'Departments with Total Budget') {
        fields = {};
    } else if (crud === 'Read' && table === 'Employees by Manager') {
        updateAnswer = await promptManager();
        where = `manager_id=${updateAnswer.manager_id}`;
        crud = 'Read Where';
        table = 'Employees';
        fields = 'Employees by Manager';
    } else if (crud === 'Read' && table === 'Departments with Total Budget') {
        console.log(`crud === 'Read' && table === 'Departments with Total Budget'`);
        crud = 'Read Total Budget';
        table = 'Departments';
        columns = `
        Departments.department_id AS 'id', department_name AS 'department', 
        CONCAT(Employees.first_name, ' ', Employees.last_name) AS 'employee', salary
        `;
    }

    // U
    else if (crud === 'Update' && table === 'Employees') {
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

    // D
    else if (crud === 'Delete' && table === 'Employees') {
        updateAnswer = await promptDeleteEmployees();
        where = `id=${updateAnswer.id}`;
    } else if (crud === 'Delete' && table === 'Roles') {
        updateAnswer = await promptDeleteRoles();
        where = `role_id=${updateAnswer.role_id}`;
    } else if (crud === 'Delete' && table === 'Departments') {
        updateAnswer = await promptDeleteDepartments();
        where = `department_id=${updateAnswer.department_id}`;
    }


    // Run the main query
    runMainQuery(crud, table, fields, where, columns);
}

const promptManager = async () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'manager_id',
            message: 'manager_id: '
        }
    ]);
}

const promptDeleteDepartments = async () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'department_id',
            message: 'department_id: '
        }
    ]);
}

// CHECK ASYNC
const promptDeleteRoles = async () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'role_id',
            message: 'role_id: '
        }
    ]);
}

const promptDeleteEmployees = async () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'id: '
        }
    ]);
}

const promptUpdateDepartmentsFields = async () => {
    let answer1 = await inquirer.prompt([
        {
            type: 'input',
            name: 'department_id',
            message: 'department_id: '
        }
    ]);

    // (crud, table, options, where, ...columns)
    const query5 = await new Query('Read Where', 'Departments', [{}], `department_id=${answer1.department_id}`, '*').buildQuery();
    /* console.log('query5: ', query5);
    console.log('department_name: ', query5.data[0].department_name); */
    let answer2 = await inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: 'department_name:',
            default: query5.data[0].department_name
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
    const query4 = await new Query('Read Where', 'Roles', [{}], `role_id=${answer1.role_id}`, '*').buildQuery();
    /* console.log('query4: ', query4);
    console.log('title: ', query4.data[0].title); */
    let answer2 = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'title:',
            default: query4.data[0].title
        },
        {
            type: 'input',
            name: 'salary',
            message: 'salary:',
            default: query4.data[0].salary
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'department_id:',
            default: query4.data[0].department_id
        }
    ]);
    return { where: `role_id=${answer1.role_id}`, fields: answer2 }
}


const promptUpdateEmployeesFields = async () => {
    let answer1 = await inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'id: '
        }
    ]);
    const query3 = await new Query('Read Where', 'Employees', [{}], `id=${answer1.id}`, '*').buildQuery();
    /* console.log('query3: ', query3);
    console.log('first_name: ', query3.data[0].first_name); */
    let answer2 = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'first_name:',
            default: query3.data[0].first_name
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'last_name:',
            default: query3.data[0].last_name
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'role_id:',
            default: query3.data[0].role_id
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'manager_id:',
            default: query3.data[0].manager_id
        }
    ]);
    return { where: `id=${answer1.id}`, fields: answer2 }
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
    console.log(`\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n✅ ${query2.message}`)

    // Run main query, and Display updated table
    if (crud === 'Read' || crud === 'Read Where' && query2.fields[0] === 'Employees by Manager' || crud === 'Read Total Budget') {
        console.table(query2.data);
    } else {
        await displayTable(table, query2.message);
    }
    await inquirer.prompt([
        {
            type: 'input',
            name: 'continue',
            message: 'Press Enter to continue'
        }
    ]);
    await displayAll();
    await selectCRUD();
}

const displayTable = async (table, query2Message) => {
    const query1 = await new Query('Read', table, [{}], '', '*').buildQuery();
    if (query2Message === true) {
        console.log(`${query1.message}`)
    } else {
        console.log(`\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n${query1.message}`)
    }
    
    console.table(query1.data);
}

const displayAll = async () => {
    const query0 = await new Query('Read All', 'Employees', [{}], '', `
        Employees.id, CONCAT(Employees.first_name, ' ', Employees.last_name) AS 'employee', 
        Employees.role_id, title AS 'role', Roles.department_id, department_name AS 'department', 
        salary as 'salary', Employees.manager_id, CONCAT(Managers.first_name, ' ', 
        Managers.last_name) AS 'manager'
    `).buildQuery();
    console.log(`\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n${query0.message}`)
    // console.log(`${query0.message}`)
    console.table(query0.data);
}

const init = async () => {
    displayAscii();
    await inquirer.prompt([
        {
            type: 'input',
            name: 'continue',
            message: 'Press Enter to start'
        }
    ]);
    await displayAll();
    await selectCRUD();
}


const displayAscii = () => {
    console.log(logo(config).render());
}

init();
