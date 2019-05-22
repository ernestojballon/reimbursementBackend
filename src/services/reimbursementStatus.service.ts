import { ReimbursementStatus } from "../models/reimbursementStatus";
import { findReimbursementStatusById } from "../dao/reimbursementStatus.dao";








//:::::::::::::::::::::::::::::::::::::::::::::::::
// find status NAME by id 
//:::::::::::::::::::::::::::::::::::::::::::::::::
export async function findReimbursementStatusNameByIdService(statusId:number):Promise<string>{
    let status:ReimbursementStatus = await findReimbursementStatusById(statusId)
    return status.status;
}
//:::::::::::::::::::::::::::::::::::::::::::::::::
// Find status OBJECT by id 
//:::::::::::::::::::::::::::::::::::::::::::::::::
export async function findReimbursementStatusByIdService(statusId:number):Promise<ReimbursementStatus>{
    
    return await findReimbursementStatusById(statusId);
}