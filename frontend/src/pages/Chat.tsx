import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Send, Users as UsersIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { useAuthStore } from "@/lib/utils"; // 1. FIX: Reverting to original import path from user's file

interface Message {
  id: number;
  text: string;
  sender: string; // This will be the user's email
  timestamp: string;
}

export default function Chat() {
  const combined = useParams();
  const { accountType} = useAuthStore(); // We still need accountType if you use it elsewhere, but not for sender logic
  console.log(combined);
  const [userMail, businessMail] = combined.id
    ?.split("|")
    .map(decodeURIComponent) || ["", ""];

  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef(null);

  const myMail=accountType==="business" ? businessMail : userMail

  console.log(userMail, businessMail);

  useEffect(() => {
    socketRef.current = io("/");

    socketRef.current.emit("join_room", `${userMail}-${businessMail}`);

    socketRef.current.on("receive_message", (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userMail, businessMail]);

  const handleSend = () => {
    if (!message.trim()) return; 

    const newMessage: Message = {
      id: Date.now(),
      text: message,
      // 2. FIX: Reverted to the simple, correct logic.
      // The sender is *always* the logged-in user's email.
      sender: accountType==="business" ? businessMail : userMail,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    socketRef.current?.emit("send_message", {
      room: `${userMail}-${businessMail}`,
      message: newMessage
    });

    setMessages(prev => [...prev, newMessage]);

    setMessage("");
  };

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
                <UsersIcon className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            {/* 3. FIX: Simplified title. `businessMail` is always the other person,
                based on your navigation logic from profilecard.tsx */}
            <CardTitle className="text-lg">Chat with {accountType==="business" ? userMail :businessMail}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              // This display logic is correct and now matches the handleSend logic
              className={`flex ${msg.sender === myMail ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  // This styling logic is also correct
                  msg.sender === myMail
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