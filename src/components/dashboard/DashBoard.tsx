import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

const DashBoard = () => {
  return (
      <Box sx={{ display: "flex", height: "100vh", bgcolor: "#1E293B", color: "#fff" }}>
          <AppBar
            position="static"
            elevation={0}
            sx={{ bgcolor: "transparent", borderBottom: "1px solid #1e1e23", mb: 4 }}
          >
            <Toolbar sx={{ justifyContent: "space-between", backgroundColor: "transparent" }}>
              <Box sx={{backgroundColor: "transparent" }}>
                <Typography variant="h5" fontWeight="bold" color="#fff">
                  DashBoard
                </Typography>
                <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                  Gerencie Seus Projetos
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>
      </Box>
  );
};

export default DashBoard;
