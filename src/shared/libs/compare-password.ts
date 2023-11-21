import * as bcrypt from 'bcrypt';

export const matchedPassword = async (
  userPassword: string,
  inputPassword: string,
) => {
  const isMatched = await bcrypt.compare(inputPassword, userPassword);
  return isMatched;
};
