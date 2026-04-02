import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { sendChatMessage } from '../services/api'
import type { ChatMessage } from '../types'
import clsx from 'clsx'

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user'

  return (
    <div className={clsx('flex items-start gap-2.5', isUser && 'flex-row-reverse')}>
      <div
        className={clsx(
          'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
          isUser
            ? 'bg-accent-purple/20'
            : 'bg-bg-elevated border border-bg-border'
        )}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-accent-purple" />
        ) : (
          <Bot className="w-3.5 h-3.5 text-accent-blue" />
        )}
      </div>

      <div
        className={clsx(
          'max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-accent-purple/15 border border-accent-purple/20 text-text-primary'
            : 'bg-bg-elevated border border-bg-border text-text-secondary'
        )}
      >
        {msg.isStreaming ? (
          <span>
            {msg.content}
            <span className="inline-block w-1.5 h-3.5 bg-accent-blue ml-0.5 animate-pulse rounded-sm" />
          </span>
        ) : (
          msg.content
        )}
      </div>
    </div>
  )
}

const SUGGESTIONS = [
  "What's the average?",
  'Any outliers?',
  'Show key trends',
  'Summarize the data',
]

export default function ChatBox() {
  const [input, setInput] = useState('')
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
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isChatLoading || !parsedCSV) return

    setInput('')

    const timestamp = Date.now()

    const userMsg: ChatMessage = {
      id: `u-${timestamp}`,
      role: 'user',
      content: trimmed,
      timestamp,
    }

    const assistantMsg: ChatMessage = {
      id: `a-${timestamp}`,
      role: 'assistant',
      content: '',
      timestamp,
      isStreaming: true,
    }

    addMessage(userMsg)
    addMessage(assistantMsg)
    setIsChatLoading(true)

    try {
      const latestMessages = [...useAppStore.getState().messages, userMsg]

      const answer = await sendChatMessage(
        trimmed,
        parsedCSV.summary,
        latestMessages
      )

      updateLastMessage(answer, true)
    } catch {
      updateLastMessage(
        'Sorry, I could not process that. Make sure the backend is running.',
        true
      )
    } finally {
      setIsChatLoading(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-lens flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>

            <div>
              <p className="text-text-secondary text-sm">
                Ask anything about your data
              </p>
              <p className="text-text-muted text-xs mt-1">
                e.g. "What's the average?"
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-bg-elevated border border-bg-border text-text-secondary hover:border-accent-purple/40 hover:text-text-primary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg: ChatMessage) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))
        )}

        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-bg-border">
        <div className="flex items-end gap-2 bg-bg-elevated border border-bg-border rounded-xl px-3 py-2 focus-within:border-accent-purple/50 transition-colors">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask about your data..."
            className="flex-1 bg-transparent text-text-primary text-sm placeholder-text-muted resize-none outline-none leading-relaxed max-h-28"
          />

          <button
            onClick={() => send(input)}
            disabled={!input.trim() || isChatLoading}
            className="w-8 h-8 rounded-lg bg-gradient-lens flex items-center justify-center shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        <p className="text-text-muted text-xs text-center mt-2">
          Enter to send · Shift+Enter for newline
        </p>
      </div>
    </div>
  )
}