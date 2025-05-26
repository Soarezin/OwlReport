import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import KanbanCard from "./KanbanCard";
import { Task } from "./KanbanBoard";

interface Props {
  columnId: string;
  title: string;
  items: Task[];
}

export default function KanbanColumn({ columnId, title, items }: Props) {
  const { setNodeRef } = useDroppable({ id: columnId });

  return (
    <div ref={setNodeRef} className="bg-slate-800 rounded-2xl shadow p-4 min-h-[200px]">
      <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {items.map((item) => (
            <KanbanCard key={item.id} id={item.id} title={item.title} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
