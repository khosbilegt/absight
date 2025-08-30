import React, { useState } from "react";
import { Dataset } from "@/types/dataset";
import { DatasetCard } from "./DatasetCard";

interface DatasetGridProps {
  datasets: Dataset[];
  onDatasetView?: (dataset: Dataset) => void;
}

export function DatasetGrid({ datasets, onDatasetView }: DatasetGridProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [summaryLoadingIndex, setSummaryLoadingIndex] = useState<number | null>(
    null
  );
  const [summarizedIndexes, setSummarizedIndexes] = useState<Set<number>>(
    new Set()
  );

  if (datasets.length === 0) return null;

  const handleExpand = (index: number) => {
    if (summarizedIndexes.has(index)) {
      setExpandedIndex(index);
      return;
    }
    setSummaryLoadingIndex(index);
    setTimeout(() => {
      setSummaryLoadingIndex(null);
      setExpandedIndex(index);
      setSummarizedIndexes((prev) => new Set(prev).add(index));
    }, 2000);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {datasets.map((dataset, index) => (
        <div
          key={index}
          className={expandedIndex === index ? "col-span-full" : ""}
        >
          <DatasetCard
            dataset={dataset}
            onView={onDatasetView}
            isSummaryLoading={summaryLoadingIndex === index}
            expanded={expandedIndex === index}
            onExpand={() => handleExpand(index)}
            onCollapse={() => setExpandedIndex(null)}
          />
        </div>
      ))}
    </div>
  );
}
