const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", "..", ".env");

const parseLine = (line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
        return null;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
        return null;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    let value = trimmedLine.slice(separatorIndex + 1).trim();

    if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
    ) {
        value = value.slice(1, -1);
    }

    return { key, value };
};

const loadEnv = () => {
    if (!fs.existsSync(envPath)) {
        return;
    }

    const content = fs.readFileSync(envPath, "utf8");

    content.split(/\r?\n/).forEach((line) => {
        const entry = parseLine(line);

        if (!entry) {
            return;
        }

        if (process.env[entry.key] === undefined) {
            process.env[entry.key] = entry.value;
        }
    });
};

module.exports = loadEnv;
