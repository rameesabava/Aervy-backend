const mongoose = require('mongoose')

const providerSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    phone:{
        type: String,
        required:true
    },
    location:{
        type: String,
        required:true
    },
    service:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    ratePerHour: {
    type: Number,
    required: true
},
    
    identityCard:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"provider"
    },
    status:{
        type:String,
        default:"Pending"
    }
    
})

const providers = mongoose.model("providers",providerSchema)

module.exports = providers