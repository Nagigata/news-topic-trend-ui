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

// Chuyển đổi nhãn chủ đề thành dạng dễ đọc
const formatTopicName = (topic: string) => {
  return topic
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const fullDate = payload[0]?.payload.fullDate || `April ${label}, 2025`;

    const sortedData = [...payload]
      .sort((a, b) => b.value - a.value)
      .map((entry) => ({
        name: formatTopicName(entry.dataKey.replace("percentages.", "")),
        color: entry.stroke,
        percentage: entry.value.toFixed(1),
      }));

    return (
      <div className="bg-card p-4 rounded-xl border shadow-lg">
        <h3 className="font-semibold text-card-foreground mb-2">
          Statistics for {fullDate}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          Distribution by Topic
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
                  {item.percentage}%
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

  // Xử lý khi không có dữ liệu hoặc đang tải
  if (isLoading) {
    return (
      <div style={{ height }} className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading data...</p>
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

  // Chỉ tính toán max dựa trên các chủ đề đang hiển thị
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

  // Xử lý bật/tắt hiển thị một chủ đề
  const toggleTopic = (topic: string) => {
    const newVisibleTopics = new Set(visibleTopics);
    if (newVisibleTopics.has(topic)) {
      newVisibleTopics.delete(topic);
    } else {
      newVisibleTopics.add(topic);
    }
    setVisibleTopics(newVisibleTopics);
  };

  // Hiển thị lại tất cả các chủ đề
  const showAllTopics = () => {
    setVisibleTopics(new Set(topics));
  };

  // Ẩn tất cả các chủ đề
  const hideAllTopics = () => {
    setVisibleTopics(new Set());
  };

  // Custom Legend để có thể tương tác
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-3 justify-center mt-2 mb-4">
        {payload.map((entry: any, index: number) => {
          const topic = entry.dataKey.replace("percentages.", "");
          const isVisible = visibleTopics.has(topic);
          const isHovered = hoveredTopic === topic;

          return (
            <div
              key={index}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all ${
                isVisible
                  ? "border-2 border-opacity-100"
                  : "border border-opacity-50 opacity-60"
              }`}
              style={{
                borderColor: entry.color,
                backgroundColor: isVisible ? `${entry.color}20` : "transparent",
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
              onClick={() => toggleTopic(topic)}
              onMouseEnter={() => setHoveredTopic(topic)}
              onMouseLeave={() => setHoveredTopic(null)}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs font-medium">
                {formatTopicName(topic)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ height }} className="relative">
      <div className="absolute top-0 right-0 flex gap-2 z-10">
        <button
          className="text-xs bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md font-medium transition-colors"
          onClick={showAllTopics}
        >
          Show All
        </button>
        <button
          className="text-xs bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-md font-medium transition-colors"
          onClick={hideAllTopics}
        >
          Clear All
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
          <Legend content={<CustomLegend />} />
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
