import React from "react";
import { Dataset } from "@/types/dataset";
import { DatasetCard } from "./DatasetCard";

interface DatasetGridProps {
  datasets: Dataset[];
  onDatasetView?: (dataset: Dataset) => void;
}

export function DatasetGrid({ datasets, onDatasetView }: DatasetGridProps) {
  if (datasets.length === 0) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {datasets.map((dataset, index) => (
        <DatasetCard key={index} dataset={dataset} onView={onDatasetView} />
      ))}
    </div>
  );
}
