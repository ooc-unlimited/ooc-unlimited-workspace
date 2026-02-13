"use client";

import { Task, PRIORITY_COLORS, PRIORITY_LABELS } from "@/lib/types";
import { useApp } from "@/lib/context";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  compact?: boolean;
}

export default function TaskCard({ task, onEdit, compact }: Props) {
  const { deleteTask } = useApp();

  const overdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  return (
    <div
      className={`group bg-gray-800/60 border border-gray-700/50 rounded-lg p-3 hover:border-gray-600 transition-colors cursor-pointer ${
        compact ? "" : ""
      }`}
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium text-gray-200 leading-snug">
          {task.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task.id);
          }}
          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all text-xs shrink-0"
          title="Delete"
        >
          ✕
        </button>
      </div>

      {!compact && task.description && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
            PRIORITY_COLORS[task.priority]
          }`}
        >
          {PRIORITY_LABELS[task.priority]}
        </span>

        {task.dueDate && (
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded ${
              overdue
                ? "bg-red-500/20 text-red-400"
                : "bg-gray-700 text-gray-400"
            }`}
          >
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}

        {task.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700/60 text-gray-500"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
