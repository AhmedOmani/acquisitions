import logger from "#config/logger.js"
import bcrypt from "bcrypt";
import {eq} from "drizzle-orm";
import {db} from "#config/database.js";
import { users } from "#models/user.model.js";

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password , 10);
    } catch (error) {
        logger.error("Password hashing error" , error);
        throw new Error("Password hashing error");
    }
}

export const createUser = async ({name , email , password , role = "user"} ) =>  {
    try {
        const existingUser = await db.select().from(users).where(eq(users.email , email)).limit(1);
        if (existingUser.length > 0) {
            throw new Error("User already exists");
        }
        
        const hashedPassword = await hashPassword(password);

        const User = {
            name,
            email,
            password: hashedPassword,
            role
        };

        const [newUser] = await db.insert(users).values(User).returning({id: users.id , name: users.name , email:users.email , role:users.role, created_at:users.createdAt});
      
        logger.info("User created" , {id: newUser.id , email: newUser.email , role: newUser.role});
        return newUser;

    } catch ( error ) {
        console.log(error.message);
        logger.error("Create user error" , error.message);
        throw new Error("Create user error");
    }
}