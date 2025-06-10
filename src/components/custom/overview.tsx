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
        transition={{ delay: 0.25 }}
      >
        <div className="rounded-xl p-8 flex flex-col gap-6 leading-relaxed text-center max-w-xl mx-auto bg-card shadow-lg">
          <div className="flex flex-row justify-center gap-4 items-center">
            <BotIcon size={48} className="text-primary" />
            <span className="text-2xl font-bold text-muted-foreground">+</span>
            <TrendingUp size={44} className="text-primary" />
            <span className="text-2xl font-bold text-muted-foreground">+</span>
            <Newspaper size={44} className="text-primary" />
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">
              Chào mừng đến với{" "}
              <span className="text-primary">Trợ lý Phân tích Tin tức</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Người bạn AI cho tin tức và chủ đề đang thịnh hành
            </p>
          </div>
          <div className="mt-4">
            <p className="text-xl font-medium text-primary">
              Hãy cho tôi biết chủ đề mà bạn muốn biết
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};
