const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const loadEnv = require("./loadEnv");

loadEnv();

const REQUIRED_TABLES = ["Departments", "Roles", "Employees"];
const SCHEMA_PATH = path.join(__dirname, "..", "..", "db", "schema.sql");
const SEEDS_PATH = path.join(__dirname, "..", "..", "db", "seeds.sql");

const getDbConfig = () => ({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root"
});

const readStatements = (filePath, skipPatterns = []) => {
    const fileContent = fs
        .readFileSync(filePath, "utf8")
        .split(/\r?\n/)
        .filter((line) => !line.trim().startsWith("--"))
        .join("\n");

    return fileContent
        .split(";")
        .map((statement) => statement.trim())
        .filter((statement) => statement.length > 0)
        .filter((statement) => skipPatterns.every((pattern) => !pattern.test(statement)));
};

const runStatements = async (connection, statements) => {
    for (const statement of statements) {
        await connection.query(statement);
    }
};

const hasRequiredTables = async (connection, dbName) => {
    const [rows] = await connection.query(
        `
        SELECT COUNT(*) AS table_count
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = ?
          AND TABLE_NAME IN (?, ?, ?)
        `,
        [dbName, ...REQUIRED_TABLES]
    );

    return Number(rows[0].table_count) === REQUIRED_TABLES.length;
};

const hasSeedData = async (connection) => {
    try {
        const [rows] = await connection.query("SELECT COUNT(*) AS total FROM Departments");
        return Number(rows[0].total) > 0;
    } catch (err) {
        return false;
    }
};

const bootstrapDatabase = async () => {
    const dbName = process.env.DB_NAME || "employeesDB";
    const serverConfig = getDbConfig();
    const serverConnection = await mysql.createConnection(serverConfig);

    try {
        await serverConnection.query(
            `CREATE DATABASE IF NOT EXISTS ${serverConnection.escapeId(dbName)}`
        );
    } finally {
        await serverConnection.end();
    }

    const appConnection = await mysql.createConnection({
        ...serverConfig,
        database: dbName
    });

    try {
        if (!(await hasRequiredTables(appConnection, dbName))) {
            const schemaStatements = readStatements(SCHEMA_PATH, [
                /^DROP DATABASE/i,
                /^CREATE DATABASE/i,
                /^USE\s+/i
            ]);
            await runStatements(appConnection, schemaStatements);
        }

        if (!(await hasSeedData(appConnection))) {
            const seedStatements = readStatements(SEEDS_PATH, [/^USE\s+/i, /^SELECT\s+/i]);
            await runStatements(appConnection, seedStatements);
        }
    } finally {
        await appConnection.end();
    }
};

module.exports = bootstrapDatabase;
