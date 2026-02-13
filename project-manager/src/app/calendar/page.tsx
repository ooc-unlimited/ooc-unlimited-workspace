"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/lib/context";
import { Task, PRIORITY_COLORS, PRIORITY_LABELS, STATUS_COLORS, STATUS_LABELS } from "@/lib/types";
import TaskModal from "@/components/TaskModal";

export default function CalendarPage() {
  const { tasks } = useApp();
  const [modal, setModal] = useState<{ open: boolean; task?: Task | null }>({
    open: false,
  });
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: { date: Date; inMonth: boolean }[] = [];

    // Previous month padding
    for (let i = startPad - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, inMonth: false });
    }

    // Current month
    for (let i = 1; i <= totalDays; i++) {
      days.push({ date: new Date(year, month, i), inMonth: true });
    }

    // Next month padding to fill 6 rows
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), inMonth: false });
    }

    return days;
  }, [year, month]);

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const task of tasks) {
      if (task.dueDate) {
        const key = task.dueDate;
        if (!map[key]) map[key] = [];
        map[key].push(task);
      }
    }
    return map;
  }, [tasks]);

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }
  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }
  function goToday() {
    setCurrentDate(new Date());
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const monthLabel = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Calendar</h1>
            <p className="text-sm text-gray-500 mt-1">
              Tasks with due dates appear on the calendar
            </p>
          </div>
          <button
            onClick={() => setModal({ open: true, task: null })}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors"
          >
            + New Task
          </button>
        </div>

        {/* Month navigation */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-white min-w-[180px] text-center">
            {monthLabel}
          </h2>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={goToday}
            className="ml-2 px-3 py-1 text-xs text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
          >
            Today
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              className="text-xs text-gray-500 font-medium text-center py-2"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 border border-gray-800 rounded-xl overflow-hidden">
          {calendarDays.map(({ date, inMonth }, i) => {
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
            const dayTasks = tasksByDate[dateStr] || [];
            const isToday = dateStr === todayStr;

            return (
              <div
                key={i}
                className={`min-h-[100px] border-t border-l border-gray-800/50 p-1.5 ${
                  inMonth ? "bg-gray-900/30" : "bg-gray-950/40"
                }`}
              >
                <div
                  className={`text-xs mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                    isToday
                      ? "bg-violet-600 text-white font-bold"
                      : inMonth
                      ? "text-gray-400"
                      : "text-gray-700"
                  }`}
                >
                  {date.getDate()}
                </div>
                <div className="space-y-0.5">
                  {dayTasks.slice(0, 3).map((task) => (
                    <button
                      key={task.id}
                      onClick={() => setModal({ open: true, task })}
                      className={`w-full text-left text-[10px] px-1.5 py-0.5 rounded truncate ${
                        PRIORITY_COLORS[task.priority]
                      } hover:opacity-80 transition-opacity`}
                    >
                      {task.title}
                    </button>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-[10px] text-gray-500 px-1">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Upcoming tasks sidebar */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Upcoming Due Dates</h3>
          <div className="space-y-2">
            {tasks
              .filter((t) => t.dueDate && t.status !== "done")
              .sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""))
              .slice(0, 8)
              .map((task) => {
                const overdue = task.dueDate && new Date(task.dueDate) < new Date();
                return (
                  <div
                    key={task.id}
                    onClick={() => setModal({ open: true, task })}
                    className="flex items-center gap-3 bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 cursor-pointer hover:border-gray-700 transition-colors"
                  >
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLORS[task.status]}`}>
                      {STATUS_LABELS[task.status]}
                    </span>
                    <span className="text-sm text-gray-300 flex-1 truncate">
                      {task.title}
                    </span>
                    <span className={`text-xs ${overdue ? "text-red-400" : "text-gray-500"}`}>
                      {task.dueDate && new Date(task.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                );
              })}
            {tasks.filter((t) => t.dueDate && t.status !== "done").length === 0 && (
              <p className="text-sm text-gray-600">No upcoming tasks with due dates</p>
            )}
          </div>
        </div>
      </div>

      {modal.open && (
        <TaskModal
          task={modal.task}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  );
}
