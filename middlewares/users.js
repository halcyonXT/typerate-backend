const User = require('../models/user')

exports.searchUsers = async (req, res) => {
    let query = new RegExp(req.body.query, 'i')
    try {
        let docs = await User.find({ username: query }, 'username badges profilePicture').exec()
        res.status(200).json(docs)
    } catch (ex) {
        console.log(ex)
        res.status(500).json({error: "Search failed"})
    }
}
//d
exports.getTargetUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        let doc = await User.findById(userId, 'username badges frequentlyMissed gamesPlayed missedCombinations profilePicture').exec();
        if (!doc) {
            res.status(404).json({error: "Not found"})
        } else {
            res.status(200).json(doc)
        }
    } catch (ex) {
        res.status(500).json({error: "Server error"})
    }
}