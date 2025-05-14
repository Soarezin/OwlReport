// SortableItem.tsx
import { Box, Typography, Chip } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import BugReportIcon from "@mui/icons-material/BugReport";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import ChatIcon from "@mui/icons-material/Chat";

interface SortableItemProps {
  id: string;
  comment: string;
  type?: "Erro" | "Ideia" | "Outro";
  date?: string;
}

const typeMap = {
  Erro: { label: "bug", icon: <BugReportIcon sx={{ fontSize: 14 }} />, color: "#ef4444" },
  Ideia: { label: "ideia", icon: <LightbulbIcon sx={{ fontSize: 14 }} />, color: "#10b981" },
  Outro: { label: "outro", icon: <ChatIcon sx={{ fontSize: 14 }} />, color: "#3b82f6" },
};

export function SortableItem({ id, comment, type = "Outro", date }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    cursor: "grab",
  };

  const chip = typeMap[type];

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        ...style,
        bgcolor: "#0f0f10",
        border: "1px solid #2e2e33",
        borderRadius: 1,
        p: 1.5,
        color: "#f4f4f5",
        fontSize: "14px",
        fontWeight: 500,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          fontWeight: 600,
        }}
      >
        {comment}
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        {chip && (
          <Chip
            size="small"
            icon={chip.icon}
            label={chip.label}
            sx={{
              fontSize: "11px",
              color: chip.color,
              bgcolor: "#18181b",
              border: `1px solid ${chip.color}`,
              height: 22,
              borderRadius: 1,
            }}
          />
        )}
        {date && (
          <Typography variant="caption" sx={{ fontSize: "11px", color: "#a1a1aa" }}>
            {date}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
