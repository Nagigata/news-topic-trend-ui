import { Button } from "@/components/ui/button";
import { ArrowUpRight, TrendingUp } from "lucide-react";

// Interfaces for different item types
export interface PopularTopic {
  topic_name: string;
  count: number;
}

export interface HotKeyword {
  top_category: string;
  top_keywords: string[];
}

// Props for the RankingList component
interface RankingListProps<T extends PopularTopic | HotKeyword> {
  items: T[];
  type: "popular" | "hot";
}

export function RankingList<T extends PopularTopic | HotKeyword>({
  items,
  type,
}: RankingListProps<T>) {
  // Render function for each item type
  const renderItem = (item: T, index: number) => {
    if (type === "popular") {
      const topic = item as PopularTopic;
      return (
        <Button
          key={index}
          variant="ghost"
          className="w-full h-auto py-3 px-4 flex items-center gap-4 text-left hover:bg-accent/50 group"
        >
          <span className="text-muted-foreground min-w-[2rem]">
            {index + 1}.
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary">
                {topic.topic_name}
              </h3>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground ml-4">
            <TrendingUp className="h-3 w-3" />
            {topic.count.toLocaleString()} bài báo
          </div>
        </Button>
      );
    } else {
      const keyword = item as HotKeyword;
      return (
        <Button
          key={index}
          variant="ghost"
          className="w-full h-auto py-3 px-4 flex items-center gap-4 text-left hover:bg-accent/50 group"
        >
          <span className="text-muted-foreground min-w-[2rem]">
            {index + 1}.
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary">
                {keyword.top_category}
              </h3>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center gap-3 mt-1">
              {keyword.top_keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </Button>
      );
    }
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => renderItem(item, index))}
    </div>
  );
}
