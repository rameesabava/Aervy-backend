const stripe = require("stripe")(process.env.STRIPE_SK)
const providers = require("../models/providerModel")
const bookings = require("../models/bookingModel")



// booking payment
exports.bookingPaymentController = async (req, res) => {
    console.log("Inside bookingPaymentController")
        const { userId,username, userPhone, providerId, providerName  } = req.body

        // find provider
        const providerDetails = await providers.findById(providerId)
        if (!providerDetails) {
            return res.status(404).json("Provider not found")
        }
        // advance payment
        const advanceAmount = 100
        // stripe line items
        const line_items = [
            {
                price_data: {
                    currency: "inr",

                    product_data: {
                        name: providerDetails.service,

                        description:
                            `Booking advance payment for ${providerDetails.username}`
                    },

                    unit_amount: advanceAmount * 100
                },

                quantity: 1
            }
        ]

        // create stripe session
        const session = await stripe.checkout.sessions.create({

            success_url: "http://localhost:5173/payment-success",

            cancel_url: "http://localhost:5173/payment-cancel",

            line_items,

            mode: "payment",

            payment_method_types: ["card"]
        })

        // save booking
        const newBooking = new bookings({ userId,username, providerId,providerName, status: "Pending"
        })

        await newBooking.save()

        // send stripe url
        res.status(200).json({
            checkoutURL: session.url
        })
}

// get provider bookings
exports.getProviderBookingsController = async (req,res)=>{
    console.log("Inside getProviderBookingsController");
    const {id} = req.params
    const providerBookings = await bookings.find({providerId:id})
     res.status(200).json(providerBookings)
}

// to complete the booking by provider
exports.updateBookingStatusCompletedController = async(req,res)=>{
    console.log("Inside updateBookingStatusCompletedController");
    const {id} = req.body
    const updatedCompletedBooking = await bookings.findByIdAndUpdate({_id:id},{status:"Completed"},{new:true})
         res.status(200).json(updatedCompletedBooking)

}

// to reject the booking by provider
exports.updateBookingStatusRejectedController = async(req,res)=>{
    console.log("Inside updateBookingStatusRejectedController");
    const {id} = req.body
    const updatedRejectedBooking = await bookings.findByIdAndUpdate({_id:id},{status:"Rejected"},{new:true})
         res.status(200).json(updatedRejectedBooking)

}