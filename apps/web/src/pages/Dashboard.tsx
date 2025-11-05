import React, { useMemo, useState } from "react";
import {
  Box,
  Container,
  IconButton,
  Typography,
  Button,
  Avatar,
  Chip,
  Paper,
  Tooltip,
  Divider,
  Select,
  MenuItem,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  Add,
  Download,
  Today,
  Timeline,
  ReceiptLong,
  PieChart as PieIcon,
  Category,
  Settings,
  Person,
  Logout,
  BarChart as BarIcon,
  CalendarToday,
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
import { getCookieToken } from "../utils/cookiesToken";
import EmptyExpensesPage from "./EmptyExpensesPage";
import NewExpenseModal from "../components/NewModal";
import api from "../api/axios";
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
  { date: "Nov 1", current: 45, previous: 30, label: "$" },
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
export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [period, setPeriod] = useState(30);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  

  const token = getCookieToken("refreshToken");
  console.log("Token in dashboard:", token);

  const fetchDashboardSummary = async () => {
    const response = await api.get(`/dashboard/summary?from=${from}&to=${to}`);
    console.log("response", response);
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["expenses", "dashboardSummary", period, from, to],
    queryFn: fetchDashboardSummary,
  });

  const formatDate = (date: Date) => date.toISOString().slice(0, 10);

  const handlePeriodChange = (e: any) => {
    const days = Number(e.target.value);
    setPeriod(days);
    const now = new Date();
    const toDate = formatDate(now);
    const fromDate = formatDate(
      new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000)
    );
    setFrom(fromDate);
    setTo(toDate);
  };

  // Set initial from/to on mount
  React.useEffect(() => {
    const now = new Date();
    const toDate = formatDate(now);
    const fromDate = formatDate(
      new Date(now.getTime() - (period - 1) * 24 * 60 * 60 * 1000)
    );
    setFrom(fromDate);
    setTo(toDate);
  }, [from, to]);
