import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Interface cho từng keyword
export interface KeywordItem {
  text: string;
  value: number;
  category: string;
}

interface KeywordBarChartProps {
  keywordsData: { [key: string]: KeywordItem[] };
  topics: string[];
  topicColors: { [key: string]: string };
  className?: string;
  maxDisplayItems?: number;
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

// Rút gọn tên chủ đề nếu quá dài để hiển thị
const shortenTopicName = (topic: string, maxLength = 35) => {
  const formattedName = formatTopicName(topic);
  if (formattedName.length <= maxLength) return formattedName;
  return formattedName.substring(0, maxLength) + "...";
};

export function KeywordBarChart({
  keywordsData,
  topics,
  topicColors,
  className,
  maxDisplayItems = 10,
  isLoading = false,
}: KeywordBarChartProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(
    topics[0] || null
  );
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [maxValue, setMaxValue] = useState<number>(50);

  // Cập nhật selectedTopic khi topics thay đổi
  useEffect(() => {
    if (
      topics.length > 0 &&
      (!selectedTopic || !topics.includes(selectedTopic))
    ) {
      setSelectedTopic(topics[0]);
    }
  }, [topics, selectedTopic]);

  // Reset animation khi chuyển chủ đề và đặt lại sau khi animation hoàn thành
  useEffect(() => {
    setAnimationComplete(false);
    // Đặt animation hoàn thành
    const timer = setTimeout(() => setAnimationComplete(true), 800);
    return () => clearTimeout(timer);
  }, [selectedTopic]);

  // Xác định màu gradient dựa trên màu của chủ đề
  const getGradientColors = (topicColor: string) => {
    if (!topicColor) return { start: "#8884d8", end: "#8884d8" };

    // Xử lý màu HSL
    const hslMatch = topicColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (hslMatch) {
      const hue = parseInt(hslMatch[1]);
      const saturation = parseInt(hslMatch[2]);
      const lightness = parseInt(hslMatch[3]);

      return {
        start: `hsl(${hue}, ${saturation}%, ${Math.min(lightness + 10, 90)}%)`,
        end: `hsl(${hue}, ${saturation}%, ${Math.max(lightness - 10, 20)}%)`,
      };
    }

    // Mặc định khi không thể xử lý màu
    return {
      start: topicColor,
      end: topicColor,
    };
  };

  // Lấy dữ liệu cho chủ đề đã chọn và tính toán maxValue
  const chartData = selectedTopic
    ? (keywordsData[selectedTopic] || [])
        .sort((a, b) => b.value - a.value) // Sắp xếp từ cao xuống thấp
        .slice(0, maxDisplayItems) // Lấy số lượng từ khóa cần hiển thị
    : [];

  // Cập nhật giá trị tối đa dựa trên dữ liệu
  useEffect(() => {
    if (chartData.length > 0) {
      const highestValue = chartData[0]?.value || 0;
      // Làm tròn lên đến 5 gần nhất và thêm 5% đệm
      const newMaxValue = Math.ceil(highestValue / 5) * 5;
      setMaxValue(newMaxValue);
    } else {
      setMaxValue(20); // Giá trị mặc định
    }
  }, [chartData]);

  // Tạo dải màu gradient cho thanh
  const gradientId = selectedTopic
    ? `gradient-${selectedTopic}`
    : "default-gradient";
  const gradientColors = selectedTopic
    ? getGradientColors(topicColors[selectedTopic] || "#8884d8")
    : { start: "#8884d8", end: "#8884d8" };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const topicColor = selectedTopic ? topicColors[selectedTopic] : "#8884d8";

      return (
        <div
          className="bg-card p-3 rounded-lg border shadow-md"
          style={{
            borderLeft: `4px solid ${topicColor}`,
          }}
        >
          <p className="font-medium text-base mb-1">{data.text}</p>
          <div className="flex items-center gap-2">
            <div className="w-full bg-muted h-1.5 rounded-full">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(data.value / maxValue) * 100}%`,
                  background: `linear-gradient(to right, ${gradientColors.start}, ${gradientColors.end})`,
                }}
              />
            </div>
            <span className="font-semibold">{data.value}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Label renderer for the bars
  const renderCustomizedLabel = (props: any) => {
    const { x, y, width, value, height } = props;
    const valueLabel = `${value}%`;
    const labelX = x + width + 5;
    const labelY = y + height / 2;

    // Hiển thị label khi animation hoàn thành
    if (!animationComplete) return null;

    return (
      <text
        x={labelX}
        y={labelY}
        fill="#888"
        textAnchor="start"
        dominantBaseline="middle"
        fontSize={12}
        fontWeight={500}
      >
        {valueLabel}
      </text>
    );
  };

  // Tạo các giá trị ticks cho trục X
  const xAxisTicks = Array.from(
    { length: Math.floor(maxValue / 5) + 1 },
    (_, i) => i * 5
  );

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-4">
          <CardTitle>Top Keywords by Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Loading data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle>Top Keywords by Topic</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={selectedTopic || undefined}
          onValueChange={(value) => {
            setSelectedTopic(value);
          }}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 h-auto mb-6 px-1 py-2 justify-items-center items-center">
            {topics.map((topic) => {
              const isActive = selectedTopic === topic;
              const topicColor = topicColors[topic] || "#8884d8";

              return (
                <TabsTrigger
                  key={topic}
                  value={topic}
                  className={`text-xs py-1.5 px-3 rounded-full transition-all truncate ${
                    isActive ? "font-medium" : "opacity-70"
                  }`}
                  style={{
                    backgroundColor: isActive
                      ? `${topicColor}20`
                      : "transparent",
                    borderColor: topicColor,
                    border: isActive
                      ? `1px solid ${topicColor}`
                      : "1px solid transparent",
                    maxWidth: "95%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={formatTopicName(topic)} // Hiển thị tên đầy đủ khi hover
                >
                  {shortenTopicName(topic)}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* SVG defs for gradients */}
          <svg style={{ height: 0 }}>
            {topics.map((topic) => {
              const colors = getGradientColors(topicColors[topic] || "#8884d8");
              return (
                <defs key={`gradient-def-${topic}`}>
                  <linearGradient
                    id={`gradient-${topic}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor={colors.start} />
                    <stop offset="100%" stopColor={colors.end} />
                  </linearGradient>
                </defs>
              );
            })}
          </svg>

          {selectedTopic ? (
            <TabsContent
              key={selectedTopic}
              value={selectedTopic}
              className="mt-0"
            >
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 70, left: 90, bottom: 5 }}
                    onMouseMove={(e) => {
                      if (e.activeTooltipIndex !== undefined) {
                        setHoverIndex(e.activeTooltipIndex);
                      }
                    }}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <XAxis
                      type="number"
                      domain={[0, maxValue]}
                      tickFormatter={(value) => `${value}%`}
                      tick={{ fontSize: 12, fill: "#888888" }}
                      axisLine={{ stroke: "#e5e7eb" }}
                      tickLine={false}
                      ticks={xAxisTicks}
                    />
                    <YAxis
                      type="category"
                      dataKey="text"
                      width={80}
                      tick={{ fontSize: 13, fill: "#444444" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "rgba(0,0,0,0.05)" }}
                    />
                    <Bar
                      dataKey="value"
                      barSize={26}
                      radius={[0, 4, 4, 0]}
                      animationDuration={800}
                      animationEasing="ease-in-out"
                      onAnimationEnd={() => setAnimationComplete(true)}
                    >
                      <LabelList
                        dataKey="value"
                        content={renderCustomizedLabel}
                      />
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`url(#${gradientId})`}
                          fillOpacity={
                            hoverIndex === null
                              ? 1
                              : hoverIndex === index
                              ? 1
                              : 0.6
                          }
                          style={{
                            transition: "fill-opacity 0.3s",
                            cursor: "pointer",
                          }}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {chartData.length === 0 && (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  There is no keyword data for this topic.
                </div>
              )}
            </TabsContent>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground">
              <p className="mb-3">Vui lòng chọn một chủ đề để xem từ khóa</p>
              <div className="flex gap-2 flex-wrap justify-center">
                {topics.slice(0, 3).map((topic) => (
                  <Button
                    key={topic}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTopic(topic)}
                    className="text-xs"
                    style={{
                      borderColor: topicColors[topic] || "#8884d8",
                    }}
                  >
                    {shortenTopicName(topic, 15)}
                  </Button>
                ))}
                {topics.length > 3 && (
                  <Button variant="outline" size="sm" className="text-xs">
                    +{topics.length - 3} chủ đề khác
                  </Button>
                )}
              </div>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
