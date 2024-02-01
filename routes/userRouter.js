import express from "express";
import userController from "../controller/user.js";
import { userCreateValidator } from "../middlewares/validators/users.js";

const router = express.Router();

router.get("/", userController.getAll);

router.post("/", ...userCreateValidator(), userController.create);

export default router;
