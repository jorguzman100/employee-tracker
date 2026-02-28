const { spawnSync } = require("child_process");
const mysql = require("mysql2/promise");
const loadEnv = require("../lib/loadEnv");

loadEnv();

const DEFAULT_DB_CONFIG = {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "employeesDB"
};

const CONNECTIVITY_ERROR_CODES = new Set([
    "ECONNREFUSED",
    "ENOTFOUND",
    "ETIMEDOUT",
    "EHOSTUNREACH",
    "EAI_AGAIN",
    "PROTOCOL_CONNECTION_LOST"
]);

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const tryDatabaseConnection = async () => {
    let connection;

    try {
        connection = await mysql.createConnection(DEFAULT_DB_CONFIG);
        await connection.ping();
        return { ok: true };
    } catch (error) {
        return { ok: false, error };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

const run = (command, args) => spawnSync(command, args, { stdio: "inherit" });

const commandExists = (command, args) => {
    const result = spawnSync(command, args, { stdio: "ignore" });
    return result.status === 0;
};

const startDockerDatabase = () => {
    if (!commandExists("docker", ["--version"])) {
        return false;
    }

    const composeResult = run("docker", ["compose", "up", "-d", "db"]);

    if (composeResult.status === 0) {
        return true;
    }

    const legacyComposeResult = run("docker-compose", ["up", "-d", "db"]);
    return legacyComposeResult.status === 0;
};

const waitForDatabase = async ({ attempts = 40, delayMs = 2000 } = {}) => {
    for (let index = 0; index < attempts; index += 1) {
        const status = await tryDatabaseConnection();

        if (status.ok) {
            return true;
        }

        await pause(delayMs);
    }

    return false;
};

const main = async () => {
    const initialStatus = await tryDatabaseConnection();

    if (initialStatus.ok) {
        return;
    }

    if (initialStatus.error && initialStatus.error.code === "ER_ACCESS_DENIED_ERROR") {
        throw new Error(
            "MySQL is reachable but rejected credentials. Update DB_USER/DB_PASSWORD in .env."
        );
    }

    if (
        initialStatus.error &&
        !CONNECTIVITY_ERROR_CODES.has(initialStatus.error.code)
    ) {
        throw initialStatus.error;
    }

    console.log("MySQL is not reachable. Starting Docker database...");

    if (!startDockerDatabase()) {
        throw new Error(
            "Could not start MySQL with Docker. Install and open Docker Desktop, then run npm start again."
        );
    }

    console.log("Waiting for MySQL to be ready...");
    const isReady = await waitForDatabase();

    if (!isReady) {
        throw new Error("MySQL did not become ready in time. Check Docker logs and retry.");
    }
};

main().catch((error) => {
    console.error(`Database startup failed: ${error.message}`);
    process.exit(1);
});
