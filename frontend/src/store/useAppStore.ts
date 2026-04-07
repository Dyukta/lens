import { create } from 'zustand'
import type { ParsedCSV, Insight, ChatMessage } from '../types'

interface AppState {
  parsedCSV: ParsedCSV | null
  isParsingCSV: boolean
  insights: Insight[]
  isLoadingInsights: boolean
  messages: ChatMessage[]
  isChatLoading: boolean

  setParsedCSV: (csv: ParsedCSV | null) => void
  setIsParsingCSV: (v: boolean) => void
  setInsights: (insights: Insight[]) => void
  setIsLoadingInsights: (v: boolean) => void
  addMessage: (msg: ChatMessage) => void
  updateMessage: (id: string, content: string, done?: boolean) => void
  setIsChatLoading: (v: boolean) => void
  reset: () => void
}

const initialState = {
  parsedCSV: null,
  isParsingCSV: false,
  insights: [],
  isLoadingInsights: false,
  messages: [],
  isChatLoading: false,
}

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  setParsedCSV: (parsedCSV) => set({ parsedCSV }),
  setIsParsingCSV: (isParsingCSV) => set({ isParsingCSV }),
  setInsights: (insights) => set({ insights }),
  setIsLoadingInsights: (isLoadingInsights) => set({ isLoadingInsights }),
  setIsChatLoading: (isChatLoading) => set({ isChatLoading }),

  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

  updateMessage: (id, content, done = false) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content, isStreaming: !done } : m
      ),
    })),

  reset: () => set(initialState),
}))