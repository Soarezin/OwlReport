import { Box, Typography, Chip } from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ImageIcon from "@mui/icons-material/Image";

interface FeedbackCardProps {
  type: "Erro" | "Ideia" | "Outro";
  comment: string;
  author: string;
  email: string;
  date: string;
  hasScreenshot?: boolean;
}

const iconMap = {
  Erro: <BugReportIcon fontSize="small" />,
  Ideia: <BugReportIcon fontSize="small" />,
  Outro: <BugReportIcon fontSize="small" />,
};

const FeedbackCard = ({
  type,
  comment,
  author,
  email,
  date,
  hasScreenshot,
}: FeedbackCardProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: 180,
        bgcolor: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: 2,
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "#f1f5f9",
        overflow: "hidden",
        // boxShadow: "0 0 0 1px #1e3a8a",
      }}
    >
      <Box>
        <Chip
          label={type}
          size="small"
          icon={iconMap[type]}
          sx={{
            bgcolor: "#1e293b",
            color: "#f1f5f9",
            fontWeight: "bold",
            mb: 1,
            "& .MuiChip-icon": { color: "#60a5fa" },
          }}
        />

        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            fontSize: "14px",
            color: "#e2e8f0",
          }}
        >
          {comment}
        </Typography>
      </Box>

      <Box mt={2} sx={{ fontSize: "12px", color: "#94a3b8" }}>
        <Box display="flex" alignItems="center" gap={1}>
          <EmailIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption">{email}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <AccessTimeIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption">{date}</Typography>
        </Box>
        {hasScreenshot && (
          <Box display="flex" alignItems="center" gap={1}>
            <ImageIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption">Screenshot disponível</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FeedbackCard;