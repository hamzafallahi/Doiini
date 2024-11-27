"use client";

import { useState } from "react";
import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, Trash2, Edit, Pin, PinOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [editedTask, setEditedTask] = useState(task);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "task-card cyberpunk-border rounded-lg p-4",
        task.completed ? "bg-zinc-900/50" : "bg-zinc-900/80"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onUpdate({ ...task, completed: !task.completed })}
            className="task-checkbox"
          />
          <h3
            className={cn(
              "font-medium transition-all duration-300",
              task.completed && "line-through text-zinc-500"
            )}
          >
            {task.title}
          </h3>
        </div>
        <div className="flex gap-2">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editedTask.title}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-content">Content</Label>
                  <Textarea
                    id="edit-content"
                    value={editedTask.content}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, content: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                  <Input
                    id="edit-tags"
                    value={editedTask.tags.join(", ")}
                    onChange={(e) =>
                      setEditedTask({
                        ...editedTask,
                        tags: e.target.value.split(",").map((tag) => tag.trim()),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-date">Due Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editedTask.date}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, date: e.target.value })
                    }
                  />
                </div>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onUpdate({ ...task, pinned: !task.pinned })}
            className="hover:text-primary"
          >
            {task.pinned ? (
              <PinOff className="h-4 w-4" />
            ) : (
              <Pin className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="mt-2 text-sm text-zinc-400">{task.content}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {task.tags.map((tag) => (
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
      <div className="mt-4 text-sm text-zinc-500">
        Due: {new Date(task.date).toLocaleDateString()}
      </div>
    </div>
  );
}