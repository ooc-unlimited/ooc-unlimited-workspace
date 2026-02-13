"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { Task, Status, STATUS_ORDER, STATUS_LABELS, STATUS_COLORS } from "@/lib/types";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";

export default function BoardPage() {
  const { tasks, moveTask } = useApp();
  const [modal, setModal] = useState<{
    open: boolean;
    task?: Task | null;
    initialStatus?: Status;
  }>({ open: false });
  const [draggedId, setDraggedId] = useState<string | null>(null);

  function handleDragStart(id: string) {
    setDraggedId(id);
  }

  function handleDrop(status: Status) {
    if (draggedId) {
      moveTask(draggedId, status);
      setDraggedId(null);
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Board</h1>
            <p className="text-sm text-gray-500 mt-1">
              Drag tasks between columns to update status
            </p>
          </div>
          <button
            onClick={() => setModal({ open: true, task: null })}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors"
          >
            + New Task
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUS_ORDER.map((status) => {
            const columnTasks = tasks.filter((t) => t.status === status);
            return (
              <div
                key={status}
                className="min-w-[280px] w-[280px] shrink-0"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(status)}
              >
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLORS[status]}`}
                  >
                    {STATUS_LABELS[status]}
                  </span>
                  <span className="text-xs text-gray-600">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-2 min-h-[200px] bg-gray-900/30 border border-gray-800/50 rounded-xl p-2">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                    >
                      <TaskCard
                        task={task}
                        onEdit={(t) => setModal({ open: true, task: t })}
                        compact
                      />
                    </div>
                  ))}

                  <button
                    onClick={() =>
                      setModal({ open: true, task: null, initialStatus: status })
                    }
                    className="w-full py-2 text-xs text-gray-600 hover:text-gray-400 hover:bg-gray-800/40 rounded-lg transition-colors"
                  >
                    + Add task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {modal.open && (
        <TaskModal
          task={modal.task}
          initialStatus={modal.initialStatus}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  );
}
