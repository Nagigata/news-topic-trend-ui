import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState } from "react";

interface ChartDataPoint {
  date: string;
  fullDate: string;
  weekLabel: string;
  Politics: number;
  Economics: number;
  Technology: number;
  Health: number;
  Education: number;
  Society: number;
  total: number;
}

interface Category {
  name: string;
  color: string;
}

interface BarChartProps {
  data: ChartDataPoint[];
  height?: string;
  title?: string;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const totalArticles = payload[0].payload.total;
    const weekLabel = payload[0].payload.weekLabel;

    const sortedData = [...payload]
      .sort((a, b) => b.value - a.value)
      .map((entry) => ({
        name: entry.name,
        value: entry.value,
        color: entry.fill,
        percentage: ((entry.value / totalArticles) * 100).toFixed(1),
      }));

    return (
      <div className="bg-card p-4 rounded-xl border shadow-lg">
        <h3 className="font-semibold text-card-foreground mb-2">{weekLabel}</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Total articles: {totalArticles}
        </p>
        <div className="space-y-2">
          {sortedData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-card-foreground">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-card-foreground">
                  {item.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({item.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Categories configuration
const categories: Category[] = [
  { name: "Politics", color: "hsl(var(--chart-1))" },
  { name: "Economics", color: "hsl(var(--chart-2))" },
  { name: "Technology", color: "hsl(var(--chart-3))" },
  { name: "Health", color: "hsl(var(--chart-4))" },
  { name: "Education", color: "hsl(var(--chart-5))" },
  { name: "Society", color: "hsl(var(--chart-6))" },
];

export function BarChart({ data, height = "400px" }: BarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          barSize={80}
          barGap={2}
          barCategoryGap={2}
          onMouseMove={(state) => {
            if (state.activeTooltipIndex !== undefined) {
              setActiveIndex(state.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "hsl(var(--muted))" }}
          />
          <Legend iconType="circle" />
          {categories.map((category) => (
            <Bar
              key={category.name}
              dataKey={category.name}
              stackId="a"
              fill={category.color}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={category.color}
                  fillOpacity={
                    activeIndex === null || activeIndex === index ? 1 : 0.6
                  }
                  className="transition-opacity duration-300"
                />
              ))}
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Helper function to generate weekly data - last 26 weeks (half year)
export function generateSampleChartData(): ChartDataPoint[] {
  const chartData: ChartDataPoint[] = [];
  const halfYearAgo = new Date();
  halfYearAgo.setDate(halfYearAgo.getDate() - 182); // About half a year (26 weeks)

  // Set to the start of the week from half a year ago
  halfYearAgo.setDate(halfYearAgo.getDate() - halfYearAgo.getDay());

  let currentDate = new Date(halfYearAgo);

  const getRandom = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const formatWeekEnd = (date: Date): string => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  const formatWeekLabel = (startDate: Date, endDate: Date): string => {
    const startMonth = startDate.toLocaleString("en-US", { month: "short" });
    const endMonth = endDate.toLocaleString("en-US", { month: "short" });

    if (startMonth === endMonth) {
      return `${startMonth} ${startDate.getDate()} - ${endDate.getDate()}, ${endDate.getFullYear()}`;
    } else {
      return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}, ${endDate.getFullYear()}`;
    }
  };

  // Generate data for 26 weeks (half year)
  for (let week = 0; week < 26; week++) {
    const weekStartDate = new Date(currentDate);
    const weekEndDate = new Date(currentDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);

    const weekNumber = getWeekNumber(currentDate);
    const weekLabel = formatWeekLabel(weekStartDate, weekEndDate);

    // Create random data with an increasing trend toward the present
    const trendFactor = 1 + (week / 26) * 0.5; // Increases from 1 to 1.5

    const Politics = Math.floor(getRandom(140, 200) * trendFactor);
    const Economics = Math.floor(getRandom(180, 260) * trendFactor);
    const Technology = Math.floor(getRandom(150, 220) * trendFactor);
    const Health = Math.floor(getRandom(80, 120) * trendFactor);
    const Education = Math.floor(getRandom(100, 160) * trendFactor);
    const Society = Math.floor(getRandom(160, 220) * trendFactor);

    const total =
      Politics + Economics + Technology + Health + Education + Society;

    chartData.push({
      date: formatWeekEnd(weekEndDate),
      fullDate: `Week ${weekNumber}, ${weekStartDate.getFullYear()}`,
      weekLabel: weekLabel,
      Politics,
      Economics,
      Technology,
      Health,
      Education,
      Society,
      total,
    });

    // Move to next week
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return chartData;
}
