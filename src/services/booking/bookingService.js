const {Event} = require('../../../models');
const { Booking } = require('../../../models');
const {WaitingList} = require('../../../models');
const { NotFoundError, InternalServerError, AppError } = require('../../utils/customError');
const sequelize = require('../../config/db').sequelize;
const {User} = require('../../../models');
const logger = require('../../utils/logger');
const { sendConfirmationEmail, bookTickets, findOrCreateUser, fetchEvent, validateBookingInput } = require('../../common/commons');

const bookTicket = async (eventName, email, name, numberOfTickets) => {
    logger.info(`Starting ticket booking process for event: ${eventName}, user: ${email}, name: ${name}, tickets: ${numberOfTickets}`);

    validateBookingInput(eventName, email, name, numberOfTickets);
    const transaction = await sequelize.transaction();

    try {
        const user = await findOrCreateUser(email, name, transaction);
        const event = await fetchEvent(eventName, transaction);

        if (event.availableTickets < numberOfTickets) {
            return await handleWaitingList(eventName, user.id, transaction);
        }

        await bookTickets(event, user.id, numberOfTickets, transaction);

        await transaction.commit();

        await sendConfirmationEmail(email, name, eventName, numberOfTickets);

        logger.info(`Tickets booked successfully for event: ${eventName}, user: ${email}`);
        return {
            success: true,
            message: 'Tickets booked successfully',
            availableTickets: event.availableTickets,
        };

    } catch (err) {
        logger.error(`Error during ticket booking for event: ${eventName}, user: ${email} - ${err.message}`);
        if (transaction.finished !== 'commit') {
            logger.info('Rolling back transaction due to error');
            await transaction.rollback();
        }
        throw err;
    }
};





const cancelTicket = async (email, eventName) => {
    const transaction = await sequelize.transaction();

    try {

        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundError('User not found');
        }

        const booking = await Booking.findOne({
            where: { eventName: eventName, userId: user.id },
            transaction,
        });
        if (!booking) {
            throw new NotFoundError('Booking not found');
        }

        const event = await Event.findOne({
            where: { eventName: eventName },
            lock: transaction.LOCK.UPDATE,
            transaction,
        });
        if (!event) {
            throw new NotFoundError('Event not found');
        }

        await event.update(
            { availableTickets: event.availableTickets + booking.numberOfTickets },
            { transaction }
        );

        await Booking.destroy({
            where: { eventName: eventName, userId: user.id },
            transaction,
        });

        const waitingListEntry = await WaitingList.findOne({
            where: { eventName: eventName },
            order: [['createdAt', 'ASC']],
            transaction,
        });

        if (waitingListEntry) {
            await WaitingList.destroy({
                where: { userId: waitingListEntry.userId, eventName: eventName },
                transaction,
            });
            await Booking.create(
                {
                    eventName: eventName,
                    userId: waitingListEntry.userId,
                    status: 'booked',
                    numberOfTickets: 1, 
                },
                { transaction }
            );

            await event.update(
                { availableTickets: event.availableTickets - 1 },
                { transaction }
            );
        }

        await transaction.commit();

        return { success: true, message: 'Ticket cancelled successfully' };
    } catch (err) {
        await transaction.rollback();
        if (err instanceof NotFoundError) {
            throw err;
        }
        throw new InternalServerError(`Failed to cancel ticket: ${err.message}`);
    }
};


const fetchAvailableTickets = async (eventName) => {
    try {
        const event = await Event.findOne({ where: { eventName } });
        if (!event) {
            throw new NotFoundError('Event not found');
        }
        return event.availableTickets;
    } catch (err) {
        throw new NotFoundError(err.message);
    }
};


const fetchWaitingList = async (eventName) => {
    try {
        const waitingList = await WaitingList.findAll({ where: { eventName } });
        return waitingList;
    } catch (err) {
        throw new InternalServerError(`Failed to fetch waiting list: ${err.message}`);
    }
};


module.exports = {
    bookTicket,
    cancelTicket,
    fetchAvailableTickets,
    fetchWaitingList,
};

