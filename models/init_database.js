const { Pool } = require('pg');

const connection = new Pool({
	host: 'ec2-54-152-185-191.compute-1.amazonaws.com',
	user: 'rcezopoulzyyhl',
	password:
		'4e54bf606cfc76caafcc7b056ae5d0f0a6e2b9f68d7b288d902c762a210104a8',
	port: '5432',
	database: 'd9t3p362ihaeei',
	ssl: {
		rejectUnauthorized: false,
	},
});




module.exports.connection = connection