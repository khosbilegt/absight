"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sun, Moon, MenuIcon, ChevronLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const menuItems = [
  { label: "Chat", icon: <MenuIcon className="w-5 h-5" /> },
  { label: "History", icon: <MenuIcon className="w-5 h-5" /> },
  { label: "Settings", icon: <MenuIcon className="w-5 h-5" /> },
];

export default function Sidebar({
  theme,
  toggleTheme,
}: {
  theme: string;
  toggleTheme: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Mobile/Tablet Toggle */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-30 md:hidden"
            aria-label="Open menu"
          >
            <MenuIcon className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <span className="font-bold text-lg text-slate-800">Menu</span>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" aria-label="Close menu">
                <ChevronLeft />
              </Button>
            </SheetClose>
          </div>
          <nav className="flex-1 flex flex-col gap-2 p-2">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="flex items-center gap-3 justify-start px-3 py-2 w-full"
              >
                {item.icon}
                <span>{item.label}</span>
              </Button>
            ))}
            <div className="flex items-center gap-3 mt-8 px-3">
              <Sun className="w-4 h-4" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
              <Moon className="w-4 h-4" />
              <span className="ml-2 text-sm text-slate-700">
                {theme.charAt(0).toUpperCase() + theme.slice(1)} mode
              </span>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-white/80 border-r border-slate-200/60 shadow-lg">
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <span className="font-bold text-lg text-slate-800">Menu</span>
        </div>
        <nav className="flex-1 flex flex-col gap-2 p-2">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="flex items-center gap-3 justify-start px-3 py-2 w-full"
            >
              {item.icon}
              <span>{item.label}</span>
            </Button>
          ))}
          <div className="flex items-center gap-3 mt-8 px-3">
            <Sun className="w-4 h-4" />
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            <Moon className="w-4 h-4" />
            <span className="ml-2 text-sm text-slate-700">
              {theme.charAt(0).toUpperCase() + theme.slice(1)} mode
            </span>
          </div>
        </nav>
      </aside>
    </>
  );
}
