import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Tooltip,
} from "@mui/material";
import DashboardAdmin from "./DashboardAdmin";
import DashboardProject from "./DashboardProject";
import { UniqueIdentifier } from "@dnd-kit/core";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import KanbanBoard from "../kanban/KanbanBoard";
import FeedbackPanel from "../../pages/FeedbackPanel";

interface Project {
  id: string;
  name: string;
  countOpenReports?: number;
  stage?: number;
  type?: string;
  icon?: React.ReactElement;
}

interface DashBoardProps {
  selectedProject?: Project;
  onSelectProject: (project: Project) => void;
  projectsList: Project[];
}

type ProjectViewTab = 'overview' | 'charts';

const DashBoard = ({ selectedProject, onSelectProject, projectsList }: DashBoardProps) => {
  const [projectTab, setProjectTab] = useState<ProjectViewTab>('overview');

  // resetar a aba quando trocar de projeto
  useEffect(() => {
    setProjectTab('overview');
  }, [selectedProject]);

  const handleChangeTab = (_: React.SyntheticEvent, newValue: ProjectViewTab) => {
    setProjectTab(newValue);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", color: "#fff" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: "#0F172A", borderBottom: "1px solid #334155", backgroundImage: "none" }}
      >

        {/* Mostrar Tabs somente quando um projeto estiver selecionado */}
        {selectedProject && selectedProject.id !== 'all' && (
          <Tabs
            value={projectTab}
            onChange={handleChangeTab}
            aria-label="Tabs do projeto"
            textColor="inherit"              // herdará a cor definida em sx
            // indicatorColor remove-se para não usar o padrão do theme
            sx={{
              bgcolor: '#0F172A !important',
              px: 2,
              '& .MuiTabs-indicator': {
                height: 4,
                borderRadius: '4px 4px 0 0',
                bgcolor: '#3B82F6 !important'// ou use uma string de cor: '#38bdf8'
              },
              '& .MuiTab-root': {
                minWidth: 0,
                mx: 1,
                color: 'grey.500',
                '&.Mui-selected': {
                  color: 'primary.main',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: '4px 4px 0 0',
                }
              }
            }}
          >
            <Tab
              icon={
                <Tooltip title="Métricas" placement="bottom">
                  <DashboardIcon />
                </Tooltip>
              }
              value="overview"
            />
            <Tab
              icon={
                <Tooltip title="Quadro de Tarefas" placement="bottom">
                  <ViewKanbanIcon />
                </Tooltip>
              }
              value="charts"
            />
          </Tabs>
        )}
      </AppBar>

      {/* Se não há projeto selecionado, exibe visão administrativa */}
      {(!selectedProject || selectedProject.id === 'all') && (
        <DashboardAdmin
          onSelectProject={(projectId: UniqueIdentifier) => {
            const found = projectsList.find(p => p.id === projectId);
            if (found) onSelectProject(found);
          }}
        />
      )}

      {/* Se há projeto selecionado, exibe abas de projeto */}
      {selectedProject && selectedProject.id !== 'all' && (
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {projectTab === 'overview' && (
            <DashboardProject
              projectId={selectedProject.id}
              name={selectedProject.name}
              stage={selectedProject.stage} // ✅ agora está corretamente passando o `stage`
              key={selectedProject.stage}   // garante re-render ao mudar o stage
            />
          )}
          {projectTab === 'charts' && (
            <FeedbackPanel />
          )}
        </Box>
      )}
    </Box>
  );
};

export default DashBoard;