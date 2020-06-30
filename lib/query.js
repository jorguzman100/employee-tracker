// Requiere dependencies
const mysql = require("mysql2/promise");
// const mysql = require("mysql");


class Query {
    constructor(crud, table, options, ...columns) {
        this.crud = crud;
        this.table = table;
        this.options = options;
        this.columns = columns;
        this.query = '';
        this.data;

    }

    async buildQuery() {

        // Select the CRUD query
        switch (this.crud) {
            case 'Create':
                this.query = `INSERT INTO ${this.table} SET ?`;
                this.data = await this.runQuery();
                // console.log(`${this.options} created!\n`);
                console.log(`Record created!\n`);
                break;
            case 'Read':
                this.query = `SELECT ${this.columns} FROM ${this.table}`;
                this.data = await this.runQuery();
                console.table(this.data);
                break;
            case 'Update':
                this.query = `UPDATE ${this.table} SET ? WHERE ?`;
                this.data = await this.runQuery();
                console.log(`${this.options[0].first_name} updated!\n`);
                console.log(`${this.data.affectedRows} records\n`);
                break;
            case 'Delete':
                this.query = `DELETE FROM ${this.table} WHERE ?`
                this.data = await this.runQuery();
                console.log(`${this.data.affectedRows} records deleted!\n`);
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

        // Run the query
        const [data] = await connection.query(this.query, this.options);
        await connection.end();
        return data;
    }
}

module.exports = Query;