import {Pool} from 'pg'

export const connectionPool:Pool = new Pool({
    user: process.env['API_USERNAME'],
    host: process.env['API_HOST'],
    database: 'project0',
    password: process.env['API_PASSWORD'],
    port: 5432,
    max: 5 

})