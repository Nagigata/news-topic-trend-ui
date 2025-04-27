import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface ChartDataPoint {
  date: string;
  fullDate: string;
  // PoliticsPercent: number;
  // EconomicsPercent: number;
  // TechnologyPercent: number;
  // HealthPercent: number;
  // EducationPercent: number;
  // SocietyPercent: number;
  [key: string]: string | number;
}

interface LineChartProps {
  data: ChartDataPoint[];
  topics: string[];
  topicColors: { [key: string]: string };
  height?: string | number;
}

// Processed categories for percentage display
// const percentCategories = [
//   {
//     name: "PoliticsPercent",
//     displayName: "Politics",
//     color: "hsl(var(--chart-1))",
//   },
//   {
//     name: "EconomicsPercent",
//     displayName: "Economics",
//     color: "hsl(var(--chart-2))",
//   },
//   {
//     name: "TechnologyPercent",
//     displayName: "Technology",
//     color: "hsl(var(--chart-3))",
//   },
//   {
//     name: "HealthPercent",
//     displayName: "Health",
//     color: "hsl(var(--chart-4))",
//   },
//   {
//     name: "EducationPercent",
//     displayName: "Education",
//     color: "hsl(var(--chart-5))",
//   },
//   {
//     name: "SocietyPercent",
//     displayName: "Society",
//     color: "hsl(var(--chart-6))",
//   },
// ];

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
    const fullDate = payload[0].payload.fullDate || `April ${label}, 2025`;

    const sortedData = [...payload]
      .sort((a, b) => b.value - a.value)
      .map((entry) => ({
        name: formatTopicName(entry.dataKey.replace("percentages.", "")),
        color: entry.stroke,
        percentage: entry.value.toFixed(1),
      }));
    // .map((entry) => {
    //   // Get the original category name without "Percent" suffix
    //   const categoryInfo = percentCategories.find(
    //     (c) => c.name === entry.dataKey
    //   );

    //   return {
    //     name: categoryInfo?.displayName || entry.name,
    //     color: entry.stroke,
    //     percentage: entry.value.toFixed(1), // Already a percentage
    //   };
    // });

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
}: LineChartProps) => {
  // Find the maximum percentage value across all data points
  // const maxPercent = Math.max(
  //   ...data.flatMap((item) => [
  //     item.PoliticsPercent || 0,
  //     item.EconomicsPercent || 0,
  //     item.TechnologyPercent || 0,
  //     item.HealthPercent || 0,
  //     item.EducationPercent || 0,
  //     item.SocietyPercent || 0,
  //   ])
  // );
  const maxPercent = Math.max(
    ...data.flatMap((item) =>
      topics.map((topic) => item.percentages?.[topic] || 0)
    )
  );

  // Round up to the nearest 5%
  const yAxisMax = Math.ceil(maxPercent / 5) * 5;

  // Generate ticks at 5% intervals
  const ticks = Array.from({ length: yAxisMax / 5 + 1 }, (_, i) => i * 5);

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis
            domain={[0, yAxisMax]}
            tickFormatter={(value) => `${value}%`}
            ticks={ticks}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) =>
              formatTopicName(value.replace("percentages.", ""))
            }
          />
          {/* {percentCategories.map((category) => (
            <Line
              key={category.name}
              type="monotone"
              name={category.displayName}
              dataKey={category.name}
              stroke={category.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))} */}
          {topics.map((topic) => (
            <Line
              key={topic}
              type="monotone"
              name={`percentages.${topic}`}
              dataKey={`percentages.${topic}`}
              stroke={topicColors[topic] || "#8884d8"}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Helper functions for data generation
export const generateMonthlyData = (month: number, year: number) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthData: ChartDataPoint[] = [];

  let currentDate = new Date(year, month, 1);

  // Giá trị ban đầu cho mỗi chủ đề
  // Technology: đang tăng mạnh
  // Politics: đang giảm
  // Economics: tăng nhẹ
  // Health: ổn định
  // Education: giảm nhẹ
  // Society: biến động nhẹ quanh một giá trị
  let baseValues = {
    Politics: 25,
    Economics: 15,
    Technology: 10,
    Health: 20,
    Education: 18,
    Society: 12,
  };

  for (let i = 0; i < daysInMonth; i++) {
    // Tạo xu hướng rõ ràng cho mỗi chủ đề
    // Technology: tăng dần đều (+0.7/ngày)
    baseValues.Technology = Math.min(baseValues.Technology + 0.7, 35);

    // Politics: giảm mạnh dần (-0.6/ngày)
    baseValues.Politics = Math.max(baseValues.Politics - 0.6, 10);

    // Economics: tăng nhẹ (+0.3/ngày)
    baseValues.Economics = Math.min(baseValues.Economics + 0.3, 25);

    // Health: tương đối ổn định (±0.1)
    baseValues.Health += Math.random() > 0.5 ? 0.1 : -0.1;
    if (baseValues.Health < 19) baseValues.Health = 19;
    if (baseValues.Health > 21) baseValues.Health = 21;

    // Education: giảm nhẹ (-0.2/ngày)
    baseValues.Education = Math.max(baseValues.Education - 0.2, 12);

    // Society: biến động nhẹ quanh 12%
    baseValues.Society += Math.random() - 0.5;
    if (baseValues.Society < 10) baseValues.Society = 10;
    if (baseValues.Society > 14) baseValues.Society = 14;

    // Đảm bảo tổng = 100%
    const total = Object.values(baseValues).reduce((sum, val) => sum + val, 0);
    const normalizedValues = Object.entries(baseValues).map(([key, value]) => [
      key,
      parseFloat(((value / total) * 100).toFixed(1)),
    ]);

    const normalizedObj = Object.fromEntries(normalizedValues);

    monthData.push({
      date: formatDate(currentDate),
      fullDate: formatFullDate(currentDate),
      PoliticsPercent: normalizedObj.Politics,
      EconomicsPercent: normalizedObj.Economics,
      TechnologyPercent: normalizedObj.Technology,
      HealthPercent: normalizedObj.Health,
      EducationPercent: normalizedObj.Education,
      SocietyPercent: normalizedObj.Society,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return monthData;
};

const formatDate = (date: Date): string => {
  return `${date.getDate()}`;
};

const formatFullDate = (date: Date): string => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};
