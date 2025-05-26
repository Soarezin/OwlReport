// BoardDragOnly.tsx
import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  DragEndEvent,
} from "@dnd-kit/core";
import { Box, Typography } from "@mui/material";
import FeedbackCard from "./FeedbackCard";
import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const initialData = [
  {
    id: "Recebidos",
    icon: <MarkChatUnreadIcon sx={{ fontSize: 16 }} />,
    items: [
      { id: "1", comment: "Bug ao clicar salvar.", type: "Erro", date: "há 3 dias" },
    ],
  },
  {
    id: "Em progresso",
    icon: <BuildCircleIcon sx={{ fontSize: 16 }} />,
    items: [
      { id: "2", comment: "Adicionar exportar PDF.", type: "Ideia", date: "há 2 dias" },
    ],
  },
  {
    id: "Concluídos",
    icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
    items: [
      { id: "3", comment: "Amei a nova UI.", type: "Outro", date: "há 1 dia" },
    ],
  },
];

export default function BoardDragOnly() {
  const [columns, setColumns] = useState(initialData);
  const [activeItem, setActiveItem] = useState<any | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !active) return;

    const fromCol = columns.find((col) => col.items.find((item) => item.id === active.id));
    const toCol = columns.find((col) => col.id === over.id);

    if (!fromCol || !toCol || fromCol.id === toCol.id) return;

    const draggedItem = fromCol.items.find((item) => item.id === active.id);
    if (!draggedItem) return;

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === fromCol.id) {
          return { ...col, items: col.items.filter((item) => item.id !== active.id) };
        }
        if (col.id === toCol.id) {
          return { ...col, items: [...col.items, draggedItem] };
        }
        return col;
      })
    );
    setActiveItem(null);
  };

  return (
    <Box sx={{ mt: 2, p: 2, borderRadius: 2, height: "98%%" }}>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={({ active }) => {
        const item = columns.flatMap((c) => c.items).find((i) => i.id === active.id);
        setActiveItem(item || null);
      }}>
        <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2, justifyContent: "space-between", height: "100%" }}>
          {columns.map((col) => (
            <DroppableColumn key={col.id} id={col.id} icon={col.icon} title={col.id}>
              {col.items.length === 0 ? (
              <Typography variant="body2" sx={{ color: "#64748b", textAlign: "center", mt: 2 }}>
                Nenhum feedback aqui ainda.
              </Typography>
              ) : (
              col.items.map((item) => (
                <DraggableCard key={item.id} id={item.id} item={item} />
              ))
              )}
            </DroppableColumn>
          ))}
        </Box>

        <DragOverlay>
          {activeItem && (
            <Box >
              <FeedbackCard
                type={activeItem.type}
                comment={activeItem.comment}
                author="Usuário"
                email="usuario@owl.com"
                date={activeItem.date}
              />
            </Box>
          )}
        </DragOverlay>
      </DndContext>
    </Box>
  );
}

function DroppableColumn({ id, icon, title, children }: { id: string; icon: React.ReactNode; title: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        width: '32%',
        height: '100%',
        flexShrink: 0,
        border: "1px solid #38bdf86b",
        borderRadius: 3,
        bgcolor: isOver ? "#1e293b" : "#111C2D",
        p: 2,
        transition: "background-color 0.2s ease-in-out",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {icon}
        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "#f1f5f9" }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>{children}</Box>
    </Box>
  );
}

function DraggableCard({ id, item }: { id: string; item: any }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        borderRadius: 2,
      }}
    >
      <Box>
        <FeedbackCard
          type={item.type}
          comment={item.comment}
          author="Usuário"
          email="usuario@owl.com"
          date={item.date}
          
        />
      </Box>
    </Box>
  );
}