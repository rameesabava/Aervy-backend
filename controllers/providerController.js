const providers = require('../models/providerModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { GoogleGenerativeAI } = require('@google/generative-ai')

// provider register
exports.providerRegisterController = async (req, res) => {
    console.log("Inside providerRegisterController");
    console.log(req.body);
    const { username, email, password, phone, location, service, description, ratePerHour } = req.body
    const identityCard = req.file.filename
    // check email is in db
    const existingUser = await providers.findOne({ email })
    // if present, send response as please login
    if (existingUser) {
        res.status(409).json("Provider Already Exists... Please Login!!!")
    } else {
        // if not present, add all details to db
        let encryptPassword = await bcrypt.hash(password, 10)
        const newProvider = await providers.create({
            username, email, password:encryptPassword, phone, location, service, description, ratePerHour, identityCard 
        })
        res.status(201).json(newProvider)
    }
}

// provider login
exports.providerLoginController = async (req, res) => {
    console.log("Inside providerLoginController");
    const { email, password } = req.body
    // check email is in db
    const existingUser = await providers.findOne({ email })
    if (existingUser) {
        // if present, check password
        const isPasswordMatch = await bcrypt.compare(password, existingUser.password)
        if (isPasswordMatch) {
            const token = jwt.sign({ providerMail: email, role: existingUser.role }, process.env.JWTSECRET)
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

// to get all providers with status pending
exports.getPendingProvidersController = async (req,res)=>{
        console.log("Inside getPendingProvidersController");
        const pendingProviders = await providers.find({status:"Pending"})
        res.status(200).json(pendingProviders)
}

// approve provider status: at admin part
exports.approveProviderStatusController = async (req, res) => {
    console.log("Inside approveProviderStatusController");
    const { id } = req.params
    const updatedProvider = await providers.findByIdAndUpdate({ _id: id },{status:"Approved"},{new:true})
    res.status(200).json(updatedProvider)
}

// reject or delete provider: at admin part
exports.rejectProviderStatusController = async (req, res) => {
    console.log("Inside rejectProviderStatusController");
    const { id } = req.params
    const updatedProvider = await providers.findByIdAndDelete({ _id: id }) 
    res.status(200).json(updatedProvider)
}

// to get all providers with status approved
exports.getApprovedProvidersController = async (req,res)=>{
        console.log("Inside getApprovedProvidersController");
        const approvedProviders = await providers.find({status:"Approved"})
        res.status(200).json(approvedProviders)
}

// get single provider to view
exports.getSingleProviderViewController = async (req, res) => {
    console.log("Inside getSingleProviderViewController");
    const { id } = req.params
    const provider = await providers.findById({ _id: id })
    res.status(200).json(provider)
}

// edit provider profile
exports.editProviderController = async (req,res)=>{
  const {id} = req.params

  const { username, email, password, phone, location, service, description, ratePerHour } = req.body

  let updateData = { username, email, phone, location, service, description, ratePerHour }

  if(password){
    updateData.password = await bcrypt.hash(password,10)
  }

  const updatedUser = await providers.findByIdAndUpdate( id, updateData, { new:true })

  res.status(200).json(updatedUser)
}

// get service description using gemini api
exports.generateDescriptionbyAIController = async (req,res)=>{
    console.log("Inside generateDescriptionbyAIController");
    
    const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API)
    const {service} = req.body

   console.log(service);
   
    const model = genAI.getGenerativeModel({
        model:"gemini-2.5-flash"
    })
    const result = await model.generateContent(`Give me a short description of services offered for ${service}`)
    const reply = result.response
    console.log(reply);
    
    res.status(200).json({
        success:true,
        user:service,
        content:reply.candidates[0].content.parts[0].text
    })
    
}