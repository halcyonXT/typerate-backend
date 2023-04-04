const User = require('../models/user')

exports.userRegisterValidator = (req, res, next) => {
    // username is not null
    req.check("username", "Username is required").notEmpty()

    //email is not null, valid and normalized
    req.check("email", "Email is required").notEmpty()
    req.check("email", "Invalid email").isEmail()

    req.check("password", "Password is required").notEmpty()
    req.check("password")
        .isLength({ min: 6 })
        .withMessage("Password must contain more than 6 characters")
    req.check("password", "Password must have at least 1 uppercase letter, 1 lowercase letter and 1 number")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
        "i"
    )

    const errors = req.validationErrors()

    if (errors) {
        const firstError = errors.map((err) => err.msg)[0]

        return res.status(400).json({
            error: firstError
        })
    }

    next()
} 

exports.userById = async (req, res, next) => {
    User.findById(req._id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            })
        }

        //add user object in req with all user infos
        req.user = user
        next()
    })
}

exports.updateGames = async (req, res) => {
    try {
        let doc = await User.findById(req._id)
        doc.gamesPlayed.push({
            wpm: req.body.wpm,
            cpm: req.body.cpm,
            accuracy: req.body.accuracy
        })
        await doc.save()
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "Update failed"})
    }
    return res.status(200).json({message: "Update successful"})
}

exports.updateProfilePicture = async (req, res) => {
    try {
        let doc = await User.findById(req._id)
        doc.profilePicture = req.body.profilePicture
        await doc.save()
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "Update failed"})
    }
    return res.status(200).json({message: "Update successful"})
}

exports.resetStats = async (req, res) => {
    try {
        let doc = await User.findById(req._id)
        doc.gamesPlayed = []
        await doc.save()
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "Reset failed"})
    }
    return res.status(200).json({message: "Reset successful"})
}

exports.updateBadges = async (req, res) => {
    try {
        let doc = await User.findById(req._id)
        doc.badges = [...doc.badges, ...req.body.badges]
        await doc.save()
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "Update failed"})
    }
    return res.status(200).json({message: "Update successful"})
}

exports.deleteAccount = async (req, res) => {
    try {
        let doc = await User.findOneAndDelete({_id: req._id})
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "Deletion failed"})
    }
    return res.status(200).json({message: "Deletion successful"})
}