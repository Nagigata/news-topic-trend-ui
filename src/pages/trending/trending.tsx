import { useRef } from "react";
import { Header } from "@/components/custom/header";
import {
  BarChart,
  generateSampleChartData,
} from "@/components/custom/BarChart";
import {
  RankingList,
  topArticles,
  trendingTopics,
} from "@/components/custom/RankingList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Trending = () => {
  // Create chart data once and store
  const chartData = useRef(generateSampleChartData());

  return (
    <div className="flex flex-col h-full bg-background">
      <Header />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold text-foreground">
              Content Discovery
            </h1>
          </div>

          {/* Bar Chart Component */}
          <Card className="mb-6">
            <CardHeader className="pb-6">
              <CardTitle>Topic distribution over time</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={chartData.current} height="400px" />
            </CardContent>
          </Card>

          {/* Ranking List Component */}
          <Card className="mb-6">
            <CardHeader className="pb-2"></CardHeader>
            <CardContent>
              <Tabs defaultValue="today" className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="today" className="text-xs sm:text-sm">
                    Popular Today
                  </TabsTrigger>
                  <TabsTrigger value="week" className="text-xs sm:text-sm">
                    Popular This Week
                  </TabsTrigger>
                  <TabsTrigger value="month" className="text-xs sm:text-sm">
                    Popular This Month
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="text-xs sm:text-sm">
                    Hot Keywords
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="today">
                  <RankingList items={topArticles} type="article" />
                </TabsContent>
                <TabsContent value="week">
                  <RankingList items={topArticles} type="article" />
                </TabsContent>
                <TabsContent value="month">
                  <RankingList items={topArticles} type="article" />
                </TabsContent>
                <TabsContent value="trending">
                  <RankingList items={trendingTopics} type="topic" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
