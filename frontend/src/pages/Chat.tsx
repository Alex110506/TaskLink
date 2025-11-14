import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Send, Users as UsersIcon } from "lucide-react";
import { useState } from "react";

export default function Chat() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: string; timestamp: string }>>([
    { id: 1, text: "Hey! How are you?", sender: "other", timestamp: "10:30 AM" },
    { id: 2, text: "I'm good, thanks! Working on the new project.", sender: "me", timestamp: "10:32 AM" },
  ]);

  const chatName = type === "team" 
    ? `Team Chat - ${id}` 
    : id?.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        text: message,
        sender: "me",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setMessage("");
  };

  const initials = type === "team" 
    ? "T" 
    : id?.split("-").map(w => w.charAt(0).toUpperCase()).join("") || "U";

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/team")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {type === "team" ? <UsersIcon className="h-5 w-5" /> : initials}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg">{chatName}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  msg.sender === "me"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs opacity-70 mt-1 block">{msg.timestamp}</span>
              </div>
            </div>
          ))}
        </CardContent>

        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button onClick={handleSend} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
