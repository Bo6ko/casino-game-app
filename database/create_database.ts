import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql';

//identify user
const sql = `ALTER USER '${process.env.DB_USER}'@'${process.env.DB_HOST}' IDENTIFIED WITH mysql_native_password BY '${process.env.DB_PASSWORD}'`;
console.log(sql);
mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
})
.query(sql);

//create a database
const sql1 = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`;
console.log(sql1);
mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
})
.query(sql1);
