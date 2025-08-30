"use client";

import {
  Settings,
  PanelLeftClose,
  PanelLeft,
  Database,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useState } from "react";
import { useRecentSearches } from "@/providers/recent-searches-provider";
import { cn } from "@/lib/utils";

// Recent searches (mock data)
// const recentSearches = [
//   "Youth employment data",
//   "Regional health statistics",
//   "Education outcomes NSW",
//   "Housing affordability trends",
// ];

const navigationItems = [
  {
    title: "Browse All",
    href: "/browse",
    icon: Database,
  },
];

export function AppSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const { recentSearches } = useRecentSearches();

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-background border-r border-border transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      {/* Header with toggle */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {isExpanded && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-1.5 rounded-lg">
                <Database className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sm truncate">DataFinder</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 shrink-0"
          >
            {isExpanded ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10 px-3",
                  !isExpanded && "px-0 justify-center"
                )}
              >
                <item.icon className="h-4 w-4" />
                {isExpanded && (
                  <span className="ml-3 truncate">{item.title}</span>
                )}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Recent Searches - Only show when expanded */}
        {isExpanded && (
          <div className="mt-6">
            <Separator className="mb-3" />

            <div className="px-3 mb-2">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Recent
                </span>
              </div>
            </div>

            <nav className="space-y-1">
              {recentSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-9 px-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  <span className="truncate">{search}</span>
                </Button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Footer with Settings and Theme */}
      <div className="p-3 border-t border-border">
        {isExpanded ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
        )}
      </div>
    </div>
  );
}
