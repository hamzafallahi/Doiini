"use client";

import { useState, useEffect } from "react";
import { Task } from "@/lib/types";
import { getTasks, saveTasks } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TaskCard } from "@/components/TaskCard";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    content: "",
    tags: [] as string[],
    date: new Date().toISOString().split("T")[0],
  });
  const { toast } = useToast();

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
      pinned: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setNewTask({
      title: "",
      content: "",
      tags: [],
      date: new Date().toISOString().split("T")[0],
    });
    toast({
      title: "Success",
      description: "Task created successfully",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    toast({
      title: "Success",
      description: "Task deleted successfully",
    });
  };

  const filteredTasks = tasks.filter((task) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchLower) ||
      task.content.toLowerCase().includes(searchLower) ||
      task.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  const pinnedTasks = filteredTasks.filter((task) => task.pinned);
  const unpinnedTasks = filteredTasks.filter((task) => !task.pinned);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search tasks or tags..."
            className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-primary transition-all duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml-4 bg-primary hover:bg-primary/80 transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="bg-zinc-800/50"
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newTask.content}
                  onChange={(e) =>
                    setNewTask({ ...newTask, content: e.target.value })
                  }
                  className="bg-zinc-800/50"
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="tags"
                    placeholder="Add tags (comma separated)"
                    className="bg-zinc-800/50"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const input = e.currentTarget;
                        const tags = input.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean);
                        setNewTask({
                          ...newTask,
                          tags: [...new Set([...newTask.tags, ...tags])],
                        });
                        input.value = "";
                      }
                    }}
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {newTask.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="bg-zinc-800/50 transition-all duration-300 hover:bg-primary/20"
                    >
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="date">Due Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newTask.date}
                  onChange={(e) =>
                    setNewTask({ ...newTask, date: e.target.value })
                  }
                  className="bg-zinc-800/50"
                />
              </div>
              <Button onClick={handleCreateTask} className="w-full">
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {pinnedTasks.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-primary">
              📌 Pinned Tasks
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pinnedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={(updatedTask) => {
                    const updatedTasks = tasks.map((t) =>
                      t.id === updatedTask.id ? updatedTask : t
                    );
                    setTasks(updatedTasks);
                    saveTasks(updatedTasks);
                  }}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="mb-4 text-lg font-semibold text-primary">All Tasks</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {unpinnedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={(updatedTask) => {
                  const updatedTasks = tasks.map((t) =>
                    t.id === updatedTask.id ? updatedTask : t
                  );
                  setTasks(updatedTasks);
                  saveTasks(updatedTasks);
                }}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}