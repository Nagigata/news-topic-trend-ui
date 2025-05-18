import { useState } from "react";
import { ChevronDown, Calendar } from "lucide-react";
import { TimeRange } from "./TimeRangeSelect";
import {
  startOfYear,
  startOfWeek,
  endOfWeek,
  addWeeks,
  format,
  getWeek,
} from "date-fns";
import { vi } from "date-fns/locale";

interface TimeRangePickerProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
  timeRange: TimeRange;
  className?: string;
}

interface TimeOption {
  value: string;
  label: string;
}

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonthIndex = currentDate.getMonth();

const monthNames = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

// Tạo danh sách các tuần từ đầu năm đến hiện tại
const getWeeks = (): TimeOption[] => {
  const weeks = [];
  const yearStart = startOfYear(currentDate);
  const firstWeekStart = startOfWeek(yearStart, { weekStartsOn: 1 }); // 1 = Thứ 2

  let weekStart = firstWeekStart;
  const currentWeekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

  while (weekStart <= currentWeekStart) {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const weekNumber = getWeek(weekStart, { weekStartsOn: 1 });

    weeks.push({
      value: format(weekStart, "yyyy-MM-dd"),
      label: `Tuần ${weekNumber} (${format(weekStart, "dd/MM", {
        locale: vi,
      })} - ${format(weekEnd, "dd/MM", { locale: vi })})`,
    });

    weekStart = addWeeks(weekStart, 1);
  }

  return weeks;
};

const getTimeOptions = (timeRange: TimeRange): TimeOption[] => {
  switch (timeRange) {
    case "week":
      return getWeeks();

    case "month":
      return monthNames.slice(0, currentMonthIndex + 1).map((name, index) => ({
        value: String(index + 1),
        label: `${name} ${currentYear}`,
      }));

    case "quarter":
      const quarters = [];
      const currentQuarter = Math.floor(currentMonthIndex / 3) + 1;
      for (let i = 1; i <= currentQuarter; i++) {
        quarters.push({
          value: String(i),
          label: `Quý ${i} ${currentYear}`,
        });
      }
      return quarters;

    case "year":
      const years = [];
      for (let i = currentYear - 2; i <= currentYear; i++) {
        years.push({
          value: String(i),
          label: `Năm ${i}`,
        });
      }
      return years;

    default:
      return [];
  }
};

export function TimeRangePicker({
  selectedTime,
  onTimeChange,
  timeRange,
  className = "w-full sm:w-64",
}: TimeRangePickerProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timeOptions = getTimeOptions(timeRange);
  const selectedOption = timeOptions.find((m) => m.value === selectedTime);

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex items-center justify-between px-4 py-2.5 rounded-lg border bg-card text-foreground hover:bg-accent/50 cursor-pointer transition-colors"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{selectedOption?.label}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
            dropdownOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {dropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg overflow-hidden z-50 max-h-[280px] overflow-y-auto">
          <div className="p-1">
            {timeOptions.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${
                  selectedTime === option.value
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-accent text-foreground"
                }`}
                onClick={() => {
                  onTimeChange(option.value);
                  setDropdownOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
