const User = require('../models/user')
const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.register = async (req, res) => {
    const usernameExists = await User.findOne({
        username: req.body.username
    })
    const emailExists = await User.findOne({
        email: req.body.email
    })

    if (usernameExists) {
        return res.status(403).json({ 
            error: "Username is taken",
            causedBy: ["username"]
        })
    }

    if (emailExists) {
        return res.status(403).json({
            error: "Email is taken",
            causedBy: ["email"]
        })
    }

    const pusher = req.body
    pusher.gamesPlayed = []

    const user = new User(pusher)
    await user.save()

    res.status(201).json({
        message: "Sign up successful! Login to proceed"
    })
}

exports.login = async (req, res) => {
    // find the user based on the email
    const { email, password } = req.body;

    await User.findOne({email}).exec((err, user) => {
        if (err || !user) {
            return res.status(401).json({
                error: "Invalid Credentials",
                causedBy: ["email", "password"]
            })
        }

        //if user is found, we use the authenticate methods
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Invalid email or password",
                causedBy: ["email", "password"]
            })
        }//if pass is incorrect

        //generate a token with user id and jwt secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "24h"
        })

        //persist the token as jwt in cookie with empty expiry date
        res.cookie("jwt", token, {expire: new Date() + 9999, httpOnly: true});


        //return the response with user
        const { username } = user;
        return res.json({
            message: 'Login successful',
            username,
        })
    })
}

exports.logout = (req, res) => {
    res.clearCookie("jwt")

    return res.json({
        message: "Logout successful"
    })
}

exports.getLoggedInUser = (req, res) => {
    const { username, gamesPlayed, profilePicture, badges } = req.user;
    return res.status(200).json({
        message: "User is still logged in",
        username,
        gamesPlayed,
        profilePicture: req.user.profilePicture,
        badges
    })
}
