import { useState } from "react";
import { Header } from "@/components/custom/header";
import { LineChart, generateMonthlyData } from "@/components/custom/LineChart";
import { MonthPicker } from "@/components/custom/MonthPicker";
import { KeywordBarChart } from "@/components/custom/KeywordBarChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Analytics = () => {
  const [selectedMonth, setSelectedMonth] = useState("4");
  const chartData = generateMonthlyData(parseInt(selectedMonth) - 1, 2025);

  return (
    <div className="flex flex-col h-full bg-background">
      <Header />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold text-foreground">
              Analytics Dashboard
            </h1>

            <MonthPicker
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          </div>

          {/* Line Chart in Card */}
          <Card className="mb-6">
            <CardHeader className="pb-6">
              <CardTitle>Monthly Topic Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={chartData} height="500px" />
            </CardContent>
          </Card>

          {/* Keyword Bar Chart */}
          <KeywordBarChart className="mb-6" />
        </div>
      </div>
    </div>
  );
};
