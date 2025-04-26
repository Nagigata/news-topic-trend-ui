import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageCircle, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

interface ChatHistory {
  id: string;
  name: string;
  active: boolean;
  timestamp: number;
  lastMessage: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Tải lịch sử chat từ localStorage khi component mount
    const savedChats = localStorage.getItem("chatHistory");
    if (savedChats) {
      setChats(JSON.parse(savedChats));

      // Tìm chat active nếu có
      const active = JSON.parse(savedChats).find(
        (chat: ChatHistory) => chat.active
      );
      if (active) {
        setActiveChat(active.id);
      }
    }
  }, []);

  useEffect(() => {
    // Lưu lịch sử chat vào localStorage khi thay đổi
    if (chats.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(chats));
    }
  }, [chats]);

  const createNewChat = () => {
    // Tạo chat mới
    const newChat = {
      id: Date.now().toString(),
      name: `Chat ${chats.length + 1}`,
      active: true,
      timestamp: Date.now(),
      lastMessage: "New conversation started",
    };

    // Đặt tất cả chat khác thành không active
    const updatedChats = chats.map((chat) => ({
      ...chat,
      active: false,
    }));

    setChats([...updatedChats, newChat]);
    setActiveChat(newChat.id);
    navigate("/");
    onClose();
  };

  const selectChat = (chatId: string) => {
    setActiveChat(chatId);
    setChats(
      chats.map((chat) => ({
        ...chat,
        active: chat.id === chatId,
      }))
    );
    navigate("/");
    onClose();
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setChats(chats.filter((chat) => chat.id !== chatId));
    if (activeChat === chatId) {
      setActiveChat(null);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return (
        date.toLocaleDateString([], { month: "short", day: "numeric" }) +
        `, ${date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      );
    }
  };

  // Sắp xếp chats theo thời gian giảm dần (mới nhất đầu tiên)
  const sortedChats = [...chats].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <>
      {/* Backdrop overlay khi sidebar mở */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 w-72 bg-card border-r shadow-lg transform transition-transform duration-200 ease-in-out z-50",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={createNewChat}
            className="mx-4 mt-4 mb-2 flex items-center gap-2"
            variant="outline"
          >
            <PlusCircle className="h-4 w-4" />
            New Chat
          </Button>

          <ScrollArea className="flex-1 px-2 py-2">
            <div className="space-y-1">
              {sortedChats.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No chat history yet. Start a new conversation!
                </div>
              ) : (
                sortedChats.map((chat) => (
                  <div key={chat.id} className="group relative">
                    <Button
                      variant={chat.active ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2 pr-8 h-auto py-2"
                      onClick={() => selectChat(chat.id)}
                    >
                      <div className="flex flex-col items-start w-full overflow-hidden">
                        <div className="flex items-center w-full">
                          <MessageCircle className="h-4 w-4 shrink-0 mr-2" />
                          <span className="font-medium truncate">
                            {chat.name}
                          </span>
                        </div>

                        <div className="flex justify-between w-full text-xs text-muted-foreground mt-1">
                          <span className="truncate max-w-[60%]">
                            {chat.lastMessage}
                          </span>
                          <span className="text-right">
                            {formatDate(chat.timestamp)}
                          </span>
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
