"use client";
import React, { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  TextField,
  Divider,
  Chip,
  Stack,
  Alert,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CloseIcon from "@mui/icons-material/Close";

type Expense = {
  id: string;
  description: string;
  category?: string;
  date?: string;
  amount?: number;
  tags?: string[];
  notes?: string;
};

type DeleteExpenseModalProps = {
  open: boolean;
  onClose: () => void;
  expense: Expense;
  onDelete: (id: string) => void;
};

export default function DeleteExpenseModal({ open, onClose, expense, onDelete }: DeleteExpenseModalProps) {
  console.log("DeleteExpenseModal expense:", expense);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = () => {
    if (confirmText === "DELETE") {
      onDelete(expense.id);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg w-full max-w-lg p-8 overflow-y-auto"
      >
        {/* Close button */}
        <IconButton
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <CloseIcon />
        </IconButton>

        {/* Header */}
        <Box className="flex flex-col items-center mb-6">
          <Box className="bg-red-100 rounded-full p-4 mb-3">
            <WarningAmberIcon className="text-red-500" sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h6" className="font-semibold">
            Delete Expense
          </Typography>
          <Typography color="text.secondary" className="text-center">
            Are you sure you want to delete this expense?
          </Typography>
        </Box>

        {/* Expense Summary */}
        <Box className="border border-gray-200 rounded-xl p-4 mt-4">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Box className="bg-red-50 p-2 rounded-lg">
                <RestaurantIcon className="text-red-400" />
              </Box>
              <Box>
                <Typography className="font-medium">{expense?.description}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {expense?.category} • {expense?.date}
                </Typography>
              </Box>
            </Stack>
            <Typography className="font-semibold text-lg">${expense?.amount}</Typography>
          </Stack>

          <Divider className="mt-3" />

          <Typography variant="body2" className="mt-2">
            <strong>Tags:</strong>{" "}
            {expense?.tags?.length > 0 ? (
              expense?.tags.map((tag, i) => (
                <Chip
                  key={i}
                  label={`#${tag}`}
                  size="small"
                  className="mr-1 bg-blue-50 text-blue-600"
                />
              ))
            ) : (
              <span className="text-gray-400">No tags</span>
            )}
          </Typography>

          {expense?.notes && (
            <Typography variant="body2" className="mt-2">
              <strong>Notes:</strong> {expense?.notes}
            </Typography>
          )}
        </Box>

        {/* Alerts */}
        <Alert severity="error" className="mb-3 rounded-lg">
          <Typography variant="subtitle2" className="font-semibold">
            Important:
          </Typography>
          <Typography variant="body2">
            This action cannot be undone. The expense will be permanently removed and will
            affect your spending analytics and totals.
          </Typography>
        </Alert>

        <Alert severity="warning" className="mb-4 rounded-lg">
          <Typography variant="subtitle2" className="font-semibold">
            Data Impact:
          </Typography>
          <Typography variant="body2">
            Deleting this expense will update your dashboard statistics and remove it
            from any reports or exports.
          </Typography>
        </Alert>

        {/* Confirmation Field */}
        <Typography variant="body2" color="text.secondary" className="mb-2">
          To confirm deletion, please type <strong>DELETE</strong> below:
        </Typography>

        <TextField
          fullWidth
          placeholder="Type DELETE to confirm"
          size="small"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="mt-4"
        />

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} className="mt-4">
          <Button
            fullWidth
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            disabled={confirmText !== "DELETE"}
            onClick={handleDelete}
          >
            Yes, Delete Expense
          </Button>
          <Button fullWidth variant="outlined" onClick={onClose}>
            Cancel & Keep
          </Button>
        </Stack>

        {/* Secondary Actions */}
        <Divider className="mt-2" />
        <Typography variant="body2" color="text.secondary" className="text-center mb-1">
          Need to make changes instead?
        </Typography>
        <Stack direction="row" justifyContent="center" spacing={2}>
          <Button variant="text" size="small">
            ✏️ Edit Expense
          </Button>
          <Button variant="text" size="small">
            📄 Duplicate Expense
          </Button>
        </Stack>

        <Divider className="my-3" />
        <Typography
          variant="body2"
          color="text.secondary"
          className="text-center"
        >
          ❓ Need help? <span className="text-blue-600 cursor-pointer">Contact support</span>
        </Typography>
      </Box>
    </Modal>
  );
}
