import { create } from 'zustand'
import type { ParsedCSV, Insight, ChatMessage, ChartConfig } from '../types'

interface AppState {
  parsedCSV: ParsedCSV | null
  isParsingCSV: boolean
  insights: Insight[]
  isLoadingInsights: boolean
  charts: ChartConfig[]
  messages: ChatMessage[]
  isChatLoading: boolean

  setParsedCSV: (csv: ParsedCSV | null) => void
  setIsParsingCSV: (v: boolean) => void
  setInsights: (insights: Insight[]) => void
  setIsLoadingInsights: (v: boolean) => void
  setCharts: (charts: ChartConfig[]) => void
  addMessage: (msg: ChatMessage) => void
  updateLastMessage: (content: string, done?: boolean) => void
  setIsChatLoading: (v: boolean) => void
  reset: () => void
}

export const useAppStore = create<AppState>((set) => ({
  parsedCSV: null,
  isParsingCSV: false,
  insights: [],
  isLoadingInsights: false,
  charts: [],
  messages: [],
  isChatLoading: false,

  setParsedCSV: (parsedCSV) => set({ parsedCSV }),
  setIsParsingCSV: (isParsingCSV) => set({ isParsingCSV }),
  setInsights: (insights) => set({ insights }),
  setIsLoadingInsights: (isLoadingInsights) => set({ isLoadingInsights }),
  setCharts: (charts) => set({ charts }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  updateLastMessage: (content, done = false) =>
    set((state) => {
      if (state.messages.length === 0) return state

      const lastIndex = state.messages.length - 1
      const updated = [...state.messages]

      updated[lastIndex] = {
        ...updated[lastIndex],
        content,
        isStreaming: !done,
      }

      return { messages: updated }
    }),

  setIsChatLoading: (isChatLoading) => set({ isChatLoading }),

  reset: () =>
    set({
      parsedCSV: null,
      isParsingCSV: false,
      insights: [],
      isLoadingInsights: false,
      charts: [],
      messages: [],
      isChatLoading: false,
    }),
}))