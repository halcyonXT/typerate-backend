const express = require("express")
const router = express.Router()

// import controllers
const { register, login, logout, getLoggedInUser, confirmPassword } = require('../controllers/user')


// middlewares
const {
    userRegisterValidator, 
    userById, 
    updateGames, 
    updateProfilePicture, 
    resetStats,
    updateBadges,
    deleteAccount,
    changeUsername,
    changeEmail,
    resetProfilePicture
} = require("../middlewares/user")
const {verifyToken} = require("../middlewares/auth")
const { searchUsers, getTargetUser } = require("../middlewares/users")

// api routes
router.post("/register", userRegisterValidator, register)
router.post("/login", login)
router.post("/confirm", confirmPassword)
router.post("/edit/username", verifyToken, changeUsername)
router.post("/edit/email", verifyToken, changeEmail)
router.get("/logout", logout)
router.get('/user', verifyToken, userById, getLoggedInUser)
router.get('/user/get/:userId', getTargetUser)
router.post('/user/search', searchUsers)
router.patch('/user', verifyToken, updateGames)
router.delete('/user/stats', verifyToken, resetStats)
router.delete('/user', verifyToken, deleteAccount)
router.patch('/user/profilepicture', verifyToken, updateProfilePicture)
router.get('/user/profilepicture/reset', verifyToken, resetProfilePicture)
router.patch('/user/badges', verifyToken, updateBadges)

module.exports = router;