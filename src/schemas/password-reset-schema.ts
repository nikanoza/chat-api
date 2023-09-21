import Joi from "joi";

import { PasswordRecoveryType } from "types";
import { PasswordRecovery } from "models";

const determineIfHashExists =
  (user: PasswordRecoveryType | null) => (value: string, helpers: any) => {
    if (!user) {
      return helpers.message("server error");
    }

    return value;
  };

const passwordResetSchema = async (data: {
  hash: string;
  password: string;
}) => {
  const result = await PasswordRecovery.findOne({ hash: data.hash });

  return Joi.object({
    hash: Joi.string()
      .custom(determineIfHashExists(result))
      .required()
      .messages({
        "string.base": "userName should be a string",
        "string.min": "userName should include 3 characters or more",
        "any.required": "userName is required",
      }),
    password: Joi.string().min(5).max(20).required().messages({
      "string.base": "password should be a string",
      "string.min": "password should be includes 5 or more characters",
      "string.max": "password should be includes 20 or les characters",
      "any.required": "password is required",
    }),
  });
};

export default passwordResetSchema;
