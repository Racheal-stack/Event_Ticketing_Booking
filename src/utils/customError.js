class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends AppError {
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}

class ValidationError extends AppError {
    constructor(message = 'Validation Error') {
        super(message, 422);
    }
}

class InternalServerError extends AppError {
    constructor(message = 'Internal Server Error') {
        super(message, 500);
    }
}

module.exports = {
    AppError,
    BadRequestError,
    NotFoundError,
    ValidationError,
    InternalServerError,
};
