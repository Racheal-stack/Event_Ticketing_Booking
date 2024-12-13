const { Event } = require('../../../models');
const {WaitingList} = require('../../../models');
const { InternalServerError, NotFoundError } = require('../../utils/customError');

const initializeEvent = async (eventName, description, totalTickets, location, image, date, time) => {
    try {
        if (!eventName || !description || !totalTickets || !location || !image || !date || !time) {
            return { error: 'All fields (eventName, description, totalTickets, location, image, date, time) are required' };
        }
        const existingEvent = await Event.findOne({ where: { eventName } });
        if (existingEvent) {
            return { error: 'Event with this name already exists' };
        }

        const event = await Event.create({
            eventName,
            description,
            totalTickets,
            availableTickets: totalTickets,
            location,
            image,
            date,
            time
        });

        return { success: true, event };
    } catch (err) {
        console.error('Error initializing event:', err);
        throw new InternalServerError('Something went wrong while creating the event: ' + err.message);
    }
};



const getEventStatus = async (eventName) => {
    try {
        const event = await Event.findOne({ where: { eventName } });
        if (!event) {
            throw new NotFoundError('Event not found'); 
        }

        const waitingListCount = await WaitingList.count({ where: { eventName } });

        return {
            name: event.name,
            availableTickets: event.availableTickets,
            waitingListCount,
        };
    } catch (err) {
        if (err instanceof NotFoundError) {
            throw err; 
        }
        throw new InternalServerError(`Failed to retrieve event status: ${err.message}`);
    }
};



module.exports = {
    initializeEvent,
    getEventStatus,
};
