import React, { useState, useMemo } from 'react'
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
} from "@mui/material";
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

import {NavLink, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { removeCookieToken } from '../utils/cookiesToken';
export default function LeftSideBar() {
    const navigate = useNavigate();
      const [sidebarOpen, setSidebarOpen] = useState(true);
    //   const [rangeLabel, setRangeLabel] = useState("Last 30 days");
    const handleLogout = async() => {
      // Implement logout functionality here
      console.log("Logout clicked");
      const response=await api.post('/auth/logout');
      if(response.data.status){
        console.log("Logged out successfully");
        removeCookieToken("accessToken");
        navigate('/');
      }
    };
  return (
   <>
    <Box
        className={`flex flex-col relative  ${
          sidebarOpen ? "w-64" : "w-20"
        } bg-[#0f1724] text-white transition-all duration-300`}
      >
        <Box className="flex items-center justify-between p-4">
          <Box className="flex items-center gap-3">
            <Box
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                sidebarOpen ? "bg-blue-600" : "bg-blue-600"
              }`}
            >
              <svg width="18" height="14" viewBox="0 0 24 24" fill="none">
                <rect width="18" height="14" rx="3" fill="white" />
              </svg>
            </Box>
            {sidebarOpen && (
              <div>
                <Typography sx={{ fontWeight: 700 }}>ExpenseTracker</Typography>
                <Typography variant="caption" color="white" className="opacity-60">
                  Personal Finance
                </Typography>
              </div>
            )}
          </Box>

          <IconButton
            size="small"
            onClick={() => setSidebarOpen((s) => !s)}
            sx={{
              color: "white",
              backgroundColor: "rgba(255,255,255,0.04)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" },
            }}
            aria-label="toggle sidebar"
            className={`absolute right-0 top-0 ${sidebarOpen ? 'ml-8':'ml-2'} `}
          >
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

        <nav className="flex-1 p-4">
          <NavItem path ="dashboard" icon={<PieIcon />} label="Dashboard" open={sidebarOpen} active />
          <NavItem path ="expenses" icon={<ReceiptLong />} label="Expenses" open={sidebarOpen} />
          <NavItem path="profile" icon={<Settings />} label="Profile Settings" open={sidebarOpen} />
        </nav>

        <Box className="p-4">
          {sidebarOpen && (
            <Button variant="contained" color="primary" fullWidth startIcon={<Logout />} onClick={() => handleLogout()}>
              Logout
            </Button>
          )}
          {!sidebarOpen && (
            <Tooltip title="Logout">
              <IconButton sx={{ color: "white" }} onClick={() => handleLogout()}>
                <Logout />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
   </>
  )
}

type NavItemProps = {
  path?: string;
  icon: React.ReactNode;
  label: string;
  open: boolean;
  active?: boolean;
  badge?: React.ReactNode;
};

function NavItem({ path, icon, label, open, active = false, badge = null }: NavItemProps) {
  const content = (
    <div
      className={`flex items-center gap-3 rounded-md mb-1 cursor-pointer hover:bg-white/5`}
    >
      <div className="text-white/90">{icon}</div>
      {open && (
        <div className="flex justify-between w-full items-center">
          <Typography sx={{ color: "white", fontWeight: 600 }}>{label}</Typography>
          {badge && (
            <div className="text-xs bg-slate-800 text-white rounded-full px-2 py-0.5 opacity-80">
              {badge}
            </div>
          )}
        </div>
      )}
    </div>
  );
  if (path) {
    return (
      <NavLink
        to={path}
        className={({ isActive }) =>
          (isActive) ? 'flex items-center gap-3 rounded-md mb-1 cursor-pointer bg-blue-600/60' : 'hover:bg-gray-500'
        }
      >
        {content}
      </NavLink>
    );
  }
  return content;
}

function QuickAction({ icon, label, open }:any) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 cursor-pointer ${
        open ? "" : "justify-center"
      }`}
    >
      <div className="text-white/90">{icon}</div>
      {open && <Typography sx={{ color: "white", fontSize: 13 }}>{label}</Typography>}
    </div>
  );
}

// Inline camera icon because MUI default may not include
function CameraIconInline() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/90">
      <path d="M4 7h3l2-2h6l2 2h3v12H4z" fill="currentColor" />
      <circle cx="12" cy="13" r="3" fill="#fff" />
    </svg>
  );
}