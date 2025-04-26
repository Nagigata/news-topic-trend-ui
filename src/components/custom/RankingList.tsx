import { Button } from "@/components/ui/button";
import { ArrowUpRight, TrendingUp } from "lucide-react";

// Interfaces for different item types
export interface Article {
  title: string;
  category: string;
  views: number;
}

export interface Topic {
  topic: string;
  category: string;
  growth: string;
  articles: number;
}

// Sample trending topics data
export const trendingTopics: Topic[] = [
  {
    topic: "Artificial Intelligence",
    category: "Technology",
    growth: "+45%",
    articles: 250,
  },
  {
    topic: "Global Economy",
    category: "Economics",
    growth: "+38%",
    articles: 180,
  },
  {
    topic: "Remote Work",
    category: "Society",
    growth: "+35%",
    articles: 165,
  },
  {
    topic: "Digital Education",
    category: "Education",
    growth: "+30%",
    articles: 145,
  },
  {
    topic: "Public Health",
    category: "Health",
    growth: "+28%",
    articles: 130,
  },
];

// Sample articles data
export const topArticles: Article[] = [
  {
    title: "Impact of AI on the Job Market",
    category: "Technology",
    views: 1500,
  },
  {
    title: "New Corporate Tax Policy Changes",
    category: "Economics",
    views: 1200,
  },
  {
    title: "The Future of Online Education",
    category: "Education",
    views: 1000,
  },
  {
    title: "Latest Vaccine Developments",
    category: "Health",
    views: 950,
  },
  {
    title: "Changes in Foreign Policy",
    category: "Politics",
    views: 900,
  },
];

// Props for the RankingList component
interface RankingListProps<T extends Article | Topic> {
  items: T[];
  type: "article" | "topic";
}

export function RankingList<T extends Article | Topic>({
  items,
  type,
}: RankingListProps<T>) {
  // Render function for each item type
  const renderItem = (item: T, index: number) => {
    if (type === "article") {
      const article = item as Article;
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
                {article.title}
              </h3>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                {article.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground ml-4">
            <TrendingUp className="h-3 w-3" />
            {article.views.toLocaleString()} views
          </div>
        </Button>
      );
    } else {
      const topic = item as Topic;
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
                {topic.topic}
              </h3>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                {topic.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm font-medium text-primary">
              {topic.growth}
            </span>
            <span className="text-sm text-muted-foreground">
              {topic.articles} articles
            </span>
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
