import { Schema, model } from "mongoose";
import { UserType } from "types";

const { String } = Schema.Types;

const userSchema = new Schema<UserType>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

const User = model("User", userSchema);

export default User;
