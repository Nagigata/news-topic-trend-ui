import { useState } from "react";
import { ChevronDown, Calendar } from "lucide-react";

// Available months for selection
export const months = [
  { value: "1", label: "January 2024" },
  { value: "2", label: "February 2024" },
  { value: "3", label: "March 2024" },
  { value: "4", label: "April 2024" },
  { value: "5", label: "May 2024" },
  { value: "6", label: "June 2024" },
  { value: "7", label: "July 2024" },
  { value: "8", label: "August 2024" },
  { value: "9", label: "September 2024" },
  { value: "10", label: "October 2024" },
  { value: "11", label: "November 2024" },
  { value: "12", label: "December 2024" },
  { value: "13", label: "January 2025" },
  { value: "14", label: "February 2025" },
  { value: "15", label: "March 2025" },
  { value: "16", label: "April 2025" },
];

interface MonthPickerProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  className?: string;
}

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
