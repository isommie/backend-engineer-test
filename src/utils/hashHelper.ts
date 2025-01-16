import bcrypt from 'bcryptjs';

export const hashHelper = {
  hashPassword: async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  comparePassword: async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
  },
};
