A full-stack CSV analytics app that turns raw data into charts, AI insights and a conversational query interface  built to handle messy real-world inputs, not clean demo files.

## What it does

Upload any CSV and Lens automatically generates charts, surfaces key statistics, produces 5 AI-written insights, and lets you ask plain-English questions about your data.

## Tech stack

**Frontend:** React, TypeScript, Vite, Zustand, Tailwind CSS, Chart.js, PapaParse
**Backend:** Node.js, Express, TypeScript, Gemini (gemini-3-flash-preview)

##Preview 

| | |
|---|---|
| ![img1](https://github.com/user-attachments/assets/2511b726-7532-4100-9467-8f0e3f80789c) | ![img2](https://github.com/user-attachments/assets/bf939576-1183-48fd-a6ff-86ac42d03264) |
| ![img3](https://github.com/user-attachments/assets/2c2412da-607b-40c6-b854-702dc56273f3) | ![img4](https://github.com/user-attachments/assets/a4282f94-a030-4acb-a2bc-dd71bc61be98) |
| ![img5](https://github.com/user-attachments/assets/106809fc-b803-4602-a341-52b4f7ae5224) | ![img6](https://github.com/user-attachments/assets/46817792-8594-4c70-955f-beae6f985a51) |

## Architecture

The core principle is a hard separation between deterministic and probabilistic logic. Parsing, type detection and chart generation all happen on the frontend making it  fast, local, and predictable. AI insights and chat run on the backend where outputs can be validated, retried and stripped before reaching the UI.

```
CSV Upload → Parse → Column Detection → Summary Generation
        ↓
   Zustand Store
        ↓
   Charts (frontend) | AI Insights (backend) | Chat (backend)
```

## Key decisions

**Column typing by heuristic** — 85% numeric threshold for numeric columns, 75% date match 
for date columns, otherwise categorical. Real CSVs are inconsistent; this handles them 
without crashing.

**Memoized charts** — computed via `useMemo`, never stored in state. Avoids stale data and 
reduces state surface area.

**Controlled parsing** — `dynamicTyping: false` throughout. Silent type coercion causes 
subtle data corruption; explicit detection doesn't.

**Structured AI output** — every insight response is parsed against a strict 
`TITLE / TYPE / DESCRIPTION` format. Malformed or empty blocks are filtered out before 
reaching the UI.

**Token budget discipline** — summary text is compressed to a compact format, top 
categorical values capped at 4, chat history limited to the last 6 turns, prompts stripped 
to bare minimum to stay within rate limits on free-tier keys.

**databridge pattern** — a dedicated `databridge.ts` layer sits between components and the 
HTTP client. Components pass typed `DataSummary` objects; databridge converts them to plain 
text before the API call. This keeps `api.ts` dealing only in strings and makes the 
transformation testable in isolation.

## Known limitations

- Column typing can misclassify edge cases in inconsistent CSVs
- No persistence — datasets don't survive a page refresh, by design
- Very large CSVs may affect frontend parse performance
- AI insight quality depends on summary density; sparse data produces weaker insights
- No streaming — chat responses arrive complete, not word by word


