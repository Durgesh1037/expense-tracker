// File: src/pages/ProfileSettings.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Box,
    Button,
    Typography,
    Avatar,
    IconButton,
    TextField,
    Chip,
    Divider,
    Tooltip,
} from "@mui/material";
import {
    Edit,
    CameraAlt,
    CheckCircle,
    Lock,
    VerifiedUser,
    //   Crown,
    ManageAccounts,
    Smartphone,
    Devices,
    Save,
    Email,
} from "@mui/icons-material";
import api from "../api/axios";
interface Profile {
    _id?: string | number;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
}
const ProfilePage = () => {
    const [profilePic, setProfilePic] = useState(
        "https://randomuser.me/api/portraits/women/65.jpg"
    );
    const [loading, setLoading] = useState(false);

    const queryClient = useQueryClient();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
        },
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);


    const uploadProfilePicture = async (file: File | null) => {
        if (!file) return;
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("avatar", file);
            const res = await api.put(`/me`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Profile picture uploaded:", res.data);
            // Invalidate and refetch profile data
            queryClient.invalidateQueries(["profile", "me"]);
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            alert("Failed to upload profile picture");
        } finally {
            setLoading(false);
        }
    }
    const handleUpload = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setProfilePic(URL.createObjectURL(file));
        }
        uploadProfilePicture(file);
    };

    const fetchProfile = async (): Promise<Profile | null> => {
        const res = await api.get(`/me`);
        console.log("fetchProfile response:", res);
        return res.data; // controller currently returns user doc or wrapped - controller returns user object
    };

    const {
        data: profileData,
        isLoading: isExpenseLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["profile", "me"],
        queryFn: fetchProfile,
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            console.log("✅ Profile data fetched:", data);
            const user = data?.updatedUser ?? data ?? {};
            console.log("user.name", user.name?.split(" ")[0])
            reset({
                firstName: user.firstName || user.name?.split(" ")[0] || "",
                lastName: user.lastName || user.name?.split(" ")[1] || "",
                phone: user.phone || "",
                email: user.email || "",
            });
            if (user.avatarUrl) setProfilePic(user.avatarUrl);
        },
    });




    useEffect(() => {
        console.log("useEffect triggered with profileData:", profileData);
        if (profileData) {
            const user = profileData;
            console.log("Resetting form with expense data:", user);
            reset({
                // backend stores description -> map to information field
                firstName: user?.firstName || user.name?.split(" ")[0] || "",
                lastName: user?.lastName || user.name?.split(" ")[1] || "",
                phone: user?.phone || "",
                email: user?.email || "",
            });

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileData]);



    const updateProfileFn = async (formData: FormData) => {
        const res = await api.put(`/me/information`, formData);
        return res.data;
    };

    const mutation = useMutation({
        mutationFn: updateProfileFn,
        onSuccess: (data) => {
            queryClient.invalidateQueries(["profile", "me"]);
            // if backend returns updatedUser, update local UI
            const user = data?.updatedUser || data;
            if (user?.avatarUrl) setProfilePic(user.avatarUrl);
            alert("Profile updated successfully");
        },
        onError: (err: any) => {
            console.error(err);
            alert("Failed to update profile");
        },
    });
    const savingOrLoading = loading || isExpenseLoading;

    const onSubmit = (values: any) => {
        const fd = new FormData();
        fd.append("firstName", values.firstName || "");
        fd.append("lastName", values.lastName || "");
        fd.append("phone", values.phone || "");
        if (selectedFile) fd.append("avatar", selectedFile);
        // backend expects avatar as single file field named 'avatar' and uses multer.single('avatar')
        mutation.mutate(fd);
    };

    return (
        <Box className="p-6 md:p-10 bg-gray-50 min-h-screen">
            {/* Header */}
            <Box className="flex justify-between items-center mb-8">
                <Box>
                    <Typography variant="h5" className="font-bold text-gray-800">
                        Profile Settings
                    </Typography>
                    <Typography className="text-gray-500">
                        Manage your account information and preferences
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSubmit(onSubmit)}
                    disabled={mutation.isLoading}
                    sx={{
                        backgroundColor: "#2563EB",
                        textTransform: "none",
                        py: 1,
                        px: 3,
                        borderRadius: "0.5rem",
                    }}
                >
                    {mutation.isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </Box>

            {/* Account Overview */}
            <Box className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
                <Typography variant="h6" className="font-semibold mb-1 text-gray-800">
                    Account Overview
                </Typography>
                <Typography className="text-gray-500 mb-6">
                    Your profile summary and quick stats
                </Typography>

                <Box className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Profile Picture */}
                    <Box className="flex flex-col items-center text-center">
                        <Box className="relative">
                            <Avatar
                                src={profilePic}
                                sx={{ width: 100, height: 100 }}
                                alt="Profile"
                            />
                            <label htmlFor="upload-photo">
                                <input
                                    id="upload-photo"
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleUpload}
                                />
                                <Tooltip title="Change Profile Picture">
                                    <IconButton
                                        component="span"
                                        className="absolute bottom-0 right-0 bg-blue-600 text-white shadow-md"
                                        size="small"
                                    >
                                        <CameraAlt fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </label>
                        </Box>
                        <Typography variant="h6" className="mt-2 font-semibold">
                            {profileData?.name}
                        </Typography>
                        <Typography className="text-gray-500 text-sm mb-2">
                            Premium Member since 2023
                        </Typography>

                    </Box>

                    {/* Stats */}
                    <Box className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center flex-1">
                        <Box>
                            <Typography className="text-gray-800 font-semibold text-xl">
                                1,247
                            </Typography>
                            <Typography className="text-gray-500 text-sm">
                                Total Expenses
                            </Typography>
                        </Box>
                        <Box>
                            <Typography className="text-gray-800 font-semibold text-xl">
                                $18,432
                            </Typography>
                            <Typography className="text-gray-500 text-sm">
                                Total Spent
                            </Typography>
                        </Box>
                        <Box>
                            <Typography className="text-gray-800 font-semibold text-xl">
                                23
                            </Typography>
                            <Typography className="text-gray-500 text-sm">
                                Categories
                            </Typography>
                        </Box>
                        <Box>
                            <Typography className="text-gray-800 font-semibold text-xl">
                                347
                            </Typography>
                            <Typography className="text-gray-500 text-sm">
                                Days Active
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider className="my-6" />

                {/* Status Badges */}
                <Box className="flex flex-wrap items-center gap-3 mb-3">
                    <Chip
                        icon={<CheckCircle fontSize="small" />}
                        label="Verified Account"
                        color="success"
                        variant="outlined"
                    />
                    <Chip
                        // icon={<Crown fontSize="small" />}
                        label="Premium"
                        color="secondary"
                        variant="outlined"
                    />
                </Box>

                {/* Security Info */}
                <Box className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 mt-3">
                    <VerifiedUser className="text-green-600" />
                    <Typography className="text-sm text-green-800">
                        Two-factor authentication enabled • Last login: Today at 9:23 AM
                    </Typography>
                </Box>
            </Box>

            {/* Main Content */}
            <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Personal Info */}
                <Box className="bg-white rounded-2xl p-6 shadow-sm md:col-span-2">
                    <Box className="flex justify-between items-center mb-4">
                        <Typography variant="h6" className="font-semibold text-gray-800">
                            Personal Information
                        </Typography>
                        <Tooltip title="Edit Info">
                            <IconButton>
                                <Edit className="text-blue-600" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Typography className="text-gray-500 mb-4">
                        Update your personal details and contact information
                    </Typography>

                    {/* Form Fields */}
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <Controller
                            name="firstName"
                            control={control}
                            rules={{ required: "firstname is required" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Full Name"
                                    fullWidth
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
                                />
                            )}
                        />
                        <Controller
                            name="lastName"
                            control={control}
                            rules={{ required: "lastname is required" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Last Name"
                                    fullWidth
                                    error={!!errors.lastName}
                                    helperText={errors.lastName?.message}
                                />
                            )}
                        />

                        <Box>
                            <Controller
                                name="email"
                                control={control}
                                rules={{ required: "email is required" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="email"
                                        fullWidth
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                )}
                            />
                        </Box>

                        <Box>
                            <Controller
                                name="phone"
                                control={control}
                                rules={{ required: "phone is required" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="phone"
                                        fullWidth
                                        error={!!errors.phone}
                                        helperText={errors.phone?.message}
                                    />
                                )}
                            />
                            <Typography className="text-gray-500 text-xs mt-1">
                                Used for account recovery and notifications
                            </Typography>
                        </Box>
                    </Box>
                    <div className="flex justify-end gap-3 mt-6">
                        {/* <Button variant="outlined" onClick={onClose}>
                                Cancel
                              </Button> */}
                        <Button
                            variant="contained"
                            onClick={handleSubmit(onSubmit)}
                            disabled={savingOrLoading || !isValid}
                        >
                            {"Save Changes"}
                        </Button>
                    </div>
                </Box>

                {/* Security Settings */}
                <Box className="bg-white rounded-2xl p-6 shadow-sm">
                    <Box className="flex items-center gap-2 mb-4">
                        <Lock className="text-blue-600" />
                        <Typography variant="h6" className="font-semibold text-gray-800">
                            Security Settings
                        </Typography>
                    </Box>

                    <Box className="flex flex-col gap-4">
                        {/* Password */}
                        <Box className="border rounded-xl p-4">
                            <Box className="flex justify-between items-center">
                                <Typography className="font-medium">Password</Typography>
                                <Typography className="text-blue-600 text-sm cursor-pointer">
                                    Change
                                </Typography>
                            </Box>
                            <Typography className="text-sm text-gray-500 mt-1">
                                Last changed 30 days ago
                            </Typography>
                        </Box>

                        {/* 2FA */}
                        <Box className="border rounded-xl p-4 bg-green-50">
                            <Box className="flex justify-between items-center">
                                <Typography className="font-medium">Two-Factor Auth</Typography>
                                <Typography className="text-blue-600 text-sm cursor-pointer">
                                    Manage
                                </Typography>
                            </Box>
                            <Typography className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                <Smartphone fontSize="small" /> Enabled via SMS
                            </Typography>
                        </Box>

                        {/* Active Sessions */}
                        <Box className="border rounded-xl p-4">
                            <Box className="flex justify-between items-center">
                                <Typography className="font-medium">Active Sessions</Typography>
                                <Typography className="text-blue-600 text-sm cursor-pointer">
                                    View All
                                </Typography>
                            </Box>
                            <Typography className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                <Devices fontSize="small" /> 3 devices logged in
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ProfilePage;
