import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AIAssistant({ jobsData, userData }) {
  const [typing, setTyping] = useState(false);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "ai", text: "Hello! How can I assist you today? 😊" },
  ]);

  const handleOpen = () => {
    setOpen(true);
    setClosing(false);
  };

  const handleClose = () => {
    setClosing(true); // trigger fade out
    setTimeout(() => setOpen(false), 400); // 400ms = durata animației fade out
  };

  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: input },
    ]);
    const userMsg = input;
    setInput("");

    setTyping(true); // 👉 pornește animația AI typing

    const sendPrompt = async (userMessage, jobsData, userData) => {
      try {
        const res = await fetch("http://localhost:5001/api/ai-assistant", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userMessage,
            jobsData,
            userData,
          }),
        });

        if (!res.ok) {
          throw new Error("Request failed");
        }

        const data = await res.json();

        setTyping(false); // 👉 oprește indicatorul

        setMessages((prev) => [
          ...prev,
          { id: Date.now(), sender: "ai", text: data.data },
        ]);
      } catch (error) {
        console.error("Error sending prompt:", error);
        setTyping(false); // 👉 oprește la eroare
        return null;
      }
    };

    sendPrompt(userMsg, jobsData, userData);
  };

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Auto-scroll to last message
  useEffect(() => {
    const el = document.querySelector(".messages-scroll");
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, typing]);

  // Adaugă o stare pentru animație
  const [closing, setClosing] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleOpen} // deschide chat-ul
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full 
    bg-gradient-to-br from-blue-500 via-pink-400 to-purple-500 
    shadow-[0_0_25px_rgba(147,51,234,0.5)] 
    animate-[gentlePulse_6s_ease-in-out_infinite]
    hover:scale-105 transition-transform duration-[1500ms]
    flex items-center justify-center"
      >
        <img src="/gemini-icon.svg" alt="Gemini Logo" className="w-8 h-8" />
      </button>
      {/* Chat Window */}
      {(open || closing) && (
        <div
          ref={chatRef}
          className={`fixed bottom-6 right-6 w-80 h-96 rounded-2xl shadow-2xl z-50
      backdrop-blur-lg bg-white/10 border border-white/20
      ${closing ? "animate-fadeOutChat" : "animate-fadeInChat"}`}
          onAnimationEnd={() => closing && setClosing(false)}
        >
          <div
            className="absolute inset-0 rounded-2xl p-[2px] 
          bg-gradient-to-br from-pink-400/40 via-purple-400/40 to-blue-400/40 
          pointer-events-none"
          ></div>

          <div className="relative flex flex-col h-full rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/20 flex items-center justify-between bg-white/5">
              <h2
                className="font-extrabold text-lg
  text-[#1a2439]
  bg-clip-text
  drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] 
"
              >
                AI Assistant
              </h2>

              <button
                onClick={() => handleClose()}
                className="transition-transform duration-[1200ms] hover:scale-110"
              >
                <X className="w-6 h-6 text-white/70 hover:text-white transition-colors duration-[1200ms]" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 messages-scroll">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`px-3 py-2 rounded-xl max-w-[85%] text-sm shadow-md backdrop-blur-sm 
                    animate-[fadeIn_1.6s_ease]
                    ${
                      msg.sender === "user"
                        ? "ml-auto bg-gradient-to-br from-pink-400 to-purple-500 text-white shadow-pink-500/30"
                        : "bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-blue-500/30"
                    }
                  `}
                >
                  {msg.text}
                </div>
              ))}

              {typing && (
                <div
                  className="px-3 py-2 rounded-xl max-w-[85%] text-sm shadow-md 
    backdrop-blur-sm bg-gradient-to-br from-blue-500 to-purple-500 
    text-white shadow-blue-500/30 animate-[fadeIn_1.6s_ease]"
                >
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></span>
                    <span
                      className="w-2 h-2 bg-white/70 rounded-full animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-white/70 rounded-full animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    ></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/20 bg-white/5 flex gap-2 backdrop-blur-sm">
              <Input
                placeholder="Write a message..."
                className="bg-white/20 border-white/20 text-white 
    placeholder-white/50 transition-all duration-[1200ms]
    focus:outline-none focus:ring-0 focus:border-transparent input-no-focus"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />

              <Button
                size="icon"
                className="bg-gradient-to-br from-pink-400 to-purple-500 text-white shadow-lg 
                hover:scale-105 transition-transform duration-[1500ms]"
                onClick={handleSend}
              >
                ➤
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Custom animations */}
      <style>
        {`
          @keyframes gentlePulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }

          @keyframes fadeSlideIn {
            0% { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(8px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          @keyframes floatSlow {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }

          @keyframes fadeInChat {
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOutChat {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(40px); }
}

.animate-fadeInChat {
  animation: fadeInChat 0.4s ease forwards;
}

.animate-fadeOutChat {
  animation: fadeOutChat 0.4s ease forwards;
}

/* Scrollbar custom pentru zona mesajelor */
.messages-scroll::-webkit-scrollbar {
  width: 6px;
}

.messages-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.messages-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.35));
  border-radius: 20px;
}

.messages-scroll::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.5));
}

/* Firefox */
.messages-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.3) transparent;
}

.input-no-focus:focus {
  outline: none !important;
  box-shadow: none !important;
  border-color: transparent !important;
}


        `}
      </style>
    </>
  );
}
