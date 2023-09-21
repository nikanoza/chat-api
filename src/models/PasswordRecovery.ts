import { Schema, model } from "mongoose";
import { PasswordRecoveryType } from "types";

const { String } = Schema.Types;

const passwordRecoverySchema = new Schema<PasswordRecoveryType>({
  email: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
});

const PasswordRecovery = model("PasswordRecovery", passwordRecoverySchema);

export default PasswordRecovery;
