import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { EmailValidation, PasswordRecovery, User } from "models";
import {
  userRegistrationSchema,
  loginSchema,
  passwordResetSchema,
} from "schemas";
import { sendEmailVerification, sendPasswordRecovery } from "mail";

export const createUser = async (req: Request, res: Response) => {
  const { body, file } = req;
  const avatar = "/poster/" + file?.filename;
  const validator = await userRegistrationSchema(body);
  const { value, error } = validator.validate(body);
  if (error) {
    return res.status(422).json(error.details);
  }
  const { name, password, email, backLink } = value;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await User.create({
    name,
    email,
    avatar,
    password: hashedPassword,
  });

  const hash = crypto.randomBytes(48).toString("hex");
  await EmailValidation.create({
    email,
    hash,
  });

  await sendEmailVerification(email, hash, name, backLink);

  return res.status(201).json({ message: "user created" });
};

export const verification = async (req: Request, res: Response) => {
  const { hash } = req.body;

  const verify = await EmailValidation.findOne({ hash });

  if (!verify) {
    return res.status(422).json({ message: "server error" });
  }

  const user = await User.findOne({ email: verify.email });
  if (!user) {
    return res.status(422).json({ message: "server error" });
  }
  await verify.deleteOne();
  user.verify = true;
  await user.save();

  return res.status(200).json({ message: "user verified" });
};

export const login = async (req: Request, res: Response) => {
  const { body } = req;

  const validator = await loginSchema(body);
  const { value, error } = validator.validate(body);
  if (error) {
    return res.status(422).json(error.details);
  }

  const { email, password } = value;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(422).json({ message: "server error" });
  }

  const result = await bcrypt.compare(password, user.password);

  if (result) {
    const signData = {
      name: user.name,
      email: user.email,
      id: user.id,
      avatar: user.avatar,
    };

    const token = jwt.sign(signData, process.env.JWT_SECRET!);
    return res.status(200).json({ ...signData, token });
  }

  return res.status(422).json({ message: "server error" });
};

export const askPasswordRecovery = async (req: Request, res: Response) => {
  const { email, backLink } = req.body;
  if (!backLink || !email) {
    return res.status(422).json({ message: "server error" });
  }
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(422).json({ message: "server error" });
  }
  const hash = crypto.randomBytes(48).toString("hex");

  await PasswordRecovery.create({
    email,
    hash,
  });
  if (!backLink) {
    return res.status(422).json({ message: "server error" });
  }
  await sendPasswordRecovery(email, hash, user.name, backLink);
  return res.status(200).json({ message: "check your email" });
};

export const passwordReset = async (req: Request, res: Response) => {
  const { body } = req;

  const validator = await passwordResetSchema(body);
  const { value, error } = validator.validate(body);
  if (error) {
    return res.status(422).json(error.details);
  }

  const { password, hash } = value;
  const result = await PasswordRecovery.findOne({ hash });
  if (!result) {
    return res.status(422).json({ message: "server error" });
  }

  const user = await User.findOne({ email: result.email });
  if (!user) {
    return res.status(422).json({ message: "server error" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user.password = hashedPassword;
  await user.save();

  return res.status(204).json({ message: "password reset" });
};
