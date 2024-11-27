"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, CheckSquare, Clock, Terminal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Tasks", href: "/", icon: CheckSquare },
  { name: "Pomodoro", href: "/pomodoro", icon: Clock },
  { name: "Calendar", href: "/calendar", icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-zinc-950 text-white neon-border">
      <div className="flex h-16 items-center px-6 border-b border-zinc-800">
        <Terminal className="w-6 h-6 mr-2 text-primary" />
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          Doiini
        </h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 nav-item transition-all duration-300",
                  isActive
                    ? "active bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive && "text-primary"
                )} />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-zinc-800">
        <div className="text-xs text-zinc-500 text-center">
          Doiini v1.0.0
        </div>
      </div>
    </div>
  );
}