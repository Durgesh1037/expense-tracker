import type { Request, Response } from "express";
import * as bcrypt from "bcrypt-ts";
import Expenses from "../models/Expenses.ts";
import mongoose from "mongoose";
export const getExpenses = async (req: Request & { user?: { _id?: string } }, res: Response) => {
  try {
    // support: from, to (dates), category, tags (comma-separated), q (search), page, limit
    const { from, to, category, tags, q, page = '1', limit = '20' } = req.query as any;
    const userId = req.user?._id;

    const filter: any = {};
    // scope to authenticated user when available
    if (userId) filter.userId = userId;

    // category can be comma-separated list
    if (category) {
      const cats = String(category).split(',').map((s: string) => s.trim()).filter(Boolean);
      if (cats.length === 1) filter.category = cats[0];
      else if (cats.length) filter.category = { $in: cats };
    }

    // tags: comma-separated -> match any
    if (tags) {
      const tagsArr = String(tags).split(',').map((s: string) => s.trim()).filter(Boolean);
      if (tagsArr.length) filter.tags = { $in: tagsArr };
    }

    // date range
    if (from || to) {
      const dateFilter: any = {};
      if (from) {
        const d = new Date(String(from));
        if (!isNaN(d.getTime())) dateFilter.$gte = d;
      }
      if (to) {
        const d = new Date(String(to));
        if (!isNaN(d.getTime())) dateFilter.$lte = d;
      }
      if (Object.keys(dateFilter).length) filter.date = dateFilter;
    }

    // text / amount search
    if (q) {
      const qStr = String(q);
      const regex = new RegExp(qStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), 'i');
      const or: any[] = [{ merchant: regex }, { notes: regex }, { category: regex }];
      const num = Number(qStr);
      if (!isNaN(num)) or.push({ amount: num });
      filter.$or = or;
    }

    const pageNum = Math.max(1, parseInt(String(page)) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(String(limit)) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [total, expenses] = await Promise.all([
      Expenses.countDocuments(filter),
      Expenses.find(filter).sort({ date: -1 }).skip(skip).limit(limitNum),
    ]);

    // return paginated response with total count
    res.status(200).json({ status: true, total, page: pageNum, limit: limitNum, expenses });
  } catch (err: any) {
    res.status(500).json({ status: false, message: err.message });
  }
};


export const getSpecificExpense = async (req: Request & { user?: { _id?: string } }, res: Response) => {
  try {
    const expenseId = req.params.id;
    const userId = req.user?._id;
    const getExpenses = await Expenses.findOne({ _id: new mongoose.Types.ObjectId(expenseId), userId: userId });
    if (getExpenses) {
      res.status(200).json({ status: true, message: "Specific Expense fetched successfully",expense:getExpenses });
    } else {
      res.status(404).json({ status: false, message: "Expense not found" });
    }
  } catch (err: any) {
    res.status(500).json({ status: false,message: err.message });
  }
}

export const createExpense = async (req: Request & { user?: { _id?: string } }, res: Response) => {
  try {
    console.log("called expenses createExpense")
    const userId = req.user?._id;
    console.log("req.body:", req);
    const {description,amount,currency,date,category,tags,notes,merchant,attachmentUrl} = req.body;
    if (userId&&amount&&currency&&date&&category) {
      const newExpense = new Expenses({
        userId,
        amount,
        currency,
        date,
        category,
        tags,
        notes,
        merchant,
        attachmentUrl,
        description
      });
      const savedExpense = await newExpense.save();
      res.status(201).json({ status: true, savedExpense });
    } else {
        console.log("missing fields:", {userId, amount, currency, date, category});
      res.status(400).json({ status: false, message: "Something went wrong!" });
    }
  } catch (err: any) {
    res.status(500).json({ status: false,message: err.message });
  }
};

export const updateExpense = async (req: Request & { user?: { _id?: string } }, res: Response) => {
  try {
    const expenseId = req.params.id;
    const userId = req.user?._id;
    console.log("req.body:", req.body);
    const {information,amount,currency,date,category,tags,notes,merchant,attachmentUrl} = req.body;
    if (userId&&amount&&currency&&date&&category) {
      const updatedExpense = await Expenses.findOneAndUpdate(
        { _id: expenseId, userId: userId },
        { description:information,amount,currency,date,category,tags,notes,merchant,attachmentUrl },
        { new: true }
      );
      if (updatedExpense) {
        res.status(200).json({ status: true, updatedExpense });
      } else {
        res.status(404).json({ status: false, message: "Expense not found" });
      }
    } else {
        console.log("missing fields:", {userId, amount, currency, date, category});
      res.status(400).json({ status: false, message: "Missing required fields" });
    }
  } catch (err: any) {
    res.status(500).json({ status: false,message: err.message });
  }
};

export const deleteExpense = async (req: Request & { user?: { _id?: string } }, res: Response) => {
  try {
    const expenseId = req.params.id;
    const userId = req.user?._id;
    const deletedExpense = await Expenses.findOneAndDelete({ _id: expenseId, userId: userId });
    if (deletedExpense) {
      res.status(200).json({ status: true, message: "Expense deleted successfully" });
    } else {
      res.status(404).json({ status: false, message: "Expense not found" });
    }
  } catch (err: any) {
    res.status(500).json({ status: false,message: err.message });
  }
}

