const express = require('express');
const router = express.Router();
const basicAuth = require('../middleware/basicAuth');
const eventController = require('../controllers/event/eventController');
const bookingController = require('../controllers/booking/bookingController');

// Apply Basic Authentication to sensitive routes

router.post('/initialize',  basicAuth, eventController.initializeEvent);
router.get('/tickets/:eventId/available-tickets',  basicAuth, bookingController.getAvailableTickets);
router.get('/tickets/:eventId/waiting-list',  basicAuth, bookingController.getWaitingList);
router.get('/status/:eventName',  basicAuth, eventController.getEventStatusController);

// Public routes
router.post('/book', bookingController.bookTicket);
router.post('/cancel', bookingController.cancelBooking);



module.exports = router;
