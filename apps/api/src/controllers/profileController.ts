import type { Request, Response } from "express";
import * as bcrypt from "bcrypt-ts";
import User from "../models/User.ts";
import mongoose from "mongoose";
export const getProfile = async (req: Request & { user?: {_id:string, email?: string } }, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req: Request & { user?: {_id:string, email?: string } }, res: Response) => {
  try {
    console.log("called my profile updateProfile");
    console.log("req.body:", req.file);
    const userId = req.user?._id;
    const avatarUrl=req?.file?.originalname;
    if (avatarUrl&&userId) {
      const updatedUser = await User.findByIdAndUpdate({_id:new mongoose.Types.ObjectId(userId)}, {avatarUrl:`${process?.env?.BACKEND_URL}uploads/${avatarUrl}`}, {
        new: true,
      });

      console.log("updatedUser:", updatedUser);
      if (updatedUser) {
        res.status(200).json({ status: true, updatedUser });
      } else {
        res.status(404).json({ status: false, message: "User not found" });
      }
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


export const updateBasicDetails = async (req: Request & { user?: {_id:string, email?: string } }, res: Response) => {
  try {
    const {firstName,lastName,phone} = req.body;
    const userId = req.user?._id;
    if (firstName&&userId) {
      const updatedUser = await User.findByIdAndUpdate({_id:new mongoose.Types.ObjectId(userId)}, {name:firstName+" "+lastName,phone}, {
        new: true,
      });

      console.log("updatedUser:", updatedUser);
      if (updatedUser) {
        res.status(200).json({ status: true, updatedUser });
      } else {
        res.status(404).json({ status: false, message: "User not found" });
      }
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
