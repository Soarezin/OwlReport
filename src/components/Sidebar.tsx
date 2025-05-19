import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
  MenuItem,
  Menu,
  IconButton,
  ListSubheader
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import InboxIcon from "@mui/icons-material/Inbox";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import DoneIcon from "@mui/icons-material/Done";
import KeyIcon from "@mui/icons-material/VpnKey";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import HttpIcon from "@mui/icons-material/Http";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BusinessIcon from "@mui/icons-material/Business";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import AddIcon from '@mui/icons-material/Add';
import DevicesIcon from '@mui/icons-material/Devices';
import { JSX, useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const drawerWidth = 260;

const sections = [
  {
    title: "Dashboard",
    items: [{ label: "Dashboard", icon: <DashboardIcon fontSize="small" /> }],
  },
  // {
  //   title: "Reports",
  //   items: [
  //     { label: "report", icon: <InboxIcon fontSize="small" /> },
  //     { label: "In Progress", icon: <HourglassTopIcon fontSize="small" /> },
  //     { label: "Done", icon: <DoneIcon fontSize="small" /> },
  //   ],
  // },
  {
    title: "Gerenciamento",
    items: [
      // { label: "Configurações", icon: <SettingsIcon fontSize="small" /> },
      { label: "Membros", icon: <PeopleIcon fontSize="small" /> },
      // { label: "Chaves", icon: <KeyIcon fontSize="small" /> },
      { label: "Webhooks", icon: <HttpIcon fontSize="small" /> },
    ],
  },
];

interface SidebarProps {
  onSelectPage: (page: string) => void;
  currentPage: string;
}

interface Project {
  id: string;
  name: string;
  countOpenReports?: number;
  stage?: number;
  type?: string;
  icon?: JSX.Element;
}
  
  
const Sidebar = ({ onSelectPage, currentPage }: SidebarProps) => {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [projectsList, setProjectsList] = useState<Project[]>([]);
    const [selected, setSelected] = useState<any>(null);
    const navigate = useNavigate();

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleSelect = (project: any) => {
    setSelected(project);
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('project/list-projects');
        const data: Project[] = response.data.data;

        const allProjectsItem: Project = {
          id: 'all',
          name: 'Todos os Projetos',
          type: 'Visão Geral',
          icon: <DashboardIcon />,
          stage: 5,
        };

        setProjectsList([allProjectsItem, ...data]);
        setSelected(allProjectsItem);

      } catch (err) {
        console.error('Erro ao buscar projetos', err);
      }
    };

    fetchProjects();
  }, []);

  const groupedProjects = projectsList.reduce((acc, project) => {
    const stageMap: Record<number, string> = {
      1: 'Desenvolvimento',
      2: 'Teste',
      3: 'Homologação',
      4: 'Produção',
      5: 'Visão Geral'
    };

    const stage = project.id === 'all' ? 'Visão Geral' : stageMap[project.stage ?? 1] || 'Desenvolvimento';

    if (!acc[stage]) acc[stage] = [];

    acc[stage].push({
      id: project.id,
      name: project.name,
      type: project.type || "Web app",
      icon: project.stage === 5 ? <DashboardIcon /> : <DevicesIcon />
    });

    return acc;
  }, {} as Record<string, { id: string; name: string; type: string; icon: JSX.Element }[]>);
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
              color: "#F8FAFC",
            }}>
            OwlReport
          </Typography>
        </div>
      </Box>

      <Divider sx={{ borderColor: "#1e1e23" }} />

      <Box sx={{ px: 2, py: 2 }}>
        {selected && (
          <Box onClick={handleOpen} sx={{ p: 2, px: 2, backgroundColor: '#0F172A', border: '1px solid #2d394d', borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 280 }}>
            <Box display="flex" alignItems="center" gap={1} bgcolor={'#0F172A'}>
              {selected.icon}
              <Box>
                <Typography color="white">{selected.name}</Typography>
              </Box>
            </Box>
            <ExpandMoreIcon sx={{ color: '#94A3B8' }} />
          </Box>
        )}

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: '#0F172A',
                color: 'white',
                border: '1px solid #334155',
                borderRadius: 2,
                width: 250,
                padding: 0,
              }
            }
          }}
          MenuListProps={{
            sx: {
              paddingTop: 0,
              paddingBottom: 0
            }
          }}
        >
          {Object.entries(groupedProjects).map(([group, list]) => (
            <Box key={group} bgcolor={'#0F172A'}>
              <ListSubheader sx={{ color: '#94A3B8', backgroundColor: '#0F172A', paddingTop: 2, paddingBottom: 2, lineHeight: 0 }}>{group}</ListSubheader>
              {list.map(project => (
                <MenuItem key={project.id} onClick={() => handleSelect(project)} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5, '&:hover': { backgroundColor: '#334155' } }}>
                  {project.icon}
                  <Box>
                    <Typography color="white">{project.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Box>
          ))}
          <Divider sx={{ borderColor: '#334155' }} />
          <MenuItem onClick={() => alert("Adicionar produto")} sx={{ display: 'flex', gap: 1, py: 1.5, bgcolor:'#0F172A' }}>
            <AddIcon fontSize="small" />
            <Box>
              <Typography color="white" fontSize={14}>Adicionar Projeto</Typography>
            </Box>
          </MenuItem>
        </Menu>
      </Box>

      <List>
        {sections.map((section, idx) => (
          <Box key={idx} sx={{ mt: 2 }}>
            <Typography variant="caption" sx={{ color: "#9CA3AF", px: 3, mb: 1, display: "block" }}>{section.title}</Typography>
            {section.items.map(({ label, icon }) => {
              const pageKey = label.toLowerCase();
              const isActive = currentPage === pageKey;
              return (
                <ListItemButton key={label} onClick={() => onSelectPage(pageKey)} sx={{ borderRadius: 1, mx: 1, mb: 0.5, transition: "all 0.2s", bgcolor: isActive ? "#1E293B" : "transparent", "&:hover": { bgcolor: "#334155" } }}>
                  <ListItemIcon sx={{ color: isActive ? "#3B82F6" : "#9CA3AF", minWidth: 32 }}>{icon}</ListItemIcon>
                  <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, color: isActive ? "#3B82F6" : "#F1F5F9", fontWeight: isActive ? "bold" : "normal" }} />
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
              <Typography variant="caption" color="#94A3B8" sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }} onClick={() => {
                localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login");}}>
                Sair
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap={1} borderTop={'1px solid #334155'} padding={2}>
          <BusinessIcon sx={{ fontSize: 20, color: '#94A3B8' }} />
          <Typography variant="caption" color="#94A3B8" lineHeight={0}>
            <strong style={{ color: '#F1F5F9' }}>{user?.clientName}</strong>
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
