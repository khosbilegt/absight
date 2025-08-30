import React from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  placeholder: string;
  size?: "large" | "normal";
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder,
  size = "normal",
}: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading && value.trim()) {
      onSubmit();
    }
  };

  const inputClasses =
    size === "large"
      ? "pr-12 h-14 text-lg bg-background border-2 border-border focus:border-primary rounded-xl shadow-lg dark:shadow-2xl transition-all duration-200"
      : "pr-12 h-12 text-base bg-background border-2 border-border focus:border-primary rounded-xl transition-all duration-200";

  const buttonClasses =
    size === "large"
      ? "absolute right-2 top-2 h-10 w-10 rounded-lg bg-primary hover:bg-primary/90 transition-colors"
      : "absolute right-2 top-2 h-8 w-8 rounded-lg bg-primary hover:bg-primary/90 transition-colors";

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={inputClasses}
        disabled={isLoading}
      />
      <Button
        onClick={onSubmit}
        size="sm"
        disabled={!value.trim() || isLoading}
        className={buttonClasses}
      >
        {isLoading ? (
          <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
        ) : (
          <Send className="h-4 w-4 text-primary-foreground" />
        )}
      </Button>
    </div>
  );
}
