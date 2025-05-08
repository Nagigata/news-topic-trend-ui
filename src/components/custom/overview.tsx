import { motion } from "framer-motion";
import { BotIcon, TrendingUp, Newspaper } from "lucide-react";

export const Overview = () => {
  return (
    <>
      <motion.div
        key="overview"
        className="max-w-3xl mx-auto md:mt-20"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ delay: 0.75 }}
      >
        <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
          <p className="flex flex-row justify-center gap-4 items-center">
            <BotIcon size={44} />
            <span>+</span>
            <TrendingUp size={40} />
            <span>+</span>
            <Newspaper size={40} />
          </p>
          <p className="text-lg">
            Chào mừng đến với <strong>Trợ lý Phân tích Tin tức</strong>
            <br />
            Người bạn AI cho tin tức và chủ đề đang thịnh hành
          </p>
          <div className="text-left space-y-4">
            <p className="font-medium">Tôi có thể giúp bạn với:</p>
            <ul className="list-disc pl-8 space-y-2">
              <li>Tin tức và sự kiện mới nhất từ các bài báo hôm nay</li>
              <li>Chủ đề đang thịnh hành trên các danh mục khác nhau</li>
              <li>Tìm kiếm các bài báo liên quan đến chủ đề bạn quan tâm</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </>
  );
};
