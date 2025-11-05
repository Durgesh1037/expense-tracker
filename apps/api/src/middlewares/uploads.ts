import express, { type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import path from 'path';

// Set up the storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Uploading file to uploads/ directory");
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null,file.originalname);
  },
});

// Initialize Multer with the storage configuration and optional limits/filters
export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
  },
}).single('avatar');