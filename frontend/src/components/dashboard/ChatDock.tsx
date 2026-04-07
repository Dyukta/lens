import React, { useState } from "react";
import ChatBox from "./ChatBox";

const ChatDock: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop chat dock */}
      <div className="hidden md:block w-80 border-l border-gray-700">
        <ChatBox />
      </div>

      {/* Floating button for mobile */}
      <button
        className="fixed bottom-4 right-4 md:hidden bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>

      {/* Mobile chat panel */}
      {open && (
        <div className="fixed bottom-0 right-0 w-full h-2/3 md:hidden bg-[#0a0a0f] border-t border-gray-700">
          <ChatBox />
        </div>
      )}
    </>
  );
};

export default ChatDock;