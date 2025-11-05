
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  InputAdornment,
  Checkbox,
  Chip,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Divider,
  Pagination,
} from "@mui/material";
import {
  Search,
  Add,
  FilterAltOutlined,
  CloudDownload,
  Delete,
  Edit,
  Notifications,
  CheckCircle,
  CalendarToday,
  ExpandMore,
  ViewList,
  ViewModule,
  ShowChart,
  Refresh,
  RefreshOutlined,
  DownloadOutlined,
} from "@mui/icons-material";
import clsx from "clsx";
import NewExpenseModal from "../components/NewModal";
import EditModal from "../components/EditModal";
import { useQuery } from "@tanstack/react-query";
import DeleteExpenseModal from "../components/DeleteExpenseModal";
import api from "../api/axios";

// mock data
const expenses = [
  {
    id: 1,
    date: "Nov 15, 2024",
    time: "9:30 AM",
    category: {
      name: "Food & Dining",
      icon: "🍔",
      color: "bg-rose-100 text-rose-600",
    },
    merchant: "Starbucks Coffee",
    tags: ["#office", "#meeting"],
    description: "Morning coffee before client meeting",
    amount: 12.45,
  },
  {
    id: 2,
    date: "Nov 14, 2024",
    time: "6:15 PM",
    category: {
      name: "Transportation",
      icon: "🚗",
      color: "bg-blue-100 text-blue-600",
    },
    merchant: "Uber",
    tags: ["#personal"],
    description: "Ride to downtown meeting location",
    amount: 28.5,
  },
  {
    id: 3,
    date: "Nov 14, 2024",
    time: "2:20 PM",
    category: {
      name: "Shopping",
      icon: "🛍️",
      color: "bg-green-100 text-green-600",
    },
    merchant: "Amazon",
    tags: ["#home", "#supplies"],
    description: "Office supplies and reference books",
    amount: 156.99,
  },
  {
    id: 4,
    date: "Nov 13, 2024",
    time: "Auto-pay",
    category: {
      name: "Entertainment",
      icon: "🎬",
      color: "bg-yellow-100 text-yellow-600",
    },
    merchant: "Netflix",
    tags: ["#subscription"],
    description: "Monthly streaming subscription",
    amount: 15.99,
  },
];

const filterOptions = {
  dateRange: ["Last 7 days", "Last 30 days", "Last 3 months"],
  categories: [
    "All Categories",
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
  ],
  tags: ["All Tags", "#office", "#personal", "#home", "#subscription"],
};

