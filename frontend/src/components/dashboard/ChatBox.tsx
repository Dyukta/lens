import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { sendChatMessage } from "../../services/api";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isStreaming?: boolean;
};

const ChatBox: React.FC = () => {
  const [input, setInput] = useState("");
  const { parsedCSV, messages, addMessage, updateLastMessage } = useAppStore();

  const send = async () => {
    if (!input.trim() || !parsedCSV) return;

    const text = input.trim();
    setInput("");

    // Add user message
    addMessage({
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    });

    // Add temporary assistant message
    addMessage({
      id: "tmp",
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      isStreaming: true,
    });

    try {
      const res = await sendChatMessage(text, parsedCSV.summary, messages);
      updateLastMessage(res, true);
    } catch {
      updateLastMessage("Error", true);
    }
  };

  return (
    <div className="chat">
      <div className="chat-body">
        {messages.map((m) => (
          <div key={m.id} className={`msg ${m.role}`}>
            {m.content}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;