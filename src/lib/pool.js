import {Pool} from "pg"

let pool; 

if (!pool) {
    pool = new Pool({
		host: process.env['PG_HOST'],
		port: process.env['PG_PORT'],
		user: process.env['PG_USER'],
		password: process.env['PG_PASSWORD'],
		database: process.env['PG_DATABASE'],
	});
}

export default { query: (sql, params) => pool.query(sql, params) };