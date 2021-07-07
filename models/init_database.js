const { Pool } = require('pg');

const connection = new Pool({
	host: 'ec2-52-5-1-20.compute-1.amazonaws.com',
	user: 'aeaubsshaayzwa',
	password:
		'4a2d34caf8e4d3903b6c7d453014c581abeac214a1f8356b617aaafecc03741e',
	port: '5432',
	database: 'd48j1jvrg9tvit',
	ssl: {
		rejectUnauthorized: false,
	},
});




module.exports.connection = connection