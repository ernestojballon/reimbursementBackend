import express = require("express");
import { authorizationMiddleware } from "../middleware/authorization.middleware";

import {
  findReimbursementViewByStatusService,
  findReimbursementViewByUserService,
  createReimbursementService,
  updateReimbursementService,
  countAllReimbursementsService
} from "../services/reimbursement.service";
import { asyncHandler } from "../util/asyncHandler";
import { dtoReimbursement } from "../dao/models/DTO";
import ReimbusementError from "../util/ReimbursementError";
import { findReimburstmentByPage } from "../dao/reimbursement.dao";
import { serverNode } from "../config";
import * as fs from 'fs'
import { insertPhotoService } from "../services/photo.service";
//Base path::   /reimburstment   from   index.ts

export const reimbursementRouter = express.Router();


// Find Reimbursements By Status
// GET
// Url: http://127.0.0.1:9050/api/reimbursement/status/[status id]
//
//              HEADER
// authorization         Beared [token]
//
reimbursementRouter.get("/status/:statusId", [
  authorizationMiddleware(["admin", "manager"]),
  asyncHandler(async (req, res) => {
    let id = +req.params.statusId;
    let reimbursements = await findReimbursementViewByStatusService(id);
    if (typeof reimbursements[0] === "undefined") {
        throw new ReimbusementError(204,"System does not have reimbursement to show with that status");
      }
    res.status(200);
    res.json(reimbursements);
  })
]);


// Find Reimbursements By User
// GET
// Url: http://127.0.0.1:9050/api/reimbursement/author/userId/[user id]
//
//              HEADER
// authorization         Beared [token]
//

reimbursementRouter.get("/author/userId/:userId", [
  authorizationMiddleware(["admin", "manager", "employee"]),
  asyncHandler(async (req, res) => {
    let id = +req.params.userId;
    if (req.userRole === "employee" && req.userId != id) {
      throw new ReimbusementError(400,`User is not authorized to see reimbursement`);
    }
    if (id && typeof id === "number") {
      let reimbursements = await findReimbursementViewByUserService(id);
      if (typeof reimbursements[0] === "undefined") {
        throw new ReimbusementError(204,"This message it's not showing because 206 code  no content XD ");
      }
      res.status(200);
      res.json(reimbursements);
    } else {
        throw new ReimbusementError(406,"Please insert only number in the url");
    }

  })

]);

// Submit Reimbursement
// POST
// Url: http://127.0.0.1:9050/api/reimbursement/
//
//              HEADER
// authorization         Beared [token]
//
//           Body
// {
//   "author_id": 3,
//   "amount": 10,
//   "description": "food is to expensive",
//   "type_id": 3
// }
reimbursementRouter.post("/", [authorizationMiddleware(["admin","manager", "employee"]),
  asyncHandler(async (req, res) => {
    const reimDto: dtoReimbursement = {
      author: req.userId, 
      amount: req.body.amount, 
      description: req.body.description, 
      reim_type_id: req.body.type_id 
    };
    if (
      !reimDto.author &&
      !reimDto.amount &&
      !reimDto.description &&
      !reimDto.reim_type_id
    ) {
    throw new ReimbusementError(400,"Please insert all fields in the correct way");
     
    }
    const reimbursement = await createReimbursementService(reimDto);
    res.status(201);
    res.json(reimbursement);
  })
]);


