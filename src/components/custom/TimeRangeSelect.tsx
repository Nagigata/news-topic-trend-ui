import { ChevronDown } from "lucide-react";
import { useState } from "react";

export type TimeRange = "week" | "month" | "quarter" | "year";

interface TimeRangeSelectProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  className?: string;
}

const currentYear = new Date().getFullYear();

const timeRanges = [
  { value: "week", label: `Tuần (${currentYear})` },
  { value: "month", label: "Tháng" },
  { value: "quarter", label: "Quý" },
  { value: "year", label: "Năm" },
];

export function TimeRangeSelect({
  selectedRange,
  onRangeChange,
  className = "w-full sm:w-48",
}: TimeRangeSelectProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectedRangeLabel = timeRanges.find(
    (r) => r.value === selectedRange
  )?.label;

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex items-center justify-between px-4 py-2.5 rounded-lg border bg-card text-foreground hover:bg-accent/50 cursor-pointer transition-colors"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span>{selectedRangeLabel}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
            dropdownOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {dropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-1">
            {timeRanges.map((range) => (
              <div
                key={range.value}
                className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${
                  selectedRange === range.value
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-accent text-foreground"
                }`}
                onClick={() => {
                  onRangeChange(range.value as TimeRange);
                  setDropdownOpen(false);
                }}
              >
                {range.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
