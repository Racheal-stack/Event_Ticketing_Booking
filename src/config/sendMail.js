const nodemailer = require('nodemailer');

const sendBookingConfirmationEmail = async (email, name, eventName, numberOfTickets) => {
    if (!email) {
        throw new Error('Recipient email address is required');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail', // or your preferred email service
        auth: {
            user: 'josephracheal902@gmail.com', // Replace with your email
            pass: 'dnbd tnoy ozfb rckk', // Replace with your App Password
        },
    });

    const mailOptions = {
        from: 'josephracheal902@gmail.com', // Sender address
        to: email, // Recipient address
        subject: 'Your Ticket Booking Confirmation', // Email subject
        html: `
            <p>Dear ${name},</p>
            <p>Thank you for booking tickets for <strong>${eventName}</strong>.</p>
            <p>You have successfully booked <strong>${numberOfTickets}</strong> ticket(s).</p>
            <p>We look forward to seeing you at the event!</p>
            <p>Best regards,<br>Event Management Team</p
        `,
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (err) {
        console.error('Failed to send email:', err);
        throw err;
    }
};

module.exports = sendBookingConfirmationEmail;
