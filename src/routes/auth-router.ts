import express from "express";
import multer from "multer";
import { fileStorage, fileFilter } from "../types/multer.js";
import {
  askPasswordRecovery,
  createUser,
  login,
  verification,
} from "controllers";

const authRouter = express.Router();

authRouter.post(
  "/register",
  multer({ storage: fileStorage, fileFilter }).single("avatar"),
  createUser
);

authRouter.post("/verify", verification);
authRouter.post("/login", login);
authRouter.post("/recovery", askPasswordRecovery);

export default authRouter;
