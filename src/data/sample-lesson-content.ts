const sampleLessonContent: Record<string, string> = {
  // B1.1 Lesson 1 — A brief history of AI (free lesson)
  l1: `# A Brief History of AI

## From Turing to Transformers

The history of Artificial Intelligence spans over seven decades, from Alan Turing's foundational work to today's generative AI revolution.

### Key Milestones

| Year | Milestone |
|------|-----------|
| **1950** | Alan Turing proposes the Turing Test |
| **1956** | The term "Artificial Intelligence" is coined at Dartmouth |
| **1966** | ELIZA — first chatbot that simulated conversation |
| **1997** | IBM Deep Blue defeats chess world champion |
| **2012** | AlexNet wins ImageNet — deep learning takes off |
| **2017** | "Attention Is All You Need" — the Transformer paper |
| **2022** | ChatGPT launches — generative AI goes mainstream |

## The Three Waves of AI

### Wave 1: Rule-Based Systems (1950s–1980s)
Expert systems encoded human knowledge as if-then rules. They were brittle and couldn't learn from data.

### Wave 2: Machine Learning (1990s–2010s)
Statistical methods let machines learn patterns from data. Support Vector Machines, Random Forests, and early neural networks emerged.

### Wave 3: Deep Learning & Generative AI (2012–Present)
Deep neural networks with billions of parameters can now generate human-quality text, code, images, and more.

## Why This Matters for You

Understanding AI's history helps you:
- Appreciate why certain approaches work (and others failed)
- Predict where the technology is heading
- Make informed decisions about which AI tools to use

> **Key Takeaway**: AI isn't new — but the Transformer architecture and massive compute have made it transformative.
`,

  // B1.2 Lesson 1 — From rule-based NLP to neural language models
  l9: `# From Rule-Based NLP to Neural Language Models

## The Evolution of Language Understanding

### Rule-Based NLP (1960s–1990s)

Early natural language processing relied on hand-crafted rules:

\`\`\`
IF sentence contains "weather" AND contains "today"
  THEN respond with current weather data
\`\`\`

**Problems**: Couldn't handle ambiguity, required extensive manual rules, and broke on unexpected input.

### Statistical NLP (2000s–2010s)

Machine learning approaches like n-gram models and word2vec learned patterns from data:

\`\`\`python
# Example: Simple word frequency approach
from collections import Counter

def predict_next_word(text, corpus):
    words = text.split()
    last_word = words[-1]
    # Find most common words following last_word in corpus
    candidates = Counter()
    for i, w in enumerate(corpus[:-1]):
        if w == last_word:
            candidates[corpus[i+1]] += 1
    return candidates.most_common(1)[0][0]
\`\`\`

### Neural Language Models (2017–Present)

Transformers changed everything by using **self-attention** to understand relationships between all words simultaneously:

- **2017**: Transformer architecture introduced
- **2018**: GPT-1 (117M parameters) and BERT
- **2020**: GPT-3 (175B parameters) — few-shot learning emerges
- **2023**: GPT-4, Claude 2, Llama 2 — near-human reasoning
- **2024-2025**: GPT-4o, Claude Opus 4, Gemini 2.5 — multimodal and agentic capabilities

## Summary

Language models evolved from brittle rules to statistical patterns to neural networks that genuinely understand context.
`,

  // B1.3 Lesson 1 — The Transformer architecture
  l19: `# The Transformer Architecture

## The Paper That Changed Everything

In 2017, Google published "Attention Is All You Need", introducing the **Transformer** architecture. This single paper became the foundation for every major language model today.

## How Transformers Work (Simplified)

### 1. Tokenization
Text is broken into tokens (subword units):

\`\`\`
"Hello, how are you?" → ["Hello", ",", " how", " are", " you", "?"]
\`\`\`

### 2. Embeddings
Each token is converted to a numerical vector:

\`\`\`python
# Conceptually:
"Hello" → [0.12, -0.45, 0.78, ..., 0.33]  # 768-dimensional vector
"how"   → [0.56, 0.23, -0.11, ..., 0.67]
\`\`\`

### 3. Self-Attention
The key innovation — every token "attends to" every other token to understand context:

\`\`\`
"The bank by the river was flooded"
      ↓
"bank" attends to "river" → understands it's a riverbank, not a financial bank
\`\`\`

### 4. Feed-Forward Layers
After attention, the data passes through neural network layers that process the patterns.

### 5. Output Generation
The model predicts the next token, one at a time:

\`\`\`
Input:  "The capital of France is"
Output: " Paris" (highest probability next token)
\`\`\`

## Encoder vs Decoder

| Component | Used For | Examples |
|-----------|----------|----------|
| **Encoder** | Understanding input | BERT, sentence transformers |
| **Decoder** | Generating output | GPT, Claude, Llama |
| **Both** | Translation, summarization | T5, BART |

> **Key Insight**: Most modern LLMs (GPT, Claude, Llama) are **decoder-only** transformers optimized for text generation.
`,

  // B5.3 Lesson 1 — What is ReAct
  l178: `# The ReAct Pattern — Reason, Act, Observe

## What is ReAct?

**ReAct** (Reasoning + Acting) is the fundamental pattern behind modern AI agents. It interleaves thinking with doing in a continuous loop.

## The ReAct Cycle

\`\`\`
1. THOUGHT  → The agent reasons about what to do next
2. ACTION   → The agent calls a tool or takes a step
3. OBSERVATION → The result feeds back into the next thought
4. REPEAT   → Until the agent has a final answer
\`\`\`

## Example: A ReAct Agent Answering a Question

\`\`\`
User: "What's the weather like in the capital of France?"

Thought: I need to find the capital of France, then get the weather there.
Action: search("capital of France")
Observation: The capital of France is Paris.

Thought: Now I know it's Paris, let me check the weather.
Action: get_weather("Paris")
Observation: Paris: 18°C, partly cloudy, humidity 65%

Thought: I now have the answer.
Final Answer: The weather in Paris (the capital of France) is 18°C
and partly cloudy with 65% humidity.
\`\`\`

## Why ReAct Works

1. **Explicit reasoning** makes decisions more transparent
2. **Tool use** extends the agent beyond what the LLM knows
3. **Observations** ground the agent in real data
4. **Iterative refinement** handles multi-step problems

## ReAct vs Direct Prompting

| Approach | Best For |
|----------|----------|
| **Direct Prompt** | Simple questions with known answers |
| **ReAct Agent** | Questions needing tools, real-time data, or multi-step reasoning |

> **Key Takeaway**: ReAct is the Reason → Act → Observe loop that makes AI agents powerful.
`,

  // I2.2 — Graph Concepts (LangGraph)
  l419: `# Graph Concepts — Nodes, Edges, State

## Why Graphs for Agent Workflows?

LangGraph models agent workflows as **directed graphs** where:
- **Nodes** are functions that process data
- **Edges** connect nodes and define flow
- **State** is shared data that flows through the graph

## Core Concepts

### 1. StateGraph

\`\`\`python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict

# Define your state schema
class AgentState(TypedDict):
    messages: list[str]
    current_step: str
    result: str

# Create the graph
graph = StateGraph(AgentState)
\`\`\`

### 2. Nodes (Functions)

Each node receives the current state and returns state updates:

\`\`\`python
def classify_input(state: AgentState) -> dict:
    """Classify the user's request type."""
    # ... classification logic
    return {"current_step": "classified"}

def process_request(state: AgentState) -> dict:
    """Process based on classification."""
    # ... processing logic
    return {"result": "processed"}

graph.add_node("classify", classify_input)
graph.add_node("process", process_request)
\`\`\`

### 3. Edges

\`\`\`python
# Sequential: classify → process → END
graph.add_edge(START, "classify")
graph.add_edge("classify", "process")
graph.add_edge("process", END)
\`\`\`

### 4. Conditional Edges

\`\`\`python
def route_by_type(state: AgentState) -> str:
    if state["current_step"] == "simple":
        return "quick_answer"
    return "deep_analysis"

graph.add_conditional_edges("classify", route_by_type)
\`\`\`

### 5. Compile and Run

\`\`\`python
app = graph.compile()
result = app.invoke({"messages": ["Hello"], "current_step": "", "result": ""})
\`\`\`

> **Key Insight**: LangGraph gives you explicit control over agent flow — unlike simple agent loops, you can define exactly how decisions branch, loop, and converge.
`,

  // A1.1 — Architectural Patterns for Agentic Systems
  l1275: `# Architectural Patterns — Microservices vs Monolith for Agents

## Choosing the Right Architecture

When deploying AI agents to production, one of the first decisions is how to structure your services.

## Monolithic Agent Architecture

All agent logic runs in a single service:

\`\`\`
┌──────────────────────────────┐
│        Agent Service         │
│  ┌──────┐ ┌──────┐ ┌──────┐ │
│  │ LLM  │ │Tools │ │Memory│ │
│  │Client│ │      │ │Store │ │
│  └──────┘ └──────┘ └──────┘ │
│  ┌──────┐ ┌──────────────┐  │
│  │ RAG  │ │ Orchestrator │  │
│  └──────┘ └──────────────┘  │
└──────────────────────────────┘
\`\`\`

**Pros**: Simple to develop, easy to debug, no network overhead
**Cons**: Hard to scale individual components, single point of failure

## Microservices Agent Architecture

Each capability runs as an independent service:

\`\`\`
┌────────────┐
│ API Gateway│
└─────┬──────┘
      │
┌─────┴──────────────────────────────┐
│  ┌──────────┐  ┌──────────┐       │
│  │Orchestrator│  │  RAG     │       │
│  │  Service  │  │ Service  │       │
│  └─────┬─────┘  └──────────┘       │
│        │                            │
│  ┌─────┴─────┐  ┌──────────┐       │
│  │Tool Service│  │ Memory   │       │
│  │           │  │ Service  │       │
│  └───────────┘  └──────────┘       │
└────────────────────────────────────┘
\`\`\`

**Pros**: Independent scaling, team autonomy, fault isolation
**Cons**: Network latency, complex debugging, operational overhead

## When to Use What

| Factor | Monolith | Microservices |
|--------|----------|---------------|
| **Team size** | Small (1-3 devs) | Large (5+ devs) |
| **Scale** | < 100 concurrent users | 100+ concurrent users |
| **Complexity** | Single agent type | Multiple agent types |
| **Development stage** | MVP / prototype | Production at scale |

> **Recommendation**: Start monolithic, evolve to microservices when scaling demands it.
`,
};

export function getLessonContent(lessonId: string): string {
  return sampleLessonContent[lessonId] || getPlaceholderContent();
}

function getPlaceholderContent(): string {
  return `# Lesson Content

This is placeholder content for this lesson. In production, this content would be loaded from the database or file storage.

## What You'll Learn

- Key concepts covered in this lesson
- Practical examples and exercises
- Best practices and common patterns

## Getting Started

Start by reviewing the concepts introduced in the previous lesson. Then work through the examples below at your own pace.

> **Tip**: Take notes as you go through the material. Writing things down helps with retention!

## Next Steps

When you're done with this lesson, click "Mark as Complete" and proceed to the next lesson.
`;
}
