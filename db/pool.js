const {Pool} = require('pg');
require('dotenv').config();

const env = process.env.CONNECTION;

module.exports = new Pool({
    // host: "localhost",
    // user: "postgres",
    // password: '123',
    // database: "postgres",
    // port: 5432
    connectionString: env
})