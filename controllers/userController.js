const users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// user register
exports.registerController = async (req, res) => {
    console.log("Inside registerController");
    console.log(req.body);
    const { username, email, password, phone } = req.body
    // check email is in db
    const existingUser = await users.findOne({ email })
    // if present, send response as please login
    if (existingUser) {
        res.status(409).json("User Already Exists... Please Login!!!")
    } else {
        // if not present, add all details to db
        let encryptPassword = await bcrypt.hash(password, 10)
        const newUser = await users.create({
            username, email, password: encryptPassword, phone
        })
        res.status(201).json(newUser)
    }
}

// user login
exports.loginController = async (req, res) => {
    console.log("Inside loginController");
    const { email, password } = req.body
    // check email is in db
    const existingUser = await users.findOne({ email })
    if (existingUser) {
        // if present, check password
        const isPasswordMatch = await bcrypt.compare(password, existingUser.password)
        if (isPasswordMatch) {
            const token = jwt.sign({ userMail: email, role: existingUser.role }, process.env.JWTSECRET)
            res.status(200).json({
                user: existingUser, token
            })
        } else {
            res.status(409).json("Invalid Email or Password")
        }
    } else {
        // if not present
        res.status(409).json("Invalid Email...Please register!!!")
    }

}

// google login
exports.googleLoginController = async (req, res) => {
    console.log("Inside googleLoginController");
    const { email, password, username } = req.body
    // check email is in db
    const existingUser = await users.findOne({ email })
    if (existingUser) {
        // if present, 

        const token = jwt.sign({ userMail: email, role: existingUser.role }, process.env.JWTSECRET)
        res.status(200).json({
            user: existingUser, token
        })
    } else {
        // if not present, register user
        let encryptPassword = await bcrypt.hash(password, 10)
        const newUser = await users.create({
            username, email, password: encryptPassword
        })
        const token = jwt.sign({ userMail: newUser.email, role: newUser.role }, process.env.JWTSECRET)

        res.status(200).json({ user: newUser, token })
    }

}