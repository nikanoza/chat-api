import Joi from "joi";

import User from "../models/User.js";
import { NewUser, UserType } from "types";

const determineIfEmailExists =
  (user: UserType | null) => (value: string, helpers: any) => {
    if (user) {
      return helpers.message("there is user with this email");
    }

    return value;
  };

const determineIfUsernameExists =
  (user: UserType | null) => (value: string, helpers: any) => {
    if (user) {
      return helpers.message("there is user with this name");
    }

    return value;
  };

const addUserSchema = async (data: NewUser) => {
  const user = await User.findOne({ email: data.email });
  const userWithName = await User.findOne({ name: data.name });

  return Joi.object<NewUser>({
    name: Joi.string()
      .min(3)
      .custom(determineIfUsernameExists(userWithName))
      .required()
      .messages({
        "string.base": "userName should be a string",
        "string.min": "userName should include 3 characters or more",
        "any.required": "userName is required",
      }),
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
    backLink: Joi.string().required().messages({
      "string.base": "backlink should be a string",
      "any.required": "backlink is required",
    }),
  });
};

export default addUserSchema;
