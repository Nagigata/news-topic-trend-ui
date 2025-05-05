import { shortenTopicName, formatTopicName } from "../utils";

interface CustomLegendProps {
  payload: any[];
  visibleTopics: Set<string>;
  hoveredTopic: string | null;
  onToggleTopic: (topic: string) => void;
  onHoverTopic: (topic: string | null) => void;
}

export const CustomLegend = ({
  payload,
  visibleTopics,
  hoveredTopic,
  onToggleTopic,
  onHoverTopic,
}: CustomLegendProps) => {
  return (
    <div className="grid grid-cols-5 gap-3 mt-5">
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
            onClick={() => onToggleTopic(topic)}
            onMouseEnter={() => onHoverTopic(topic)}
            onMouseLeave={() => onHoverTopic(null)}
            title={formatTopicName(topic)}
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs font-medium truncate">
              {shortenTopicName(topic)}
            </span>
          </div>
        );
      })}
    </div>
  );
};
