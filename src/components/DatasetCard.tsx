import React from "react";
import { Dataset } from "@/types/dataset";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DatasetCardProps {
  dataset: Dataset;
  onView?: (dataset: Dataset) => void;
}

export function DatasetCard({ dataset, onView }: DatasetCardProps) {
  const getQualityColor = (score: number) => {
    if (score > 90) return "bg-green-500 dark:bg-green-600";
    if (score > 70) return "bg-yellow-500 dark:bg-yellow-600";

    return "bg-red-500 dark:bg-red-600";
  };

  return (
    <Card className="py-0 hover:shadow-md dark:hover:shadow-lg transition-shadow cursor-pointer h-full bg-card border-border hover:bg-accent/50">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="space-y-3 flex-1">
          {/* Header */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm leading-tight line-clamp-3 text-card-foreground">
              {dataset.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{dataset.agency}</span>
            </div>
          </div>

          {/* Topics & Keywords */}
          <div className="space-y-2">
            {dataset.topics.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {dataset.topics.slice(0, 3).map((topic) => (
                  <Badge
                    key={topic}
                    variant="secondary"
                    className="text-xs bg-secondary/50 text-secondary-foreground hover:bg-secondary/70"
                  >
                    {topic}
                  </Badge>
                ))}
                {dataset.topics.length > 3 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className="text-xs cursor-pointer"
                        >
                          +{dataset.topics.length - 3}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        {dataset.topics.slice(3).join(", ")}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-border mt-3">
          <div className="flex items-center gap-2">
            <a
              href={dataset.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={-1}
              className="focus:outline-none"
            >
              <Badge
                asChild
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-secondary/70"
              >
                <span>⬇️ Download</span>
              </Badge>
            </a>

            <div className="flex items-center gap-1">
              <div
                className={`h-2 w-2 rounded-full ${getQualityColor(
                  dataset.qualityScore
                )}`}
              />
              <span className="text-xs text-muted-foreground">
                {dataset.qualityScore}/100
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs hover:bg-accent"
            onClick={() => onView?.(dataset)}
          >
            View →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
