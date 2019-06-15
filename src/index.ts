import express from "express";
import { authRouter } from "./routers/authRouter";
import bodyParser = require("body-parser");
import { authenticateMiddleware } from "./middleware/authentication.middleware";
import { userRouter } from "./routers/userRouter";
import { reimbursementRouter } from "./routers/reimbursementRouter";
import fileUpload from "express-fileupload"
export const jwtkey  = process.env['SUPER_SECRET_CODE']
import cors = require('cors');
const app = express();
app.use(bodyParser.json())

app.use(cors({
    origin: ['*','http://localhost:3000','http://ernesto-react.s3-website.us-east-2.amazonaws.com'],
    credentials: true
})); 

app.post('/api/login',authRouter)

//retrict the access to any route of our domain if you are not authenticated
app.use('',authenticateMiddleware)
app.use(fileUpload());
//redirect to usersRouter
app.use('/api/users',userRouter);

//redirect to reimburstmentRouter
app.use('/api/reimbursement',reimbursementRouter);

app.use('/',(req,res)=>{
    res.status(501)
    res.json({
        message:'This url was not implemented in this API'
    })
})


app.listen(9050, ()=>{
    console.log('app has started');
})