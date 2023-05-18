const mongoose = require('mongoose')
const uuidv1 = require('uuidv1')
const crypto = require('crypto')


emailValidator = function(val){
    return /^[\w+\-.]+@[a-z\d\-.]+\.[a-z]+$/i.test(val);
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        validate: {
            validator: function(val) {
                return val.length <= 25 || val.length >= 4 || val.length === 0
            },
            message: () => `Username must be between 4 and 25 characters long`
        },
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate: [emailValidator, "Please enter a valid email"]
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    salt: String,
    gamesPlayed: [{
        wpm: Number,
        cpm: Number,
        accuracy: Number,
        timestamp: String,
    }],
    frequentlyMissed: [{
        key: String,
        instances: Number,
    }],
    missedCombinations: [{
        key1: String,
        key2: String,
        instances: Number,
        impact: {
            average: Number,
            sum: Number
        }
    }],
    profilePicture: String,
    badges: [String]
}, {
    timestamps: true
})

//vifielld
userSchema.virtual("password").set(function (password) {
    this._password = password;
    this.salt = uuidv1()
    this.hashedPassword = this.encryptPassword(password)
})

userSchema.methods = {
    encryptPassword: function(password) {
        if (!password) return ""
        try {
            return crypto.createHmac("sha256", this.salt)
                .update(password)
                .digest("hex")
        } catch (err) {
            return ""
        }
    },
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword
    }
}

module.exports = mongoose.model('User', userSchema)