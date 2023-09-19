import { Schema, model } from "mongoose";
import { EmailValidation } from "types";

const { String } = Schema.Types;

const emailValidationSchema = new Schema<EmailValidation>({
  email: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
});

const EmailValidation = model("EmailValidation", emailValidationSchema);

export default EmailValidation;
