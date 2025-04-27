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
} from "recharts";

// Interface cho từng keyword
export interface KeywordItem {
  text: string;
  value: number;
  category: string;
}

// Tất cả keywords theo topic
// const keywordsData: { [key: string]: KeywordItem[] } = {
//   Politics: [
//     { text: "Elections", value: 80, category: "Politics" },
//     { text: "Democracy", value: 70, category: "Politics" },
//     { text: "Policy Reform", value: 65, category: "Politics" },
//     { text: "Legislation", value: 60, category: "Politics" },
//     { text: "International Relations", value: 55, category: "Politics" },
//     { text: "Voting Rights", value: 50, category: "Politics" },
//     { text: "Immigration", value: 45, category: "Politics" },
//     { text: "Political Parties", value: 42, category: "Politics" },
//     { text: "National Security", value: 40, category: "Politics" },
//     { text: "Foreign Policy", value: 38, category: "Politics" },
//   ],

//   Economics: [
//     { text: "Inflation", value: 78, category: "Economics" },
//     { text: "GDP Growth", value: 65, category: "Economics" },
//     { text: "Interest Rates", value: 62, category: "Economics" },
//     { text: "Stock Market", value: 58, category: "Economics" },
//     { text: "Fiscal Policy", value: 52, category: "Economics" },
//     { text: "Cryptocurrency", value: 48, category: "Economics" },
//     { text: "Global Trade", value: 45, category: "Economics" },
//     { text: "Supply Chain", value: 42, category: "Economics" },
//     { text: "Employment", value: 40, category: "Economics" },
//     { text: "Consumer Spending", value: 38, category: "Economics" },
//   ],
//   Technology: [
//     { text: "AI", value: 85, category: "Technology" },
//     { text: "Machine Learning", value: 72, category: "Technology" },
//     { text: "Blockchain", value: 65, category: "Technology" },
//     { text: "Quantum Computing", value: 58, category: "Technology" },
//     { text: "Cloud Computing", value: 52, category: "Technology" },
//     { text: "Robotics", value: 48, category: "Technology" },
//     { text: "IoT", value: 46, category: "Technology" },
//     { text: "5G", value: 43, category: "Technology" },
//     { text: "Cybersecurity", value: 42, category: "Technology" },
//     { text: "VR/AR", value: 38, category: "Technology" },
//   ],
//   Health: [
//     { text: "COVID-19", value: 82, category: "Health" },
//     { text: "Vaccines", value: 70, category: "Health" },
//     { text: "Mental Health", value: 65, category: "Health" },
//     { text: "Telemedicine", value: 58, category: "Health" },
//     { text: "Healthcare Policy", value: 52, category: "Health" },
//     { text: "Wellness", value: 48, category: "Health" },
//     { text: "Chronic Disease", value: 45, category: "Health" },
//     { text: "Public Health", value: 42, category: "Health" },
//     { text: "Medical Research", value: 40, category: "Health" },
//     { text: "Nutrition", value: 38, category: "Health" },
//   ],

//   Education: [
//     { text: "Online Learning", value: 75, category: "Education" },
//     { text: "Digital Literacy", value: 65, category: "Education" },
//     { text: "Educational Technology", value: 60, category: "Education" },
//     { text: "Student Debt", value: 55, category: "Education" },
//     { text: "STEM Education", value: 50, category: "Education" },
//     { text: "Higher Education", value: 48, category: "Education" },
//     { text: "K-12", value: 45, category: "Education" },
//     { text: "Teachers", value: 42, category: "Education" },
//     { text: "Education Reform", value: 40, category: "Education" },
//     { text: "Academic Research", value: 38, category: "Education" },
//   ],
//   Society: [
//     { text: "Social Media", value: 85, category: "Society" },
//     { text: "Cultural Trends", value: 72, category: "Society" },
//     { text: "Diversity & Inclusion", value: 68, category: "Society" },
//     { text: "Urban Development", value: 62, category: "Society" },
//     { text: "Family Structure", value: 55, category: "Society" },
//     { text: "Generation Gap", value: 52, category: "Society" },
//     { text: "Social Movements", value: 48, category: "Society" },
//     { text: "Community Building", value: 45, category: "Society" },
//     { text: "Social Norms", value: 42, category: "Society" },
//     { text: "Digital Society", value: 40, category: "Society" },
//   ],
// };

// // Danh sách các topic
// const topics = [
//   "Politics",
//   "Economics",
//   "Technology",
//   "Health",
//   "Education",
//   "Society",
// ];

