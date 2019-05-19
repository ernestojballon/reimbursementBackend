import * as express from 'express'
import { User } from '../models/user';
import { findUserByUsernameAndPasswordService } from '../services/user.service';
import {jwtkey} from '../config'

export const authRouter = express.Router();

const jwt = require('jsonwebtoken');

authRouter.use('',async (req,res)=>{
    try{
    //compare password an username from front end TODO has password  
        const {username, password} = req.body;
        const user:User = await findUserByUsernameAndPasswordService(username, password);
        const token = jwt.sign({ userId:user.id,userRole:user.role.role }, jwtkey,{ expiresIn: '1h' });
        res.status(200);
        res.json({
            token:token,
            user:user
        });
       
    }catch(err){
        let message = err.message || `We can't let you in`
        res.status(401).send({
            message: err.message
        });
    }
    
})