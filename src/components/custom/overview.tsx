import { motion } from "framer-motion";
import { MessageCircle, BotIcon, TrendingUp, Newspaper } from "lucide-react";

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
            Welcome to <strong>News Analysis Assistant</strong>
            <br />
            Your AI companion for news and trending topics
          </p>
          <div className="text-left space-y-4">
            <p className="font-medium">I can help you with:</p>
            <ul className="list-disc pl-8 space-y-2">
              <li>Latest news and events from today's articles</li>
              <li>Trending topics across different categories</li>
              <li>Finding related news articles on your topics of interest</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </>
  );
};
