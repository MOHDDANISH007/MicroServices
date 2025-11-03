const express = require('express')
const dotenv = require('dotenv').config()

const captainRoute = require('./routes/captain.routes.js')
const cookieParser = require('cookie-parser')
const connectDB = require('./DB/db.js')

connectDB()

const app = express()


app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/', captainRoute)

module.exports = app
