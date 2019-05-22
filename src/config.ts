

export const jwtkey  = process.env['SUPER_SECRET_CODE']
export const salt:number  = +process.env['API_SALT']
export const serverNode = 'http://127.0.0.1:9050';