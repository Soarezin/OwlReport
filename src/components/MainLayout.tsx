import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
      }}
    >
      
        {children}
    </Box>
  );
};

export default MainLayout;
