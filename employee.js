// Requiere dependencies
const inquirer = require("inquirer");
const Query = require("./lib/query");


// CLI 
// constructor (crud, table, options, ...columns)
const startCMS = async () => {

    // C
    const query2 = await new Query('Create', 'employee', [{
        first_name: "2nd test",
        last_name: "Man",
        role_id: 1,
        manager_id: 4
    }], '*').buildQuery();

    // U
    const query3 = await new Query('Update', 'employee', [{first_name: 'Maggi'}, {first_name: '2nd test'}]).buildQuery();

    displayAllEmployees();
}

const displayAllEmployees = () => {
    // R - Display all employee DB
    const query1 = new Query('Read', 'employee', [{}], '*').buildQuery();
}

startCMS();

/* 
updateProduct() {
       console.log("Updating all Rocky Road quantities...\n");
       var query = connection.query(
           "UPDATE products SET ? WHERE ?",
           [
               {
                   quantity: 100
               },
               {
                   flavor: "Rocky Road"
               }
           ],

       );

       // logs the actual query being run
       console.log(query.sql);
   }
*/

