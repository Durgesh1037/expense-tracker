// File: src/pages/LoginPage.jsx
"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import {
    Visibility,
    VisibilityOff,
    LockOutlined,
    Google,
    Microsoft,
    Security,
    VerifiedUser,
    Shield,
    Group,
    Analytics,
    Smartphone,
    Star,
    PersonAddAlt,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import { setCookie } from "../utils/cookiesToken";
import axios from "axios";

const SigninPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            email: "sarah.wilson@company.com",
            password: "",
            remember: false,
        },
    });
    const password = watch("password");

    // 🔹 Password Strength Logic
    const getPasswordStrength = (pwd: string) => {
        if (!pwd) return "";
        const regexes = {
            strong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
            medium: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
        };
        if (regexes.strong.test(pwd)) return "strong";
        if (regexes.medium.test(pwd)) return "medium";
        return "weak";
    };
    const strength = getPasswordStrength(password);
    const getStrengthColor = () => {
        switch (strength) {
            case "strong":
                return "text-green-600";
            case "medium":
                return "text-yellow-600";
            case "weak":
                return "text-red-600";
            default:
                return "text-gray-400";
        }
    };

    const onSubmit = async (data: any) => {
        // Replace with your submit logic
        console.log("Login data:", data);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, data);
            console.log("Created:", response.data);
            toast.success("Logged in successfully!");
            setCookie({ accessToken: response?.data?.accessToken }, 1800);
            navigate("/auth/dashboard");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong, please try later!");
        }
        alert("Signed in! (placeholder)");
    };

    return (
        <Box className="flex min-h-screen bg-white ">
            {/* LEFT SECTION */}
            <Box className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 md:px-16 bg-white rounded-l-2xl shadow-xl  ">
                {/* Logo */}
                <Box className="flex items-center space-x-2 mb-8">
                    {/* <LockOutlined className="text-blue-600 bg-blue-500" /> */}
                    <Box className="bg-blue-600 p-2 rounded-full flex items-center justify-center">
                        <PersonAddAlt sx={{ color: "white" }} />
                    </Box>

                    <Typography variant="h5" className="font-bold text-gray-900">
                        ExpenseTracker
                    </Typography>
                </Box>

                {/* Welcome Text */}
                <Typography variant="h4" className="font-semibold mb-2 text-gray-800">
                    Welcome back
                </Typography>
                <Typography className="text-gray-500 mb-6 text-center">
                    Sign in to your account to continue tracking your expenses
                </Typography>

                {/* OAuth Buttons */}
                <Box className="w-full max-w-sm space-y-6">
                    <Button
                        variant="outlined"
                        startIcon={<Google />}
                        fullWidth
                        sx={{ textTransform: "none" }}
                        style={{ marginBottom: 8 }}
                    >
                        Continue with Google
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Microsoft />}
                        fullWidth
                        sx={{ textTransform: "none" }}
                        style={{ marginBottom: 8 }}
                    >
                        Continue with Microsoft
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Shield />}
                        fullWidth
                        sx={{ textTransform: "none" }}
                    >
                        Continue with SSO
                    </Button>
                </Box>

                <Divider className="my-6 w-full max-w-sm" style={{ marginBottom: 8 }}>
                    or sign in with email
                </Divider>

                {/* Email + Password */}
                <Box className="w-full max-w-sm space-y-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: "Email is required",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "Invalid email address",
                                },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email Address"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    style={{ marginBottom: 8 }}
                                />
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: "Password is required" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Password"
                                    variant="outlined"
                                    type={showPassword ? "text" : "password"}
                                    fullWidth
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    style={{ marginBottom: 8 }}
                                />
                            )}
                        />
                        {/* Password strength indicator */}
                        {strength && (
                            <Typography
                                variant="body2"
                                className={`mt-1 ml-1 ${getStrengthColor()}`}
                            >
                                Password strength:{" "}
                                {strength.charAt(0).toUpperCase() + strength.slice(1)}
                            </Typography>
                        )}
                        <Box className="flex justify-between items-center mt-2">
                            <Controller
                                name="remember"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                {...field}
                                                checked={!!field.value}
                                                size="small"
                                            />
                                        }
                                        label="Remember me"
                                    />
                                )}
                            />
                            <Typography
                                variant="body2"
                                className="text-blue-600 cursor-pointer hover:underline"
                            >
                                Forgot password?
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            type="submit"
                            sx={{
                                backgroundColor: "#2563EB",
                                textTransform: "none",
                                py: 1.5,
                                fontWeight: 600,
                            }}
                            style={{ marginBottom: 8 }}
                            disabled={!isValid}
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            Sign in to Dashboard
                        </Button>
                    </form>
                </Box>

                {/* Security Info */}
                <Box
                    className="flex items-center space-x-6 mt-8 text-sm text-gray-500"
                    style={{ marginBottom: 8 }}
                >
                    <Box className="flex items-center space-x-1">
                        <Security fontSize="small" /> <span>SSL Secured</span>
                    </Box>
                    <Box className="flex items-center space-x-1">
                        <VerifiedUser fontSize="small" /> <span>2FA Available</span>
                    </Box>
                    <Box className="flex items-center space-x-1">
                        <Shield fontSize="small" /> <span>Privacy Protected</span>
                    </Box>
                </Box>

                {/* Footer */}
                <Typography
                    className="mt-10 text-sm text-gray-500"
                    style={{ marginBottom: 8 }}
                >
                    Don’t have an account?{" "}
                    <Link to="/" className="text-blue-600 font-medium hover:underline">
                        <span className="text-blue-600 cursor-pointer hover:underline">
                            Create your free account
                        </span>
                    </Link>
                </Typography>

                <Box className="flex space-x-4 mt-6 text-xs text-gray-400">
                    <span>Help Center</span>
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                </Box>
            </Box>

            {/* RIGHT SECTION */}
            <Box className="hidden md:flex w-1/2 flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-blue-800 text-white p-10 rounded-r-2xl shadow-xl">
                <Box className="max-w-md text-center">
                    <Box className="rounded-2xl flex justify-center mb-6">
                        <img
                            src={`./dashboard.png`}
                            alt="Dashboard Preview"
                            className="rounded-xl shadow-lg"
                            width={100}
                            height={100}
                        />
                    </Box>
                    <Typography variant="h5" className="font-bold">
                        Take Complete Control of Your Financial Future
                    </Typography>
                    <Typography className="text-blue-100 text-sm">
                        Track every expense, analyze spending patterns, set budgets, and
                        achieve your financial goals with our comprehensive expense
                        management platform.
                    </Typography>

                    {/* Features */}
                    <Box className="grid grid-cols-2 gap-4 text-sm text-blue-100 mt-6">
                        <Box className="flex items-center space-x-2">
                            <Analytics fontSize="small" /> <span>Smart Analytics</span>
                        </Box>
                        <Box className="flex items-center space-x-2">
                            <Smartphone fontSize="small" /> <span>Mobile Ready</span>
                        </Box>
                        <Box className="flex items-center space-x-2">
                            <Shield fontSize="small" /> <span>Bank-Level Security</span>
                        </Box>
                        <Box className="flex items-center space-x-2">
                            <Group fontSize="small" /> <span>Team Collaboration</span>
                        </Box>
                    </Box>

                    {/* Testimonial */}
                    <Box className="bg-white/10 p-4 rounded-xl mt-8 text-left">
                        <Box className=" flex items-center space-x-2">
                            <img
                                src={`./avatar-5.png`}
                                alt="User"
                                className="w-8 h-8 rounded-full"
                            />
                            <Box>
                                <Typography className="font-bold">Sarah Wilson</Typography>
                                <Typography className="font-sm" fontSize={12}>
                                    Financial Advisor
                                </Typography>
                            </Box>
                        </Box>
                        <Typography className="text-sm mt-2 italic">
                            "ExpenseTracker transformed how I manage my finances. The insights
                            helped me save over $3,000 this year!"
                        </Typography>
                        <Box className="flex mt-2 text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} fontSize="small" />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default SigninPage;
