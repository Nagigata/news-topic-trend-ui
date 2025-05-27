import { useEffect, useState } from "react";
import { Header } from "@/components/custom/header";
import { ChartDataPoint, LineChart } from "@/components/custom/TrendLineChart";
import { TimeRangePicker } from "@/components/custom/TimeRangePicker";
import {
  TimeRangeSelect,
  TimeRange,
} from "@/components/custom/TimeRangeSelect";
import {
  KeywordBarChart,
  KeywordItem,
} from "@/components/custom/KeywordBarChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { startOfWeek, format } from "date-fns";

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
    `${
      import.meta.env.VITE_BASE_API_URL
    }/lda/topic-trends/?month=${month}&year=${year}`,
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    }
  );

  const data = await response.json();
  console.log(data);
  return data;
};

export const Analytics = () => {
  const currentMonth = String(new Date().getMonth() + 1);
  const [selectedTime, setSelectedTime] = useState(currentMonth);
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
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
        const data = await fetchTrendData(parseInt(selectedTime), 2025);
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
  }, [selectedTime, timeRange]);

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);

    // Tính toán giá trị mặc định dựa trên loại khoảng thời gian
    if (range === "week") {
      const currentDate = new Date();
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      setSelectedTime(format(weekStart, "yyyy-MM-dd"));
    } else if (range === "month") {
      setSelectedTime(String(new Date().getMonth() + 1));
    } else if (range === "quarter") {
      setSelectedTime(String(Math.floor(new Date().getMonth() / 3) + 1));
    } else if (range === "year") {
      setSelectedTime(String(new Date().getFullYear()));
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <Header />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold text-foreground">
              Thống kê phân tích
            </h1>

            <div className="flex gap-4">
              <TimeRangeSelect
                selectedRange={timeRange}
                onRangeChange={handleTimeRangeChange}
              />
              <TimeRangePicker
                selectedTime={selectedTime}
                onTimeChange={handleTimeChange}
                timeRange={timeRange}
              />
            </div>
          </div>

          {/* Line Chart in Card */}
          <Card className="mb-6">
            <CardHeader className="pb-6">
              <CardTitle>Xu hướng chủ đề</CardTitle>
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
