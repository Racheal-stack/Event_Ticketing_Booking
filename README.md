# Event Ticket Booking System

## Description


This project is a Node.js-based event ticket booking system that provides a RESTful API for managing event ticket sales, including handling concurrent bookings, waiting lists, and cancellations. The application is built with a focus on senior-level Node.js development skills such as asynchronous programming, concurrency handling, Test-Driven Development (TDD), and modular design.

## Features

- Initialize events with a predefined number of tickets.
- Concurrent ticket booking with thread-safety.
- Automated waiting list management when tickets are sold out.
- Handle cancellations and reassign tickets to waiting list users.
- View event status, including available tickets and waiting list count.
- Persist order details in a relational database using Sequelize ORM.

## Basic Auth Details
   Username: admin
   Password: password123

   
## Skills Assessed

- Node.js and Express.js proficiency
- Asynchronous programming and concurrency handling
- RESTful API design principles
- Error handling and edge case management
- Test-Driven Development (TDD)
- Modular and maintainable code organization

---

## Installation and Setup

### Prerequisites

- Node.js (v16+ recommended)
- PostgreSQL or MySQL database
- `npm` or `yarn`

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/Rachcode11/Event_Ticketing_Booking.git
   cd event-ticket-booking-system

2. Install dependency
    npm install
   
4. Setup database
      open config file
      set up your database by creating event_ticketing_booking in your database
         replace the "Password: ###" to your database password

5. Run database migrations
   open config file
      set up your database by creating event_ticketing_booking in your database
         replace the "Password: ###" to your database password
   then run npx sequelize-cli db:migrate

6. Start the server
    npm run dev ( if any error like permission denied 
   `` bash
      rm -rf node_modules
      run npm install again)

7. Run test
    npm jest

   Deploy URL : https://event-ticketing-booking.onrender.com
    API Documentation
        url: [text](https://documenter.getpostman.com/view/24179938/2sAYHwJQ41)

