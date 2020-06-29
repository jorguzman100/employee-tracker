// Requiere dependencies
const inquirer = require("inquirer");
const Query = require("./lib/query");


// CLI
const startCMS = () => {
    // Display all employee DB
    const queryAll = new Query('Read', 'employee', '*');
    queryAll.runQuery();
}

startCMS();