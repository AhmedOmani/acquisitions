import logger from "#config/logger.js";
import { signupSchema } from "#validations/auth.validation.js";
import { formatValidationErrors } from "#utils/format.js";
import { createUser } from "#services/auth.service.js";
import {jwttoken} from "#utils/jwt.js";
import { cookies } from "#utils/cookies.js";

export const signup = async (req , res , next) => {
    try {
        const validationResult = signupSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                error: "Validation failed",
                detailes: formatValidationErrors(validationResult.error)
            });
        }

        const {name , email , password , role} = validationResult.data;

        //AUTH SERVICE
        const user = await createUser({name , email , password , role});
        const token = jwttoken.sign({id: user.id , email: user.email , role: user.role});
        cookies.set(res, "token", token);

        logger.info("User signed up" , {name , email , role});
        res.status(201).json({
            message: "User signed up successfully" , 
            user: user
        });

    } catch ( error ) {
        logger.error("Signup error" , error);
        
        if (error.message === "User with this eail already exists") {
            return res.status(409).json({message: error.message})
        }

        next(error);
    }
}