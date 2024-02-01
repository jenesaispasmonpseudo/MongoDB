import { body } from "express-validator";

export const userCreateValidator = () => {
  return [
    body("username").notEmpty().isLength({ min: 3 }).escape(),
    body("password").notEmpty().isLength({ min: 6 }).escape(),
    body("email").notEmpty().isEmail().normalizeEmail(),
  ];
};
