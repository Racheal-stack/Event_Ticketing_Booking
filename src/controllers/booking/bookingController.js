const { client_encoding } = require('pg/lib/defaults');
const BookingService = require('../../services/booking/bookingService');

exports.bookTicket = async (req, res) =>{
    const {eventName, email, name, numberOfTickets} = req.body;

    try {
        const result = await BookingService.bookTicket(eventName, email, name, numberOfTickets);

        return res.status(200).json(result);
    } catch(err){
        console.error(err);
        return res.status(500).json({message: 'Something went wrong', error: err.message});
    }
}

exports.cancelBooking = async (req, res) =>{

    const {email,eventName} = req.body;

    try {
        const result = await BookingService.cancelTicket(email, eventName);

        return res.status(200).json(result);
    } catch(err){
        console.error(err);
        return res.status(500).json({message: 'Something went wrong', error: err.message});
    }
}

exports.getAvailableTickets = async (req, res) => {

    const {eventId} = req.params;

    try {
        const event = await BookingService.fetchAvailableTickets(eventId);

        return res.status(200).json(event);
    }

    catch(err){
        console.error(err);
        return res.status(500).json({message: 'Something went wrong', error: err.message});
    }
}

exports.getWaitingList = async (req, res) => {
    
        const {eventId} = req.params;
    
        try {
            const waitingList = await BookingService.fetchWaitingList(eventId);
            return res.status(200).json(waitingList);
        }
    
        catch(err){
            console.error(err);
            return res.status(500).json({message: 'Something went wrong', error: err.message});
        }
    }