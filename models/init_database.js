const { Pool } = require('pg');

const connection = new Pool({
	host: 'ec2-34-206-8-52.compute-1.amazonaws.com',
	user: 'rbgvqvhqammioy',
	password:
		'4164b47f7d7558ac4e65468537b777d3b13aca818a6a61e51fd85d03843012b8',
	port: '5432',
	database: 'd7bvh5o2o71u2c',
	ssl: {
		rejectUnauthorized: false,
	},
});




module.exports.connection = connection