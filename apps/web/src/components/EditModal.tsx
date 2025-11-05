"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Chip,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import { Close, Upload, Add, Delete, Visibility } from "@mui/icons-material";
import api from "../api/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Expense {
  _id?: string | number;
  information?: string;
  category?: string;
  amount?: number | string;
  currency?: string;
  date?: string;
  billable?: boolean;
  recurring?: boolean;
  paymentMethod?: string;
  notes?: string;
  description?: string;
  attachmentUrl?: string | null;
  tags?: string[];
  receipt?: string | null;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
  width: "90%",
  maxWidth: 800,
  maxHeight: "90vh",
  overflowY: "auto",
};

export default function EditModal({
  open,
  onClose,
  expenseId,
}: {
  open: boolean;
  onClose: () => void;
  expenseId: number|string | null;
}) {
    console.log("EditModal expenseId:",expenseId);
  const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm({
    mode: "onChange",
    defaultValues: {
      information: "",
      category: "",
      amount: "",
      currency: "USD",
      date: "",
      billable: false,
      recurring: false,
      notes: "",
    },
  });
  const [tags, setTags] = useState<any>([]);
  const [newTag, setNewTag] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [existingFile, setExistingFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  // Fetch existing expense using react-query
  const fetchExpense = async (): Promise<Expense | null> => {
    if (!expenseId) return null;
    const res = await api.get(`/expenses/${expenseId}`);
    // API returns { status, message, expense }
    return res.data?.expense as Expense;
  };

  const { data: expenseData, isLoading: isExpenseLoading, error: expenseError } = useQuery<Expense | null>({
    queryKey: ["expense", expenseId],
    queryFn: fetchExpense,
    enabled: !!open && !!expenseId,
    retry: false,
  });


  console.log("Fetched expense data:", expenseData);
  // When expense is loaded, reset the form values
  useEffect(() => {
    console.log("useEffect triggered with expenseData:", expenseData);
    if (expenseData) {
      const exp = expenseData;
      console.log("Resetting form with expense data:", exp);
      reset({
        // backend stores description -> map to information field
        information: exp?.description || "",
        category: exp.category || "",
        amount: String(exp.amount ?? ""),
        currency: exp.currency || "USD",
        date: exp.date ? exp.date.split("T")[0] : "",
        billable: !!exp.billable,
        recurring: !!exp.recurring,
        notes: exp.notes || "",
      });
      setTags(Array.isArray(exp.tags) ? exp.tags : []);
      setExistingFile(exp.attachmentUrl || exp.receipt || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenseData, reset]);

  // Form handlers


  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag:any) => {
    setTags(tags.filter((t:any) => t !== tag));
  };

  // file chooser is directly handled inline; no separate handler needed

  const handleFileDelete = () => {
    setExistingFile(null);
    setFile(null);
  };

  // Use mutation for update to keep react-query cache in sync

  const updateExpense = async (formData: FormData) => {
    // Do NOT set Content-Type manually for multipart/form-data.
    // Let the browser/axios set the correct boundary header.
    const res = await api.put(`/expenses/${expenseId}`, formData);
    return res.data;
  };

  const mutation = useMutation({
    
    mutationFn: (formData: FormData) => updateExpense(formData),
    onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["expenses"] });
  queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      setLoading(false);
      onClose();
    },
    onError: (err) => {
      console.error("Update failed:", err);
      alert("Failed to update expense!");
      setLoading(false);
    },
  });

  const onSubmit = (formData: any) => {
    setLoading(true);
    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]: any) => {
      if (val !== undefined && val !== null) payload.append(key, String(val));
    });
    tags.forEach(tag => payload.append("tags", tag));
    // payload.append("tags", JSON.stringify(tags));
    if (file) payload.append("receipt", file as any);
    // FormData can't be inspected by console.log directly in a readable way.
    // Iterate entries to debug what is actually inside the FormData.
    console.log("Submitting payload entries:");
    for (const pair of payload.entries()) {
      console.log(pair[0], pair[1]);
    }
    mutation.mutate(payload);
  };

  // show loading state inside modal when fetching expense (modal stays open)
  if (expenseError) console.error("Error loading expense:", expenseError);
  const savingOrLoading = loading || isExpenseLoading;
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <Typography variant="h6" className="font-semibold">
            Edit Expense
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </div>
        <Typography variant="body2" color="text.secondary">
          Update your expense details
        </Typography>

        <Divider className="my-4" />

        {/* Basic Info */}
        <Typography variant="subtitle1" className="font-semibold mb-2">
          Basic Information
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Controller
            name="information"
            control={control}
            rules={{ required: "Information is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Basic Information *"
                fullWidth
                error={!!errors.information}
                helperText={errors.information?.message}
              />
            )}
          />
          <Controller
            name="category"
            control={control}
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Category *"
                fullWidth
                error={!!errors.category}
                helperText={errors.category?.message}
              />
            )}
          />
        </div>

        {/* Amount & Date */}
        <Typography variant="subtitle1" className="font-semibold mb-2">
          Amount & Date
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Controller
            name="amount"
            control={control}
            rules={{ required: "Amount is required", pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Enter a valid amount" } }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Amount *"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                error={!!errors.amount}
                helperText={errors.amount?.message}
              />
            )}
          />
           <Typography variant="subtitle1" className="font-semibold mb-2">
          Currency
        </Typography>
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Select {...field} fullWidth>
                <MenuItem value="USD">USD</MenuItem>
              </Select>
            )}
          />
          <Controller
            name="date"
            control={control}
            rules={{ required: "Date is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                type="date"
                label="Date *"
                InputLabelProps={{ shrink: true }}
                fullWidth
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            )}
          />
        </div>

        {/* Tags */}
        <Typography variant="subtitle1" className="font-semibold mb-2">
          Tags & Classification
        </Typography>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag:any) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleRemoveTag(tag)}
              color="primary"
              variant="outlined"
            />
          ))}
        </div>
        <div className="flex gap-2 mb-4">
          <TextField
            label="Add new tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            size="small"
          />
          <Button variant="contained" onClick={handleAddTag}>
            Add Tag
          </Button>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <Controller
            name="billable"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={!!field.value} />}
                label="Billable Expense"
              />
            )}
          />
          <Controller
            name="recurring"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={!!field.value} />}
                label="Recurring Expense"
              />
            )}
          />
        </div>

        {/* Project & Payment */}
        {/* <Typography variant="subtitle1" className="font-semibold mb-2">
          Project & Payment
        </Typography> */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Controller
            name="project"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Project (Optional)"
                fullWidth
              />
            )}
          />
        </div> */}

        {/* Notes & Attachments */}
        <Typography variant="subtitle1" className="font-semibold mb-2">
          Notes & Attachments
        </Typography>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              multiline
              rows={3}
              label="Notes"
              fullWidth
              className="mb-4"
            />
          )}
        />

        <div className="border border-dashed border-gray-300 p-5 rounded-lg text-center mt-4">
          <Upload fontSize="large" className="mx-auto text-blue-500" />
          <Typography variant="body1" className="font-medium">
            Upload Receipt
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drag & drop or click below
          </Typography>
          <Button variant="contained" component="label" className="mt-3">
            Choose File
            <input type="file" hidden onChange={e => setFile(e.target.files?.[0] || null)} />
          </Button>

          {(file || existingFile) && (
            <div className="flex items-center justify-between mt-4 border border-gray-200 p-3 rounded-md">
              <div className="flex items-center gap-2">
                <Typography>{file ? file.name : existingFile}</Typography>
              </div>
              <div className="flex gap-2">
                <IconButton>
                  <Visibility />
                </IconButton>
                <IconButton onClick={handleFileDelete}>
                  <Delete />
                </IconButton>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={savingOrLoading || !isValid}
          >
            {savingOrLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
