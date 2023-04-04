const express = require("express")
const router = express.Router()

// import controllers
const { register, login, logout, getLoggedInUser } = require('../controllers/user')


// middlewares
const {
    userRegisterValidator, 
    userById, 
    updateGames, 
    updateProfilePicture, 
    resetStats,
    updateBadges,
    deleteAccount
} = require("../middlewares/user")
const {verifyToken} = require("../middlewares/auth")

// api routes
router.post("/register", userRegisterValidator, register)
router.post("/login", login)
router.get("/logout", logout)
router.get('/user', verifyToken, userById, getLoggedInUser)
router.patch('/user', verifyToken, updateGames)
router.delete('/user/stats', verifyToken, resetStats)
router.delete('/user', verifyToken, deleteAccount)
router.patch('/user/profilepicture', verifyToken, updateProfilePicture)
router.patch('/user/badges', verifyToken, updateBadges)

module.exports = router;