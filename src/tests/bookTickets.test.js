const { bookTicket, cancelTicket, fetchAvailableTickets, fetchWaitingList } = require('../services/booking/bookingService');
const { Event, Booking, WaitingList, User } = require('../../models');
const { BadRequestError, NotFoundError, InternalServerError } = require('../utils/customError');
const sendBookingConfirmationEmail = require('../config/sendMail');

jest.mock('../../models', () => ({
    Event: { findOne: jest.fn(), update: jest.fn() },
    Booking: { findOne: jest.fn(), create: jest.fn(), destroy: jest.fn() },
    WaitingList: { findOne: jest.fn(), findAll: jest.fn(), destroy: jest.fn(), create: jest.fn() },
    User: { findOne: jest.fn(), findOrCreate: jest.fn() },
}));

jest.mock('../config/sendMail', () => jest.fn());

describe('Ticket Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('bookTicket', () => {
        it('should throw BadRequestError if required parameters are missing', async () => {
            await expect(bookTicket(null, 'email@test.com', 'User', 1)).rejects.toThrow(BadRequestError);
        });

        it('should add user to the waiting list if tickets are unavailable', async () => {
            User.findOrCreate.mockResolvedValue([{ id: 1 }]);
            Event.findOne.mockResolvedValue({ availableTickets: 0 });
            WaitingList.create.mockResolvedValue({});

            const response = await bookTicket('Event1', 'email@test.com', 'User', 1);

            expect(response).toEqual({
                success: true,
                message: 'Not enough tickets available. Added to the waiting list',
            });
        });

        it('should book tickets if available and send confirmation email', async () => {
            User.findOrCreate.mockResolvedValue([{ id: 1 }]);
            Event.findOne.mockResolvedValue({ availableTickets: 10, update: jest.fn() });
            Booking.create.mockResolvedValue({});

            const response = await bookTicket('Event1', 'email@test.com', 'User', 2);

            expect(sendBookingConfirmationEmail).toHaveBeenCalledWith('email@test.com', 'User', 'Event1', 2);
            expect(response.success).toBe(true);
            expect(response.message).toBe('Tickets booked successfully');
        });
    });

    describe('cancelTicket', () => {
        it('should throw NotFoundError if user does not exist', async () => {
            User.findOne.mockResolvedValue(null);

            await expect(cancelTicket('email@test.com', 'Event1')).rejects.toThrow(NotFoundError);
        });

        it('should throw NotFoundError if booking does not exist', async () => {
            User.findOne.mockResolvedValue({ id: 1 });
            Booking.findOne.mockResolvedValue(null);

            await expect(cancelTicket('email@test.com', 'Event1')).rejects.toThrow(NotFoundError);
        });

        it('should cancel the ticket and handle waiting list', async () => {
            User.findOne.mockResolvedValue({ id: 1 });
            Booking.findOne.mockResolvedValue({ numberOfTickets: 1 });
            Event.findOne.mockResolvedValue({ availableTickets: 10, update: jest.fn() });
            WaitingList.findOne.mockResolvedValue({ userId: 2 });
            WaitingList.destroy.mockResolvedValue({});
            Booking.create.mockResolvedValue({});

            const response = await cancelTicket('email@test.com', 'Event1');

            expect(response).toEqual({ success: true, message: 'Ticket cancelled successfully' });
        });
    });

    describe('fetchAvailableTickets', () => {
        it('should return the number of available tickets for an event', async () => {
            Event.findOne.mockResolvedValue({ availableTickets: 10 });

            const availableTickets = await fetchAvailableTickets('Event1');

            expect(availableTickets).toBe(10);
        });

        it('should throw NotFoundError if the event does not exist', async () => {
            Event.findOne.mockResolvedValue(null);

            await expect(fetchAvailableTickets('Event1')).rejects.toThrow(NotFoundError);
        });
    });

    describe('fetchWaitingList', () => {
        it('should return the waiting list for an event', async () => {
            WaitingList.findAll.mockResolvedValue([{ userId: 1 }, { userId: 2 }]);

            const waitingList = await fetchWaitingList('Event1');

            expect(waitingList).toEqual([{ userId: 1 }, { userId: 2 }]);
        });

        it('should throw InternalServerError if fetching the waiting list fails', async () => {
            WaitingList.findAll.mockRejectedValue(new Error('Database error'));

            await expect(fetchWaitingList('Event1')).rejects.toThrow(InternalServerError);
        });
    });
});