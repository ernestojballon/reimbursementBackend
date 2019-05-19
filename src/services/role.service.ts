import { findRoleById } from "../dao/role.dao";
import { Role } from "../models/role";



//:::::::::::::::::::::::::::::::::::::::::::::::::
// find roll NAME by id 
//:::::::::::::::::::::::::::::::::::::::::::::::::
export async function findRolNameByIdService(rolId:number){
    let role:Role = await findRoleById(rolId)
    return role.role;
}
//:::::::::::::::::::::::::::::::::::::::::::::::::
// Find roll OBJECT by id 
//:::::::::::::::::::::::::::::::::::::::::::::::::
export async function findRolByIdService(rolId:number):Promise<Role>{
    
    return await findRoleById(rolId);
}