const jwt = require('jsonwebtoken')

const providerMiddleware = (req, res, next) => {
    console.log("Inside Provider Authentication Middleware");
    const token = req.headers['authorization'].split(" ")[1]
    console.log(token);
    if (token) {
        try {
            const jwtresponse = jwt.verify(token, process.env.JWTSECRET)
            console.log(jwtresponse);
            req.payload = jwtresponse.providerMail
            const role = jwtresponse.role
            if (role == "provider") {
                next()
            } else {
                res.status(401).json("Authorization failed...Unauthorised user!!!")

            }


        } catch (err) {
            res.status(401).json("Invalid Token... Please Login!!!")
        }
    } else {
        res.status(401).json("Authorization failed...Token Missing!!!!")
    }


}

module.exports = providerMiddleware