const totals = useMemo(() => {
  const trend: Array<{ date: string; current: number; previous: number }> = data?.trend ?? [];
  if (!trend.length) {
    return { avg: "0.00", peak: "0.00", low: "0.00" };
  }
  const avg = trend.reduce((s: number, d: { current: number }) => s + (d.current ?? 0), 0) / Math.max(1, trend.length);
  const peak = Math.max(...trend.map((d: { current: number }) => d.current ?? 0));
  const low = Math.min(...trend.map((d: { current: number }) => d.current ?? 0));
  return { avg: avg.toFixed(2), peak: peak.toFixed(2), low: low.toFixed(2) };
}, [data?.trend]);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      {data ? (
        <Box className="flex-1 p-6 overflow-auto">
          <Container maxWidth="xl" className="p-0">
            {/* Top bar */}
            <Box className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  Dashboard Overview
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Welcome back, Here's your financial snapshot for today.
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Last updated: {new Date().toLocaleString()}
                </Typography>
              </Box>

              <Box className="flex items-center gap-3">
                <Box sx={{ minWidth: 140 }}>
                  <Select
                    size="small"
                    value={period}
                    onChange={handlePeriodChange}
                    startAdornment={<Today sx={{ mr: 1 }} />}
                  >
                    <MenuItem value={7}>Last 7 days</MenuItem>
                    <MenuItem value={30}>Last 30 days</MenuItem>
                    <MenuItem value={90}>Last 90 days</MenuItem>
                  </Select>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setModalOpen(true)}
                >
                  Add Expense
                </Button>
                <Button variant="outlined" startIcon={<Download />}>
                  Export
                </Button>
              </Box>
            </Box>

            {/* KPI Cards */}
            <Box className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* TOTAL SPENT */}
              <Paper elevation={1} className="p-4 rounded-xl">
                <Box className="flex justify-between items-start">
                  <Box>
                    <Typography variant="caption" className="text-slate-500">
                      TOTAL SPENT
                    </Typography>
                    <Typography sx={{ fontWeight: 800, mt: 1 }}>
                      ${data.total?.toLocaleString() ?? "-"}
                    </Typography>
                    <Typography variant="caption" className="text-slate-400 mt-1">
                      This period
                    </Typography>
                  </Box>
                  <Box>
                    <ReceiptLong sx={{ color: "#f97373" }} />
                  </Box>
                </Box>
                {/* delta + progress */}
                <Box className="mt-4">
                  {data.totalDeltaPct !== undefined && (
                    <Box className="flex items-center justify-between">
                      <Box className={`flex items-center gap-2 ${data.totalDeltaUp ? "text-green-600" : "text-red-500"}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
                          <path d="M12 2L6 12h12L12 2z" />
                        </svg>
                        <Typography variant="caption">
                          {data.totalDeltaPct}% vs last period
                        </Typography>
                      </Box>
                      <Typography variant="caption" className="text-slate-400">
                        {data.totalDeltaAmount}
                      </Typography>
                    </Box>
                  )}
                  <Box className="h-2 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
                    <div style={{ width: `${data.totalBarValue ?? 65}%`, background: "#f97373", height: "100%" }} />
                  </Box>
                </Box>
              </Paper>

              {/* DAILY AVERAGE */}
              <Paper elevation={1} className="p-4 rounded-xl">
                <Box className="flex justify-between items-start">
                  <Box>
                    <Typography variant="caption" className="text-slate-500">
                      DAILY AVERAGE
                    </Typography>
                    <Typography sx={{ fontWeight: 800, mt: 1 }}>
                      ${data.avgDaily?.toLocaleString() ?? "0"}
                    </Typography>
                    <Typography variant="caption" className="text-slate-400 mt-1">
                      Past {period} days
                    </Typography>
                  </Box>
                  <Box>
                    <Timeline sx={{ color: "#3b82f6" }} />
                  </Box>
                </Box>
                <Box className="mt-4">
                  {data.avgDeltaPct !== undefined && (
                    <Box className="flex items-center justify-between">
                      <Box className={`flex items-center gap-2 ${data.avgDeltaUp ? "text-green-600" : "text-red-500"}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
                          <path d="M12 2L6 12h12L12 2z" />
                        </svg>
                        <Typography variant="caption">
                          {data.avgDeltaPct}% vs last period
                        </Typography>
                      </Box>
                      <Typography variant="caption" className="text-slate-400">
                        {data.avgDeltaAmount}
                      </Typography>
                    </Box>
                  )}
                  <Box className="h-2 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
                    <div style={{ width: `${data.avgBarValue ?? 45}%`, background: "#3b82f6", height: "100%" }} />
                  </Box>
                </Box>
              </Paper>

              {/* TOP CATEGORY */}
              <Paper elevation={1} className="p-4 rounded-xl">
                <Box className="flex justify-between items-start">
                  <Box>
                    <Typography variant="caption" className="text-slate-500">
                      TOP CATEGORY
                    </Typography>
                    <Typography sx={{ fontWeight: 800, mt: 1 }}>
                      {data.topCategory?.name ?? "-"}
                    </Typography>
                    <Typography variant="caption" className="text-slate-400 mt-1">
                      {data.topCategory ? `$${data.topCategory.amount?.toLocaleString()}` : "-"}
                    </Typography>
                  </Box>
                  <Box>
                    <Category sx={{ color: "#f59e0b" }} />
                  </Box>
                </Box>
                <Box className="mt-4">
                  <Box className="h-2 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
                    <div style={{ width: `${data.topCategoryBarValue ?? 80}%`, background: "#fcd34d", height: "100%" }} />
                  </Box>
                </Box>
              </Paper>

              {/* TRANSACTIONS */}
              <Paper elevation={1} className="p-4 rounded-xl">
                <Box className="flex justify-between items-start">
                  <Box>
                    <Typography variant="caption" className="text-slate-500">
                      TRANSACTIONS
                    </Typography>
                    <Typography sx={{ fontWeight: 800, mt: 1 }}>
                      {data.totalTansactions?.toLocaleString() ?? "-"}
                    </Typography>
                    <Typography variant="caption" className="text-slate-400 mt-1">
                      This period
                    </Typography>
                  </Box>
                  <Box>
                    <BarIcon sx={{ color: "#10b981" }} />
                  </Box>
                </Box>
                <Box className="mt-4">
                  {data.txnsDeltaPct !== undefined && (
                    <Box className="flex items-center justify-between">
                      <Box className={`flex items-center gap-2 ${data.txnsDeltaUp ? "text-green-600" : "text-red-500"}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
                          <path d="M12 2L6 12h12L12 2z" />
                        </svg>
                        <Typography variant="caption">
                          {data.txnsDeltaPct}% vs last period
                        </Typography>
                      </Box>
                      <Typography variant="caption" className="text-slate-400">
                        {data.txnsDeltaAmount}
                      </Typography>
                    </Box>
                  )}
                  <Box className="h-2 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
                    <div style={{ width: `${data.txnsBarValue ?? 50}%`, background: "#34d399", height: "100%" }} />
                  </Box>
                </Box>
              </Paper>
            </Box>

            {/* Add Expenses Modal */}
            <NewExpenseModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
            />

            {/* Main Panels: Trend + Category */}
            <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Spending Trend (left - wide) */}
              <Paper elevation={1} className="p-6 rounded-xl col-span-2">
                <Box className="flex items-center justify-between mb-3">
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Spending Trend Analysis
                  </Typography>
                  <Box className="flex items-center gap-2">
                    <Chip
                      label="Current Period"
                      size="small"
                      sx={{ bgcolor: "#2b6cf6", color: "white" }}
                    />
                    <Chip
                      label="Previous Period"
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Box style={{ width: "100%", height: 340 }}>
                  <ResponsiveContainer>
                    <LineChart
                      data={data?.trend}
                      margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorCurrent"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#2b6cf6"
                            stopOpacity={0.25}
                          />
                          <stop
                            offset="95%"
                            stopColor="#2b6cf6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                      <XAxis dataKey="date" tickLine={false} />
                      <YAxis tickLine={false} />
                      <ReTooltip />
                      {/* previous period: show a faint area + a clear line for visibility */}
                      <Area
                        type="monotone"
                        dataKey="previous"
                        stroke="#c7d2fe"
                        fill="#f8fafc"
                        fillOpacity={0.06}
                      />
                      <Line
                        type="monotone"
                        dataKey="previous"
                        stroke="#c7d2fe"
                        dot={{ r: 4 }}
                        strokeWidth={2}
                        opacity={0.9}
                      />

                      {/* current period: prominent area + line */}
                      <Area
                        type="monotone"
                        dataKey="current"
                        stroke="#2b6cf6"
                        fill="url(#colorCurrent)"
                        fillOpacity={1}
                      />
                      <Line
                        type="monotone"
                        dataKey="current"
                        stroke="#2b6cf6"
                        dot={{ r: 4 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>

                  <Box className="flex items-center justify-between mt-4">
                    <Typography variant="body2" color="text.secondary">
                      Average: <strong>${totals.avg}</strong> &nbsp; Peak:{" "}
                      <strong>${totals.peak}</strong> &nbsp; Low:{" "}
                      <strong>${totals.low}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Hover over chart for details
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Category Breakdown (right) */}
              <Paper elevation={1} className="p-6 rounded-xl">
                <Box className="flex items-center justify-between mb-4">
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Category Breakdown
                  </Typography>
                  <IconButton size="small">
                    <Download />
                  </IconButton>
                </Box>

                <Box className="flex sm:flex-row lg:flex-col gap-5">
                  <Box style={{ width: 220, height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          outerRadius={80}
                          dataKey="value"
                          innerRadius={55}
                          paddingAngle={3}
                          stroke="transparent"
                        >
                          {categoryData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>

                  <Box className="flex-1 mt-12">
                    {categoryData.map((c) => (
                      <Box
                        key={c.name}
                        className="flex items-center justify-between py-2"
                      >
                        <Box className="flex items-center gap-3">
                          <Box
                            style={{
                              width: 12,
                              height: 12,
                              background: c.color,
                              borderRadius: 6,
                            }}
                          />
                          <div>
                            <Typography sx={{ fontWeight: 700 }}>
                              {c.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {Math.round(
                                (c.value /
                                  categoryData.reduce(
                                    (s, d) => s + d.value,
                                    0
                                  )) *
                                  100
                              )}
                              % • {Math.round((c.value / c.value) * 1)}{" "}
                              transactions
                            </Typography>
                          </div>
                        </Box>

                        <Typography sx={{ fontWeight: 700 }}>
                          ${c.value.toLocaleString()}
                        </Typography>
                      </Box>
                    ))}

                    <Box className="mt-4">
                      <Button variant="outlined" fullWidth>
                        View All Categories
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Container>
        </Box>
      ) : (
        <div className="w-full flex-1 p-6 overflow-auto">
          <EmptyExpensesPage />
        </div>
      )}
    </>
  );
}
