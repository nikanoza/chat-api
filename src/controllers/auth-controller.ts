import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { EmailValidation, User } from "models";
import { UserRegistrationSchema } from "schemas";
import { sendEmailVerification } from "mail";

export const createUser = async (req: Request, res: Response) => {
  const { body, file } = req;
  const avatar = "/poster/" + file?.filename;
  const validator = await UserRegistrationSchema(body);
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

  return res.status(200).json({ message: "user created" });
};

export const verification = async (req: Request, res: Response) => {
  const { hash } = req.body;

  const verify = await EmailValidation.findOne({ hash });

  if (!verify) {
    return res.status(422).json({ message: "server error" });
  }
};
