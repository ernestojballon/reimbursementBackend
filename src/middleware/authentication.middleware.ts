
var jwt = require('jsonwebtoken');

export function authenticateMiddleware(req,res,next){
    const bearerHeader = req.headers['authorization'];
    if(bearerHeader){
        
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        jwt.verify(bearerToken, 'secret_key',(err,authData)=>{
            if(err){// there is an error or the userdid is not in the token :( forbbidenn
                res.sendStatus(418);
            }else{
                req.userId = authData.userId;//add userid to the request
                req.userRole = authData.userRole.role;//add userid to the request
            }
            
        });

        next();

    }else{
        res.sendStatus(403);
    }

}