export default function Expenses() {
  const [selected, setSelected] = useState<any>([]);
  const [view, setView] = useState("list");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [expenseId, setExpenseId] = useState<string | number | null>(null);
  const [deleteExpense, setDeleteExpense] = useState(null);
 // 🔍 Filter state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    dateRange: "Last 30 days",
    category: "All Categories",
    tag: "All Tags",
    minAmount: "",
    maxAmount: "",
  });

  const [open, setOpen] = useState(false);


  const fetchSpecificexpenses = async () => {
    const response = await api.get(`/expenses/${expenseId}`);
    console.log("fetch Specific Expenses data for delete button", response);
    setDeleteExpense(response.data?.expense);
    return response.data;
  };

  const handleDelete = async () => {
    console.log("Deleted Expense ID:", expenseId);
    const response = await api.delete(`/expenses/${expenseId}`);
    setOpen(false);
    if(response)
    alert("deleted successfully")
    fetchUserExpenses();
    // const data=await fetchUserExpenses();
    // console.log("Updated Expenses after deletion:",data);
  };
  const fetchUserExpenses = async () => {
    const params: any = {};

    if (filters.search) params.search = filters.search;
    if (filters.category !== "All Categories")
      params.category = filters.category;
    if (filters.tag !== "All Tags") params.tag = filters.tag;
    if (filters.minAmount) params.min = filters.minAmount;
    if (filters.maxAmount) params.max = filters.maxAmount;
    if (filters.dateRange && filters.dateRange !== "All")
      params.dateRange = filters.dateRange;

    const response = await api.get("/expenses", { params });
    const totalAmount = response.data.expenses.reduce(
      (acc: number, exp: any) => acc + exp.amount,
      0
    );
    const totalAverage = totalAmount / 30;
    return {
      ...response.data,
      totalAmount: `$${totalAmount.toFixed(2)}`,
      totalTransactionAvg: `$${totalAverage.toFixed(2)}`,
    };
  };
  const { data, isLoading, error } = useQuery({
    queryKey: ["expenses", "dashboardSummary"],
    queryFn: fetchUserExpenses,
  });

  

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const handleSelectAll = (checked: any) => {
    setSelected(checked ? expenses.map((e) => e.id) : []);
  };
   const handleClearFilters = () => {
    setFilters({
      search: "",
      dateRange: "Last 30 days",
      category: "All Categories",
      tag: "All Tags",
      minAmount: "",
      maxAmount: "",
    });
    refetch();
  };

 const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const handleSelect = (id: number) => {
    setSelected((prev: any) =>
      prev.includes(id) ? prev.filter((x: any) => x !== id) : [...prev, id]
    );
  };

  return (
    <Box className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <Box className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Expenses
          </Typography>
          <Typography color="text.secondary">
            Manage and track all your expenses
          </Typography>
        </Box>

        <TextField
          placeholder="Search expenses..."
          size="small"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: "100%", maxWidth: 300 }}
        />

        <Box className="flex items-center gap-3">
          <IconButton>
            <Notifications />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setModalOpen(true)}
          >
            Add Expense
          </Button>
        </Box>
      </Box>

      <NewExpenseModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <EditModal
        expenseId={expenseId}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
      <DeleteExpenseModal
        open={open}
        onClose={() => setOpen(false)}
        expense={deleteExpense}
        onDelete={handleDelete}
      />

      {/* Search and Filters */}
      <Paper
        elevation={0}
        className="p-4 mb-8 rounded-xl border border-slate-200"
      >
        <Box className="mb-4 flex items-center justify-between">
          <Box className="mb-4">
            <Typography className="font-bold">
              Filter Expenses{" "}
              <span className="bg-blue-500 rounded-3xl text-white p-2">
                {data?.total} results
              </span>
            </Typography>
          </Box>
          <Box className="flex items-center gap-4 mb-5">
            <Button variant="outlined" startIcon={<FilterAltOutlined />}>
              Advanced Filters
            </Button>
            <Button variant="outlined" startIcon={<DownloadOutlined />}>
              Export
            </Button>
            <Button
              variant="text"
              startIcon={<RefreshOutlined />}
              color="error"
            >
              Clear All
            </Button>
          </Box>
        </Box>
        <Box className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <Box className="flex flex-wrap gap-3">
            <TextField
              select
              label="Date Range"
              size="small"
              defaultValue="Last 30 days"
            >
              {filterOptions.dateRange.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Category"
              size="small"
              value={filters.category}
              onChange={(e) =>
                handleFilterChange("category", e.target.value)
              }
            >
              {filterOptions.categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Tags"
              size="small"
              value={filters.tag}
              onChange={(e) => handleFilterChange("tag", e.target.value)}
            >
              {filterOptions.tags.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Min Amount"
              size="small"
              type="number"
              sx={{ width: 120 }}
              value={filters.minAmount}
              onChange={(e) =>
                handleFilterChange("minAmount", e.target.value)
              }
            />

            <TextField
              label="Max Amount"
              size="small"
              type="number"
              sx={{ width: 120 }}
              value={filters.maxAmount}
              onChange={(e) =>
                handleFilterChange("maxAmount", e.target.value)
              }
            />

            <Button
              variant="contained"
              color="primary"
              onClick={() => refetch()}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Summary */}
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <SummaryCard title="Total Amount" value={data?.total}/>
        <SummaryCard title="Transactions" value={data?.totalAmount}/>
        <SummaryCard title="Daily Average" value={data?.totalTransactionAvg} />
      </Box>

      {/* Toolbar */}
      <Box className="flex flex-wrap items-center justify-between mb-3 gap-3">
        <Box className="flex items-center gap-2">
          <Checkbox
            checked={selected.length === expenses.length}
            indeterminate={
              selected.length > 0 && selected.length < expenses.length
            }
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <Typography>
            {selected.length > 0
              ? `${selected.length} item(s) selected`
              : `Select All`}
          </Typography>
        </Box>

        <Box className="flex items-center gap-2">
          {selected.length > 0 && (
            <>
              <Button variant="outlined" startIcon={<Edit />}>
                Bulk Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  fetchSpecificexpenses(), setOpen(true);
                }}
                startIcon={<Delete />}
              >
                Delete Selected
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<CloudDownload />}
              >
                Export Selected
              </Button>
            </>
          )}
          <Divider orientation="vertical" flexItem />
          <Box className="flex items-center gap-1">
            <IconButton
              size="small"
              onClick={() => setView("list")}
              color={view === "list" ? "primary" : "default"}
            >
              <ViewList />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setView("grid")}
              color={view === "grid" ? "primary" : "default"}
            >
              <ViewModule />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setView("chart")}
              color={view === "chart" ? "primary" : "default"}
            >
              <ShowChart />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Expense Table */}
      <Paper elevation={0} className="rounded-xl border border-slate-200">
        <Table>
          <TableHead>
            <TableRow className="bg-slate-100">
              <TableCell padding="checkbox"></TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Merchant</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.expenses?.map((exp) => (
              <TableRow
                key={exp._id}
                hover
                className={clsx("transition", {
                  "bg-blue-50": selected.includes(exp._id),
                })}
                onClick={() => {
                  setEditModalOpen(true), setExpenseId(exp._id);
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(exp._id)}
                    onChange={() => handleSelect(exp._id)}
                  />
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>{exp.date}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {/* {exp.time} */}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={` ${exp.category}`}
                    className="bg-blue-300 font-medium"
                  />
                </TableCell>
                <TableCell>{exp?.merchant || "-"}</TableCell>
                <TableCell>
                  <Box className="flex flex-wrap gap-1">
                    {exp.tags.map((t) => (
                      <Chip
                        key={t}
                        label={t}
                        size="small"
                        sx={{ fontSize: 11, borderRadius: "6px" }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>{exp.description}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  ${exp.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Pagination */}
      <Box className="flex justify-between items-center mt-4">
        <Typography variant="caption">
          {`Showing 1 - ${data?.expenses?.length ?? 0} of ${data?.total ?? 0}`}
        </Typography>
        {/* <Pagination count={10} color="primary" size="small" /> */}
      </Box>
    </Box>
  );
}

function SummaryCard({ title, value }: any) {
  return (
    <Paper elevation={0} className="p-4 rounded-xl border border-slate-200">
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 800, mt: 1 }}>
        {value}
      </Typography>
    </Paper>
  );
}