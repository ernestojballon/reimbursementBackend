
import { findReimbursementView, findReimbursementViewByStatus, findReimbursementViewByUser, createReimbursement, updateReimbursement } from '../dao/reimbursement.dao';
import { dtoReimbursement } from '../dao/models/DTO';



//::::::::::::::::::::::::::::::::::::::::::::::::::
// Find all reimburstments view  by status service
//::::::::::::::::::::::::::::::::::::::::::::::::::

export async function findReimbursementViewService(){
    return  await findReimbursementView();
}
//::::::::::::::::::::::::::::::::::::::::::::::::::
// Find reimburstments view by status service
//::::::::::::::::::::::::::::::::::::::::::::::::::
export async function findReimbursementViewByStatusService(statusId:number){
    return  await findReimbursementViewByStatus(statusId);
}
//::::::::::::::::::::::::::::::::::::::::::::::::::
// Find reimburstments by user service
//::::::::::::::::::::::::::::::::::::::::::::::::::
export async function findReimbursementViewByUserService(userId:number){
    return  await findReimbursementViewByUser(userId);
}
//::::::::::::::::::::::::::::::::::::::::::::::::::
// Create reimburstments service
//::::::::::::::::::::::::::::::::::::::::::::::::::
export async function createReimbursementService(reimburstmentDto:dtoReimbursement){
    return  await createReimbursement(reimburstmentDto);
}
//::::::::::::::::::::::::::::::::::::::::::::::::::
// Update reimburstments service
//::::::::::::::::::::::::::::::::::::::::::::::::::
export async function updateReimbursementService(reimburstmentDto:dtoReimbursement){
    return  await updateReimbursement(reimburstmentDto);
}