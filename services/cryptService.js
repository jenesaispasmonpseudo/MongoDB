import bcrypt from "bcrypt";

const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

export const hashPassword = (password) => {
  return bcrypt.hash(password, saltRounds);
};
