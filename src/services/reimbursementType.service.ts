import { ReimbursementType } from "../models/reimbursementType";
import { findReimbursementTypeById } from "../dao/reimbursementType.dao";





//:::::::::::::::::::::::::::::::::::::::::::::::::
// find type NAME by id 
//:::::::::::::::::::::::::::::::::::::::::::::::::
export async function findReimbursementTypeNameByIdService(typeId:number):Promise<string>{
    let type:ReimbursementType = await findReimbursementTypeById(typeId)
    return type.type;
}
//:::::::::::::::::::::::::::::::::::::::::::::::::
// Find type OBJECT by id 
//:::::::::::::::::::::::::::::::::::::::::::::::::
export async function findReimbursementTypeByIdService(typeId:number):Promise<ReimbursementType>{
    
    return await findReimbursementTypeById(typeId);
}