// Update Reimbursment
// PATCH
// Url: http://127.0.0.1:9050/api/reimbursement/
//
//              HEADER
// authorization         Beared [token]
//
//           Body
// {
//   "reimbursement_id": 20,
//   "author_id": 3,
//   "amount": "1050",
//   "submitted_date": "2019-08-17",
//   "resolve_date": "2019-08-17T04:00:00.000Z",
//   "description": "money because i am a good worker",
//   "resolver_id": 3,
//   "status_id": 2,
//   "type_id": 2
// }
reimbursementRouter.patch("/", [
  authorizationMiddleware(["admin", "manager"]),
  asyncHandler(async (req, res) => {
    const reimDto: dtoReimbursement = {
      reimbursement_id: req.body.reimbursement_id,
      author: req.body.author_id, 
      amount: req.body.amount,
      submitted_date: req.body.submitted_date, 
      resolve_date: req.body.resolve_date, 
      description: req.body.description,
      resolver: req.userId , 
      status_id: req.body.status_id, 
      reim_type_id: req.body.type_id 
    };
    console.log(reimDto);
    for (let key in reimDto) {
      if (!reimDto[key]) {
        throw new Error("Please insert all fields in the correct way");
      }
    }
    const reimbursement = await updateReimbursementService(reimDto);
    res.status(200);
    res.json(reimbursement);
  })
]);





// Pagination for my reimbursement get all 
//GET
// Url: http://127.0.0.1:9050/api/reimbursement/page?page=[page]&limit=[limit]
//
//              HEADER
// authorization         Beared [token]
//
//           PARAMS
//Key               Value:
//page              [integer]
//limit             [integer]

//set this middleware in route if you have more than one pagination end point in our api
reimbursementRouter.use(function(req, res, next) {
  // set default  10 
  if (req.query.limit >= 10) req.query.limit = 10;
  next();
});
reimbursementRouter.get("/page", [
  authorizationMiddleware(["admin", "manager"]),
  asyncHandler(async (req, res) => {
    let pageSize = +req.query.limit || 3;//pageSize 3 default change this after middleware is set up
    let totalRecords:number = await countAllReimbursementsService();
    let pageCount = Math.ceil(totalRecords/pageSize);
    let current = 1;
    if(req.query.page){ current = Math.abs(req.query.page) }
    if (!current || !pageCount || current > pageCount){ throw new ReimbusementError(400,"Database do not have that many records in the database")}
    let start = (current -1) * pageSize;
    let response = await findReimburstmentByPage(pageSize,start);
    let before = [];
    let after = [];  
    for (let x=1;x<pageCount+1;x++){
      if(x>current){
        after.push(serverNode + req.baseUrl + '/page?page='+x+"&limit="+pageSize||0)
      }
      if(x<current){
        before.push(serverNode + req.baseUrl + '/page?page='+x+"&limit="+pageSize||0)
      }
    }
    let page = {
      result:response,
      before: before,
      after:  after
    } 
    res.status(200);
    res.json(page);
  })
]);

//imagen upload
//POST
// Url:  http://127.0.0.1:9050/api/reimbursement/upload/[reimbursement ID] 
// Upload images for a reimbursment 
// photos are saved in uploads
//
//              HEADER
// authorization         Beared [token]
//
//           BODY:form-data
//Key:type file            Value:
//myreceipt               [image path in your computer]
//

reimbursementRouter.post("/upload/:reimId", [
  authorizationMiddleware(["admin", "manager","employee"]),
  asyncHandler(async (req, res) => {
    let myReceiptFile;
    let uploadPath;


    if (Object.keys(req.files).length == 0) {
      res.status(400).send('No files were uploaded.');
      return;
    }
    myReceiptFile = req.files.myreceipt;
    myReceiptFile.name = Date.now().toString().split(" ").join("") + myReceiptFile.name.slice(-4);
    uploadPath =__dirname + '/../uploads/temp/'+ myReceiptFile.name

    try {await myReceiptFile.mv(uploadPath)}catch(err){throw new ReimbusementError(500,'Error uploading the file')}
    
    let reimId = req.params.reimId;
    let relativePath = '/../uploads/'+ myReceiptFile.name;
    let newPath = __dirname + relativePath;
    try{await insertPhotoService(relativePath,reimId);}catch(err){
      fs.unlinkSync(uploadPath);
      throw err;
    }
    fs.rename(uploadPath, newPath, function (err) {
      if (err) throw err
      //console.log('Successfully renamed - AKA moved!')
    })
    res.status(201);
    res.send({
      message:'photo saved'
    });
  })
]);