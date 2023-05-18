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
            accuracy: req.body.accuracy,
            timestamp: req.body.timestamp
        })
        try {
            for (let item of req.body.missed) {
                if (item.key === " " || item.key === "") {continue}
                let index = doc.frequentlyMissed.findIndex(el => el.key === item.key)
                if (index === -1) {
                    doc.frequentlyMissed.push({key: item.key, instances: item.instances})
                } else {
                    doc.frequentlyMissed[index].instances += item.instances
                }
            }
            for (let item of req.body.combinations) {
                if (item.key1 === '' || item.key2 === '') {continue}
                let index = doc.missedCombinations.findIndex(el => el.key1 === item.key1 && el.key2 === item.key2)
                if (index === -1) {
                    doc.missedCombinations.push({key1: item.key1, key2: item.key2, instances: item.instances, impact: {average: item.impact.average, sum: item.impact.sum}})
                } else {
                    let total = doc.missedCombinations[index].impact.sum + item.impact.sum
                    let prev = doc.missedCombinations[index].impact.average
                    doc.missedCombinations[index].instances += item.instances
                    doc.missedCombinations[index].impact.average = (prev + item.impact.average) / total
                    doc.missedCombinations[index].impact.sum = total
                }
            }
        } catch (ex) {console.log(err)}

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

exports.resetProfilePicture = async (req, res) => {
    try {
        let doc = await User.findById(req._id)
        doc.profilePicture = "default"
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
        doc.badges = []
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

exports.changeUsername = async (req, res) => {
    const usernameExists = await User.findOne({
        username: req.body.username
    })

    if (usernameExists) {
        return res.status(403).json({ 
            error: "Username is taken",
        })
    }

    try {
        let doc = await User.findById({_id: req._id})
        doc.username = req.body.username
        await doc.save()
    } catch (err) {
        return res.status(500).json({error: "Server error"})
    }
    return res.status(200).json({message: "Change successful"})
}

exports.changeEmail = async (req, res) => {
    const emailExists = await User.findOne({
        email: req.body.email
    })

    if (emailExists) {
        return res.status(403).json({
            error: "Email is taken"
        })
    }

    try {
        let doc = await User.findById({_id: req._id})
        doc.email = req.body.email
        await doc.save()
    } catch (err) {
        return res.status(500).json({error: "Server error"})
    }
    return res.status(200).json({message: "Change successful"})
}
