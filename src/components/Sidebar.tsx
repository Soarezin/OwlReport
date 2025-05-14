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
  
  const drawerWidth = 260;
  
  const sections = [
    {
      title: "Dashboard",
      items: [{ label: "Dashboard", icon: <DashboardIcon fontSize="small" /> }],
    },
    {
      title: "Feedbacks",
      items: [
        { label: "Recebidos", icon: <InboxIcon fontSize="small" /> },
        { label: "In Progress", icon: <HourglassTopIcon fontSize="small" /> },
        { label: "Done", icon: <DoneIcon fontSize="small" /> },
      ],
    },
    {
      title: "Personalizar",
      items: [{ label: "Widget", icon: <TuneIcon fontSize="small" /> }],
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
  
  const Sidebar = () => {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            bgcolor: "#0c0c0f",
            color: "#e4e4e7",
            boxSizing: "border-box",
            borderRight: "1px solid #1e1e23",
          },
        }}
      >
        <Box sx={{ px: 3, py: 4 }}>
          <Typography variant="h6" fontWeight="bold">
            Teste
          </Typography>
          <Typography variant="caption" color="#6b7280">
            owner
          </Typography>
        </Box>
  
        <Divider sx={{ borderColor: "#1e1e23" }} />
  
        <List>
          {sections.map((section, idx) => (
            <Box key={idx} sx={{ mt: 2 }}>
              <Typography
                variant="caption"
                sx={{ color: "#6b7280", px: 3, mb: 1, display: "block" }}
              >
                {section.title}
              </Typography>
              {section.items.map(({ label, icon }) => (
                <ListItemButton
                  key={label}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    mb: 0.5,
                    "&:hover": {
                      bgcolor: "#1e1e23",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "#9ca3af", minWidth: 32 }}>{icon}</ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{ fontSize: 14, color: "#e4e4e7" }}
                  />
                </ListItemButton>
              ))}
            </Box>
          ))}
        </List>
  
        <Box sx={{ mt: "auto", px: 3, py: 4 }}>
          <Typography variant="caption" color="#6b7280">
            Tema • Idioma
          </Typography>
          <Box mt={1}>
            <Typography variant="body2" fontWeight="bold">
              Prevedello
            </Typography>
            <Typography variant="caption" color="#9ca3af">
              soarezin223@gmail.com
            </Typography>
          </Box>
        </Box>
      </Drawer>
    );
  };
  
  export default Sidebar;
  