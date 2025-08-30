import { Dataset } from "@/types/dataset";

export const mockDatasets: Dataset[] = [
  {
    title: "Labour Force, Australia",
    description:
      "Monthly labour force statistics including employment, unemployment and participation rates across all Australian states and territories.",
    agency: "Australian Bureau of Statistics",
    portal: "abs.gov.au",
    url: "https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia",
    topics: ["employment", "statistics"],
    keywords: ["labour", "employment", "unemployment", "jobs"],
    geographic_coverage: ["Australia", "All States"],
    last_updated: "2024-08-15",
    access_type: "download",
    qualityScore: 95,
  },
  {
    title: "Youth Employment Outcomes",
    description:
      "Comprehensive data on employment outcomes for young Australians aged 15-24, including regional breakdowns and industry analysis.",
    agency: "Department of Employment and Workplace Relations",
    portal: "data.gov.au",
    url: "https://data.gov.au/dataset/youth-employment",
    topics: ["employment", "youth", "regional"],
    keywords: ["youth", "employment", "young people", "regional"],
    geographic_coverage: ["Australia", "Regional", "Metropolitan"],
    last_updated: "2024-07-20",
    access_type: "api",
    qualityScore: 88,
  },
  {
    id: "3",
    title: "Regional Development Index",
    description:
      "Economic indicators and development metrics for regional and remote areas of Australia.",
    agency: "Department of Infrastructure, Transport, Regional Development",
    portal: "data.gov.au",
    url: "https://data.gov.au/dataset/regional-development",
    topics: ["regional", "economics", "development"],
    keywords: ["regional", "development", "economics", "remote"],
    geographic_coverage: ["Regional", "Remote"],
    last_updated: "2024-06-30",
    access_type: "download",
    qualityScore: 82,
  },
];
