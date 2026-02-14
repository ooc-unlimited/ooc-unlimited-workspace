import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

interface Task {
  name: string;
  date: string;
  goal: string;
  status: 'queued' | 'in-progress' | 'done';
}

function parseTasks(): { queued: Task[]; inProgress: Task[]; done: Task[] } {
  const result = { queued: [] as Task[], inProgress: [] as Task[], done: [] as Task[] };
  try {
    const content = readFileSync(
      join(process.env.HOME || '', '.openclaw/workspace/memory/autonomous-task-log.md'),
      'utf-8'
    );
    const lines = content.split('\n');
    for (const line of lines) {
      const match = line.match(/^- \[(.)\] (.+?) \| (\d{4}-\d{2}-\d{2}) \| Goal: (.+?) \| Status: (.+)$/);
      if (!match) continue;
      const [, , name, date, goal, status] = match;
      const task: Task = { name: name.trim(), date, goal, status: status.trim() as Task['status'] };
      if (status.trim() === 'queued') result.queued.push(task);
      else if (status.trim() === 'in-progress') result.inProgress.push(task);
      else if (status.trim() === 'done') result.done.push(task);
    }
  } catch {}
  return result;
}

export async function GET() {
  return NextResponse.json(parseTasks());
}
