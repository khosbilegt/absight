"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Dataset } from "@/types/dataset";

interface QAEntry {
  question: string;
  answer: string;
  datasets: Dataset[];
}

interface RecentSearchesContextType {
  recentSearches: string[];
  addRecentSearch: (
    query: string,
    answer?: string,
    datasets?: Dataset[]
  ) => void;
  clearRecentSearches: () => void;
  getSavedQA: (query: string) => QAEntry | undefined;
}

const RecentSearchesContext = createContext<
  RecentSearchesContextType | undefined
>(undefined);

const RECENT_SEARCHES_KEY = "recentSearches";
const QA_MAP_KEY = "qaMap";
const MAX_RECENT = 20;

export function RecentSearchesProvider({ children }: { children: ReactNode }) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [qaMap, setQaMap] = useState<Record<string, QAEntry>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem(RECENT_SEARCHES_KEY) || "[]"
    );
    setRecentSearches(stored);
    const qaStored = JSON.parse(localStorage.getItem(QA_MAP_KEY) || "{}");
    setQaMap(qaStored);
  }, []);

  // Write to localStorage whenever recentSearches or qaMap changes

  // Whenever recentSearches changes, prune qaMap to only keep entries for those searches
  useEffect(() => {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
    setQaMap((prev) => {
      const pruned: Record<string, QAEntry> = {};
      recentSearches.forEach((q) => {
        if (prev[q]) pruned[q] = prev[q];
      });
      return pruned;
    });
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem(QA_MAP_KEY, JSON.stringify(qaMap));
  }, [qaMap]);

  const addRecentSearch = (
    query: string,
    answer?: string,
    datasets?: Dataset[]
  ) => {
    setRecentSearches((prev) => {
      let updated = [query, ...prev.filter((s) => s !== query)];
      if (updated.length > MAX_RECENT) updated = updated.slice(0, MAX_RECENT);
      return updated;
    });
    if (answer !== undefined && datasets !== undefined) {
      setQaMap((prev) => ({
        ...prev,
        [query]: { question: query, answer, datasets },
      }));
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    setQaMap({});
  };

  const getSavedQA = (query: string) => qaMap[query];

  return (
    <RecentSearchesContext.Provider
      value={{
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        getSavedQA,
      }}
    >
      {children}
    </RecentSearchesContext.Provider>
  );
}

export function useRecentSearches() {
  const ctx = useContext(RecentSearchesContext);
  if (!ctx)
    throw new Error(
      "useRecentSearches must be used within a RecentSearchesProvider"
    );
  return ctx;
}
