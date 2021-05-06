const { Pool } = require('pg');


const connection = new Pool({
	host: 'localhost',
	user: 'postgres',
	password:'123',
	port: '5432',
	database: 'E-app'
});




module.exports.connection = connection