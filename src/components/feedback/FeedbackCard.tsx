import { Box, Typography, Chip, Tooltip, IconButton } from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { JSX } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React from "react";

interface ListReport {
  id: string;
  pageUrl: string;
  userComment?: string;
  category: string;
  severity: string;
  status: string;
  createdAt: string;
  statusId: string;
}


const iconMap: Record<string, JSX.Element> = {
  "Error": <BugReportIcon fontSize="small" />,
  "Suggestion": <LightbulbIcon fontSize="small" />,
};


function getColoredIcon(category: string, severity: string): JSX.Element | null {
  const icon = iconMap[category];
  const color = severityColor(severity);

  if (!icon || !color) return null;

  return React.cloneElement(icon, {
    sx: { color }
  });
}



const severityColor = (type: string) => {
  switch (type) {
    case "Low":
      return "#16a34a";
    case "Medium":
      return "#ca8a04";
    case "High":
      return "#ea580c";
    case "Critical":
      return "#e11d48";
    case "NoImpact":
      return "#38bdf8"
    default:
      return "#64748b";
  }
};

const translateSeverity = (severity: string) => {
  switch (severity) {
    case "Low":
      return "Baixa";
    case "Medium":
      return "Média";
    case "High":
      return "Alta";
    case "Critical":
      return "Crítica";
    case "NoImpact":
      return "Sem Impacto";
    default:
      return severity;
  }
};

const FeedbackCard = ({
  id,
  pageUrl,
  userComment,
  category,
  severity,
  status,
  createdAt,
  statusId,
}: ListReport) => {
  const navigate = useNavigate();
  const date = new Date(createdAt);
  const formattedDate = !isNaN(date.getTime())
    ? date.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    })
    : "Data inválida";

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 2,
        bgcolor: "#0f172a",
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "#f1f5f9",
        maxHeight: 125,
        gap: 1,
        boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        border: `1px solid ${severityColor(severity)}55`,
        '&:hover': {
          backgroundColor: "#273549",
          transition: 'background-color 0.2s ease-in-out',
        },
        cursor: "grab",
      }}
    >
      {/* Cabeçalho */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {getColoredIcon(category, severity)}
        <Chip
          label={translateSeverity(severity)}
          size="small"
          sx={{
            bgcolor: `${severityColor(severity)}22`,
            color: severityColor(severity),
            fontWeight: 700,
            fontSize: "11px",
            borderRadius: "8px",
            height: 24,
            px: 1.2,
          }}
        />
      </Box>

      {/* Comentário */}
      <Typography
        variant="body2"
        sx={{
          margin: '0 !important',
          mb: 1,
          fontSize: 13,
          color: "#e2e8f0",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
        }}
      >
        {userComment || "(Sem comentário)"}
      </Typography>

      {/* Rodapé */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={0.5}>
          <AccessTimeIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
          <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: 11 }}>
            {formattedDate}
          </Typography>
        </Box>
        <IconButton
          onPointerUp={(e) => {
            e.stopPropagation();
            setTimeout(() => navigate(`/report-detail/${id}`), 0);
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default FeedbackCard;
