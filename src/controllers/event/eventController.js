const eventService = require('../../services/event/eventService');


const initializeEvent = async (req, res, next) => {
    const { eventName, description, totalTickets, location, image, date, time }  = req.body;

    try {
        const result = await eventService.initializeEvent(eventName, description, totalTickets, location, image, date, time);

        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        return res.status(201).json({
            message: 'Event created successfully',
            event: result.event,
        });
    } catch (err) {
        next(err);  
    }
};

const getEventStatusController = async (req, res) => {
    const { eventName } = req.params;

    try {
        const status = await eventService.getEventStatus(eventName);
        res.status(200).json({ success: true, status });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


module.exports = {
    initializeEvent,
    getEventStatusController,
};
