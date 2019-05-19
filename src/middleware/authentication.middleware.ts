

const jwt = require('jsonwebtoken');
import {jwtkey} from '../config'; 

export async function authenticateMiddleware(req, res, next) {
    try {
        const bearerHeader = req.headers['authorization'];
        if (bearerHeader) {

            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            req.token = bearerToken;

            await jwt.verify(bearerToken, jwtkey, async (err, authData) => {
                if (err) {// there is an error or the userdid is not in the token :( forbbidenn
                    throw err;
                } else {
                    req.userId = authData.userId;//add userid to the request
                    req.userRole = authData.userRole;//add userid to the request
                }

            });
            next();

        } else {
            res.sendStatus(403);
        }

    } catch (err) {
        res.status(401).send({
            "message": "The incoming token has expired"
        });
    }


}