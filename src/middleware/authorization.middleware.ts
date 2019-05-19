


export function authorizationMiddleware(authRoles:string[]){
    //the function we return is the middleware
    return (req, res, next) => {
        let isAuth = false;
        if(authRoles.includes(req.userRole)){
                isAuth = true
        }
        
        if(isAuth){
            next()
        } else {
            res.status(401)
            res.json({ message:'User not authorized to this end point'})
        }

    }
}