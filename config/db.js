const mysql = require("mysql2/promise");

let db;

async function connectDB() {
    console.log("DB_HOST:", process.env.DB_HOST);
    console.log("DB_PORT:", process.env.DB_PORT);
    console.log("DB_USER:", process.env.DB_USER);
    console.log("DB_NAME:", process.env.DB_NAME);
    db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT)   // important for cloud
    });

    console.log("mysql connected");
}

function getDB() {
    if (!db) {
        throw new Error("Database not connected yet");
    }
    return db;
}

module.exports = { connectDB, getDB };