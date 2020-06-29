// Requiere dependencies
const mysql = require("mysql2/promise");


class Query {
    constructor(crud, table, object, ...columns) {
        this.crud = crud;
        this.table = table;
        this.object = object;
        this.columns = columns;
        this.query = '';
        this.data;
        
    }

    async builQuery() {

        // Select the CRUD query
        switch (this.crud) {
            case 'Create':
                this.query = `INSERT INTO ${this.table} SET ?`;
                this.data = await this.runQuery();
                //console.log(data);
                console.log(`${this.object.first_name} inserted!\n`);
                break;
            case 'Read':
                this.query = `SELECT ${this.columns} FROM ${this.table}`;
                // this.runQuery();
                this.data = await this.runQuery();
                console.table(this.data);
                break;
            case 'Update':
                this.query = ``
                break;
            case 'Delete':
                this.query = ``
                break;
            default:
                console.log('Please select a CRUD option.');
                break;
        }
    }

    async runQuery() {

        // Create the connection to MySQL
        const connection = await mysql.createConnection({
            port: 3306,
            user: 'root',
            password: 'REDACTED_DB_PASSWORD',
            database: 'employeesDB'
        });

        // Activate the connection
       /*  connection.connect((err) => {
            if (err) throw err;
            console.log(`MySQL connection PORT: ${connection.config.port}, database: ${connection.config.database} and threadId: ${connection.threadId}`);
        }); */

        // Run the query
        const [data] = await connection.query(this.query, this.object);
        connection.end();
        return data;
            /* (err, data, fields) => {
            if (err) throw err;
           connection.end();
           return data; */
           // this.printData(data);
        // });
    }

    /* printData(data) {
        switch (this.crud) {
            case 'Create':
                console.table(data);
                console.log(data.affectedRows + " product inserted!\n");
                break;
            case 'Read':
                console.table(data) 
                break;
            case 'Update':
                
                break;
            case 'Delete':
            
                break;
        }
    } */


}

module.exports = Query;