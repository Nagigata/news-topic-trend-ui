import { useState } from "react";
import { ChevronDown, Calendar } from "lucide-react";

interface MonthPickerProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  className?: string;
}

interface Month {
  value: string;
  label: string;
}

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonthIndex = currentDate.getMonth();

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const months: Month[] = monthNames
  .slice(0, currentMonthIndex + 1)
  .map((name, index) => ({
    value: String(index + 1),
    label: `${name} ${currentYear}`,
  }));

export function MonthPicker({
  selectedMonth,
  onMonthChange,
  className = "w-full sm:w-64",
}: MonthPickerProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectedMonthLabel = months.find(
    (m) => m.value === selectedMonth
  )?.label;

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex items-center justify-between px-4 py-2.5 rounded-lg border bg-card text-foreground hover:bg-accent/50 cursor-pointer transition-colors"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{selectedMonthLabel}</span>
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
            {months.map((month) => (
              <div
                key={month.value}
                className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${
                  selectedMonth === month.value
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-accent text-foreground"
                }`}
                onClick={() => {
                  onMonthChange(month.value);
                  setDropdownOpen(false);
                }}
              >
                {month.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
