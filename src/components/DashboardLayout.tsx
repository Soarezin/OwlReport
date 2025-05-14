import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#0c0c0f", color: "#fff" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, px: 5, py: 4 }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{ bgcolor: "transparent", borderBottom: "1px solid #1e1e23", mb: 4 }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="#fff">
                Feedbacks
              </Typography>
              <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                Gerencie os feedbacks do projeto
              </Typography>
            </Box>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#3b82f6",
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#2563eb" },
              }}
            >
              ESCOLHER PLANO 🚀
            </Button>
          </Toolbar>
        </AppBar>

        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
