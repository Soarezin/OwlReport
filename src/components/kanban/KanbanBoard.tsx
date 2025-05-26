import {
    DndContext,
    closestCenter,
    DragEndEvent,
    DragStartEvent,
    UniqueIdentifier,
    DragOverlay,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useState } from "react";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";

export type Task = {
    id: string;
    title: string;
};

type Columns = Record<string, Task[]>;

const initialColumns: Columns = {
    open: [{ id: "1", title: "Erro 500 na Dashboard" }],
    progress: [{ id: "2", title: "Replay travando no Firefox" }],
    resolved: [],
    closed: [],
};

export default function KanbanBoard() {
    const [columns, setColumns] = useState<Columns>(initialColumns);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

    const findColumnByTaskId = (taskId: UniqueIdentifier): string | null =>
        Object.keys(columns).find((colId) =>
            columns[colId].some((task) => task.id === taskId)
        ) ?? null;

    const getTaskById = (taskId: UniqueIdentifier): Task | undefined => {
        const columnId = findColumnByTaskId(taskId);
        return columnId ? columns[columnId].find((t) => t.id === taskId) : undefined;
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        setActiveId(null);
        if (!over) return;

        const fromColumn = findColumnByTaskId(active.id);
        const toColumn = findColumnByTaskId(over.id) ?? String(over.id);

        if (!fromColumn || !toColumn || fromColumn === toColumn) return;

        const task = getTaskById(active.id);
        if (!task) return;

        setColumns((prev) => {
            const updated = { ...prev };
            updated[fromColumn] = updated[fromColumn].filter((t) => t.id !== active.id);
            updated[toColumn] = [...updated[toColumn], task];
            return updated;
        });
    };


    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
                {Object.entries(columns).map(([columnId, tasks]) => (
                    <KanbanColumn
                        key={columnId}
                        columnId={columnId}
                        title={mapColumnTitle(columnId)}
                        items={tasks}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeId ? (
                    <KanbanCard
                        id={String(activeId)}
                        title={getTaskById(activeId)?.title ?? ""}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

const mapColumnTitle = (id: string): string => {
    switch (id) {
        case "open": return "Aberto";
        case "progress": return "Em andamento";
        case "resolved": return "Resolvido";
        case "closed": return "Fechado";
        default: return id;
    }
};
