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
  ListSubheader
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import HttpIcon from "@mui/icons-material/Http";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BusinessIcon from "@mui/icons-material/Business";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DevicesIcon from '@mui/icons-material/Devices';
import { JSX, useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import ModalNovoProjeto from "./projects/ModalNewProject";

const drawerWidth = 260;

const sections = [
  {
    title: "Dashboard",
    items: [{ label: "Home", icon: <DashboardIcon fontSize="small" /> }],
  },
  {
    title: "Gerenciamento",
    items: [
      { label: "Membros", icon: <PeopleIcon fontSize="small" /> },
      { label: "Webhooks", icon: <HttpIcon fontSize="small" /> },
    ],
  },
];

interface SidebarProps {
  onSelectPage: (page: string) => void;
  currentPage: string;
  onSelectProject: (project: Project) => void;
  projectsList: Project[];
  selectedProject: Project | null;
}

interface Project {
  id: string;
  name: string;
  countOpenReports?: number;
  stage?: number;
  type?: string;
  icon?: JSX.Element;
}

const Sidebar = ({ onSelectPage, currentPage, onSelectProject, projectsList, selectedProject }: SidebarProps) => {
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleSelect = (project: Project) => {
    onSelectProject(project);
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!selectedProject && projectsList.length > 0) {
      const defaultProject = projectsList.find(p => p.id === 'all') ?? projectsList[0];
      onSelectProject(defaultProject);
    }
  }, [projectsList]);

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
      icon: project.stage === 5 ? <DashboardIcon /> : <DevicesIcon />,
      stage: project.stage ?? 1,
    });

    return acc;
  }, {} as Record<string, { id: string; name: string; type: string; icon: JSX.Element, stage: number }[]>);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          bgcolor: openModal ? "#0b1120" : "#0f172a",
          color: "#F1F5F9",
          boxSizing: "border-box",
          borderRight: "1px solid #1e293b",
          transition: "background-color 0.3s ease"
        },
      }}
    >
      <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #1e293b" }}>
        <Box display="flex" alignItems="center" gap={1}>
          <img src="../../icons/logo.jpeg" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: 24 }}>
            OwlReport
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 2, py: 2 }}>
        {selectedProject && (
          <Box
            onClick={handleOpen}
            sx={{
              p: 1.5,
              backgroundColor: '#1e293b',
              border: '1px solid #38bdf86b',
              borderRadius: 1.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'background-color 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(51,65,85,0.8)'
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              {selectedProject.icon}
              <Typography fontWeight={500}>{selectedProject.name}</Typography>
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
                backgroundColor: '#1e293b',
                color: 'white',
                border: '1px solid #334155',
                borderRadius: 2,
                width: 250,
                padding: 0,
              }
            }
          }}
          MenuListProps={{ sx: { paddingTop: 0, paddingBottom: 0 } }}
        >
          {Object.entries(groupedProjects).map(([group, list]) => (
            <Box key={group}>
              <ListSubheader sx={{ color: '#94A3B8', backgroundColor: '#1e293b', px: 2, py: 1 }}>{group}</ListSubheader>
              {list.map(project => (
                <MenuItem
                  key={project.id}
                  onClick={() => handleSelect(project)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1.2,
                    px: 2,
                    '&:hover': { backgroundColor: '#334155' }
                  }}
                >
                  {project.icon}
                  <Typography>{project.name}</Typography>
                </MenuItem>
              ))}
            </Box>
          ))}
          <Divider sx={{ borderColor: '#334155' }} />
          <ListItemButton
            onClick={() => setOpenModal(true)}
            sx={{
              display: 'flex',
              gap: 1,
              py: 1.5,
              bgcolor: '#1e293b',
              '&:hover': { bgcolor: '#334155' },
              px: 2
            }}
          >
            <AddIcon fontSize="small" />
            <Typography fontSize={14}>Adicionar Projeto</Typography>
          </ListItemButton>
        </Menu>

        <ModalNovoProjeto
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSuccess={() => window.location.reload()} // ou chame uma função que refaz o fetch no App
        />
      </Box>

      <List>
        {sections.map((section, idx) => (
          <Box key={idx} sx={{ mt: 2 }}>
            <Typography variant="caption" sx={{ color: "#9CA3AF", px: 3, mb: 1, display: "block" }}>
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
                    borderRadius: 2,
                    mx: 1,
                    mb: 0.5,
                    px: 2,
                    transition: "all 0.2s",
                    bgcolor: isActive ? "#1E293B" : "transparent",
                    "&:hover": { bgcolor: "#334155" }
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? "#3B82F6" : "#9CA3AF", minWidth: 32 }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      color: isActive ? "#3B82F6" : "#F1F5F9",
                      fontWeight: isActive ? "bold" : "normal"
                    }}
                  />
                </ListItemButton>
              );
            })}
          </Box>
        ))}
      </List>

      <Box sx={{ mt: "auto", bgcolor: '#0e1629', borderTop: '1px solid #1e293b' }}>
        <Box sx={{ px: 2, py: 2 }}>
          <Box display="flex" alignItems="flex-start" gap={1}>
            <AccountCircleIcon sx={{ fontSize: 28, color: "#94A3B8" }} />
            <Box display="flex" flexDirection="column">
              <Typography variant="body2" color="#F1F5F9">
                <strong>{user?.name || "Guest"}</strong>
                <span style={{ margin: "0 4px" }}>•</span>
                <span style={{ color: "#94A3B8", fontWeight: 400 }}>{user?.role}</span>
              </Typography>
              <Typography
                variant="caption"
                color="#94A3B8"
                sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
              >
                Sair
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap={1} borderTop={'1px solid #334155'} p={2} bgcolor="#0b1320">
          <BusinessIcon sx={{ fontSize: 20, color: '#94A3B8' }} />
          <Typography variant="caption" color="#94A3B8">
            <strong style={{ color: '#F1F5F9' }}>{user?.clientName}</strong>
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;