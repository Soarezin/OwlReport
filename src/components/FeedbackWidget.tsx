import { useEffect, useRef, useState } from "react";
import * as rrweb from "rrweb";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";

const FeedbackWidget = () => {
  const [open, setOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState("Erro");
  const eventsRef = useRef<any[]>([]);
  const startTime = useRef(Date.now());

  useEffect(() => {
    rrweb.record({
      emit: (event) => eventsRef.current.push(event),
      maskAllInputs: false,
      maskInputOptions: { password: true },
    });

    window.addEventListener("beforeunload", () => {
      if (!eventsRef.current.length) return;

      const payload = {
        projectId: "demo",
        user: { id: "user-123", email: "demo@email.com" },
        meta: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          resolution: `${window.innerWidth}x${window.innerHeight}`,
          language: navigator.language,
        },
        events: eventsRef.current,
        startTime: startTime.current,
        endTime: Date.now(),
      };

      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon("http://localhost:3000/api/sessions", blob);
    });
  }, []);

  return (
    <>
      <Box
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          right: 0,
          top: "40%",
          writingMode: "vertical-rl",
          backgroundColor: "#4f46e5",
          color: "white",
          px: 1.5,
          py: 1,
          borderRadius: "8px 0 0 8px",
          fontSize: "14px",
          fontWeight: 500,
          cursor: "pointer",
          zIndex: 1300,
          transition: "opacity 0.3s",
          opacity: 0.9,
          "&:hover": { opacity: 1 },
        }}
      >
        Feedback
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "1rem",
          }}
        >
          Deixe-nos um feedback
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            bgcolor: "#18181b",
            color: "#fff",
            width: 380,
            px: 3,
            py: 2,
            borderRadius: "0 0 12px 12px",
          }}
        >
          <FormControl fullWidth sx={{ mb: 1.5 }}>
            <Select
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              variant="outlined"
              sx={{
                bgcolor: "#0f0f10",
                color: "#fff",
                "& fieldset": { borderColor: "#4f46e5" },
                "&:hover fieldset": { borderColor: "#6366f1" },
                "&.Mui-focused fieldset": { borderColor: "#6366f1" },
              }}
            >
              <MenuItem value="Erro">Erro</MenuItem>
              <MenuItem value="Ideia">Ideia</MenuItem>
              <MenuItem value="Outro">Outro</MenuItem>
            </Select>
            <Typography variant="caption" sx={{ color: "#a1a1aa", mt: 0.5 }}>
              Usaremos essa informação para categorizar seu feedback
            </Typography>
          </FormControl>

          <TextField
            fullWidth
            placeholder="Deixe-nos uma comentário"
            multiline
            rows={3}
            variant="outlined"
            sx={inputStyle}
          />
          <Typography variant="caption" sx={{ color: "#a1a1aa", mt: 0.5 }}>
            Conte-nos um pouco sobre o seu feedback
          </Typography>

          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              border: "1px solid #333",
              borderRadius: 1,
              px: 1.5,
              py: 1,
              cursor: "pointer",
              bgcolor: "#0f0f10",
            }}
          >
            <CameraAltOutlinedIcon fontSize="small" />
            <Typography variant="body2">Screenshot</Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            startIcon={<SendIcon />}
            sx={{
              mt: 2,
              bgcolor: "#6366f1",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#4f46e5" },
              textTransform: "none",
            }}
            onClick={() => {
              alert("Feedback enviado (mock)");
              setOpen(false);
            }}
          >
            Enviar feedback
          </Button>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography
              variant="caption"
              sx={{ color: "#a1a1aa", display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}
            >
              <img src="https://em-content.zobj.net/source/microsoft-teams/337/rocket_1f680.png" width="14" />
              Powered by <a href="#" style={{ color: "#a5b4fc", marginLeft: 4 }}>Owl Report</a>
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

const inputStyle = {
  mt: 1.5,
  mb: 1,
  input: { color: "#fff" },
  "& .MuiOutlinedInput-root": {
    bgcolor: "#0f0f10",
    "& fieldset": { borderColor: "#333" },
    "&:hover fieldset": { borderColor: "#6366f1" },
    "&.Mui-focused fieldset": { borderColor: "#6366f1" },
  },
};

export default FeedbackWidget;
