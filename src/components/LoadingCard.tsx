import { Card, CardContent } from "@/components/ui/card";

export function LoadingCard() {
  return (
    <Card className="h-full bg-card border-border">
      <CardContent className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-3 bg-muted/70 rounded animate-pulse w-3/4" />

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-muted/50 rounded animate-pulse" />
          <div className="h-3 bg-muted/50 rounded animate-pulse w-5/6" />
          <div className="h-3 bg-muted/50 rounded animate-pulse w-2/3" />
        </div>

        {/* Tags skeleton */}
        <div className="flex gap-2">
          <div className="h-5 bg-muted rounded-full animate-pulse w-16" />
          <div className="h-5 bg-muted rounded-full animate-pulse w-20" />
        </div>

        {/* Footer skeleton */}
        <div className="flex justify-between items-center pt-3 border-t border-border">
          <div className="h-5 bg-muted rounded animate-pulse w-16" />
          <div className="h-6 bg-muted rounded animate-pulse w-12" />
        </div>
      </CardContent>
    </Card>
  );
}
