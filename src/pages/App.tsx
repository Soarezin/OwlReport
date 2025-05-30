import Dashboard from "../components/dashboard/DashBoard";
import FeedbackPanel from "../pages/FeedbackPanel";
import MainLayout from "../components/MainLayout";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import React, { useEffect, useState } from "react";
import LoginPage from "./LoginPage";
import UserManagement from "../components/user-management/UserManagement";
import { SnackbarProvider } from "./../components/snackbar/SnackbarContext";
import api from "../services/api";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useRef } from 'react';

interface Project {
  id: string;
  name: string;
  countOpenReports?: number;
  stage?: number;
  type?: string;
  icon?: React.ReactElement;
}

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projectsList, setProjectsList] = useState<Project[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const alreadyFetched = useRef(false);

  useEffect(() => {
    if (alreadyFetched.current) return;
      alreadyFetched.current = true;

    const fetchProjects = async () => {
      const response = await api.get("project/list-projects");
      const data: Project[] = response.data.data;

      const allProjectsItem: Project = {
        id: 'all',
        name: 'Todos os Projetos',
        type: 'Todos os Projetos',
        icon: <DashboardIcon />, // importe isso no topo
        stage: 5,
      };

      const fullList = [allProjectsItem, ...data];

      setProjectsList(fullList);
      setSelectedProject(allProjectsItem);
    };

    fetchProjects();
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <Dashboard
            selectedProject={selectedProject ?? undefined}
            onSelectProject={(project) => {
              setSelectedProject(project);
            }}
            projectsList={projectsList}
          />
        );
      case "membros":
        return <UserManagement projectsList={projectsList} />;
      default:
        return <div>404 - Página não encontrada</div>;
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginPage />
    );
  }

  return (
    <SnackbarProvider>
      <div className="flex h-screen">
        <Sidebar
          onSelectPage={setCurrentPage}
          currentPage={currentPage}
          onSelectProject={(project) => {
            setSelectedProject(project);
            if (currentPage !== "home") {
              setCurrentPage("home");
            }
          }}
          projectsList={projectsList}
          selectedProject={selectedProject}
        />
        <MainLayout>{renderPage()}</MainLayout>
      </div>
    </SnackbarProvider>

  );
};

export default App;
