// types/dataset.ts
export interface Dataset {
  agency: string;
  title: string;
  topics: string[];
  date: string;
  url: string;
  downloadUrl?: string;
  qualityScore?: number;
}

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  datasets?: Dataset[];
  timestamp: Date;
}
