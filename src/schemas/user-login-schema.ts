import Joi from "joi";

import User from "../models/User.js";
import { NewUser, UserType } from "types";

const determineIfEmailExists =
  (user: UserType | null) => (value: string, helpers: any) => {
    if (!user) {
      return helpers.message("there is user with this email");
    }

    return value;
  };

const loginSchema = async (data: { email: string; password: string }) => {
  const user = await User.findOne({ email: data.email });

  return Joi.object<NewUser>({
    email: Joi.string()
      .custom(determineIfEmailExists(user))
      .email()
      .required()
      .messages({
        "string.base": "email should be a string",
        "string.email": "email should be email format",
        "any.required": "email is required",
      }),
    password: Joi.string().min(5).max(20).required().messages({
      "string.base": "password should be a string",
      "string.min": "password should be includes 5 or more characters",
      "string.max": "password should be includes 20 or les characters",
      "any.required": "password is required",
    }),
  });
};

export default loginSchema;