// // Màu sắc cho từng topic
// const topicColors = {
//   Politics: "hsl(var(--chart-1))",
//   Economics: "hsl(var(--chart-2))",
//   Technology: "hsl(var(--chart-3))",
//   Health: "hsl(var(--chart-4))",
//   Education: "hsl(var(--chart-5))",
//   Society: "hsl(var(--chart-6))",
// };

// // Tạo mảng màu cho các thanh trong biểu đồ
// const generateColors = (topic: string, count: number) => {
//   const baseColor = topicColors[topic as keyof typeof topicColors];
//   const baseHsl = baseColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);

//   if (!baseHsl) return Array(count).fill(baseColor);

//   const hue = parseInt(baseHsl[1]);
//   const saturation = parseInt(baseHsl[2]);
//   const baseLightness = parseInt(baseHsl[3]);

//   return Array.from({ length: count }, (_, i) => {
//     // Giảm dần độ sáng cho các thanh từ trên xuống dưới
//     const lightness = Math.max(baseLightness - i * 1.5, baseLightness * 0.7);
//     return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
//   });
// };

interface KeywordBarChartProps {
  keywordsData: { [key: string]: KeywordItem[] };
  topics: string[];
  topicColors: { [key: string]: string };
  className?: string;
}

// Tạo màu cho các thanh dựa trên màu chủ đề
const generateBarColors = (topicColor: string, count: number) => {
  const baseHsl = topicColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!baseHsl) return Array(count).fill(topicColor);

  const hue = parseInt(baseHsl[1]);
  const saturation = parseInt(baseHsl[2]);
  const baseLightness = parseInt(baseHsl[3]);

  return Array.from({ length: count }, (_, i) => {
    const lightness = Math.max(baseLightness - i * 1.5, baseLightness * 0.7);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  });
};

// Chuyển đổi nhãn chủ đề thành dạng dễ đọc
const formatTopicName = (topic: string) => {
  return topic
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function KeywordBarChart({
  keywordsData,
  topics,
  topicColors,
  className,
}: KeywordBarChartProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(
    topics[0] || null
  );
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // // Tính toán dữ liệu biểu đồ từ các từ khóa đã sắp xếp
  // const chartData = keywordsData[selectedTopic]
  //   .sort((a, b) => b.value - a.value) // Sắp xếp từ cao xuống thấp
  //   .slice(0, 10); // Lấy 10 từ khóa hàng đầu

  // Cập nhật selectedTopic khi topics thay đổi
  useEffect(() => {
    if (
      topics.length > 0 &&
      (!selectedTopic || !topics.includes(selectedTopic))
    ) {
      setSelectedTopic(topics[0]);
    }
  }, [topics, selectedTopic]);

  const chartData = selectedTopic
    ? keywordsData[selectedTopic]
        ?.sort((a, b) => b.value - a.value) // Sắp xếp từ cao xuống thấp
        .slice(0, 10) // Lấy 10 từ khóa hàng đầu
    : [];

  // Tạo mảng màu cho các thanh
  const barColors =
    selectedTopic && topicColors[selectedTopic]
      ? generateBarColors(topicColors[selectedTopic], chartData.length)
      : [];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card p-2 rounded-md border shadow-sm">
          <p className="font-medium">{data.text}</p>
          <p className="text-sm text-muted-foreground">
            Frequency: <span className="font-medium">{data.value}%</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Category: <span className="font-medium">{data.category}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-6">
        <CardTitle>Top Keywords by Topic</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={selectedTopic || undefined}
          onValueChange={setSelectedTopic}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 mb-6">
            {topics.map((topic) => (
              <TabsTrigger
                key={topic}
                value={topic}
                className="text-xs sm:text-sm capitalize"
              >
                {formatTopicName(topic)}
              </TabsTrigger>
            ))}
          </TabsList>

          {topics.map((topic) => (
            <TabsContent key={topic} value={topic} className="mt-0">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
                    onMouseMove={(e) => {
                      if (e.activeTooltipIndex !== undefined) {
                        setHoverIndex(e.activeTooltipIndex);
                      }
                    }}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="text"
                      width={80}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "hsl(var(--muted))" }}
                    />
                    <Bar
                      dataKey="value"
                      barSize={28}
                      radius={[0, 4, 4, 0]}
                      animationDuration={500}
                    >
                      {chartData?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={barColors[index]}
                          fillOpacity={
                            hoverIndex === null || hoverIndex === index
                              ? 1
                              : 0.6
                          }
                          className="transition-opacity duration-300"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
