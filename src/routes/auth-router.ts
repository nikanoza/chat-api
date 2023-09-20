import express from "express";
import multer from "multer";
import { fileStorage, fileFilter } from "../types";
import { createUser } from "controllers";

const authRouter = express.Router();

authRouter.post(
  "/register",
  multer({ storage: fileStorage, fileFilter }).single("avatar"),
  createUser
);

export default authRouter;
