import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const fileStorage = multer.diskStorage({
  destination: (
    _: Request,
    __: Express.Multer.File,
    callback: DestinationCallback
  ): void => {
    callback(null, "public/storage");
  },
  filename: (
    _: Request,
    file: Express.Multer.File,
    callback: FileNameCallback
  ): void => {
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const name = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
    callback(null, timestamp + name);
  },
});

export const fileFilter = (
  __: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};
