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
        width: 300,
        height: 180,
        bgcolor: "#1a1a1e",
        border: "1px solid #2e2e33",
        borderRadius: 2,
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "#e4e4e7",
        overflow: "hidden",
      }}
    >
      <Box>
        <Chip
          label={type}
          size="small"
          icon={iconMap[type]}
          sx={{
            bgcolor: "#3b3b45",
            color: "#fff",
            fontWeight: "bold",
            mb: 1,
            "& .MuiChip-icon": { color: "#a5b4fc" },
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
            color: "#f4f4f5",
          }}
        >
          {comment}
        </Typography>
      </Box>

      <Box mt={2} sx={{ fontSize: "12px", color: "#a1a1aa" }}>
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
