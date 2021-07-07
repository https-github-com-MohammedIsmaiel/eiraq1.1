const { Pool } = require('pg');

const connection = new Pool({
	host: 'ec2-52-5-1-20.compute-1.amazonaws.com',
	user: 'zngsfxbaerzzgo',
	password:
		'75e96c83ec0f50d0bc9e0cc3a94c13d9b07ad4b52e8ad562ad3770c866b54ad8',
	port: '5432',
	database: 'deqajgslo5pt7n',
	ssl: {
		rejectUnauthorized: false,
	},
});




module.exports.connection = connection