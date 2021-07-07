const { Pool } = require('pg');

const connection = new Pool({
	host: 'ec2-52-5-1-20.compute-1.amazonaws.com',
	user: 'tcvuafzdkqdwle',
	password: '000c7c38a44ce4cbe6dc4bae1240ea0db56a6a07f0d7d1a8d39c05cb4d9820e6',
	port: '5432',
	database: 'd6g8jk7srs5gu1',
	ssl: {
	  rejectUnauthorized: false,
	},
});




module.exports.connection = connection