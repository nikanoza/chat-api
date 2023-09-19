import { Schema, model } from "mongoose";
import { v4 as uuid } from "uuid";
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
    default: uuid,
  },
});

const User = model("User", userSchema);

export default User;
