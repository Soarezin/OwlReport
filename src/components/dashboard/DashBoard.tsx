import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
} from "@mui/material";
import api from '../../services/api';
import DashboardAdmin from "./DashboardAdmin";

interface Project {
  id: string;
  name: string;
  countOpenReports?: number;
  stage?: number;
  type?: string;
  icon?: React.ReactElement;
}


const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await api.get('project/list-projects');
    const projectsList: Project[] = response.data.data;
    return projectsList;
  } catch (err) {
    console.error('Erro ao buscar projetos', err);
    return [];
  }
};

interface DashBoardProps {
  selectedProject?: Project;
}

const DashBoard = ({ selectedProject }: DashBoardProps) => {
  const [projectsList, setProjectsList] = useState<Project[]>([]);


  useEffect(() => {
    fetchProjects().then((projects) => {
      setProjectsList(projects);
    });
    console.log('selectedProject', selectedProject);
  }, [selectedProject]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", color: "#fff" }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0F172A", borderBottom: "1px solid #334155", backgroundImage: "none" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h5" fontWeight="bold" color="#fff" lineHeight={0} fontSize={20}>
            {selectedProject?.name || "Geral"}
          </Typography>
        </Toolbar>
      </AppBar>

      {selectedProject?.id === "all" ? (
        <DashboardAdmin />
      ) : (
        <Box p={4}>
          <Typography variant="body1" color="text.secondary">
            Selecione um projeto com acesso ao painel administrativo.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DashBoard;
