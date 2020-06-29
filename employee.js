// Requiere dependencies
const inquirer = require("inquirer");
const Query = require("./lib/query");


// CLI 
// constructor (crud, table, object, ...columns)
const startCMS = async () => {
    const query2 = await new Query('Create', 'employee', {
                    first_name: "2nd test",
                    last_name: "Man",
                    role_id: 1,
                    manager_id: 4
                }, '*').builQuery();
    displayAllEmployees();
}

const displayAllEmployees = () => {
    // Display all employee DB
    const query1 = new Query('Read', 'employee', {}, '*').builQuery();
}


startCMS();