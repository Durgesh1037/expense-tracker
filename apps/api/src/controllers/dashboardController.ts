import type { Request, Response } from "express";
import Expenses from "../models/Expenses.ts";
import mongoose from "mongoose";

interface User {
  id: string;
}

interface UserRequest extends Request {
  user: User;
}

// import mongoose from "mongoose";
// import { Request, Response } from "express";
// import Expenses from "../models/Expenses"; // adjust import as per your structure

export const getDashboardSummary = async (
  req: Request & { user?: { _id?: string } },
  res: Response
) => {
  try {
    const userId = req?.user?._id;
    if (!userId) {
      return res
        .status(400)
        .json({ status: false, message: "User ID is required" });
    }

    const { from, to } = req.query as any;

    // default date range = last 30 days
    const endDate = to ? new Date(String(to)) : new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = from
      ? new Date(String(from))
      : new Date(endDate.getTime() - 29 * 24 * 60 * 60 * 1000);
    startDate.setHours(0, 0, 0, 0);

    console.log(
      "📊 Dashboard summary for user:",
      userId,
      "from",
      startDate,
      "to",
      endDate
    );

    const msPerDay = 24 * 60 * 60 * 1000;
    const periodDays = Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime() + 1) / msPerDay)
    );

    // ✅ Fix: ensure userId matches database type (string vs ObjectId)
    const userIdMatch =
      typeof userId === "string" && mongoose.isValidObjectId(userId)
        ? new mongoose.Types.ObjectId(userId)
        : userId;

    const baseMatch: any = {
      userId: userId,
      date: { $gte: startDate, $lte: endDate }, // $lte: endDate includes the full day (23:59:59.999)
    };

    console.log("Base Match:", baseMatch);
    console.log(await Expenses.find(baseMatch));

    // --- TOTAL EXPENSES ---
    const totalAgg = await Expenses.aggregate([
      { $match: baseMatch },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    console.log("Total Agg:", totalAgg);
    const total = totalAgg[0]?.total ?? 0;

    // --- PREVIOUS PERIOD ---
    const prevEnd = new Date(startDate.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - (periodDays - 1) * msPerDay);
    prevStart.setHours(0, 0, 0, 0);
    prevEnd.setHours(23, 59, 59, 999);

    const prevMatch = {
      userId: userIdMatch,
      date: { $gte: prevStart, $lte: prevEnd },
    };

    const prevAgg = await Expenses.aggregate([
      { $match: prevMatch },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const prevPeriodTotal = prevAgg[0]?.total ?? 0;

    // --- PERCENT CHANGE ---
    const pctChange =
      prevPeriodTotal === 0
        ? total === 0
          ? 0
          : 100
        : ((total - prevPeriodTotal) / Math.abs(prevPeriodTotal)) * 100;

    // --- AVERAGE DAILY ---
    const avgDaily = periodDays > 0 ? total / periodDays : 0;

    // --- TOP CATEGORY ---
    const topCatAgg = await Expenses.aggregate([
      { $match: baseMatch },
      { $group: { _id: "$category", amount: { $sum: "$amount" } } },
      { $sort: { amount: -1 } },
      { $limit: 1 },
    ]);
    const topCategory = topCatAgg[0]
      ? { name: topCatAgg[0]._id, amount: topCatAgg[0].amount }
      : { name: null, amount: 0 };

    // --- DAILY TREND (CURRENT PERIOD) ---
    const trendAgg = await Expenses.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // --- DAILY TREND (PREVIOUS PERIOD) ---
    const prevTrendAgg = await Expenses.aggregate([
      { $match: prevMatch },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    const trendMap = new Map<string, number>();
    for (const t of trendAgg) {
      const d = new Date(t._id.year, t._id.month - 1, t._id.day);
      const key = d.toISOString().slice(0, 10);
      trendMap.set(key, t.total);
    }

    const prevTrendMap = new Map<string, number>();
    for (const t of prevTrendAgg) {
      const d = new Date(t._id.year, t._id.month - 1, t._id.day);
      const key = d.toISOString().slice(0, 10);
      prevTrendMap.set(key, t.total);
    }

    const trend: Array<{ date: string; current: number; previous: number }> =
      [];
    for (let i = 0; i < periodDays; i++) {
      // Current period date
      const d = new Date(startDate.getTime() + i * msPerDay);
      const key = d.toISOString().slice(0, 10);
      // Previous period date (aligned by offset)
      const prevD = new Date(prevStart.getTime() + i * msPerDay);
      const prevKey = prevD.toISOString().slice(0, 10);
      trend.push({
        date: key,
        current: trendMap.get(key) ?? 0,
        previous: prevTrendMap.get(prevKey) ?? 0,
      });
    }

    res.status(200).json({
      status: true,
      totalTansactions: trend.reduce(
        (sum, day) => sum + (day.current > 0 ? 1 : 0),
        0
      ),
      total: Number(total.toFixed(2)),
      prevPeriodTotal: Number(prevPeriodTotal.toFixed(2)),
      pctChange: Number(pctChange.toFixed(2)),
      avgDaily: Number(avgDaily.toFixed(2)),
      topCategory,
      trend,
      message: "Dashboard summary fetched successfully",
    });
  } catch (err: any) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ status: false, message: err.message });
  }
};

export const getSpendingTrends = (req: Request, res: Response) => {
  // Placeholder implementation
  res.status(200).json({
    trends: [
      { month: "January", amount: 400 },
      { month: "February", amount: 350 },
      { month: "March", amount: 450 },
    ],
  });
};
