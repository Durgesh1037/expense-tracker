import type { Request, Response } from "express";
import Category from "../models/Category.ts";

export const categorycontroller = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
