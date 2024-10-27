/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const MessageBubble = ({ message }: { message: Message }) => (
  <div
    className={`flex w-full ${
      message.role === "user" ? "justify-end" : "justify-start"
    } mb-4`}
  >
    <div
      className={`flex items-start gap-2.5 ${
        message.role === "user" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full ${
          message.role === "user" ? "bg-blue-100" : "bg-gray-100"
        }`}
      >
        {message.role === "user" ? (
          <User className="w-5 h-5 text-blue-600" />
        ) : (
          <Bot className="w-5 h-5 text-gray-600" />
        )}
      </div>
      <div
        className={`max-w-xl px-4 py-2 rounded-lg ${
          message.role === "user"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <span className="text-xs opacity-70">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  </div>
);

const AiChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8081/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context: [0],
          model: "gpt-3.5-turbo",
          prompt: inputMessage,
        }),
      });

      const data = await response.json();

      // Add assistant message to chat
      const assistantMessage: Message = {
        role: "assistant",
        content:
          data.response || "I apologize, but I couldn't process your request.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          "I apologize, but I encountered an error while processing your request.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full h-[65vh] flex flex-col relative">
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pt-4 pr-4 pb-32" ref={scrollAreaRef}>
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Thinking...
            </div>
          )}
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-black border-t z-50 w-full px-10 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col gap-2 z-50"
          >
            <Textarea
              value={inputMessage}
              onChange={(e: any) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-[60px] resize-none"
              onKeyDown={(e: any) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-4"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiChatComponent;
