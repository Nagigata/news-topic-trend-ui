import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { CustomTooltip } from "./TrendLineChart/CustomTooltip";
import { CustomLegend } from "./TrendLineChart/CustomLegend";
import { Loader2 } from "lucide-react";

export interface ChartDataPoint {
  date: string;
  fullDate: string;
  percentages: { [key: string]: number };
  [key: string]: string | number | { [key: string]: number };
}

interface LineChartProps {
  data: ChartDataPoint[];
  topics: string[];
  topicColors: { [key: string]: string };
  height?: string | number;
  maxVisibleTopics?: number;
  isLoading?: boolean;
}

export const LineChart = ({
  data,
  topics,
  topicColors,
  height = "600px",
  maxVisibleTopics = 5,
  isLoading = false,
}: LineChartProps) => {
  const [visibleTopics, setVisibleTopics] = useState<Set<string>>(
    new Set(topics.slice(0, maxVisibleTopics))
  );
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  // Handle when there's no data or loading state
  if (isLoading) {
    return (
      <div style={{ height }} className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0 || topics.length === 0) {
    return (
      <div style={{ height }} className="flex items-center justify-center">
        <p className="text-muted-foreground">
          Không có dữ liệu xu hướng chủ đề
        </p>
      </div>
    );
  }

  // Only calculate max based on currently visible topics
  const maxPercent = Math.max(
    ...data.flatMap((item) =>
      Array.from(visibleTopics).map(
        (topic) => (item.percentages as { [key: string]: number })[topic] || 0
      )
    )
  );

  // Round up to the nearest 5%
  const yAxisMax = Math.ceil(maxPercent / 5) * 5;

  // Generate ticks at 5% intervals
  const ticks = Array.from({ length: yAxisMax / 5 + 1 }, (_, i) => i * 5);

  // Handle toggling a topic's visibility
  const toggleTopic = (topic: string) => {
    const newVisibleTopics = new Set(visibleTopics);
    if (newVisibleTopics.has(topic)) {
      newVisibleTopics.delete(topic);
    } else {
      newVisibleTopics.add(topic);
    }
    setVisibleTopics(newVisibleTopics);
  };

  // Show all topics
  const showAllTopics = () => {
    setVisibleTopics(new Set(topics));
  };

  // Hide all topics
  const hideAllTopics = () => {
    setVisibleTopics(new Set());
  };

  return (
    <div style={{ height }} className="relative">
      <div className="absolute top-0 right-0 flex gap-2 z-10">
        <button
          className="text-xs bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md font-medium transition-colors"
          onClick={showAllTopics}
        >
          Hiển thị tất cả
        </button>
        <button
          className="text-xs bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-md font-medium transition-colors"
          onClick={hideAllTopics}
        >
          Xóa tất cả
        </button>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 25, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="date" stroke="#888888" tickLine={false} />
          <YAxis
            domain={[0, yAxisMax]}
            tickFormatter={(value) => `${value}%`}
            ticks={ticks}
            stroke="#888888"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            content={
              <CustomLegend
                payload={topics.map((topic) => ({
                  dataKey: `percentages.${topic}`,
                  color: topicColors[topic] || "#8884d8",
                }))}
                visibleTopics={visibleTopics}
                hoveredTopic={hoveredTopic}
                onToggleTopic={toggleTopic}
                onHoverTopic={setHoveredTopic}
              />
            }
          />
          {topics.map((topic) => {
            const isVisible = visibleTopics.has(topic);
            const isHovered = hoveredTopic === topic;
            const opacity = !isVisible
              ? 0
              : hoveredTopic === null
              ? 1
              : isHovered
              ? 1
              : 0.3;

            return (
              <Line
                key={topic}
                type="monotone"
                name={`percentages.${topic}`}
                dataKey={`percentages.${topic}`}
                stroke={topicColors[topic] || "#8884d8"}
                strokeWidth={isHovered ? 3 : 2}
                dot={false}
                activeDot={{ r: 6 }}
                opacity={opacity}
                strokeDasharray={isHovered ? "" : ""}
              />
            );
          })}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};
