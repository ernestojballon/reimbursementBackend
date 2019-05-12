import express = require("express");
import { authorizationMiddleware } from "../middleware/authorization.middleware";




export const reimbursmentRouter = express.Router();


// Find Reimbursements By Status
// Reimbursements should be ordered by date
// URL /reimbursements/status/:statusId
//      For a challenge you could do this instead:
//      /reimbursements/status/:statudId/date-submitted?start=:startDate&end=:endDate
// Method: GET
// Allowed Roles finance-manager
// Response:Reimbursement

reimbursmentRouter.get('/reimbursements/status/:statusId',[authorizationMiddleware(['admin','manager']),(req,res)=>{
    
    res.json(`
    // Find Reimbursements By Status
    // Reimbursements should be ordered by date
    // URL /reimbursements/status/:statusId
    // For a challenge you could do this instead:
    // /reimbursements/status/:statudId/date-submitted?start=:startDate&end=:endDate
    // Method: GET
    // Allowed Roles finance-manager
    // Response:Reimbursement
    `);
   
}]);

// Find Reimbursements By User
// Reimbursements should be ordered by date
// URL /reimbursements/author/userId/:userId
//      For a challenge you could do this instead:
//      /reimbursements/author/userId/:userId/date-submitted?start=:startDate&end=:endDate
// Method: GET
// Allowed Roles finance-manager or if ther userId is the user making the request.
// Response:Reimbursement

reimbursmentRouter.get('/reimbursements/author/userId/:userId',[authorizationMiddleware(['admin','manager','employee']),(req,res)=>{
    
    res.json(`
    // Find Reimbursements By User
    // Reimbursements should be ordered by date
    // URL /reimbursements/author/userId/:userId
    //      For a challenge you could do this instead:
    //      /reimbursements/author/userId/:userId/date-submitted?start=:startDate&end=:endDate
    // Method: GET
    // Allowed Roles finance-manager or if ther userId is the user making the request.
    // Response:Reimbursement
    `);
   
}]);

// Submit Reimbursement
// URL /reimbursements
// Method: POST
// Request: The reimbursementId should be 0
// Reimbursement
// Response:
// Status Code 201 CREATED
//   Reimbursement

reimbursmentRouter.post('/reimbursements',[authorizationMiddleware(['admin','employee']),(req,res)=>{
    
    res.json(`
    // Submit Reimbursement
    // URL /reimbursements
    // Method: POST
    // Request: The reimbursementId should be 0
    // Reimbursement
    // Response:
    // Status Code 201 CREATED
    //   Reimbursement
    `);
   
}]);

// Update Reimbursment
// URL /:reinbursment
// Method: PATCH
// Allowed Roles finance-manager
// Request The reimbursementId must be presen as well as all fields
//       to update, any field left undefined will not be updated. 
//          This can be used to approve and deny.
//   Reimbursement
// Response:Reimbursement

reimbursmentRouter.patch('/:id',[authorizationMiddleware(['admin','manager']),(req,res)=>{
    
    res.json(`
    // Update Reimbursement
    // URL /users
    // Method: PATCH
    // Allowed Roles finance-manager
    // Request The reimbursementId must be presen as well as all fields
    //       to update, any field left undefined will not be updated. 
    //          This can be used to approve and deny.
    //   Reimbursement
    // Response:Reimbursement
    `);
   
}]);