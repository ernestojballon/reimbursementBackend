import * as express from 'express'
import { authorizationMiddleware } from '../middleware/authorization.middleware';
import { User } from '../models/user';
import { findAllUsersService, findUserByIdService, updateUserService,createUserService, deleteUserService } from '../services/user.service';

import { dtoUser } from '../dao/models/DTO';
import { asyncHandler } from '../util/asyncHandler';
import ReimbusementError from '../util/ReimbursementError';
import * as bcrypt from "bcryptjs";
import { salt } from '../config';


export const userRouter = express.Router();

//Base path::   /users   from   index.ts
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Find Users
// GET
// Url: http://127.0.0.1:9050/api/users
//
//              HEADER
// authorization         Beared [token]
//

userRouter.get('/',[authorizationMiddleware(['admin','manager']),asyncHandler(async (req,res)=>{
    let users:User[] = await findAllUsersService();
    res.status(200)
    res.json(users);
    
})]);
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Find Users By Id
// GET
// Url: http://127.0.0.1:9050/api/users/[user Id]
//
//              HEADER
// authorization         Beared [token]
//

userRouter.get('/:userId',[authorizationMiddleware(['admin','manager','employee']),asyncHandler(async (req,res)=>{
    let id = +req.params.userId;
    if (req.userRole === "employee" && req.userId != id) {
      throw new ReimbusementError(400,`User is not authorized to see other users`);
    }
    let user:User = await findUserByIdService(id)
    res.status(200);
    res.json(user);
   
})]);
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Update User
// PATCH
// Url: http://127.0.0.1:9050/api/users/[user Id]
//
//              HEADER
// authorization         Beared [token]
//
//           Body
// 
// {
//     "userName": "joesb",
//     "firstName": "joseph",
//     "lastName": "beldnesr",
//     "email": "beldsner@gmail.com",
//     "role":  2
// }
userRouter.patch('/:id',[authorizationMiddleware(['admin']),asyncHandler(async (req,res)=>{
    const userdto:dtoUser = {
        user_id : req.params.id, 
        username : req.body.userName  ,
        firstname : req.body.firstName  , 
        password: req.body.password || 'hashed',
        lastname : req.body.lastName  , 
        email : req.body.email ,
        role_id : req.body.role   
    };
    for (let key in userdto){
        if(!userdto[key]){
            throw new ReimbusementError(400,"Please insert all fields in the correct way");
        }
    }
    const user:User = await updateUserService(userdto);
    res.status(200);
    res.json(user); 
   
}

)]);
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Create User
// POST
// Url: http://127.0.0.1:9050/api/users/
//
//              HEADER
// authorization         Beared [token]
//
//           Body
// 
//  {
//     "userName": "admin",
//     "password": "pass",
//     "firstName": "admin",
//     "lastName": "admin",
//     "email": "finava@gmail.com",
//     "role":  1
// }


userRouter.post('/',[authorizationMiddleware(['admin']),asyncHandler(async (req,res)=>{
   
    const userdto:dtoUser = {
        user_id : 0,
        username : req.body.userName  ,
        firstname : req.body.firstName  , 
        password: bcrypt.hashSync(req.body.password,salt),
        lastname : req.body.lastName  , 
        email : req.body.email   ,
        role_id : req.body.role   
    };
    
    if(
        !userdto.username && 
        !userdto.firstname && 
        !userdto.lastname && 
        !userdto.password && 
        !userdto.email && 
        !userdto.role_id ){
            throw new ReimbusementError(400,"Please insert all fields in the correct way");
        }
    
    const user:User = await createUserService(userdto);
    res.status(201);
    res.json(user); 
   
}

)]);
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Delete User
userRouter.delete('/:userId',[authorizationMiddleware(['admin']),asyncHandler(async (req,res)=>{
    let id = +req.params.userId;
    
    if(!id){
            throw new ReimbusementError(400,"Please insert an id to delete from database");
        }
    
    await deleteUserService(id);
    res.status(200);
    res.json({
        id,
        messsage:'user delete'
    }); 
   
}

)]);





