import * as express from 'express'
import { users } from '../state';



export const authRouter = express.Router();

const jwt = require('jsonwebtoken');

authRouter.use('',(req,res)=>{
    
     //compare password an username from front end TODO has password  
    const {username, password} = req.body;
    const user = users.find(u => u.username === username && u.password === password)


    // sign jwt with userid and rol to manage authorization in future requests
    if(user){
        const token = jwt.sign({ userId:user.id,userRole:user.role }, 'secret_key',{ expiresIn: '1h' });
        res.status(200);
        res.json({
            token:token
        })
    }else{
        res.sendStatus(401)
    }
})