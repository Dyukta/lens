export const CHART_COLORS_ARRAY = [
  'rgba(124, 92, 252, 0.85)',
  'rgba(92, 140, 252, 0.85)',
  'rgba(92, 210, 252, 0.85)',
  'rgba(252, 92, 168, 0.85)',
  'rgba(252, 192, 92, 0.85)',
  'rgba(92, 252, 168, 0.85)',
  'rgba(252, 92, 92, 0.85)',
  'rgba(92, 252, 220, 0.85)',
]

export const CHART_BORDER_ARRAY = [
  'rgba(124, 92, 252, 1)',
  'rgba(92, 140, 252, 1)',
  'rgba(92, 210, 252, 1)',
  'rgba(252, 92, 168, 1)',
  'rgba(252, 192, 92, 1)',
  'rgba(92, 252, 168, 1)',
  'rgba(252, 92, 92, 1)',
  'rgba(92, 252, 220, 1)',
]

export const MAX_CATEGORIES_PIE = 8
export const MAX_BARS = 20
export const MAX_SCATTER_POINTS = 200

export const BASE_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#8888a8',
        font: { family: 'DM Sans', size: 12 },
        boxWidth: 12,
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: '#181825',
      borderColor: '#2a2a3d',
      borderWidth: 1,
      titleColor: '#e8e8f0',
      bodyColor: '#8888a8',
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      ticks: { color: '#8888a8', font: { family: 'DM Sans', size: 11 } },
      grid: { color: 'rgba(255,255,255,0.04)' },
    },
    y: {
      ticks: { color: '#8888a8', font: { family: 'DM Sans', size: 11 } },
      grid: { color: 'rgba(255,255,255,0.04)' },
    },
  },
} as const