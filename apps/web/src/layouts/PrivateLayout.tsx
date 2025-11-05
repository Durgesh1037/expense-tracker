"use client";
import React, { useState, useMemo } from "react";
import { Outlet } from "react-router-dom";
import {
  Box,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Timeline,
  ReceiptLong,
  PieChart as PieIcon,
  Category,
  BarChart as BarIcon,
} from "@mui/icons-material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  CartesianGrid,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import LeftSideBar from "./LeftSideBar";

/**
 * DashboardPage
 * React + MUI + Tailwind + Recharts implementation modeled after the provided screenshot.
 *
 * Usage:
 * - Put this file in your project and ensure Tailwind + MUI are configured.
 * - Replace mock data / handlers with real data as needed.
 */

const kpiCards = [
  {
    id: "total",
    title: "TOTAL SPENT",
    subtitle: "This month",
    value: "$3,247.82",
    delta: { up: true, pct: "12%", amount: "+$347.82" },
    bar: { color: "#f97373", value: 65 },
    icon: <ReceiptLong sx={{ color: "#f97373" }} />,
  },
  {
    id: "avg",
    title: "DAILY AVERAGE",
    subtitle: "Past 30 days",
    value: "$108.26",
    delta: { up: false, pct: "5%", amount: "-$5.74" },
    bar: { color: "#3b82f6", value: 45 },
    icon: <Timeline sx={{ color: "#3b82f6" }} />,
  },
  {
    id: "top",
    title: "TOP CATEGORY",
    subtitle: "Highest spend",
    value: "Food & Dining\n$1,456.32",
    delta: { up: null, pct: null, amount: null },
    bar: { color: "#fcd34d", value: 80 },
    icon: <Category sx={{ color: "#f59e0b" }} />,
  },
  {
    id: "txns",
    title: "TRANSACTIONS",
    subtitle: "This month",
    value: "147",
    delta: { up: true, pct: "23%", amount: "+27 txns" },
    bar: { color: "#34d399", value: 50 },
    icon: <BarIcon sx={{ color: "#10b981" }} />,
  },
];

// Mock line chart data (dates and values)
const trendData = [
  { date: "Nov 1", current: 45, previous: 30 },
  { date: "Nov 3", current: 120, previous: 90 },
  { date: "Nov 5", current: 100, previous: 80 },
  { date: "Nov 7", current: 230, previous: 150 },
  { date: "Nov 9", current: 180, previous: 160 },
  { date: "Nov 11", current: 110, previous: 120 },
  { date: "Nov 13", current: 65, previous: 90 },
  { date: "Nov 15", current: 200, previous: 150 },
];

// Mock pie chart (category) data
const categoryData = [
  { name: "Food & Dining", value: 1456.32, color: "#ef4444" },
  { name: "Transportation", value: 892, color: "#3b82f6" },
  { name: "Shopping", value: 634, color: "#10b981" },
  { name: "Entertainment", value: 265, color: "#f59e0b" },
];

export default function PrivateLayout() {
  const totals = useMemo(() => {
    const avg =
      trendData.reduce((s, d) => s + d.current, 0) / Math.max(1, trendData.length);
    const peak = Math.max(...trendData.map((d) => d.current));
    const low = Math.min(...trendData.map((d) => d.current));
    return { avg: avg.toFixed(2), peak: peak.toFixed(2), low: low.toFixed(2) };
  }, []);

  return (
    <Box className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <LeftSideBar/>

      {/* Main content */}
      <main>
        <Outlet />
      </main>
    </Box>
  );
}

