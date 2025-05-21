import Dashboard from "../components/dashboard/DashBoard";
import FeedbackPanel from "../pages/FeedbackPanel";
import MainLayout from "../components/MainLayout";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import React, { useEffect, useState } from "react";
import LoginPage from "./LoginPage";
import UserManagement from "../components/user-management/UserManagement";
import { SnackbarProvider } from "./../components/snackbar/SnackbarContext";

interface Project {
  id: string;
  name: string;
  countOpenReports?: number;
  stage?: number;
  type?: string;
  icon?: React.ReactElement;
}

const App = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard
            key={`${selectedProject?.id}-${selectedProject?.stage}`} // 🔁 força remount se o stage mudar
            selectedProject={selectedProject ?? undefined}
          />
        );
      case "report":
        return <FeedbackPanel />;
      case "membros":
        return <UserManagement />;
      default:
        return <div>404 - Página não encontrada</div>;
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginPage onLoginSuccess={() => setIsAuthenticated(false)} />
    );
  }

  return (
    <SnackbarProvider>

      <div className="flex h-screen">
        <Sidebar onSelectPage={setCurrentPage} currentPage={currentPage} onSelectProject={setSelectedProject} />
        <MainLayout>{renderPage()}</MainLayout>
      </div>
    </SnackbarProvider>

  );
};

export default App;
