const logger = require('../utils/logger');
const { BadRequestError, NotFoundError } = require('../utils/customError');
const { User, Event } = require('../../models');


const validateBookingInput = (eventName, email, name, numberOfTickets) => {
    if (!eventName || !name || !email || !numberOfTickets || numberOfTickets <= 0) {
        logger.warn(`Invalid input for booking: eventName=${eventName}, name=${name}, email=${email}, numberOfTickets=${numberOfTickets}`);
        throw new BadRequestError('Event Name, Name, Email, and a positive Number of Tickets are required');
    }
};


const findOrCreateUser = async (email, name, transaction) => {
    logger.info(`Checking or creating user: ${email}`);
    const [user] = await User.findOrCreate({
        where: { email },
        defaults: { name, email },
        transaction,
    });
    return user;
};

const fetchEvent = async (eventName, transaction) => {
    logger.info(`Fetching event: ${eventName}`);
    const event = await Event.findOne({
        where: { eventName },
        lock: transaction.LOCK.UPDATE,
        transaction,
    });

    if (!event) {
        logger.error(`Event not found: ${eventName}`);
        throw new NotFoundError('Event not found');
    }
    return event;
};


const handleWaitingList = async (eventName, userId, transaction) => {
    logger.info(`Adding user ${userId} to waiting list for event: ${eventName}`);
    await WaitingList.create({ eventName, userId }, { transaction });
    await transaction.commit();
    return {
        success: true,
        message: 'Not enough tickets available. Added to the waiting list',
    };
};

const bookTickets = async (event, userId, numberOfTickets, transaction) => {
    logger.info(`Booking tickets for event: ${event.eventName}, user: ${userId}`);
    await Booking.create(
        { eventName: event.eventName, userId, numberOfTickets, status: 'booked' },
        { transaction }
    );

    logger.info(`Updating available tickets for event: ${event.eventName}`);
    await event.update(
        { availableTickets: event.availableTickets - numberOfTickets },
        { transaction }
    );
};

const sendConfirmationEmail = async (email, name, eventName, numberOfTickets) => {
    logger.info(`Sending booking confirmation email to: ${email}`);
    await sendBookingConfirmationEmail(email, name, eventName, numberOfTickets);
};




module.exports = {
    validateBookingInput,
    findOrCreateUser,
    fetchEvent,
    handleWaitingList,
    bookTickets,
    sendConfirmationEmail,
};





