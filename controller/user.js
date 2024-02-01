// recuperer le modele User
import User from "../models/user.js";
import { hashPassword } from "../services/cryptService.js";

const getUsers = async (req, res, next) => {
  // recuperer les users depuis la base de donnees
  const users = await User.find();
  res.json({
    message: "GET /user",
    users: users,
  });
};

const createUser = async (req, res, next) => {
  // recuperer les donnees depuis le body
  const { username, password, email } = req.body;

  // hash the password
  const hashedPassword = await hashPassword(password);
  // creer un nouveau user
  const user = new User({
    username: username,
    password: hashedPassword,
    email: email,
  });
  // sauvegarder le user dans la base de donnees
  await user.save();
  res.json({
    message: "POST /user",
    user: user,
  });
};

export default {
  getAll: getUsers,
  create: createUser,
};
