import React, { useEffect, useState } from "react";
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
import { Box, Stack, Typography } from "@mui/material";
import FeedbackCard from "./FeedbackCard";
import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import InboxIcon from "@mui/icons-material/Inbox";
import api from "../../services/api";

export interface ListReport {
  id: string;
  pageUrl: string;
  userComment?: string;
  category: string;
  severity: string;
  severityColor: string;
  status: string;
  createdAt: string;
  statusId: string
}

interface BoardDragOnlyProps {
  projectId: string;
}

export const getReports = async (projectId: string): Promise<ListReport[]> => {
  const res = await api.get("/report-web/reports", {
    params: { projectId },
  });
  return res.data.data;
};

const updateReportStatus = async (reportId: string, statusId: string) => {
  try {
    await api.post("/report-web/update-status", null, {
      params: {
        reportId,
        statusId,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar status do report:", error);
  }
};

export default function BoardDragOnly({ projectId }: BoardDragOnlyProps) {
  const [columns, setColumns] = useState<any[]>([]);
  const [activeItem, setActiveItem] = useState<any | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));
  useEffect(() => {
    getReports(projectId).then((reports) => {
      const received = reports.filter((r) => r.statusId === "b1111111-1111-1111-1111-111111111111");
      const inProgress = reports.filter((r) => r.statusId === "b2222222-2222-2222-2222-222222222222");
      const resolved = reports.filter((r) => r.statusId === "b3333333-3333-3333-3333-333333333333");
      const stashed = reports.filter((r) => r.statusId === "b4444444-4444-4444-4444-444444444444");

      setColumns([
        {
          id: 'b1111111-1111-1111-1111-111111111111',
          name: "Recebidos",
          icon: <MarkChatUnreadIcon sx={{ fontSize: 16 }} />,
          items: received.map(toCardItem),
        },
        {
          id: 'b2222222-2222-2222-2222-222222222222',
          name: "Em progresso",
          icon: <BuildCircleIcon sx={{ fontSize: 16 }} />,
          items: inProgress.map(toCardItem),
        },
        {
          id: 'b3333333-3333-3333-3333-333333333333',
          name: "Resolvido",
          icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
          items: resolved.map(toCardItem),
        },
        {
          id: 'b4444444-4444-4444-4444-444444444444',
          name: "Stashed",
          icon: <Inventory2Icon sx={{ fontSize: 16 }} />,
          items: stashed.map(toCardItem),
        },
      ]);
    });
  }, [projectId]);

  const toCardItem = (r: ListReport) => ({
    id: r.id,
    comment: r.userComment || "(Sem comentário)",
    type: r.category,
    date: new Date(r.createdAt).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    status: r.status,
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !active) return;

    const fromCol = columns.find((col) => col.items.find((item: any) => item.id === active.id));
    const toCol = columns.find((col) => col.id === over.id);

    if (!fromCol || !toCol || fromCol.id === toCol.id) return;

    const draggedItem = fromCol.items.find((item: any) => item.id === active.id);
    if (!draggedItem) return;

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === fromCol.id) {
          return { ...col, items: col.items.filter((item: any) => item.id !== active.id) };
        }
        if (col.id === toCol.id) {
          return { ...col, items: [...col.items, draggedItem] };
        }
        return col;
      })
    );
    setActiveItem(null);
    if (fromCol.id !== toCol.id) {
      await updateReportStatus(String(active.id), String(toCol.id));
    }
  };

  return (
    <Box sx={{ mt: 2, p: 2, borderRadius: 2, height: "98%" }}>
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={({ active }) => {
          const item = columns.flatMap((c) => c.items).find((i: any) => i.id === active.id);
          setActiveItem(item || null);
        }}
      >
        <Box sx={{ display: "flex", gap: 2, overflowY: "auto", pb: 2, justifyContent: "space-between", height: "100%" }}>
          {columns.map((col) => (
            <DroppableColumn key={col.id} id={col.id} icon={col.icon} title={col.name}>
              {col.items.length === 0 ? (
                <Stack alignItems="center" spacing={1} mt={2} margin={'auto'}>
                  <InboxIcon sx={{ fontSize: 32, color: "#64748b" }} />
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Tudo certo por aqui!
                  </Typography>
                </Stack>
              ) : (
                col.items.map((item: any) => (
                  <DraggableCard key={item.id} id={item.id} item={item} />
                ))
              )}
            </DroppableColumn>
          ))}
        </Box>

        <DragOverlay>
          {activeItem && (
            <Box>
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

function DroppableColumn({
  id,
  icon,
  title,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        width: "24%",
        height: "100%",
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
      <Box sx={{
        flexGrow: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        pr: 1, // opcional: evita que a barra de rolagem sobreponha os cards
      }}>{children}</Box>
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
      <FeedbackCard
        type={item.type}
        comment={item.comment}
        author="Usuário"
        email="usuario@owl.com"
        date={item.date}
      />
    </Box>
  );
}
