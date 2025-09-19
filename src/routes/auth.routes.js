import express from "express";
import { signup } from "#controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/sign-up" , signup);

authRoutes.post("/sign-in" , (req , res) => {
    res.send("POST /api/auth/sign-up response");
})

authRoutes.post("/sign-out" , (req , res) => {

});

export default authRoutes;

