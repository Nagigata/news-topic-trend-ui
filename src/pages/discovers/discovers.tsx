import { Header } from "@/components/custom/header";
import {
  RankingList,
  PopularTopic,
  HotKeyword,
} from "@/components/custom/RankingList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Loader2, Flame, Snowflake } from "lucide-react";

export const Discovers = () => {
  const [todayTopics, setTodayTopics] = useState<PopularTopic[]>([]);
  const [weekTopics, setWeekTopics] = useState<PopularTopic[]>([]);
  const [weekHotTopics, setWeekHotTopics] = useState<string[]>([]);
  const [weekColdTopics, setWeekColdTopics] = useState<string[]>([]);
  const [monthTopics, setMonthTopics] = useState<PopularTopic[]>([]);
  const [monthHotTopics, setMonthHotTopics] = useState<string[]>([]);
  const [monthColdTopics, setMonthColdTopics] = useState<string[]>([]);
  const [hotKeywords, setHotKeywords] = useState<HotKeyword[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BASE_API_URL;
        const fetchOptions: RequestInit = {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
          mode: "cors" as RequestMode,
        };

        const [todayRes, weekRes, monthRes, hotRes] = await Promise.all([
          fetch(`${baseUrl}/lda/popular-topics-today/`, fetchOptions),
          fetch(`${baseUrl}/lda/popular-topics-this-week/`, fetchOptions),
          fetch(`${baseUrl}/lda/popular-topics-this-month/`, fetchOptions),
          fetch(`${baseUrl}/lda/hot-keywords`, fetchOptions),
        ]);

        const [todayData, weekData, monthData, hotData] = await Promise.all([
          todayRes.json(),
          weekRes.json(),
          monthRes.json(),
          hotRes.json(),
        ]);

        setTodayTopics(todayData.results);
        setWeekTopics(weekData.results);
        setWeekHotTopics(weekData.hot_topics || []);
        setWeekColdTopics(weekData.cold_topics || []);
        setMonthTopics(monthData.results);
        setMonthHotTopics(monthData.hot_topics || []);
        setMonthColdTopics(monthData.cold_topics || []);

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
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Chủ đề phổ biến
                        </h3>
                        <RankingList items={weekTopics} type="popular" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="rounded-lg border bg-gradient-to-br from-red-50 to-transparent dark:from-red-950/20 dark:to-transparent p-4">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-600 dark:text-red-400">
                            <Flame className="h-5 w-5" />
                            Chủ đề hot
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                              (Xu hướng tăng)
                            </span>
                          </h3>
                          <div className="space-y-2">
                            {weekHotTopics.map((topic, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded-md"
                              >
                                <span className="text-muted-foreground min-w-[2rem]">
                                  {index + 1}.
                                </span>
                                <span className="font-medium">{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent p-4">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <Snowflake className="h-5 w-5" />
                            Chủ đề cold
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                              (Xu hướng giảm)
                            </span>
                          </h3>
                          <div className="space-y-2">
                            {weekColdTopics.map((topic, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded-md"
                              >
                                <span className="text-muted-foreground min-w-[2rem]">
                                  {index + 1}.
                                </span>
                                <span className="font-medium">{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
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
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Chủ đề phổ biến
                        </h3>
                        <RankingList items={monthTopics} type="popular" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="rounded-lg border bg-gradient-to-br from-red-50 to-transparent dark:from-red-950/20 dark:to-transparent p-4">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-600 dark:text-red-400">
                            <Flame className="h-5 w-5" />
                            Chủ đề hot
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                              (Xu hướng tăng)
                            </span>
                          </h3>
                          <div className="space-y-2">
                            {monthHotTopics.map((topic, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded-md"
                              >
                                <span className="text-muted-foreground min-w-[2rem]">
                                  {index + 1}.
                                </span>
                                <span className="font-medium">{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent p-4">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <Snowflake className="h-5 w-5" />
                            Chủ đề cold
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                              (Xu hướng giảm)
                            </span>
                          </h3>
                          <div className="space-y-2">
                            {monthColdTopics.map((topic, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded-md"
                              >
                                <span className="text-muted-foreground min-w-[2rem]">
                                  {index + 1}.
                                </span>
                                <span className="font-medium">{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
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
