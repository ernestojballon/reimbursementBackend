import { connectionPool } from "./indexDao";
import PoolClient from 'pg'
import { Role } from "../models/role";
import { dtoRole } from "./models/DTO";
import ReimbusementError from "../util/ReimbursementError";


function sqlRoletojsRol(res:dtoRole):Role{
    let role:Role = {
        id: res.role_id,
        role :res.role_name// primary key
    }
    return role
}

export async function findRoleById(roleId:number):Promise<Role>{
    let client:PoolClient;
    try{
        
        client = await connectionPool.connect();
        //console.log("the ::",roleId)
        let query = `select * from roles where role_id = $1;`;
        let result = await client.query(query,[roleId]);
        
        return sqlRoletojsRol(result.rows[0])
    } catch(err){//check for what kind of error and send back appropriate custom error
        throw new ReimbusementError(500, 'An error occurs when system attemps to take roles from the database');
    } finally {
        client && client.release()
    }
}
