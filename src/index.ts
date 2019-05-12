import * as express from "express";
import { authRouter } from "./routers/authRouter";
import bodyParser = require("body-parser");
import { authenticateMiddleware } from "./middleware/authentication.middleware";
import { authorizationMiddleware } from "./middleware/authorization.middleware";


const app = express();

app.use(bodyParser.json())

// login router gives the token with userId and userRol inside validated for 1 hour
app.post('/api/login',authRouter)

//retrict the access to any route of our domain if you are not authenticated
app.use('',authenticateMiddleware)

// Example of Authorizacion for manager an employee 
    // app.get('/api/protected',[authorizationMiddleware(['manager']),(req,res)=>{
    //     res.json({
    //         text: 'this is gonna be protected url a manager can acces to this one'
    //     });
    // }]);
    // app.get('/api/employee',[authorizationMiddleware(['employee']),(req,res)=>{
    //     res.json({
    //         text: 'this is gonna be protected url a employee can acces to this one'
    //     });
    // }]);
////////////////////////////////////////////////////////////////




app.listen(9050, ()=>{
    console.log('app has started');
})