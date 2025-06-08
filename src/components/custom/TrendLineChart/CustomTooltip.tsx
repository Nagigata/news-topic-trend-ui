import { formatTopicName } from "../utils";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const date = payload[0]?.payload.date;
    const fullDate = date
      ? format(parseISO(date), "d 'tháng' M, yyyy", { locale: vi })
      : `Tháng 4 ${label}, 2025`;

    const sortedData = [...payload]
      .sort((a, b) => b.value - a.value)
      .map((entry) => ({
        name: formatTopicName(entry.dataKey.replace("percentages.", "")),
        color: entry.stroke,
        percentage: entry.value.toFixed(1),
      }));

    return (
      <div className="bg-card p-4 rounded-xl border shadow-lg">
        <h3 className="font-semibold text-card-foreground mb-2">
          Thống kê cho {fullDate}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          Phân bố theo Chủ đề
        </p>
        <div className="space-y-2">
          {sortedData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-card-foreground">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-card-foreground">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};
