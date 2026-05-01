const mysql = require("mysql2/promise");

let db;

async function connectDB() {
    db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT   // important for cloud
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