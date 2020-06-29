// Requiere dependencies
const mysql = require("mysql");


class Query {
    constructor(crud, table, ...columns) {
        this.crud = crud;
        this.table = table;
        this.columns = columns;
        this.query = '';
    }

    runQuery() {

        // Create the connection to MySQL
        const connection = mysql.createConnection({
            port: 3306,
            user: 'root',
            password: 'REDACTED_DB_PASSWORD',
            database: 'employeesDB'
        });

        // Activate the connection
        connection.connect((err) => {
            if (err) throw err;
            console.log(`MySQL connection PORT: ${connection.config.port}, database: ${connection.config.database} and threadId: ${connection.threadId}`);
        });

        // Select the CRUD query
        switch (this.crud) {
            case 'Create':
                this.query = ``
                break;
            case 'Read':
                this.query = `SELECT ${this.columns} FROM ${this.table}`
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

        // Run the query
        connection.query(this.query, (err, data, fields) => {
            if (err) throw err;

            // Log all results of the SELECT statement
            console.log('***** data *****');
            console.table(data);
            console.log('***** fields *****');
            console.log(fields);
            connection.end();
        });
    }
}

module.exports = Query;