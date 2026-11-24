
import Joi from "joi";

// Create User
export const createUserSchema = Joi.object({
    fullName: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.base": "Full name must be a string",
            "string.empty": "Full name cannot be empty",
            "string.min": "Full name must be at least 3 characters long",
            "string.max": "Full name must be at most 50 characters long",
            "any.required": "Full name is required"
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.base": "Email must be a string",
            "string.email": "Email must be a valid email address",
            "any.required": "Email is required"
        }),

    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            "string.base": "Phone number must be a string",
            "string.pattern.base": "Phone number must be a valid 10-digit number",
            "any.required": "Phone number is required"
        })
});

// Get User Sessions
export const getUserSessionsSchema = Joi.object({
    id: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            "string.hex": "User ID must be a valid MongoDB ObjectId",
            "string.length": "User ID must be 24 characters long",
            "any.required": "User ID is required"
        })
});
