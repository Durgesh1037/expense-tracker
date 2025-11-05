"use client";
import React, { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Box,
    Button,
    Container,
    Grid,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    Divider,
    LinearProgress,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import {
    Visibility,
    VisibilityOff,
    Google as GoogleIcon,
    GitHub as GitHubIcon,
    CheckCircle,
    Cancel,
    PersonAddAlt,
    InsertChartOutlined,
    Security,
    PhoneAndroid,
    CloudQueue,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from 'react-toastify';
import { setCookie } from "../utils/cookiesToken";
import axios from "axios";


const RULES = [
    { id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
    { id: "uppercase", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { id: "number", label: "One number", test: (p) => /[0-9]/.test(p) },
    { id: "special", label: "One special character", test: (p) => /[!@#$%^&*(),.?\":{}|<>]/.test(p) },
];

// (No Grid aliases required) Use MUI Grid directly.

export default function SignupPage() {
  const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { control, handleSubmit, watch, formState: { errors, isValid } } = useForm({
        mode: "onChange",
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            tos: false,
            marketing: false,
            twoFA: false,
        },
    });

    const password = watch("password");
    const confirmPassword = watch("confirmPassword");

    const passwordChecks = useMemo(() => {
        const p = password || "";
        return RULES.map((r) => ({ ...r, ok: r.test(p) }));
    }, [password]);

    const passwordScore = useMemo(() => {
        const okCount = passwordChecks.filter((r) => r.ok).length;
        return (okCount / RULES.length) * 100;
    }, [passwordChecks]);

    const passwordStrengthLabel = useMemo(() => {
        if (!password) return "Weak";
        if (passwordScore === 100) return "Strong";
        if (passwordScore >= 50) return "Moderate";
        return "Weak";
    }, [password, passwordScore]);



    // Placeholder social handlers
    const handleGoogle = () => console.log("Google OAuth placeholder");
    const handleGithub = () => console.log("GitHub OAuth placeholder");
    const handleSSO = () => console.log("SSO placeholder");


    const onSubmit = async (data: any) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, data);
            console.log('Created:', response.data);
            toast.success('Account created successfully!');
            setCookie({ accessToken:response?.data?.accessToken }, 1800);
            navigate('/auth/dashboard');
        } catch (error) {
            console.error(error);
            toast.error('Error creating account. Please try again.');
        }
    };

    return (
        <Box className="min-h-screen flex flex-col items-center py-8">
            {/* Header */}
            <Container maxWidth="lg" className="flex items-center justify-between">
                <Box className="flex items-center gap-3">
                    <Box className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow">
                        <PersonAddAlt sx={{ color: "white" }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            ExpenseTracker
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Personal Finance Management
                        </Typography>
                    </Box>
                </Box>

                <Box className="hidden md:flex gap-6 items-center">
                    <Button variant="text">Features</Button>
                    <Button variant="text">Pricing</Button>
                    <Button variant="text">Support</Button>
                    <Button variant="text" sx={{ color: "primary.main", fontWeight: 600 }}>
                        Sign In
                    </Button>
                </Box>
            </Container>

            {/* Hero */}
            <Container maxWidth="md" className="text-center mt-8">
                <Typography variant="h4" sx={{ fontWeight: 800 }} gutterBottom>
                    Take Control of Your Financial Future
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: "auto" }}>
                    Join thousands of users who have transformed their spending habits with our comprehensive expense tracking platform. Start your journey to financial freedom today.
                </Typography>
            </Container>

            {/* Main card */}
            <Container maxWidth="lg" className="mt-10">
                <Box className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <Grid container>
                        {/* Left: Form */}
                        <Grid size={6} className="bg-white p-8 md:p-10">
                            <Box className="flex flex-col items-start">
                                <Box className="mb-6 text-center w-full flex flex-col items-center">
                                    <Box className="bg-blue-600 p-2 rounded-xl flex items-center justify-center">
                                        <PersonAddAlt sx={{ color: "white" }} />

                                    </Box>
                                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                        Create Your Account
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 4 }}>
                                        Start your 14-day free trial today
                                    </Typography>
                                </Box>

                                {/* Social Buttons */}
                                <Box className="flex flex-col gap-4 w-full">
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        startIcon={<GoogleIcon />}
                                        onClick={handleGoogle}
                                        sx={{ textTransform: "none", py: 1.25, borderRadius: 2 }}
                                    >
                                        Continue with Google
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        startIcon={<GitHubIcon />}
                                        onClick={handleGithub}
                                        sx={{ textTransform: "none", py: 1.25, borderRadius: 2 }}
                                    >
                                        Continue with GitHub
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        startIcon={<Security />}
                                        onClick={handleSSO}
                                        sx={{ textTransform: "none", py: 1.25, borderRadius: 2 }}
                                    >
                                        Continue with SSO
                                    </Button>
                                </Box>

                                <Divider sx={{ width: "100%", my: 5 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        or sign up with email
                                    </Typography>
                                </Divider>

                                <Box component="form" onSubmit={handleSubmit(onSubmit)} className="w-full">
                                    <Grid container spacing={2}>
                                        <Grid size={6}>
                                            <Controller
                                                name="firstName"
                                                control={control}
                                                rules={{ required: "First name is required" }}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="First Name *"
                                                        fullWidth
                                                        size="small"
                                                        error={!!errors.firstName}
                                                        helperText={errors.firstName?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={6}>
                                            <Controller
                                                name="lastName"
                                                control={control}
                                                rules={{ required: "Last name is required" }}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Last Name *"
                                                        fullWidth
                                                        size="small"
                                                        error={!!errors.lastName}
                                                        helperText={errors.lastName?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <Controller
                                                name="email"
                                                control={control}
                                                rules={{
                                                    required: "Email is required",
                                                    pattern: {
                                                        value: /\S+@\S+\.\S+/, message: "Invalid email address"
                                                    }
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Email Address *"
                                                        fullWidth
                                                        size="small"
                                                        placeholder="john.doe@example.com"
                                                        error={!!errors.email}
                                                        helperText={errors.email?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <Controller
                                                name="phone"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Phone Number"
                                                        fullWidth
                                                        size="small"
                                                        placeholder="+1 (555) 123-4567"
                                                    />
                                                )}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                Optional - for account recovery and notifications
                                            </Typography>
                                        </Grid>
                                        <Grid size={12}>
                                            <Controller
                                                name="password"
                                                control={control}
                                                rules={{
                                                    required: "Password is required",
                                                    validate: {
                                                        length: v => v.length >= 8 || "At least 8 characters",
                                                        uppercase: v => /[A-Z]/.test(v) || "One uppercase letter",
                                                        number: v => /[0-9]/.test(v) || "One number",
                                                        special: v => /[!@#$%^&*(),.?":{}|<>]/.test(v) || "One special character"
                                                    }
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Password *"
                                                        fullWidth
                                                        size="small"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Create a strong password"
                                                        error={!!errors.password}
                                                        helperText={errors.password?.message}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                            {/* Password strength bar */}
                                            <Box className="mt-3">
                                                <Box className="flex items-center justify-between">
                                                    <Typography variant="caption" color="text.secondary">
                                                        Password strength: {passwordStrengthLabel}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {Math.round(passwordScore)}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={passwordScore}
                                                    sx={{
                                                        height: 6,
                                                        borderRadius: 2,
                                                        mt: 1,
                                                        backgroundColor: "rgba(0,0,0,0.06)",
                                                    }}
                                                />
                                            </Box>
                                            <Box className="mt-3 space-y-1">
                                                {passwordChecks.map((r) => (
                                                    <Box key={r.id} className="flex items-center gap-2">
                                                        {r.ok ? (
                                                            <CheckCircle fontSize="small" sx={{ color: "success.main" }} />
                                                        ) : (
                                                            <Cancel fontSize="small" sx={{ color: "error.main" }} />
                                                        )}
                                                        <Typography variant="caption" color="text.secondary">
                                                            {r.label}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Grid>
                                        <Grid size={12}>
                                            <Controller
                                                name="confirmPassword"
                                                control={control}
                                                rules={{
                                                    required: "Confirm your password",
                                                    validate: v => v === password || "Passwords do not match"
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Confirm Password *"
                                                        fullWidth
                                                        size="small"
                                                        type={showConfirm ? "text" : "password"}
                                                        error={!!errors.confirmPassword}
                                                        helperText={errors.confirmPassword?.message}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton onClick={() => setShowConfirm((s) => !s)} edge="end">
                                                                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <Controller
                                                name="tos"
                                                control={control}
                                                rules={{ required: "You must agree to the terms" }}
                                                render={({ field }) => (
                                                    <FormControlLabel
                                                        control={<Checkbox {...field} checked={!!field.value} />}
                                                        label={
                                                            <Typography variant="body2">
                                                                I agree to the{" "}
                                                                <a href="#" className="text-blue-600 underline">
                                                                    Terms of Service
                                                                </a>{" "}
                                                                and{" "}
                                                                <a href="#" className="text-blue-600 underline">
                                                                    Privacy Policy
                                                                </a>
                                                            </Typography>
                                                        }
                                                    />
                                                )}
                                            />
                                            {errors.tos && (
                                                <Typography variant="caption" color="error">
                                                    {errors.tos.message}
                                                </Typography>
                                            )}
                                            <Box className="mt-2">
                                                <Controller
                                                    name="marketing"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormControlLabel
                                                            control={<Checkbox {...field} checked={!!field.value} />}
                                                            label={<Typography variant="body2">I would like to receive marketing emails about new features and updates</Typography>}
                                                        />
                                                    )}
                                                />
                                                <Controller
                                                    name="twoFA"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormControlLabel
                                                            control={<Checkbox {...field} checked={!!field.value} />}
                                                            label={<Typography variant="body2">Enable two-factor authentication for enhanced security (recommended)</Typography>}
                                                        />
                                                    )}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid size={12}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                size="large"
                                                type="submit"
                                                disabled={!isValid}
                                                sx={{ borderRadius: 3, textTransform: "none", py: 1.4 }}
                                            >
                                                Create Account
                                            </Button>
                                        </Grid>
                                        <Grid size={12} className="text-center">
                                            <Typography variant="body2" className="flex justify-center">
                                                Already have an account?{" "}
                                                <Link to="/login" className="text-blue-600 underline">
                                                    Sign in
                                                </Link>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Right: Info panel */}
                        <Grid
                            size={6}
                            className="text-white"
                            sx={{
                                background: "linear-gradient(180deg,#2f6ef7 0%, #1f4bd8 100%)",
                                p: 6,
                                display: "flex",
                                // flexDirection: "column",
                                justifyContent: "center",
                            }}
                        >
                            <Box className="flex flex-col items-center md:items-start text-center md:text-left">
                                <Box className=" rounded-lg p-3 mb-2 flex flex-col items-center justify-center">
                                    <InsertChartOutlined sx={{ color: "white" }} className="bg-blue-500" />
                                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                                        Start Your Financial Journey
                                    </Typography>
                                    <Typography variant="body2" sx={{ maxWidth: 420, mb: 5 }}>
                                        Join thousands of users who have transformed their spending habits and achieved their financial goals.
                                    </Typography>
                                </Box>


                                <Box className="space-y-5 w-full">
                                    <FeatureRow icon={<Security />} title="Bank-Level Security" desc="Your financial data is protected with 256-bit encryption and multi-factor authentication." />
                                    <FeatureRow icon={<PhoneAndroid />} title="Mobile & Desktop" desc="Access your expenses anywhere with our responsive web app and mobile companion." />
                                    <FeatureRow icon={<InsertChartOutlined />} title="Smart Analytics" desc="Get insights into your spending patterns with AI-powered categorization and trends." />
                                    <FeatureRow icon={<CloudQueue />} title="Cloud Backup" desc="Never lose your data with automatic cloud backups and cross-device synchronization." />
                                </Box>

                                <Box className="mt-8">
                                    <Box sx={{ background: "rgba(255,255,255,0.12)", p: 3, borderRadius: 2, width: 320 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: "white", textAlign: "center" }}>
                                            14 Days Free
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "white", textAlign: "center" }}>
                                            Then $9.99/month
                                        </Typography>
                                        <Box className="flex items-center justify-center gap-2 mt-2 text-white/80">
                                            <CheckCircle fontSize="small" />
                                            <Typography variant="caption">Cancel anytime, no commitment</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}

function FeatureRow({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <Box className="flex gap-3 items-start">
            <Box sx={{ background: "rgba(255,255,255,0.12)", p: 1.25, borderRadius: 1 }}>{icon}</Box>
            <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                    {desc}
                </Typography>
            </Box>
        </Box>
    );
}
