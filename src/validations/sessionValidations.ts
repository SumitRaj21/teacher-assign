
import Joi from "joi";

// Create Session
export const createSessionSchema = Joi.object({
    teacherId: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            "string.hex": "Teacher ID must be a valid MongoDB ObjectId",
            "string.length": "Teacher ID must be 24 characters long",
            "any.required": "Teacher ID is required"
        }),

    startTime: Joi.date()
        .required()
        .messages({
            "date.base": "Start time must be a valid date",
            "any.required": "Start time is required"
        }),

    endTime: Joi.date()
        .greater(Joi.ref("startTime"))
        .required()
        .messages({
            "date.base": "End time must be a valid date",
            "date.greater": "End time must be greater than start time",
            "any.required": "End time is required"
        })
});

// Get Available Sessions
export const getAvailableSessionsSchema = Joi.object({
    dateTimestamp: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "Date timestamp must be a number",
            "number.integer": "Date timestamp must be an integer",
            "number.positive": "Date timestamp must be positive",
            "any.required": "Date timestamp is required"
        })
});

// Book Session
export const bookSessionSchema = Joi.object({
    userId: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            "string.hex": "User ID must be a valid MongoDB ObjectId",
            "string.length": "User ID must be 24 characters long",
            "any.required": "User ID is required"
        })
});

// Complete Session
export const completeSessionSchema = Joi.object({
    id: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            "string.hex": "Session ID must be a valid MongoDB ObjectId",
            "string.length": "Session ID must be 24 characters long",
            "any.required": "Session ID is required"
        })
});
