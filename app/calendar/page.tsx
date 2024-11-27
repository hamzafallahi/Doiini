"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTasks } from "@/lib/store";
import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const tasks = getTasks();

  const tasksByDate = tasks.reduce((acc: { [key: string]: Task[] }, task) => {
    const date = task.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {});

  const selectedDateTasks = selectedDate
    ? tasksByDate[selectedDate.toISOString().split("T")[0]] || []
    : [];

  return (
    <div className="flex min-h-screen gap-6 p-6">
      <div className="flex-1">
        <Card className="cyberpunk-border p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md"
            modifiers={{
              booked: (date) => {
                const dateStr = date.toISOString().split("T")[0];
                return !!tasksByDate[dateStr]?.length;
              },
            }}
            modifiersClassNames={{
              booked: "bg-primary text-primary-foreground font-bold hover:bg-primary/90",
            }}
          />
        </Card>
      </div>

      <div className="w-96">
        <Card className="cyberpunk-border p-6">
          <h2 className="mb-6 text-xl font-bold">
            Tasks for {selectedDate?.toLocaleDateString()}
          </h2>
          <div className="space-y-4">
            {selectedDateTasks.length === 0 ? (
              <p className="text-zinc-500">No tasks for this date</p>
            ) : (
              selectedDateTasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "cyberpunk-border rounded-lg p-4 transition-all duration-300",
                    task.completed ? "bg-zinc-900/50" : "bg-zinc-900/80"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className={cn(
                        "font-medium transition-all duration-300",
                        task.completed && "line-through text-zinc-500"
                      )}
                    >
                      {task.title}
                    </h3>
                    {task.pinned && <span>📌</span>}
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{task.content}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {task.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="bg-zinc-800/50 transition-all duration-300 hover:bg-primary/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}