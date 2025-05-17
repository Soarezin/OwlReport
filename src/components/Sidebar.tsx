import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import InboxIcon from "@mui/icons-material/Inbox";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import DoneIcon from "@mui/icons-material/Done";
import TuneIcon from "@mui/icons-material/Tune";
import KeyIcon from "@mui/icons-material/VpnKey";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import HttpIcon from "@mui/icons-material/Http";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BusinessIcon from "@mui/icons-material/Business";

const drawerWidth = 260;

const sections = [
  {
    title: "Dashboard",
    items: [{ label: "Dashboard", icon: <DashboardIcon fontSize="small" /> }],
  },
  {
    title: "Reports",
    items: [
      { label: "report", icon: <InboxIcon fontSize="small" /> },
      { label: "In Progress", icon: <HourglassTopIcon fontSize="small" /> },
      { label: "Done", icon: <DoneIcon fontSize="small" /> },
    ],
  },
  {
    title: "Gerenciamento",
    items: [
      { label: "Chaves", icon: <KeyIcon fontSize="small" /> },
      { label: "Configurações", icon: <SettingsIcon fontSize="small" /> },
      { label: "Membros", icon: <PeopleIcon fontSize="small" /> },
      { label: "Webhooks", icon: <HttpIcon fontSize="small" /> },
    ],
  },
];


interface SidebarProps {
  onSelectPage: (page: string) => void;
  currentPage: string;

}

const Sidebar = ({ onSelectPage, currentPage }: SidebarProps) => {
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          bgcolor: "#111C2D",
          color: "#F1F5F9",
          boxSizing: "border-box",
          borderRight: "1px solid #334155",
        },
      }}
    >
      <Box sx={{ px: 3, py: 1, borderBottom: "1px solid #334155" }}>
        <div className="flex flex-row items-center">
          <img src="../../icons/logo.jpeg" className="w-12 h-12 mr-3" />
          <Typography variant="h6" fontWeight="bold"
            sx={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 700,
              fontSize: "24px",
              letterSpacing: "0.5px",
              color: "#F8FAFC", // texto mais claro
            }}>
            OwlReport
          </Typography>
        </div>
      </Box>

      <Divider sx={{ borderColor: "#1e1e23" }} />

      <List>
        {sections.map((section, idx) => (
          <Box key={idx} sx={{ mt: 2 }}>
            <Typography
              variant="caption"
              sx={{ color: "#9CA3AF", px: 3, mb: 1, display: "block" }}
            >
              {section.title}
            </Typography>
            {section.items.map(({ label, icon }) => {
              const pageKey = label.toLowerCase();
              const isActive = currentPage === pageKey;

              return (
                <ListItemButton
                  key={label}
                  onClick={() => onSelectPage(pageKey)}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    mb: 0.5,
                    transition: "all 0.2s",
                    bgcolor: isActive ? "#1E293B" : "transparent",
                    "&:hover": {
                      bgcolor: "#334155",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "#3B82F6" : "#9CA3AF",
                      minWidth: 32,
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      color: isActive ? "#3B82F6" : "#F1F5F9",
                      fontWeight: isActive ? "bold" : "normal",
                    }}
                  />
                </ListItemButton>
              );
            })}
          </Box>
        ))}
      </List>

      <Box sx={{ mt: "auto" }}>
        <Box sx={{ px: 2, py: 2, borderTop: "1px solid #334155", paddingBottom: 1 }}>
          <Box display="flex" alignItems="flex-start" gap={1}>
            <AccountCircleIcon sx={{ fontSize: 28, color: "#94A3B8" }} />
            <Box display="flex" flexDirection="column" justifyContent="center">
              <Typography variant="body2" color="#F1F5F9">
                <strong>{user?.name || "Guest"}</strong>
                <span style={{ margin: "0 4px" }}>•</span>
                <span style={{ color: "#94A3B8", fontWeight: 400 }}>{user?.role}</span>
              </Typography>
              <Typography
                variant="caption"
                color="#94A3B8"
                sx={{
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Sair
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" gap={1} borderTop={'1px solid #334155'} padding={2}>
        <BusinessIcon sx={{ fontSize: 20, color: '#94A3B8' }} />
        <Typography variant="caption" color="#94A3B8">
          <strong style={{ color: '#F1F5F9' }}>{user.clientName}</strong>
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;


