"use client";
import React, { useState } from "react";
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
} from "@mui/material";
import { Close, Upload, Add, PlusOneOutlined, HdrPlusOutlined, PlusOne } from "@mui/icons-material";
import axios from "axios";
import api from "../api/axios";
import { useQuery } from "@tanstack/react-query";

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
    maxWidth: 700,
    maxHeight: "90vh",
    overflowY: "auto",
};


export default function NewExpenseModal({ open, onClose }: any) {
    const [tags, setTags] = useState(["#business-travel", "#reimbursable"]);
    const [newTag, setNewTag] = useState("");
    const [file, setFile] = useState<{ name?: string } | null>(null);

    const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm({
        mode: "onChange",
        defaultValues: {
            description: "",
            category: "",
            amount: "",
            currency: "USD",
            date: "",
            merchant: "",
            billable: true,
            recurring: false,
            notes: "",
        },
    });



    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove: any) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleFileChange = (e: any) => {
        setFile(e.target.files[0]);
    };


    const onSubmit = async (formData: any) => {
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]: any) => data.append(key, value));
            tags.forEach(tag => data.append("tags[]", tag));
            if (file) data.append("receipt", file?.name);

            const response = await api.post("/expenses", data);

            console.log("Expense saved:", response.data);
            alert("Expense added successfully!");
            reset();
            setTags(["#business-travel", "#reimbursable"]);
            setFile(null);
            onClose(false);
        } catch (error) {
            console.error("Error saving expense:", error);
            alert("Failed to save expense!");
        }
    };

    const fetchAllCategories = async () => {
        const response = await api.get('/categories');
        console.log("response", response);
        return response.data
        console.log("fetching dashboard summary");
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ["expenses", "categories"],
        queryFn: fetchAllCategories,
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="w-full flex justify-center mt-6">

            <Modal open={open} onClose={() => onClose(false)}>
                <Box sx={style} className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <Typography variant="h6" className="font-semibold">
                            New Expense
                        </Typography>
                        <IconButton onClick={() => onClose(false)}>
                            <Close />
                        </IconButton>
                    </div>
                    <Typography variant="body2" color="text.secondary">
                        Add a new expense to your tracker
                    </Typography>

                    {/* Basic Information */}
                    <div className="space-y-3">
                        <Typography variant="subtitle1" className="font-semibold">
                            Basic Information
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: "Description is required" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Expense Description *"
                                        fullWidth
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                    />
                                )}
                            />
                        </div>
                        <Typography variant="subtitle1" className="font-semibold">
                            Currency
                        </Typography>
                        <Controller
                            name="currency"
                            control={control}

                            rules={{ required: "Category is required" }}
                            render={({ field }) => (
                                <Select {...field} fullWidth>
                                    <MenuItem value="USD">USD</MenuItem>
                                    {/* <MenuItem value="INR">INR</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem> */}
                                </Select>

                            )}
                        />

                    </div>

                    {/* Amount & Date */}

                    <div className="space-y-3">
                        <Typography variant="subtitle1" className="font-semibold">
                            Amount
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

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
                            <Controller
                                name="date"
                                control={control}
                                rules={{ required: "Date is required" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Date *"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                        error={!!errors.date}
                                        helperText={errors.date?.message}
                                    />
                                )}
                            />
                        </div>
                        <Typography variant="subtitle1" className="font-semibold">
                            Category
                        </Typography>

                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} fullWidth>
                                    {data.map((category: any) => (
                                        <MenuItem key={category} value={category?.icone + " " + category?.name}>
                                            {category?.name}
                                        </MenuItem>
                                    ))}
                                    {/* <MenuItem value="INR">INR</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem> */}
                                </Select>
                            )}
                        />

                    </div>

                    {/* Additional Details */}
                    <div className="space-y-3">
                        <Typography variant="subtitle1" className="font-semibold">
                            Additional Details
                        </Typography>
                        <Controller
                            name="merchant"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Merchant/Vendor"
                                    fullWidth
                                />
                            )}
                        />
                        <div className="flex items-center justify-between">
                            <Controller
                                name="billable"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={<Checkbox {...field} checked={!!field.value} />}
                                        label="Billable to Client"
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
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Typography variant="subtitle1" className="font-semibold">
                            Tags
                        </Typography>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onDelete={() => handleRemoveTag(tag)}
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </div>
                        <div className="flex gap-2 mt-2">
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
                    </div>

                    {/* Notes */}
                    <Controller
                        name="notes"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Notes (Optional)"
                                multiline
                                rows={3}
                                fullWidth
                                className="mb-4"
                            />
                        )}
                    />

                    {/* Upload */}
                    <div className="space-y-3 border border-dashed border-gray-300 p-6 rounded-lg text-center mt-4">
                        <Upload fontSize="large" className="mx-auto text-blue-500" />
                        <Typography variant="subtitle1" className="font-semibold">
                            Upload Receipt
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Drag & drop your receipt here or click below
                        </Typography>
                        <Button
                            variant="contained"
                            component="label"
                            className="mt-3"
                            color="primary"
                        >
                            Choose File
                            <input type="file" hidden onChange={e => setFile(e.target.files?.[0] || null)} />
                        </Button>
                        {file && (
                            <Typography variant="body2" color="text.secondary" className="mt-2">
                                Selected: {file?.name}
                            </Typography>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outlined" onClick={() => onClose(false)}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={!isValid}>
                            Create Expense
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
