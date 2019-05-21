import { findAllUsers, findUserById, findUserByUsernameAndPassword, updateUser, createUser } from "../dao/user.dao";
import { findRolByIdService } from "./role.service";
import { User } from "../models/user";
import { dtoUser } from "../dao/models/DTO";

//::::::::::::::::::::::::::::::::::::::::::
// Find all user service
//::::::::::::::::::::::::::::::::::::::::::
export async function findAllUsersService():Promise<User[]>{
      //promise all to return only when all the promises in newlist were return
    return await findAllUsers();;
}

//::::::::::::::::::::::::::::::::::::::::::
// Find user by id service
//::::::::::::::::::::::::::::::::::::::::::
export async function findUserByIdService(userId:number):Promise<User>{
    return await findUserById(userId)
}

//::::::::::::::::::::::::::::::::::::::::::
// Find user by id and password
//::::::::::::::::::::::::::::::::::::::::::
export async function findUserByUsernameAndPasswordService(username:string, password:string):Promise<User>{

    return await findUserByUsernameAndPassword(username, password);
    
}

//::::::::::::::::::::::::::::::::::::::::::
// Update user 
//::::::::::::::::::::::::::::::::::::::::::
export async function updateUserService(userdto:dtoUser):Promise<User>{
    return await updateUser(userdto);
};

//::::::::::::::::::::::::::::::::::::::::::
// Create user service
//::::::::::::::::::::::::::::::::::::::::::
export async function createUserService(userdto:dtoUser):Promise<User>{
    return await createUser(userdto);
};