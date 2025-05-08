import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cx } from "classix";
import { SparklesIcon } from "./icons";
import { Markdown } from "./markdown";
import { message } from "../../interfaces/interfaces";
import { MessageActions } from "@/components/custom/actions";
import { TypingEffect } from "./typing-effect";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { facts } from "@/data/facts";
import { useTheme } from "@/context/ThemeContext";

export const PreviewMessage = ({ message }: { message: message }) => {
  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={message.role}
    >
      <div
        className={cx(
          "group-data-[role=user]/message:bg-zinc-700 dark:group-data-[role=user]/message:bg-muted group-data-[role=user]/message:text-white flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl"
        )}
      >
        {message.role === "assistant" && (
          <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
            <SparklesIcon size={14} />
          </div>
        )}

        <div className="flex flex-col w-full">
          {message.content && (
            <div className="flex flex-col gap-4 text-left">
              {message.role === "assistant" ? (
                <TypingEffect text={message.content} />
              ) : (
                <Markdown>{message.content}</Markdown>
              )}
            </div>
          )}

          {message.role === "assistant" && <MessageActions message={message} />}
        </div>
      </div>
    </motion.div>
  );
};

export const ThinkingMessage = () => {
  const role = "assistant";
  const [currentFact, setCurrentFact] = useState("");
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    setCurrentFact(randomFact);
  }, []);

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      data-role={role}
    >
      <div
        className={cx(
          "flex flex-col gap-2 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
          "group-data-[role=user]/message:bg-muted"
        )}
      >
        <div className="flex items-center gap-4">
          <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
            <SparklesIcon size={14} />
          </div>
          <DotLottieReact
            src={
              isDarkMode
                ? "/animations/thinking-light.lottie"
                : "/animations/thinking-dark.lottie"
            }
            loop
            autoplay
            className="w-16 h-16"
          />
        </div>
        {currentFact && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-muted-foreground italic pl-12"
          >
            {currentFact}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
