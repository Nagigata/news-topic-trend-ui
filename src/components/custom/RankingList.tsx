import { Button } from "@/components/ui/button";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Interfaces for different item types
export interface Paper {
  source: string;
  url: string;
  title: string;
}

export interface PopularTopic {
  topic_name: string;
  count: number;
  papers: Paper[];
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
  const limitedItems = items.slice(0, 5);

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

          <Dialog>
            <DialogTrigger asChild>
              <div className="flex items-center gap-1 text-sm text-muted-foreground ml-4 cursor-pointer hover:text-primary">
                <TrendingUp className="h-3 w-3" />
                {topic.count.toLocaleString()} bài báo
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  Danh sách bài báo về {topic.topic_name}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {topic.papers.map((paper, idx) => (
                  <a
                    key={idx}
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="text-base font-medium mb-1">
                      {paper.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Nguồn: {paper.source}
                    </div>
                  </a>
                ))}
              </div>
            </DialogContent>
          </Dialog>
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
      {limitedItems.map((item, index) => renderItem(item, index))}
    </div>
  );
}
