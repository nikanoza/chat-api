export type UserType = {
  name: string;
  email: string;
  password: string;
  verify: boolean;
  avatar: string;
  id: string;
};

export type EmailValidationType = {
  email: string;
  hash: string;
};

export type PasswordRecoveryType = EmailValidationType;
