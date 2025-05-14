// FeedbackBoardDnD.tsx
import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, Typography } from "@mui/material";
import { SortableItem } from "./SortableItem";
import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const initialColumns = [
  {
    id: "Recebidos",
    icon: <MarkChatUnreadIcon sx={{ fontSize: 16 }} />,
  },
  {
    id: "Em progresso",
    icon: <BuildCircleIcon sx={{ fontSize: 16 }} />,
  },
  {
    id: "Concluídos",
    icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
  },
];

const defaultFeedbacks = [
  {
    id: "1",
    comment: "Bug ao clicar salvar.",
    status: "Recebidos",
    type: "Erro",
    date: "há 3 dias",
  },
  {
    id: "2",
    comment: "Adicionar exportar PDF.",
    status: "Em progresso",
    type: "Ideia",
    date: "há 2 dias",
  },
  {
    id: "3",
    comment: "Amei a nova UI.",
    status: "Concluídos",
    type: "Outro",
    date: "há 1 dia",
  },
];

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: "column", columnId: id },
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        minWidth: 260,
        maxWidth: 260,
        flexShrink: 0,
        border: "1px solid #26262d",
        borderRadius: 2,
        bgcolor: isOver ? "#1f2937" : "#1a1a1e",
        p: 2,
        transition: "background-color 0.2s ease-in-out",
      }}
    >
      {children}
    </Box>
  );
}

export default function FeedbackBoardDnD() {
  const [feedbacks, setFeedbacks] = useState(defaultFeedbacks);

  useEffect(() => {
    const saved = localStorage.getItem("feedbacks");
    if (saved) {
      setFeedbacks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
  }, [feedbacks]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (!over) return;

  const activeItem = feedbacks.find((f) => f.id === active.id);
  const newStatus = over.data?.current?.columnId;

  if (
    activeItem &&
    newStatus &&
    activeItem.status !== newStatus
  ) {
    setFeedbacks((prev) =>
      prev.map((fb) =>
        fb.id === active.id
          ? { ...fb, status: newStatus }
          : fb
      )
    );
  }
};


  return (
    <Box
      sx={{ mt: 2, p: 2, border: "1px solid #26262d", borderRadius: 2, bgcolor: "#141417" }}
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={feedbacks.map((f) => String(f.id))}
          strategy={verticalListSortingStrategy}
        >
          <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}>
            {initialColumns.map((col) => (
              <DroppableColumn key={col.id} id={col.id}>
                <Box
                  id={col.id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                    {col.icon}
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "#fff" }}>
                      {col.id}
                    </Typography>
                  </Box>

                  {feedbacks
                    .filter((fb) => fb.status === col.id)
                    .map((fb) => (
                      <SortableItem
                        key={String(fb.id)}
                        id={String(fb.id)}
                        comment={fb.comment}
                        type={fb.type as any}
                        date={fb.date}
                      />
                    ))}
                </Box>
              </DroppableColumn>
            ))}
          </Box>
        </SortableContext>
      </DndContext>
    </Box>
  );
}
