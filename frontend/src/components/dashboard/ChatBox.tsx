import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { askQuestion } from '../../services/databridge'

const SUGGESTED = ["What's the average?", 'Any outliers?', 'Show key trends', 'Summarize the data']

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/^[-*]\s+/gm, '')
    .trim()
}

export default function ChatBox() {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const { parsedCSV, messages, isChatLoading, addMessage, updateMessage, setIsChatLoading } =
    useAppStore()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || !parsedCSV || isChatLoading) return

    setInput('')
    setIsChatLoading(true)

    addMessage({ id: Date.now().toString(), role: 'user', content: trimmed, timestamp: Date.now() })

    const assistantId = `assistant-${Date.now()}`
    addMessage({ id: assistantId, role: 'assistant', content: '', timestamp: Date.now(), isStreaming: true })

    try {
      const answer = await askQuestion(trimmed, parsedCSV.summary, messages)
      updateMessage(assistantId, stripMarkdown(answer), true)
    } catch {
      updateMessage(assistantId, 'Something went wrong. Please try again.', true)
    } finally {
      setIsChatLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b shrink-0" style={{ borderColor: 'var(--color-border)' }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
          <Sparkles size={14} color="#fff" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">Ask Lens</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>Chat with your data</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center gap-4 pt-6">
            <p className="text-xs text-center" style={{ color: 'var(--color-muted)' }}>Ask anything about your data</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTED.map((s) => (
                <button key={s} className="btn-outline text-xs px-3 py-1.5" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex animate-fade-in ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.isStreaming ? (
                <div className="msg-assistant">
                  <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                </div>
              ) : (
                <div className={m.role === 'user' ? 'msg-user' : 'msg-assistant'}>{m.content}</div>
              )}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t shrink-0" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: 'var(--color-border)', border: '1px solid var(--color-border-hi)' }}>
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-muted)]"
            placeholder="Ask about your data…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send(input)}
            disabled={isChatLoading}
          />
          <button
            className="shrink-0 transition-all duration-150 disabled:opacity-40"
            style={{ color: 'var(--color-accent)', borderRadius: '6px', padding: '4px' }}
            onClick={() => send(input)}
            disabled={!input.trim() || isChatLoading}
            aria-label="Send"
          >
            <Send size={15} />
          </button>
        </div>
        <p className="text-xs mt-1.5 text-center" style={{ color: 'var(--color-muted)' }}>Enter to send · Shift+Enter for newline</p>
      </div>
    </div>
  )
}