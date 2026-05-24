require('dotenv').config()
const express = require('express')
const cors = require('cors')
const routes = require('./routes/allRoutes')
require('./config/db')

// server creation
const server = express()
// enable cors in server
server.use(cors())
// parse json to js content
server.use(express.json())
// use routes in server
server.use(routes)
// handling static file/folder
server.use('/uploads',express.static('./uploads'))

const PORT = process.env.PORT

server.listen(PORT, () => {
    console.log("Server started");

})

server.use((err,req,res,next)=>{
    res.status(500).json(err.message)
})


server.get('/', (req, res) => {
    res.status(200).send(`<h1>Server started</h1>`)
})

