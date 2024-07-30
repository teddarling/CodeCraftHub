import bcrypt from 'bcryptjs';

// Hash password
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};
