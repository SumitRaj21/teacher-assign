
import Joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction, RequestHandler } from "express";
import ApiError from "../utils/AppError";

type RequestSchema = {
    params?: ObjectSchema;
    query?: ObjectSchema;
    body?: ObjectSchema;
};

type ValidatedRequestData = {
    params?: Record<string, unknown>;
    query?: Record<string, unknown>;
    body?: Record<string, unknown>;
};

declare global {
    namespace Express {
        interface Request {
            validated?: ValidatedRequestData;
        }
    }
}

const validate = (schema: RequestSchema): RequestHandler => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            const validSchema: Record<string, ObjectSchema> = {};

            // Compile only provided validation schemas
            (["params", "query", "body"] as const).forEach((key) => {
                if (schema[key]) {
                    validSchema[key] = schema[key];
                }
            });

            const object: Record<string, unknown> = {};

            // Extract request data
            Object.keys(validSchema).forEach((key) => {
                object[key] = req[key as keyof Request];
            });

            // Validate request data
            const { value, error } = Joi.object(validSchema)
                .prefs({
                    abortEarly: false,
                    allowUnknown: true,
                    stripUnknown: {
                        objects: true
                    }
                })
                .validate(object);

            // Handle validation errors
            if (error) {
                const errorMessage = error.details
                    .map((detail) => detail.message.replace(/["]/g, ""))
                    .join(", ");

                return next(new ApiError(400, errorMessage));
            }

            // Store sanitized and validated request data
            req.validated = value as ValidatedRequestData;

            // Update request properties where supported
            if (value.body !== undefined) {
                req.body = value.body;
            }

            if (value.params !== undefined) {
                req.params = value.params;
            }

            // Use req.validated.query for validated query data.
            return next();

        } catch (error: unknown) {
            return next(error);
        }
    };
};

export default validate;
