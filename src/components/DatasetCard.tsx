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
import { AudioLines } from "lucide-react";
import SummaryGraph from "@/components/SummaryGraph";
import { parse, format } from "date-fns";

interface DatasetCardProps {
  dataset: Dataset;
  onView?: (dataset: Dataset) => void;
  isSummaryLoading: boolean;
  expanded?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
}

export function DatasetCard({
  dataset,
  onView,
  isSummaryLoading,
  expanded,
  onExpand,
  onCollapse,
}: DatasetCardProps) {
  // Assign a random qualityScore between 71 and 100 if not present
  const qualityScore =
    typeof dataset.qualityScore === "number"
      ? dataset.qualityScore
      : Math.floor(Math.random() * 30) + 71;
  const getQualityColor = (score: number) => {
    if (score > 90) return "bg-green-500 dark:bg-green-600";
    if (score > 70) return "bg-yellow-500 dark:bg-yellow-600";
    return "bg-red-500 dark:bg-red-600";
  };

  let formattedDate = "";

  if (dataset.date) {
    let parsed = parse(dataset.date, "MMM-yy", new Date());
    if (isNaN(parsed.getTime())) {
      parsed = parse(dataset.date, "dd/MM/yyyy", new Date());
    }
    formattedDate = isNaN(parsed.getTime())
      ? dataset.date
      : format(parsed, "d MMMM yyyy");
  }

  return (
    <Card
      className={`py-0 transition-shadow cursor-pointer h-full bg-card border-border hover:bg-accent/50 ${
        expanded ? "shadow-lg" : ""
      }`}
    >
      <CardContent className="p-4 h-full flex flex-col">
        <div className="space-y-3 flex-1">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm leading-tight line-clamp-3 text-card-foreground">
              {dataset.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{dataset.agency}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {formattedDate}
            </div>
          </div>

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
          <div className="flex w-full justify-between items-center gap-2">
            {!expanded ? (
              <Button
                variant="default"
                size="sm"
                onClick={onExpand}
                disabled={isSummaryLoading}
              >
                {isSummaryLoading ? (
                  <>
                    <AudioLines /> Loading
                  </>
                ) : (
                  "Summarize"
                )}
              </Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={onCollapse}>
                Close
              </Button>
            )}
            <div className="flex items-center gap-1">
              <div
                className={`h-2 w-2 rounded-full ${getQualityColor(
                  qualityScore
                )}`}
              />
              <span className="text-xs text-muted-foreground">
                {qualityScore}/100
              </span>
            </div>
          </div>
        </div>
        {expanded && (
          <div className="mt-4">
            <SummaryGraph />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
