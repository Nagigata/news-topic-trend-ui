import { useEffect, useState } from "react";
import { Header } from "@/components/custom/header";
import { ChartDataPoint, LineChart } from "@/components/custom/TrendLineChart";
import { MonthPicker } from "@/components/custom/MonthPicker";
import {
  KeywordBarChart,
  KeywordItem,
} from "@/components/custom/KeywordBarChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Generate color based on topic hash
const generateTopicColors = (topics: string[]) => {
  const colors: { [key: string]: string } = {};
  topics.forEach((topic) => {
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
  console.log(data);
  return data;
};

export const Analytics = () => {
  const currentMonth = String(new Date().getMonth() + 1);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [keywordsData, setKeywordsData] = useState<{
    [key: string]: KeywordItem[];
  }>({});
  const [topicColors, setTopicColors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTrendData(parseInt(selectedMonth), 2025);
        setChartData(data.data);
        setTopics(data.topics);
        setTopicColors(generateTopicColors(data.topics));
        setKeywordsData(data.keywords);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

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
              onMonthChange={handleMonthChange}
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
                maxVisibleTopics={4}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          {/* Keyword Bar Chart */}
          <KeywordBarChart
            keywordsData={keywordsData}
            topics={topics}
            topicColors={topicColors}
            className="mb-6"
            maxDisplayItems={10}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
