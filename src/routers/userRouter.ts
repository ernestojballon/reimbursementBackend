import * as express from 'express'
import { users } from '../state';
import { authorizationMiddleware } from '../middleware/authorization.middleware';



export const userRouter = express.Router();

//Base path::   /users   from   index.ts


// Find Users
// URL /users 
// Method: GET
// Allowed Roles finance-manager
// Response:User

userRouter.get('/',[authorizationMiddleware(['admin','manager']),(req,res)=>{
    
     res.json(`
     user response from // Find Users
     // URL /users 
     // Method: GET
     // Allowed Roles finance-manager
     // Response:User`);
    
}]);

// Find Users By Id
// URL /users/:id
// Method: GET
// Allowed Roles finance-manager or if the id provided matches the id of the current user
// Response:User
userRouter.get('/:id',[authorizationMiddleware(['admin','manager','employee']),(req,res)=>{
    
    res.json(`
    // Find Users By Id
    // URL /users/:id
    // Method: GET
    // Allowed Roles finance-manager or if the id provided matches the id of the current user
    // Response:User`);
   
}]);

// Update User
// URL /users
// Method: PATCH
// Allowed Roles admin
// Request The userId must be presen as well as all fields to 
//    update, any field left undefined will not be updated.:User
// Response:User

userRouter.patch('/',[authorizationMiddleware(['admin']),(req,res)=>{
    
    res.json(`
    // Update User
    // URL /users
    // Method: PATCH
    // Allowed Roles admin
    // Request The userId must be presen as well as all fields to 
    //    update, any field left undefined will not be updated.:User
    // Response:User`);
   
}]);

