// Chuyển đổi nhãn chủ đề thành dạng dễ đọc
export const formatTopicName = (topic: string) => {
  return topic
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Rút gọn tên chủ đề nếu quá dài để hiển thị
export const shortenTopicName = (topic: string, maxLength = 35) => {
  const formattedName = formatTopicName(topic);
  if (formattedName.length <= maxLength) return formattedName;
  return formattedName.substring(0, maxLength) + "...";
};

// Lấy màu mặc định nếu không có màu được chỉ định
export const getDefaultColor = (color?: string) => color || "#8884d8";

// Tạo màu gradient từ màu chủ đề
export const getGradientColors = (topicColor: string) => {
  if (!topicColor) return { start: "#8884d8", end: "#8884d8" };

  // Xử lý màu HSL
  const hslMatch = topicColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (hslMatch) {
    const hue = parseInt(hslMatch[1]);
    const saturation = parseInt(hslMatch[2]);
    const lightness = parseInt(hslMatch[3]);

    return {
      start: `hsl(${hue}, ${saturation}%, ${Math.min(lightness + 10, 90)}%)`,
      end: `hsl(${hue}, ${saturation}%, ${Math.max(lightness - 10, 20)}%)`,
    };
  }

  // Mặc định khi không thể xử lý màu
  return {
    start: topicColor,
    end: topicColor,
  };
};

// Tạo ID gradient cho chủ đề
export const getGradientId = (topic: string | null) => 
  topic ? `gradient-${topic}` : "default-gradient";

// Tạo các giá trị ticks cho trục X
export const generateAxisTicks = (maxValue: number, interval = 5) => 
  Array.from({ length: Math.floor(maxValue / interval) + 1 }, (_, i) => i * interval); 