import { Header } from "@/components/custom/header";
import {
  RankingList,
  PopularTopic,
  HotKeyword,
} from "@/components/custom/RankingList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export const Discovers = () => {
  const [todayTopics, setTodayTopics] = useState<PopularTopic[]>([]);
  const [weekTopics, setWeekTopics] = useState<PopularTopic[]>([]);
  const [monthTopics, setMonthTopics] = useState<PopularTopic[]>([]);
  const [hotKeywords, setHotKeywords] = useState<HotKeyword[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BASE_API_URL;
        const [todayRes, weekRes, monthRes, hotRes] = await Promise.all([
          fetch(`${baseUrl}/lda/popular-topics-today/`),
          fetch(`${baseUrl}/lda/popular-topics-this-week/`),
          fetch(`${baseUrl}/lda/popular-topics-this-month/`),
          fetch(`${baseUrl}/lda/hot-keywords`),
        ]);

        const [todayData, weekData, monthData, hotData] = await Promise.all([
          todayRes.json(),
          weekRes.json(),
          monthRes.json(),
          hotRes.json(),
        ]);

        setTodayTopics(todayData.results);
        setWeekTopics(weekData.results);
        setMonthTopics(monthData.results);

        // Convert hot keywords response to array
        const hotKeywordsArray = Object.values(hotData.results) as HotKeyword[];
        setHotKeywords(hotKeywordsArray);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-full bg-background">
      <Header />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Khám phá nội dung
              </h1>
            </div>
          </div>

          {/* Ranking List Component */}
          <Card className="mb-6">
            <CardHeader className="pb-6">
              <CardTitle>Xếp hạng nội dung</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="today" className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="today" className="text-xs sm:text-sm">
                    Phổ biến hôm nay
                  </TabsTrigger>
                  <TabsTrigger value="week" className="text-xs sm:text-sm">
                    Phổ biến tuần này
                  </TabsTrigger>
                  <TabsTrigger value="month" className="text-xs sm:text-sm">
                    Phổ biến tháng này
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="text-xs sm:text-sm">
                    Từ khóa nổi bật
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="today">
                  {loading ? (
                    <div className="flex flex-col items-center gap-3 py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Đang tải dữ liệu...
                      </p>
                    </div>
                  ) : (
                    <RankingList items={todayTopics} type="popular" />
                  )}
                </TabsContent>
                <TabsContent value="week">
                  {loading ? (
                    <div className="flex flex-col items-center gap-3 py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Đang tải dữ liệu...
                      </p>
                    </div>
                  ) : (
                    <RankingList items={weekTopics} type="popular" />
                  )}
                </TabsContent>
                <TabsContent value="month">
                  {loading ? (
                    <div className="flex flex-col items-center gap-3 py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Đang tải dữ liệu...
                      </p>
                    </div>
                  ) : (
                    <RankingList items={monthTopics} type="popular" />
                  )}
                </TabsContent>
                <TabsContent value="trending">
                  {loading ? (
                    <div className="flex flex-col items-center gap-3 py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Đang tải dữ liệu...
                      </p>
                    </div>
                  ) : (
                    <RankingList items={hotKeywords} type="hot" />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
