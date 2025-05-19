import Dashboard from "../components/dashboard/DashBoard";

import FeedbackPanel from "../pages/FeedbackPanel";

import MainLayout from "../components/MainLayout";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import LoginPage from "./LoginPage";
import UserManagement from "../components/user-management/UserManagement";
import { SnackbarProvider } from "./../components/snackbar/SnackbarContext";

const App = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
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
      <Sidebar onSelectPage={setCurrentPage} currentPage={currentPage} />
      <MainLayout>{renderPage()}</MainLayout>
    </div>
    </SnackbarProvider>

  );
};

export default App;
