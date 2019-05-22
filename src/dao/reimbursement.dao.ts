import { Reimbursement } from "../models/reimbursement";
import { dtoReimbursement } from "./models/DTO";
import { User } from "../models/user";
import { ReimbursementStatus } from "../models/reimbursementStatus";
import { ReimbursementType } from "../models/reimbursementType";
import { findUserByIdService } from "../services/user.service";
import { findReimbursementTypeByIdService } from "../services/reimbursementType.service";
import { findReimbursementStatusByIdService } from "../services/reimbursementStatus.service";
import { connectionPool } from "./indexDao";
import * as PoolClient from 'pg'
import ReimbusementError from "../util/ReimbursementError";


//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Parse (dtoReimburstment model) to --------> (Reimburstment model)
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
async function sqlReimbursementtojsReimbursement(res:dtoReimbursement):Promise<Reimbursement>{
    try{
        let _author:User = await findUserByIdService(res.author)
        let _resolver:User = await findUserByIdService(res.resolver)
        let _status:ReimbursementStatus = await findReimbursementStatusByIdService(res.status_id);
        let _type:ReimbursementType= await findReimbursementTypeByIdService(res.status_id);
        let reimburstment:Reimbursement = {
            id: res.reimbursement_id ,// primary key
            author: _author,// foreign key -> User, not null
            amount: res.amount ,// not null
            dateSubmitted:res.submitted_date ,// not null
            dateResolved:res.resolve_date || null  ,// not null
            description: res.description ,// not null
            resolver: _resolver  ,// foreign key -> User
            status: _status ,// foreign ey -> ReimbursementStatus, not null
            type: _type ,// foreign key -> ReimbursementType
            
        }
        return reimburstment;
    }catch(err){
        //console.log(err.message)
        throw new ReimbusementError(500, 'Internal error can not retrieve reimbursement');
    }
   
}
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Find reimbursement by id  :: Caution:this method use to many connection to the database,use view by id::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
export async function findReimbursementById(reimbursementId:number){
    
    let client:PoolClient;
    try{
        client = await connectionPool.connect();
        let query = 'select * from reimbursements where reimbursement_id = $1 '
        let result= await client.query(query,[reimbursementId])
        //console.log(result.rows[0]);
        return result.rows[0];
    }catch(err){
        //console.log(err.message)
        throw new ReimbusementError(500, 'Internal error reimbursement by id failed');
    } finally{
        client && client.release()
    }
}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Create reimbursement 
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
export async function createReimbursement(reimburstmentDto:dtoReimbursement){
    let client:PoolClient;
    try{
        
        client = await connectionPool.connect();
        let query = `
        INSERT INTO reimbursements(author,amount,description,reim_type_id) 
        VALUES($1, $2,$3,$4) RETURNING reimbursement_id;`;
        let result = await client.query(query,[reimburstmentDto.author,reimburstmentDto.amount,reimburstmentDto.description,reimburstmentDto.reim_type_id]);
         query = `select * from reimbursements_view where reimbursement_id= $1;`;
         result = await client.query(query,[result.rows[0].reimbursement_id]);
        //console.log('the result is ::',result.rows[0])
        return result.rows[0];

    }catch(err){
        //console.log(err.message)
        throw new ReimbusementError(500, `Internal error reimbursement was not created`);
    } finally{
        client && client.release()
    }
}
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Update reimbursement
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
export async function updateReimbursement(reimbursementDto:dtoReimbursement){
    let client:PoolClient;
    try{
        
        client = await connectionPool.connect();
        let query = `
        UPDATE reimbursements
        SET
        author = $1,
        amount = $2 ,
        submitted_date = $3, 
        resolve_date = $4 ,
        description = $5 ,
        resolver = $6,
        status_id = $7,
        reim_type_id = $8 
        WHERE reimbursement_id = $9;`;
        await client.query(query,[
            reimbursementDto.author,
            reimbursementDto.amount,
            reimbursementDto.submitted_date,
            reimbursementDto.resolve_date,
            reimbursementDto.description,
            reimbursementDto.resolver,
            reimbursementDto.status_id,
            reimbursementDto.reim_type_id,
            reimbursementDto.reimbursement_id
        ]);
        return reimbursementDto;

    }catch(err){
        //console.log(errr.message)
        throw new ReimbusementError(500, `Internal error reimbursement was not updated`);
    } finally{
        client && client.release()
    }
}
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Find reimbursements View 
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
export async function findReimbursementView(){
    
    let client:PoolClient;
    try{
        client = await connectionPool.connect();
        let query = 'select * from reimbursements_view;'
        let result= await client.query(query)
        return result.rows;
    }catch(err){
        //console.log(errr.message)
        throw new ReimbusementError(500, `Internal error system can not retrieve reimbursements`);
    } finally{
        client && client.release()
    }
}
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Find reimbursement view by status
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
export async function findReimbursementViewByStatus(statusId:number){
    
    let client:PoolClient;
    try{
        client = await connectionPool.connect();
        let query = 'select * from reimbursements_view where status_id= $1'
        let result= await client.query(query,[statusId])
        return result.rows;
    }catch(err){
        //console.log(errr.message)
        throw new ReimbusementError(500, 'Internal error: Reimbursement by state failed');
    } finally{
        client && client.release()
    }
}
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Find reimbursement view by id
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
export async function findReimbursementViewByUser(userId:number){
    
    let client:PoolClient;
    try{
        client = await connectionPool.connect();
        let query = 'select * from reimbursements_view where author_id= $1'
        let result= await client.query(query,[userId])
        return result.rows;
    }catch(err){
        //console.log(errr.message)
        throw new ReimbusementError(500, 'Internal error: Reimbursement by id failed');
    } finally{
        client && client.release()
    }
}
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Count all the reimbursement in the table
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
export async function countAllReimbursements():Promise<number>{
    
    let client:PoolClient;
    try{
        client = await connectionPool.connect();
        let query = 'select count(reimbursement_id) from reimbursements_view'
        let result= await client.query(query)
        console.log("this is the result fromn the query::",result.rows[0].count)
        return result.rows[0].count;
    }catch(err){
        //console.log(errr.message)
        throw new ReimbusementError(500, 'Internal error: Reimbursement count failed');
    } finally{
        client && client.release()
    }
}
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Find Reimbursement page with page seze and start point
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
export async function findReimburstmentByPage(pageSize,start){
    //TO DO:: Finish query ,basically all this method
    let client:PoolClient;
    try{
        client = await connectionPool.connect();
        let query = 'select * from reimbursements_view order by reimbursement_id limit $1 offset $2'
        let result= await client.query(query,[pageSize,start])
        //console.log(query,pageSize,start)
        return result.rows;
    }catch(err){
        //console.log(errr.message)
        throw new ReimbusementError(500, 'Internal error: Reimbursement pagination failed');
    } finally{
        client && client.release()
    }
}
