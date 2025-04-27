import { useEffect, useState } from "react";
import { Header } from "@/components/custom/header";
import { ChartDataPoint, LineChart } from "@/components/custom/LineChart";
import { MonthPicker } from "@/components/custom/MonthPicker";
import {
  KeywordBarChart,
  KeywordItem,
} from "@/components/custom/KeywordBarChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Tạo màu dựa trên hash của topic
const generateTopicColors = (topics: string[]) => {
  const colors: { [key: string]: string } = {};
  topics.forEach((topic, index) => {
    const hash = topic
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    colors[topic] = `hsl(${hue}, 70%, 50%)`;
  });
  return colors;
};

const fetchTrendData = async (month: number, year: number) => {
  const response = await fetch(
    `http://localhost:8000/lda/topic-trends/?month=${month}&year=${year}`
  );
  const data = await response.json();
  return data;
};

export const Analytics = () => {
  const [selectedMonth, setSelectedMonth] = useState("4");
  // const chartData = generateMonthlyData(parseInt(selectedMonth) - 1, 2025);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [keywordsData, setKeywordsData] = useState<{
    [key: string]: KeywordItem[];
  }>({});
  const [topicColors, setTopicColors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchTrendData(parseInt(selectedMonth), 2025).then((data) => {
      setChartData(data.data);
      setTopics(data.topics);
      setTopicColors(generateTopicColors(data.topics));
      setKeywordsData(data.keywords);
    });
  }, [selectedMonth]);

  return (
    <div className="flex flex-col h-full bg-background">
      <Header />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold text-foreground">
              Analytics Dashboard
            </h1>

            <MonthPicker
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          </div>

          {/* Line Chart in Card */}
          <Card className="mb-6">
            <CardHeader className="pb-6">
              <CardTitle>Monthly Topic Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={chartData}
                topics={topics}
                topicColors={topicColors}
                height="500px"
              />
            </CardContent>
          </Card>

          {/* Keyword Bar Chart */}
          <KeywordBarChart
            keywordsData={keywordsData}
            topics={topics.slice(1, 6)}
            topicColors={topicColors}
            className="mb-6"
          />
        </div>
      </div>
    </div>
  );
};
