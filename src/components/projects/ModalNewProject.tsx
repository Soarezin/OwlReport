import React, { useState } from "react";
import axios from "axios";
import api from "../../services/api";
import {
  Modal,
  Switch,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Grid,
  Divider,
  OutlinedInput,
} from "@mui/material";

interface ModalNovoProjetoProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ModalNovoProjeto: React.FC<ModalNovoProjetoProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [projectName, setProjectName] = useState("");
  const [autoCreateCard, setAutoCreateCard] = useState(true);
  const [blockConsoleLogs, setBlockConsoleLogs] = useState(true);
  const [blockNetworkLogs, setBlockNetworkLogs] = useState(true);
  const [blockReplayLogs, setBlockReplayLogs] = useState(true);
  const [stage, setStage] = useState(4);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({
    open: false,
    type: "success",
    message: "",
  });

  const handleCloseToast = () => setToast({ ...toast, open: false });

  const STAGES = [
    { label: "Desenvolvimento", value: 1, icon: "🛠️" },
    { label: "Teste", value: 2, icon: "🧪" },
    { label: "Homologação", value: 3, icon: "✅" },
    { label: "Produção", value: 4, icon: "🚀" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName.trim()) {
      setToast({
        open: true,
        type: "error",
        message: "O nome do projeto é obrigatório.",
      });
      return;
    }

    setLoading(true);
    try {
      await api.post("/project/create-project", {
        projectName,
        autoCreateCard,
        blockConsoleLogs,
        blockNetworkLogs,
        blockReplayLogs,
        stage,
      });

      setToast({
        open: true,
        type: "success",
        message: "Projeto criado com sucesso!",
      });
      setProjectName("");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error(error);
      setToast({
        open: true,
        type: "error",
        message: "Erro ao criar o projeto.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#0f172a",
            p: 4,
            borderRadius: 4,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" mb={2} fontWeight="bold" color="#fff">
            Novo Projeto
          </Typography>

          <Stack spacing={2.2}>
            <OutlinedInput
              autoFocus
              placeholder="Nome do Projeto *"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              fullWidth
              required
              sx={{
                bgcolor: "#1e293b",
                borderRadius: 2,
                color: "#fff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#334155",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#475569",
                },
              }}
            />

            <Select
              value={stage}
              required
              onChange={(e) => setStage(Number(e.target.value))}
              fullWidth
              displayEmpty
              sx={{
                borderRadius: 2,
                bgcolor: "#1e293b",
                color: "#fff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#334155",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#475569",
                },
                "& .MuiSvgIcon-root": {
                  color: "#fff",
                },
                pl: 2,
              }}
              renderValue={() => {
                const selected = STAGES.find((s) => s.value === stage);
                return (
                  <Box display="flex" alignItems="center">
                    <span style={{ marginRight: 8 }}>{selected?.icon}</span>
                    {selected?.label}
                  </Box>
                );
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#1e293b",
                    color: "#fff",
                    borderRadius: 2,
                  },
                },
              }}
            >
              {STAGES.map(({ label, value, icon }) => (
                <MenuItem key={value} value={value}>
                  <span style={{ marginRight: 8 }}>{icon}</span>
                  {label}
                </MenuItem>
              ))}
            </Select>

            <Divider sx={{ borderColor: "#334155" }} />

            {[
              {
                label: "Criar Card Automaticamente",
                value: autoCreateCard,
                onChange: setAutoCreateCard,
                tooltip:
                  "Se ativado, um card será criado automaticamente após o projeto ser criado.",
              },
              {
                label: "Bloquear Console Logs",
                value: blockConsoleLogs,
                onChange: setBlockConsoleLogs,
                tooltip:
                  "Impede que logs do console do navegador sejam capturados.",
              },
              {
                label: "Bloquear Network Logs",
                value: blockNetworkLogs,
                onChange: setBlockNetworkLogs,
                tooltip:
                  "Impede que requisições de rede (fetch, XHR) sejam registradas.",
              },
              {
                label: "Bloquear Replay Logs",
                value: blockReplayLogs,
                onChange: setBlockReplayLogs,
                tooltip:
                  "Impede o registro de ações para reprodução visual da sessão.",
              },
            ].map((item, i) => (
              <Tooltip key={i} title={item.tooltip} placement="top-start">
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <Typography sx={{ color: "#fff", fontSize: "0.95rem" }}>
                      {item.label}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Switch
                      checked={item.value}
                      onChange={(e) => item.onChange(e.target.checked)}
                    />
                  </Grid>
                </Grid>
              </Tooltip>
            ))}

            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button
                onClick={onClose}
                disabled={loading}
                variant="text"
                sx={{ color: "#60a5fa" }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ bgcolor: "#3b82f6" }}
              >
                {loading ? <CircularProgress size={20} /> : "Salvar"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.type}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ModalNovoProjeto;
