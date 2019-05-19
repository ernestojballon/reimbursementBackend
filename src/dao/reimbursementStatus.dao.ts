
import PoolClient from 'pg'
import { connectionPool } from "./indexDao";
import { dtoReimbursementStatus } from './models/DTO';
import { ReimbursementStatus } from '../models/reimbursementStatus';
import ReimbusementError from '../util/ReimbursementError';



function sqlStatustojsStatus(res:dtoReimbursementStatus):ReimbursementStatus{
    let status:ReimbursementStatus = {
        id: res.status_id,
        status :res.status_name// primary key
    }
    return status
}

export async function findReimbursementStatusById(statusId:number):Promise<ReimbursementStatus>{
    let client:PoolClient;
    try{
        client = await connectionPool.connect()
        let query = `select * from status where status_id = $1;`;
        let result = await client.query(query,[statusId]);
        return sqlStatustojsStatus(result.rows[0])
    } catch(err){//check for what kind of error and send back appropriate custom error
        //console.log(err.message)
        throw new ReimbusementError(500, `internal error can't get status from the database`);
    } finally {
        client && client.release()
    }
}