interface KeywordBarChartTooltipProps {
  active?: boolean;
  payload?: any[];
  topicColor: string;
}

export function KeywordBarChartTooltip({
  active,
  payload,
  topicColor,
}: KeywordBarChartTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div
        className="bg-card p-3 rounded-lg border shadow-md"
        style={{
          borderLeft: `4px solid ${topicColor}`,
        }}
      >
        <p className="font-medium text-base mb-1">{data.text}</p>
        <span className="font-semibold">{data.value}%</span>
      </div>
    );
  }
  return null;
}
