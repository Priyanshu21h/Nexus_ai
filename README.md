# ⚡ Nexus AI — Tri-Hybrid Document Summarizer

A modern AI-powered document summarizer built with **Next.js 16**, offering three inference modes — **Cloud**, **Browser**, and **Local** — so you can summarize documents however you want.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **☁️ Cloud Mode (Groq)** — Ultra-fast summarization using Groq's LLaMA 3.3 70B model
- **🌐 Browser Mode (WebGPU)** — Run AI directly in the browser using HuggingFace Transformers + WebGPU
- **💻 Local Mode (Ollama)** — Fully offline summarization using locally hosted Ollama models
- **📄 PDF Upload** — Extract and summarize text from PDF documents
- **📊 TTFT Chart** — Visualize Time-to-First-Token performance across summarization runs
- **📜 History Sidebar** — Browse and revisit past summaries stored locally via IndexedDB (Dexie)
- **🌙 Dark / Light Theme** — Toggle between themes with `next-themes`
- **⚡ Real-time Feedback** — Loading states, error handling, and instant results

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **UI** | React 19, Radix UI, shadcn/ui, Tailwind CSS 4 |
| **Icons** | Lucide React |
| **Cloud AI** | Groq SDK (LLaMA 3.3 70B) |
| **Browser AI** | HuggingFace Transformers (DistilBART via WebGPU) |
| **Local AI** | Ollama (Qwen 2.5 Coder 7B / Qwen3-VL 4B) |
| **PDF Parsing** | pdfjs-dist |
| **Local Storage** | Dexie (IndexedDB) |
| **Theming** | next-themes |

---

## 📁 Project Structure

```
nexus-ai/
├── app/
│   ├── api/groq/route.ts      # Groq API endpoint
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main summarizer page
│   └── globals.css             # Global styles
├── components/
│   ├── FileUpload.tsx          # PDF / text file upload
│   ├── ModeSelector.tsx        # Cloud / Browser / Local toggle
│   ├── SummaryCard.tsx         # Rendered summary output
│   ├── TTFTChart.tsx           # Performance chart
│   ├── Sidebar.tsx             # History sidebar
│   ├── HistoryPanel.tsx        # History list panel
│   ├── ThemeToggle.tsx         # Dark/Light mode toggle
│   └── ui/                     # shadcn/ui primitives
├── lib/
│   ├── groq.ts                 # Groq SDK wrapper
│   ├── ollama.ts               # Ollama API wrapper
│   ├── browserAI.ts            # HuggingFace in-browser inference
│   ├── pdfExtract.ts           # PDF text extraction
│   ├── db.ts                   # Dexie (IndexedDB) schema
│   └── modeDetector.ts         # Auto-detect available modes
├── hooks/
│   ├── useSummarize.ts         # Core summarization hook
│   └── useHistory.ts           # History management hook
├── types/                      # TypeScript type definitions
└── workers/                    # Web Workers
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- (Optional) [Ollama](https://ollama.ai) installed for local mode

### 1. Clone the repo

```bash
git clone https://github.com/Priyanshu21h/Nexus_ai.git
cd Nexus_ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_OLLAMA_URL=http://localhost:11434
```

> Get a free Groq API key at [console.groq.com](https://console.groq.com)

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use Nexus AI.

### 5. (Optional) Start Ollama for local mode

```bash
ollama serve
ollama pull qwen2.5-coder:7b
```

---

## 🧠 How It Works

| Mode | How it runs | Requires |
|---|---|---|
| **Cloud (Groq)** | Sends text to Groq API server-side | `GROQ_API_KEY` |
| **Browser (WebGPU)** | Runs DistilBART model directly in browser | WebGPU-enabled browser |
| **Local (Ollama)** | Calls locally running Ollama instance | Ollama installed & running |

---

## 📜 License

This project is open source under the [MIT License](LICENSE).

---

## 🙋 Author

**Priyanshu** — [@Priyanshu21h](https://github.com/Priyanshu21h)
