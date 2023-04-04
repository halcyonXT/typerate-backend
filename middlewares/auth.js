const jwt = require('jsonwebtoken')

exports.verifyToken = (req, res, next) => {
    let accessToken = req.cookies.jwt

    //if there is not token in the cookies, request is unauthorized
    if (!accessToken) {
        return res.status(403).json({
            error: "Unauthorized",
        })
    }

    let payload;
    try {
        //verify the token using jwt.verifty
        //throws an error if token has expired or has an invalid signature
        payload = jwt.verify(accessToken, process.env.JWT_SECRET)
        req._id = payload._id

        next()
    } catch(err) {
        //return the req unauthorized error
        return res.status(403).json({
            error: "Unauthorized",
        })
    }
}