import { dtoReimbursmentType } from "./models/DTO";
import { ReimbursementType } from "../models/reimbursementType";
import PoolClient from 'pg'
import { connectionPool } from "./indexDao";
import ReimbusementError from "../util/ReimbursementError";





function sqlTypetojsType(res:dtoReimbursmentType):ReimbursementType{
    let role:ReimbursementType = {
        id: res.type_id,
        type :res.type_name// primary key
    }
    return role
}

export async function findReimbursementTypeById(typeId:number):Promise<ReimbursementType>{
    let client:PoolClient;
    try{
        client = await connectionPool.connect()
        let query = `select * from types where type_id = $1;`;
        let result = await client.query(query,[typeId]);
        return sqlTypetojsType(result.rows[0])
    } catch(err){//check for what kind of error and send back appropriate custom error
        //console.log(err.message)
        throw new ReimbusementError(500, `Internal error can't get types from the database`);
    } finally {
        client && client.release()
    }
}