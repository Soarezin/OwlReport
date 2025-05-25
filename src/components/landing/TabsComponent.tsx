import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip
} from "@mui/material";
import {
  ViewKanbanRounded,
  PlayArrowRounded,
  CameraAltRounded,
  BarChartRounded
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Player from "rrweb-player";
import 'rrweb-player/dist/style.css';

const TabsComponent = () => {
  const [activeTab, setActiveTab] = useState("kanban");

  useEffect(() => {
    if (activeTab === "replay") {
      fetch("/landing/rrweb/exemploMockado.json")
        .then((res) => res.json())
        .then((data) => {
          const events = data?.rawPayload?.replay?.[0]?.events;

          if (!Array.isArray(events)) {
            throw new Error("Formato de eventos inválido.");
          }

          const safeEvents = events.filter(
            (e) => e && typeof e === "object" && "type" in e && "timestamp" in e
          );

          const target = document.getElementById("rrweb-player");
          if (!target) return;

          console.log("Eventos carregados:", safeEvents);

          new Player({
            target,
            props: {
              events: safeEvents,
              showController: true,
            },
          });
        })
        .catch((err) => {
          console.error("Erro ao carregar eventos rrweb:", err);
        });
    }
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "kanban":
        return (
          <Grid container spacing={2}>
            {/* ... conteúdo do kanban permanece o mesmo ... */}
          </Grid>
        );
      case "replay":
        return (
          <Box sx={{ backgroundColor: "#1e293b", p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="#94a3b8" mb={2}>
              Abaixo está um replay de uma sessão gravada com rrweb:
            </Typography>
            <Box
              sx={{
                backgroundColor: "#0f172a",
                borderRadius: 2,
                overflow: "hidden",
                width: "100%",
                maxWidth: 800,
                height: 500,
                mx: "auto",
              }}
            >
              <div id="rrweb-player" />
            </Box>
          </Box>
        );
      case "screenshot":
        return (
          <Typography color="#94a3b8">
            Capturas de tela automáticas durante erros críticos.
          </Typography>
        );
      case "console":
        return (
          <Typography color="#94a3b8">
            Logs de console detalhados para diagnóstico.
          </Typography>
        );
      case "network":
        return (
          <Typography color="#94a3b8">
            Monitoramento de todas as requisições HTTP em tempo real.
          </Typography>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        borderBottom={1}
        borderColor="rgba(30, 41, 59, 0.8)"
        pb={1}
        px={1}
        mb={2}
      >
        {[
          { key: "kanban", icon: <ViewKanbanRounded fontSize="small" />, label: "Kanban" },
          { key: "replay", icon: <PlayArrowRounded fontSize="small" />, label: "Replay" },
          { key: "screenshot", icon: <CameraAltRounded fontSize="small" />, label: "Screenshot" },
          { key: "console", icon: <Typography fontFamily="monospace">&gt;_</Typography>, label: "Console Logs" },
          { key: "network", icon: <BarChartRounded fontSize="small" />, label: "Network Logs" }
        ].map((tab) => (
          <Box
            key={tab.key}
            flex={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={1}
            sx={{ cursor: "pointer" }}
            color={activeTab === tab.key ? "#e2e8f0" : "#64748b"}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon}
            <Typography variant="body2">{tab.label}</Typography>
          </Box>
        ))}
      </Box>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Box px={1} py={2}>{renderTabContent()}</Box>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default TabsComponent;
