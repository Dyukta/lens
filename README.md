Lens is a full-stack application that transforms raw CSV files into structured insights, visualizations and a conversational query interface.
It is designed to reflect real-world engineering decisions handling messy data, unreliable AI outputs and maintaining a clean, scalable architecture.


## What makes this project different

* Handles **messy real world CSVs** (not ideal demo data)
* Separates **deterministic logic (frontend)** from **probabilistic logic (AI backend)**
* Guards against **LLM failure modes** with strict validation
* Generates **meaningful charts automatically** without configuration
* Prioritizes **architecture and correctness** over feature bloat

## Example output

Upload a CSV (e.g. sales, transactions, logs) 

* Automatically generated charts:

  * revenue trends over time
  * category distribution
  * numeric correlations
* Summary KPIs:

  * averages, peaks, distributions
* 4–6 AI-generated insights:

  * “Revenue consistently peaks in Q4”
  * “Category X contributes 48% of total volume”
* Ask questions:

  * “Which region performs best?”
  * “Is there a trend over time?”
    → Context-aware answers grounded in your data


## High-level architecture

```id="kq9v2m"
CSV Upload → Parse → Column Detection → Summary Generation
        ↓
   Frontend Store (Zustand)
        ↓
   ┌───────────────┬────────────────┬───────────────┐
   ↓               ↓                ↓
Charts       AI Insights        Chat Interface
(local)      (backend)          (backend)
```

### Core principle

**Deterministic logic stays on the frontend. Probabilistic logic goes to the backend.**


## Tech Stack

### Frontend

* React + TypeScript
* Vite
* Zustand
* Tailwind CSS
* Chart.js (react-chartjs-2)
* PapaParse

### Backend

* Node.js + Express
* TypeScript
* OpenAI (gpt-4o-mini)


## Key decisions

### Zustand over Redux

Minimal boilerplate and direct state updates.

**Tradeoff:** less structure for large scale apps, requires discipline.


### Derived state over stored state (charts)

Charts are computed via `useMemo`, not stored.

**Why:** avoids stale data and reduces state complexity
**Tradeoff:** small recomputation cost


### Controlled parsing (no implicit typing)

```ts id="c0f3kx"
dynamicTyping: false
```

**Why:** prevents silent data corruption
**Tradeoff:** requires explicit type detection

### Heuristic column typing

* 85% numeric → numeric
* 75% date match → date
* otherwise → categorical

**Why:** real-world CSVs are inconsistent
**Tradeoff:** occasional misclassification


### Clear frontend/backend responsibility split

| Concern  | Location | Reason            |
| -------- | -------- | ----------------- |
| Parsing  | Frontend | Fast, local       |
| Charts   | Frontend | Deterministic     |
| Insights | Backend  | AI-driven         |
| Chat     | Backend  | Context + control |


### Defensive AI integration (critical)

LLMs are treated as **unreliable systems**.

**Safeguards:**

* Strip markdown wrappers (`extractJSON`)
* Strict schema validation
* Fail fast on invalid responses

**Tradeoff:** more backend code, significantly higher reliability


### ID-based state updates

```ts id="u9w2dl"
updateMessage(id, content, done)
```

Prevents race conditions and async state bugs.


### Production-aligned backend setup

* `helmet()` for security headers
* Env-based CORS control
* Rate limiting: 20 req / 60 sec

---

## Data flow

### 1. Upload

* Drag-and-drop CSV
* Simulated progress for perceived performance

### 2. Parsing (`useCSVParser`)

* Parse rows (PapaParse)
* Detect column types
* Build summary statistics

### 3. Store hydration

Zustand holds:

* parsed data
* metadata
* computed summary

### 4. Chart generation (`useChartConfig`)

* Pure `useMemo`
* Generates:

  * bar
  * doughnut
  * line
  * scatter
  * stats

### 5. Insights (`useInsights`)

* Triggered once per dataset
* Backend returns structured insight objects

### 6. Chat

* Last 6 messages sent as context
* Summary injected into system prompt
* Responses constrained and validated


## Chart strategy

Opinionated by design:

* **Bar** → categorical vs numeric aggregation
* **Doughnut** → small categorical distributions
* **Line** → time-series trends
* **Scatter** → numeric relationships
* **Stats** → quick numeric overview


## AI design constraints

* Responses capped at **120 words** (prevents verbosity)
* Only **last 6 messages** retained (controls context size)
* Structured summary injected (grounds responses)
* Strict validation before UI consumption


## Performance considerations

* Memoized chart computation
* Sampling (50 rows) for type detection
* Scatter plots capped at 200 points
* Minimal global state


## UX decisions

* Explicit empty states (no silent failures)
* Suggested prompts for onboarding
* Auto-scrolling chat
* Disabled inputs during async operations
* Subtle micro-interactions for feedback



## Tradeoffs

### No persistence layer

**Why:** CSVs are transient inputs
**Tradeoff:** no history or saved sessions


### No streaming responses

**Why:** simpler backend design
**Tradeoff:** slightly less responsive chat

### Opinionated charts

**Why:** faster time-to-insight
**Tradeoff:** less flexibility for advanced users

### Single global store

**Why:** simpler mental model
**Tradeoff:** scaling limits in larger systems


## Known limitations

* Column typing may misclassify edge cases
* Very large CSVs may impact frontend performance
* AI insights depend on summary quality
* No cross-session persistence


## What this project demonstrates

* Separation of deterministic vs AI-driven logic
* Safe handling of unreliable LLM outputs
* Real-world data processing (not ideal inputs)
* Thoughtful state and data flow design
* Tradeoff-driven engineering decisions
* Maintainable, scalable frontend architecture

## Future improvements

* Streaming chat responses
* Persistent dataset history
* User-controlled chart configuration
* Advanced anomaly detection
* Cross-dataset schema learning

## Summary

Lens is built with a focus on:

* correctness over clever abstractions
* clarity over unnecessary complexity
* reliability over feature count

It reflects how production systems handle imperfect data, unpredictable AI behavior, and the need for maintainable architecture.
ai data analyser
