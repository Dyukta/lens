import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { sendChatMessage } from '../services/api'

export default function ChatBox() {
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const {
    parsedCSV,
    messages,
    isChatLoading,
    addMessage,
    updateLastMessage,
    setIsChatLoading,
  } = useAppStore()

  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [messages])

  const send = async () => {
    if (!input.trim() || !parsedCSV || isChatLoading) return

    const text = input.trim()
    setInput('')

    addMessage({ id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() })
    addMessage({ id: 'tmp', role: 'assistant', content: '', timestamp: Date.now(), isStreaming: true })

    setIsChatLoading(true)

    try {
      const res = await sendChatMessage(text, parsedCSV.summary, messages)
      updateLastMessage(res, true)
    } catch {
      updateLastMessage('Error processing request', true)
    } finally {
      setIsChatLoading(false)
    }
  }

  return (
    <>
      <button
        className="chat-fab md:hidden"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>

      <div className={`chat-container ${open ? 'open' : ''}`}>
        <div className="chat-messages">
          {messages.map((m) => (
            <div key={m.id} className={`msg ${m.role}`}>
              {m.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={send}><Send size={14} /></button>
        </div>
      </div>
    </>
  )
}