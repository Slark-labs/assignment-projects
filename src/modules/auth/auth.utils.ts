import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  plainPassword: string,
  hashPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashPassword);
};

export function generateOtp(length = 5): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

export const hashedOtp = async (otp: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};
export const verifyOtp = async (
  otp: string,
  hashedOtp: string,
): Promise<boolean> => bcrypt.compare(otp, hashedOtp);
