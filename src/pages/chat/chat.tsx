import { ChatInput } from "@/components/custom/chatinput";
import {
  PreviewMessage,
  ThinkingMessage,
} from "../../components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";
import { useState, useRef, useEffect } from "react";
import { message } from "../../interfaces/interfaces";
import { Overview } from "@/components/custom/overview";
import { Header } from "@/components/custom/header";
import { v4 as uuidv4 } from "uuid";

const API_URL = `${import.meta.env.VITE_BASE_API_URL}/chat`;

export function Chat() {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  const [messages, setMessages] = useState<message[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasReceivedChunk, setHasReceivedChunk] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cancel previous request when component unmounts or when sending a new request
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  async function handleSubmit(text?: string) {
    if (isLoading) return;

    // Reset hasReceivedChunk khi bắt đầu câu hỏi mới
    setHasReceivedChunk(false);

    const messageText = text || question;
    if (!messageText.trim()) return;

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsLoading(true);
    const traceId = uuidv4();

    // Add user message to the list
    setMessages((prev) => [
      ...prev,
      { content: messageText, role: "user", id: traceId },
    ]);
    setQuestion("");

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ question: messageText }),
        signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let responseText = "";

        // Đọc và xử lý dữ liệu stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log("Toàn bộ câu trả lời từ API:", responseText);
            break;
          }
          const chunk = decoder.decode(value, { stream: true });
          responseText += chunk;

          // Cập nhật state khi nhận được chunk đầu tiên
          if (!hasReceivedChunk) {
            setHasReceivedChunk(true);
          }

          // Cập nhật message bot mỗi khi nhận được chunk mới
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            const newMessage = {
              content: responseText,
              role: "assistant",
              id: traceId,
            };
            return lastMessage?.role === "assistant"
              ? [...prev.slice(0, -1), newMessage]
              : [...prev, newMessage];
          });
        }
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("API error:", error);
        // Display error message to user
        setMessages((prev) => [
          ...prev,
          {
            content:
              "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
            role: "assistant",
            id: traceId,
          },
        ]);
      }
    } finally {
      setIsLoading(false);
      setHasReceivedChunk(false);
      abortControllerRef.current = null;
    }
  }

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <Header />
      <div
        className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
        ref={messagesContainerRef}
      >
        {messages.length == 0 && <Overview />}
        {messages.map((message, index) => (
          <PreviewMessage key={index} message={message} />
        ))}
        {isLoading && !hasReceivedChunk && <ThinkingMessage />}
        <div
          ref={messagesEndRef}
          className="shrink-0 min-w-[24px] min-h-[24px]"
        />
      </div>
      <div className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        <ChatInput
          question={question}
          setQuestion={setQuestion}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
