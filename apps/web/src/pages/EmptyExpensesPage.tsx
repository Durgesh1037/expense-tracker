import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import NewExpenseModal from "../components/NewModal";
import { useState } from "react";

export default function EmptyExpensesPage() {
    const [modalOpen,setModalOpen]=useState(false);
  return (
    <Container
      maxWidth="md"
      className=" inset-0 flex flex-col items-center justify-center min-h-screen bg-gray-50 z-10"
      sx={{ minHeight: '100vh', width: '100vw', overflow: 'auto' }}
    >
      {/* Header Section */}
      <Box className="text-center mb-10">
        <div className="flex flex-col items-center">
          <AccountBalanceWalletIcon
            sx={{ fontSize: 48 }}
            className="text-blue-600 mb-2"
          />
          <Typography variant="h5" className="font-semibold mb-1">
            Welcome to ExpenseTracker
          </Typography>
          <Typography variant="body1" color="text.secondary" className="max-w-md">
            Take control of your finances with our powerful expense tracking
            platform. Monitor spending, analyze patterns, and achieve your
            financial goals.
          </Typography>
        </div>
      </Box>

      {/* Empty Illustration Section */}
      <Box className="flex flex-col items-center text-center bg-white rounded-2xl p-10 shadow-sm w-full max-w-sm mb-8">
        <img
          src="https://cdn-icons-png.flaticon.com/512/825/825564.png"
          alt="Empty wallet"
          className="w-48 h-48 mb-6"
        />
        <Typography variant="h6" className="font-semibold mb-1">
          No expenses yet!
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mb-6">
          You haven not added any expenses yet. Start tracking your spending to
          gain valuable insights into your financial habits and make informed
          decisions.
        </Typography>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className="bg-blue-600 hover:bg-blue-700"
            onClick={()=>setModalOpen(true)}
          >
            Add First Expense
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Import from CSV
          </Button>
        </Stack>
      </Box>

{/* new Expense add modal */}
<NewExpenseModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
            />

      {/* Floating Add Button */}
      {/* <Fab
        color="warning"
        aria-label="add"
        className="!fixed bottom-8 right-8 bg-yellow-400 hover:bg-yellow-500"
      >
        <AddIcon />
      </Fab> */}
    </Container>
    // </Box>
  );
}
