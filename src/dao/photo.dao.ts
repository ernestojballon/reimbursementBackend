

import { connectionPool } from "./indexDao";
import PoolClient from 'pg'
import { Photo } from "../models/photo";
import { dtoPhoto } from "./models/DTO";
import ReimbusementError from "../util/ReimbursementError";


function sqlRoletojsPhoto(res:dtoPhoto):Photo{
    let role:Photo = {
        id: res.photo_id,
        url : res.url,
        reimbursement: res.reimbursement_id

    }
    return role
}
export async function insertPhoto(url:string,reimId:number){
    let client:PoolClient;
    try{
        
        client = await connectionPool.connect();
        console.log("the ::",url,reimId)
        let query = `INSERT INTO photos VALUES(default,$1,$2)RETURNING photo_id;`;
        let result = await client.query(query,[url,reimId]);
        console.log(result.rows[0])
        result.rows[0]? true:false;
    } catch(err){//check for what kind of error and send back appropriate custom error
        console.log(err)
        throw new ReimbusementError(500, 'The image could not be attach to the reimbursement that you picked');
    } finally {
        client && client.release()
    }
}