import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { shortenTopicName, getDefaultColor } from "../utils";

interface KeywordBarChartTabsProps {
  topics: string[];
  selectedTopic: string | null;
  topicColors: { [key: string]: string };
  onTopicChange: (topic: string) => void;
}

export function KeywordBarChartTabs({
  topics,
  selectedTopic,
  topicColors,
  onTopicChange,
}: KeywordBarChartTabsProps) {
  return (
    <TabsList className="grid grid-cols-5 gap-2 h-auto mb-6 px-1 py-2">
      {topics.map((topic) => {
        const isActive = selectedTopic === topic;
        const topicColor = getDefaultColor(topicColors[topic]);

        return (
          <TabsTrigger
            key={topic}
            value={topic}
            className={`text-xs py-1.5 px-3 rounded-full transition-all truncate ${
              isActive ? "font-medium" : "opacity-70"
            }`}
            style={{
              backgroundColor: isActive ? `${topicColor}20` : "transparent",
              borderColor: topicColor,
              border: isActive
                ? `1px solid ${topicColor}`
                : "1px solid transparent",
              width: "100%",
              height: "100%",
              minHeight: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={topic}
            onClick={() => onTopicChange(topic)}
          >
            {shortenTopicName(topic)}
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}
