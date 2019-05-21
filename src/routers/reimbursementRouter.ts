import express = require("express");
import { authorizationMiddleware } from "../middleware/authorization.middleware";
import { Reimbursement } from "../models/reimbursement";
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
//Base path::   /reimburstment   from   index.ts

export const reimbursementRouter = express.Router();

// Find Reimbursements By Status
// Reimbursements should be ordered by date
// URL /reimbursements/status/:statusId
//      For a challenge you could do this instead:
//      /reimbursements/status/:statudId/date-submitted?start=:startDate&end=:endDate
// Method: GET
// Allowed Roles finance-manager
// Response:Reimbursement

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
// Reimbursements should be ordered by date
// URL /reimbursements/author/userId/:userId
//      For a challenge you could do this instead:
//      /reimbursements/author/userId/:userId/date-submitted?start=:startDate&end=:endDate
// Method: GET
// Allowed Roles finance-manager or if ther userId is the user making the request.
// Response:Reimbursement

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
// URL /reimbursements
// Method: POST
// Request: The reimbursementId should be 0
// Reimbursement
// Response:
// Status Code 201 CREATED
//   Reimbursement

reimbursementRouter.post("/", [authorizationMiddleware(["admin", "employee"]),
  asyncHandler(async (req, res) => {
    const reimDto: dtoReimbursement = {
      author: req.body.author_id, // foreign key -> User, not null
      amount: req.body.amount, // not null
      description: req.body.description, // not null
      reim_type_id: req.body.type_id // foreign key -> ReimbursementType
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
// URL /:reinbursment
// Method: PATCH
// Allowed Roles finance-manager
// Request The reimbursementId must be presen as well as all fields
//       to update, any field left undefined will not be updated.
//          This can be used to approve and deny.
//   Reimbursement
// Response:Reimbursement

reimbursementRouter.patch("/", [
  authorizationMiddleware(["admin", "manager"]),
  asyncHandler(async (req, res) => {
    const reimDto: dtoReimbursement = {
      reimbursement_id: req.body.reimbursement_id,
      author: req.body.author_id, // foreign key -> User, not null
      amount: req.body.amount,
      submitted_date: req.body.submitted_date, // not null
      resolve_date: req.body.resolve_date, // not null
      description: req.body.description,
      resolver: req.body.resolver_id, // foreign key -> User
      status_id: req.body.status_id, // not null
      reim_type_id: req.body.type_id // foreign key -> ReimbursementType
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
//set this middleware in route if you have more than one pagination in our api

reimbursementRouter.use(function(req, res, next) {
  // set default or minimum is 10 (as it was prior to v0.2.0)
  if (req.query.limit >= 10) req.query.limit = 10;
  next();
});

// pagination for my reimbursement get all 
reimbursementRouter.get("/page", [
  authorizationMiddleware(["admin", "manager"]),
  asyncHandler(async (req, res) => {
    //Todo: middleware to prevent pageSize bigger than 10 
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
// pagination for my reimbursement get all 
reimbursementRouter.post("/upload/:id", [
  authorizationMiddleware(["admin", "manager","employee"]),
  asyncHandler(async (req, res) => {
    let sampleFile;
    let uploadPath;

    if (Object.keys(req.files).length == 0) {
      res.status(400).send('No files were uploaded.');
      return;
    }
    console.log('req.files >>>', req.files); // eslint-disable-line
    sampleFile = req.files.sampleFile;
    sampleFile.name = Date.now().toString().split(" ").join("") + sampleFile.name.slice(-4);
    uploadPath =__dirname + '/../uploads/temp/'+ sampleFile.name

    try {await sampleFile.mv(uploadPath)}catch(err){throw new ReimbusementError(500,'Error uploading the file')}
    //TO DO : find reimbursement by id ,store url in photos table, and fk to a reimbursements
    //let response = await findReimburstmentById(pageSize,start);

    var oldPath = __dirname + '/../uploads/temp/'+ sampleFile.name
    var newPath = __dirname + '/../uploads/'+ sampleFile.name

    fs.rename(oldPath, newPath, function (err) {
      if (err) throw err
      console.log('Successfully renamed - AKA moved!')
    })
    
    res.send('File uploaded to ' + uploadPath);
  })
]);