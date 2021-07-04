const { Pool } = require('pg');

const connection = new Pool({
	host: 'ec2-107-21-10-179.compute-1.amazonaws.com',
	user: 'yilybqpvuolpen',
	password:
		'b8c8c8d3cf2d77d0b14fe9ca0b33496efa424dc74b693bcfea5f13fb1b089cd7',
	port: '5432',
	database: 'd6l3imlttb58vq',
	ssl: {
		rejectUnauthorized: false,
	},
});




module.exports.connection = connection