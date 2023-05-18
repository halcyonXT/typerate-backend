// import modules
const express = require('express')
const {json, urlencoded} = express
const mongoose = require('mongoose')
const morgan =require('morgan')
const cors = require('cors')
require("dotenv").config()
const cookieParser = require("cookie-parser")
const expressValidator = require("express-validator")
const path = require('path')
// app
const app = express()

// db
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('DB connected'))
    .catch((err) => console.log(err))

// middlewares
app.use(morgan("dev"))
app.use(cors({origin: true, credentials: true}))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())
app.use(expressValidator())

// routess
const userRoutes = require('./routes/user')
app.use("/", userRoutes)


//deployment code
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('typing-speed-test/dist'))

    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'typing-speed-test', 'dist', 'index.html'))
    })
}

// port
const port = process.env.PORT || 5173

//listener
const server = app.listen(port, () => console.log('Server running' + port))


