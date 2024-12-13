const { initializeEvent, getEventStatus } = require('../services/event/eventService'); 
const { Event } = require('../../models'); 
const { InternalServerError } = require('../utils/customError'); 

jest.mock('../../models');

describe('initializeEvent', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return an error if any field is missing', async () => {
        const result = await initializeEvent('Event Name', 'Description', null, 'Location', 'image.png', '2024-12-25', '10:00 AM');
        expect(result).toEqual({
            error: 'All fields (eventName, description, totalTickets, location, image, date, time) are required'
        });
    });

    test('should return an error if an event with the same name already exists', async () => {
        Event.findOne.mockResolvedValue({ id: 1, eventName: 'Event Name' });

        const result = await initializeEvent('Event Name', 'Description', 100, 'Location', 'image.png', '2024-12-25', '10:00 AM');
        expect(Event.findOne).toHaveBeenCalledWith({ where: { eventName: 'Event Name' } });
        expect(result).toEqual({ error: 'Event with this name already exists' });
    });

    test('should successfully create an event if all inputs are valid and event does not already exist', async () => {
        Event.findOne.mockResolvedValue(null);
        Event.create.mockResolvedValue({
            id: 1,
            eventName: 'Event Name',
            description: 'Description',
            totalTickets: 100,
            availableTickets: 100,
            location: 'Location',
            image: 'image.png',
            date: '2024-12-25',
            time: '10:00 AM'
        });

        const result = await initializeEvent('Event Name', 'Description', 100, 'Location', 'image.png', '2024-12-25', '10:00 AM');

        expect(Event.findOne).toHaveBeenCalledWith({ where: { eventName: 'Event Name' } });
        expect(Event.create).toHaveBeenCalledWith({
            eventName: 'Event Name',
            description: 'Description',
            totalTickets: 100,
            availableTickets: 100,
            location: 'Location',
            image: 'image.png',
            date: '2024-12-25',
            time: '10:00 AM'
        });
        expect(result).toEqual({
            success: true,
            event: {
                id: 1,
                eventName: 'Event Name',
                description: 'Description',
                totalTickets: 100,
                availableTickets: 100,
                location: 'Location',
                image: 'image.png',
                date: '2024-12-25',
                time: '10:00 AM'
            }
        });
    });

    test('should throw an InternalServerError if an error occurs', async () => {
        Event.findOne.mockRejectedValue(new Error('Database error'));

        await expect(
            initializeEvent('Event Name', 'Description', 100, 'Location', 'image.png', '2024-12-25', '10:00 AM')
        ).rejects.toThrow(InternalServerError);
        expect(Event.findOne).toHaveBeenCalledWith({ where: { eventName: 'Event Name' } });
    });
});


