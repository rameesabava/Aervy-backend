const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },
    username:{
        type:String,
        required:true
    },

    providerId: {
        type: String,
        required: true
    },
    providerName:{
        type:String,
        required:true
    },

    status: {
        type: String,
        default: "Pending"
    }

}, { timestamps: true })

const bookings = mongoose.model("bookings", bookingSchema)

module.exports = bookings