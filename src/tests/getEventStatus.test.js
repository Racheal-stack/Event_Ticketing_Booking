const {  getEventStatus } = require('../services/event/eventService'); 
const {Event, WaitingList } = require('../../models'); 
const { InternalServerError, NotFoundError } = require('../utils/customError'); 

jest.mock('../../models'); 


describe('getEventStatus', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return event status if event exists', async () => {
        Event.findOne.mockResolvedValue({
            name: 'Event Name',
            availableTickets: 50,
        });
        WaitingList.count.mockResolvedValue(10);

        const result = await getEventStatus('Event Name');

        expect(Event.findOne).toHaveBeenCalledWith({ where: { eventName: 'Event Name' } });
        expect(WaitingList.count).toHaveBeenCalledWith({ where: { eventName: 'Event Name' } });
        expect(result).toEqual({
            name: 'Event Name',
            availableTickets: 50,
            waitingListCount: 10,
        });
    });

    test('should throw NotFoundError if event does not exist', async () => {
        Event.findOne.mockResolvedValue(null);

        await expect(getEventStatus('Nonexistent Event')).rejects.toThrow(NotFoundError);
        expect(Event.findOne).toHaveBeenCalledWith({ where: { eventName: 'Nonexistent Event' } });
    });

    test('should throw InternalServerError if an error occurs', async () => {
        Event.findOne.mockRejectedValue(new Error('Database error'));

        await expect(getEventStatus('Event Name')).rejects.toThrow(InternalServerError);
        expect(Event.findOne).toHaveBeenCalledWith({ where: { eventName: 'Event Name' } });
    });
});
