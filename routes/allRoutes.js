const express = require('express')
const userController = require('../controllers/userController')
const providerController = require('../controllers/providerController')
const multerMiddleware = require('../middlewares/multerMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const userMiddleware = require('../middlewares/userMiddleware')
const providerMiddleware = require('../middlewares/providerMiddleware')
const bookingController = require('../controllers/bookingController')

const router = new express.Router()

// user register
router.post('/register',userController.registerController)

// user login
router.post('/login',userController.loginController)

// user - google login
router.post('/google-login',userController.googleLoginController)

// provider register
router.post('/provider-register',multerMiddleware.single('identityCard'), providerController.providerRegisterController)

// provider login
router.post('/provider-login',providerController.providerLoginController)

// get service description AI
router.post('/service-ai',providerController.generateDescriptionbyAIController)

// get pending providers
router.get('/admin/pending-providers',adminMiddleware,providerController.getPendingProvidersController)

// approve provider status
router.put('/admin/provider-approve/:id',adminMiddleware,providerController.approveProviderStatusController)

// reject providers
router.delete('/admin/provider-reject/:id',adminMiddleware,providerController.rejectProviderStatusController)

// get approved providers
router.get('/approved-providers',userMiddleware,providerController.getApprovedProvidersController)

// get single provider to view for users
router.get('/provider/view/:id',userMiddleware,providerController.getSingleProviderViewController)

// new booking
router.post('/booking-payment',userMiddleware,bookingController.bookingPaymentController)

// // get provider to view by provider
router.get('/provider/:id',providerMiddleware,providerController.getSingleProviderViewController)

// provider bookings
router.get('/provider/bookings/:id',providerMiddleware,bookingController.getProviderBookingsController)

// provider status complete bookings
router.put('/provider/complete-bookings',providerMiddleware,bookingController.updateBookingStatusCompletedController)

// provider status reject bookings
router.put('/provider/reject-bookings',providerMiddleware,bookingController.updateBookingStatusRejectedController)

// update provider profile
router.put('/profile/:id',providerMiddleware,providerController.editProviderController)

module.exports = router
