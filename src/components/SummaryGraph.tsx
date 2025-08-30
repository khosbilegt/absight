"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { date: "Mar-17", commenced: 52066, inProgress: 219357, completed: 56883 },
  { date: "Jun-17", commenced: 54172, inProgress: 217966, completed: 52722 },
  { date: "Sep-17", commenced: 55288, inProgress: 221297, completed: 52676 },
  { date: "Dec-17", commenced: 54772, inProgress: 220201, completed: 51811 },
  { date: "Mar-18", commenced: 62349, inProgress: 230931, completed: 53528 },
  { date: "Jun-18", commenced: 57224, inProgress: 229763, completed: 55128 },
  { date: "Sep-18", commenced: 56071, inProgress: 228901, completed: 57102 },
  { date: "Dec-18", commenced: 48639, inProgress: 218486, completed: 53727 },
  { date: "Mar-19", commenced: 46168, inProgress: 216446, completed: 52420 },
  { date: "Jun-19", commenced: 45679, inProgress: 207987, completed: 51653 },
  { date: "Sep-19", commenced: 40895, inProgress: 201057, completed: 47848 },
  { date: "Dec-19", commenced: 42964, inProgress: 188225, completed: 50794 },
  { date: "Mar-20", commenced: 46772, inProgress: 190533, completed: 47187 },
  { date: "Jun-20", commenced: 42588, inProgress: 185382, completed: 46026 },
  { date: "Sep-20", commenced: 42485, inProgress: 184287, completed: 44077 },
  { date: "Dec-20", commenced: 51975, inProgress: 187369, completed: 44467 },
  { date: "Mar-21", commenced: 53137, inProgress: 196478, completed: 45623 },
  { date: "Jun-21", commenced: 66429, inProgress: 214840, completed: 45969 },
  { date: "Sep-21", commenced: 57429, inProgress: 227874, completed: 44468 },
  { date: "Dec-21", commenced: 52245, inProgress: 232827, completed: 42933 },
  { date: "Mar-22", commenced: 48730, inProgress: 240284, completed: 42723 },
  { date: "Jun-22", commenced: 47371, inProgress: 243248, completed: 42637 },
  { date: "Sep-22", commenced: 45176, inProgress: 244180, completed: 44326 },
  { date: "Dec-22", commenced: 41654, inProgress: 238181, completed: 43943 },
  { date: "Mar-23", commenced: 45698, inProgress: 241861, completed: 44941 },
  { date: "Jun-23", commenced: 41986, inProgress: 240871, completed: 41241 },
  { date: "Sep-23", commenced: 38147, inProgress: 234964, completed: 44203 },
  { date: "Dec-23", commenced: 40078, inProgress: 225113, completed: 45945 },
  { date: "Mar-24", commenced: 40607, inProgress: 226367, completed: 41963 },
  { date: "Jun-24", commenced: 41116, inProgress: 220924, completed: 45398 },
  { date: "Sep-24", commenced: 44149, inProgress: 220714, completed: 44974 },
  { date: "Dec-24", commenced: 42672, inProgress: 212616, completed: 45521 },
  { date: "Mar-25", commenced: 47645, inProgress: 219883, completed: 43517 },
];

const chartConfig = {
  commenced: {
    label: "Commenced",
    color: "var(--chart-1)",
  },
  inProgress: {
    label: "In Progress",
    color: "var(--chart-2)",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const last = chartData[chartData.length - 1];
const prev = chartData[chartData.length - 2];
const commencedChange =
  ((last.commenced - prev.commenced) / prev.commenced) * 100;
const commencedTrend = commencedChange >= 0 ? "up" : "down";
const commencedChangeAbs = Math.abs(commencedChange).toFixed(1);

export default function SummaryGraph() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Australia: Dwelling Construction Trends (2017–2025)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <YAxis
              label={{
                value: "Number of Dwellings",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#888" },
              }}
              tickFormatter={(value) => {
                if (value >= 1_000_000)
                  return (
                    (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
                  );
                if (value >= 1_000) return (value / 1_000).toFixed(0) + "k";
                return value;
              }}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              orientation="bottom"
              tickFormatter={(value) => {
                const [month, year] = value.split("-");
                return `${month} 20${year}`;
              }}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="commenced"
              stackId="a"
              fill="#22d3ee"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="inProgress"
              stackId="a"
              fill="#2563eb"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="completed"
              stackId="a"
              fill="#a3e635"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {`Commenced: ${last.commenced.toLocaleString()} (${commencedTrend} ${commencedChangeAbs}% from last quarter) `}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          {`Showing data from ${chartData[0].date} to ${last.date}`}
        </div>
      </CardFooter>
    </Card>
  );
}
