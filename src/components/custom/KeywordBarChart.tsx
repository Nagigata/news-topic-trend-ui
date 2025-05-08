import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { KeywordBarChartTabs } from "./KeywordBarChart/KeywordBarChartTabs";
import { KeywordBarChartTooltip } from "./KeywordBarChart/KeywordBarChartTooltip";

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
import {
  shortenTopicName,
  getGradientColors,
  getGradientId,
  generateAxisTicks,
  getDefaultColor,
} from "./utils";

// Interface for each keyword
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

// Label renderer for the bars
const renderCustomizedLabel = (props: any) => {
  const { x, y, width, value, height } = props;
  const valueLabel = `${value}%`;
  const labelX = x + width + 5;
  const labelY = y + height / 2;

  // Only display label when animation is complete
  if (!props.animationComplete) return null;

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
  // Update selectedTopic when topics change
  useEffect(() => {
    if (
      topics.length > 0 &&
      (!selectedTopic || !topics.includes(selectedTopic))
    ) {
      setSelectedTopic(topics[0]);
    }
  }, [topics, selectedTopic]);

  // Reset animation when changing topic and set it again after animation completes
  useEffect(() => {
    setAnimationComplete(false);
    // Set animation as complete
    const timer = setTimeout(() => setAnimationComplete(true), 800);
    return () => clearTimeout(timer);
  }, [selectedTopic]);

  // Get data for selected topic and calculate maxValue
  const chartData = selectedTopic
    ? (keywordsData[selectedTopic] || [])
        .sort((a, b) => b.value - a.value) // Sort from highest to lowest
        .slice(0, maxDisplayItems) // Get the number of keywords to display
    : [];

  // Update maximum value based on data
  useEffect(() => {
    if (chartData.length > 0) {
      const highestValue = chartData[0]?.value || 0;
      // Round up to nearest 5 and add 5% padding
      const newMaxValue = Math.ceil(highestValue / 5) * 5;
      setMaxValue(newMaxValue);
    } else {
      setMaxValue(20); // Default value
    }
  }, [chartData]);

  // Create gradient color range for bars
  const gradientId = getGradientId(selectedTopic);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-4">
          <CardTitle>Top Keywords by Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Loading data...</p>
            </div>
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
          <KeywordBarChartTabs
            topics={topics}
            selectedTopic={selectedTopic}
            topicColors={topicColors}
            onTopicChange={setSelectedTopic}
          />

          {/* SVG defs for gradients */}
          <svg style={{ height: 0 }}>
            {topics.map((topic) => {
              const colors = getGradientColors(
                getDefaultColor(topicColors[topic])
              );
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
            <div className="h-[400px] w-full">
              {chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  There is no keyword data for this topic.
                </div>
              ) : (
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
                      ticks={generateAxisTicks(maxValue)}
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
                      content={
                        <KeywordBarChartTooltip
                          topicColor={getDefaultColor(
                            topicColors[selectedTopic]
                          )}
                        />
                      }
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
                        content={(props) =>
                          renderCustomizedLabel({ ...props, animationComplete })
                        }
                      />
                      {chartData.map((_, index) => (
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
              )}
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground">
              <p className="mb-3">Please select a topic to view keywords</p>
              <div className="flex gap-2 flex-wrap justify-center">
                {topics.slice(0, 3).map((topic) => (
                  <Button
                    key={topic}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTopic(topic)}
                    className="text-xs"
                    style={{
                      borderColor: getDefaultColor(topicColors[topic]),
                    }}
                  >
                    {shortenTopicName(topic, 15)}
                  </Button>
                ))}
                {topics.length > 3 && (
                  <Button variant="outline" size="sm" className="text-xs">
                    +{topics.length - 3} other topics
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
