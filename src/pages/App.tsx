import Dashboard from "../components/dashboard/DashBoard";

import FeedbackPanel from "../pages/FeedbackPanel";

import MainLayout from "../components/MainLayout";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useState } from "react";


const App = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "report":
        return <FeedbackPanel />;
      default:
        return <div>404 - Página não encontrada</div>;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar onSelectPage={setCurrentPage} />
      <MainLayout>{renderPage()}</MainLayout>
    </div>
  );
};

export default App;
