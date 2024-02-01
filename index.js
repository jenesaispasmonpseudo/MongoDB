import Express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import "dotenv/config.js";
import { matchedData, query, validationResult } from "express-validator";

const app = Express();

async function connect() {
  try {
    // Middlewares
    app.use(Express.json());

    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/rpi");
    console.log("Connected to MongoDB");

    // Routes
    app.get("/hello", query("person").notEmpty().escape(), (req, res) => {
      const result = validationResult(req);
      if (result.isEmpty()) {
        const data = matchedData(req);
        return res.send(`Hello ${data.person}`);
      }
      return res.status(400).json({ errors: result.array() });
    });
    app.use("/users", userRouter);

    // Start server
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (err) {
    console.log(err);
  }
}

connect();
