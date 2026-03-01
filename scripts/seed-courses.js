// MongoDB Insert Script for NMMR Training Platform
// Execute in mongosh or Azure Cosmos DB Data Explorer (Mongo Shell)
//
// Usage with mongosh:
//   mongosh "your-connection-string" scripts/seed-courses.js
//
// Or copy the db.courses.insertMany([...]) block into Azure Cosmos DB Data Explorer

// Drop existing courses if any (optional - uncomment if needed)
// db.courses.deleteMany({});

db.courses.insertMany([
  {
    slug: "introduction-to-generative-ai",
    title: "Introduction to Generative AI",
    description:
      "A comprehensive beginner course covering the fundamentals of Generative AI, including LLMs, transformers, and practical applications.",
    longDescription: `This course provides a thorough introduction to Generative AI, one of the most transformative technologies of our time.

You'll learn about the core concepts behind Large Language Models (LLMs), how transformer architectures work, and how to leverage these powerful tools in real-world applications.

**What you'll learn:**
- Understand the fundamentals of Generative AI and LLMs
- Learn how transformer architectures power modern AI
- Explore real-world applications across industries
- Get hands-on experience with AI APIs
- Build your first AI-powered application

**Who this course is for:**
- Beginners curious about AI and machine learning
- Developers wanting to integrate AI into their applications
- Business professionals looking to understand AI capabilities
- Students pursuing careers in AI and technology`,
    thumbnail: "/images/placeholder-course.webp",
    price: 0,
    currency: "INR",
    category: "GenAI",
    difficulty: "beginner",
    duration: "6 hours",
    status: "published",
    instructor: "Dr. Priya Sharma",
    modules: [
      {
        title: "Getting Started with AI",
        order: 1,
        lessons: [
          {
            title: "What is Generative AI?",
            type: "video",
            content: "",
            duration: "15 min",
            order: 1,
            isFree: true,
          },
          {
            title: "History of AI: From Rule-Based to Generative",
            type: "video",
            content: "",
            duration: "20 min",
            order: 2,
            isFree: true,
          },
          {
            title: "Key Concepts and Terminology",
            type: "markdown",
            content: `# Key Concepts and Terminology

## Large Language Models (LLMs)

A **Large Language Model** is a neural network trained on vast amounts of text data. These models learn patterns in language and can generate human-like text, answer questions, translate languages, and much more.

### How LLMs Are Trained

LLMs are trained in two main phases:

1. **Pre-training**: The model learns from billions of text documents
2. **Fine-tuning**: The model is refined for specific tasks using curated data

\`\`\`python
# Example: Using an LLM via API
from anthropic import Anthropic

client = Anthropic()

message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is machine learning?"}
    ]
)
print(message.content[0].text)
\`\`\`

## Key Terms

| Term | Definition |
|------|-----------|
| **Token** | The basic unit of text that LLMs process |
| **Prompt** | The input text given to an LLM |
| **Inference** | The process of generating output from a model |
| **Context Window** | The maximum amount of text a model can process |
| **Temperature** | Controls randomness in model output |

## Summary

Understanding these key concepts is essential for working effectively with Generative AI. In the next lesson, we'll test your knowledge with a quiz.`,
            duration: "10 min",
            order: 3,
            isFree: false,
          },
          {
            title: "Quiz: AI Fundamentals",
            type: "quiz",
            content: "",
            duration: "5 min",
            order: 4,
            isFree: false,
          },
        ],
      },
      {
        title: "Understanding Large Language Models",
        order: 2,
        lessons: [
          {
            title: "How LLMs Work",
            type: "video",
            content: "",
            duration: "25 min",
            order: 1,
            isFree: false,
          },
          {
            title: "Transformer Architecture Explained",
            type: "video",
            content: "",
            duration: "30 min",
            order: 2,
            isFree: false,
          },
          {
            title: "Tokenization and Embeddings",
            type: "markdown",
            content: `# Tokenization and Embeddings

## What is Tokenization?

Tokenization is the process of breaking text into smaller units called **tokens**. These tokens are the fundamental building blocks that language models process.

### Types of Tokenization

- **Word-level**: Splits text by spaces and punctuation
- **Subword-level**: Splits words into meaningful sub-units (BPE, WordPiece)
- **Character-level**: Each character is a token

\`\`\`python
# Example: Tokenization with tiktoken
import tiktoken

encoder = tiktoken.encoding_for_model("gpt-4")
tokens = encoder.encode("Hello, world! This is tokenization.")
print(f"Tokens: {tokens}")
print(f"Number of tokens: {len(tokens)}")

# Decode back to text
decoded = encoder.decode(tokens)
print(f"Decoded: {decoded}")
\`\`\`

## Understanding Embeddings

**Embeddings** are numerical representations of text in a high-dimensional vector space. Similar concepts are placed close together in this space.

\`\`\`python
# Example: Creating embeddings
from openai import OpenAI

client = OpenAI()

response = client.embeddings.create(
    model="text-embedding-3-small",
    input="Machine learning is a subset of AI"
)

embedding = response.data[0].embedding
print(f"Embedding dimensions: {len(embedding)}")
print(f"First 5 values: {embedding[:5]}")
\`\`\`

### Why Embeddings Matter

Embeddings enable:
- **Semantic search**: Find documents by meaning, not just keywords
- **Clustering**: Group similar documents together
- **Classification**: Categorize text automatically
- **RAG systems**: Retrieve relevant context for LLM responses`,
            duration: "15 min",
            order: 3,
            isFree: false,
          },
          {
            title: "Popular LLMs: GPT, Claude, Llama",
            type: "video",
            content: "",
            duration: "20 min",
            order: 4,
            isFree: false,
          },
        ],
      },
      {
        title: "Practical Applications",
        order: 3,
        lessons: [
          {
            title: "Text Generation and Summarization",
            type: "video",
            content: "",
            duration: "20 min",
            order: 1,
            isFree: false,
          },
          {
            title: "Code Generation with AI",
            type: "video",
            content: "",
            duration: "25 min",
            order: 2,
            isFree: false,
          },
          {
            title: "Building Your First AI App",
            type: "video",
            content: "",
            duration: "35 min",
            order: 3,
            isFree: false,
          },
          {
            title: "Final Project: AI-Powered Tool",
            type: "document",
            content: "",
            duration: "60 min",
            order: 4,
            isFree: false,
          },
        ],
      },
    ],
    createdAt: new Date("2025-06-01T00:00:00Z"),
    updatedAt: new Date("2025-06-01T00:00:00Z"),
  },
  {
    slug: "building-ai-agents-with-langchain",
    title: "Building AI Agents with LangChain",
    description:
      "Learn to build autonomous AI agents that can reason, plan, and execute multi-step tasks using LangChain and modern LLMs.",
    longDescription: `Dive deep into the world of Agentic AI by building sophisticated AI agents with LangChain.

This intermediate course teaches you how to create AI agents that go beyond simple chat — agents that can reason about problems, plan solutions, use tools, and execute complex multi-step workflows autonomously.

**What you'll learn:**
- Design and build AI agents with LangChain
- Implement tool-using agents for real-world tasks
- Create multi-agent systems that collaborate
- Build RAG-powered agents with custom knowledge bases
- Deploy production-ready agent systems

**Prerequisites:**
- Basic Python programming
- Familiarity with LLM APIs
- Understanding of prompt engineering basics`,
    thumbnail: "/images/placeholder-course.webp",
    price: 4999,
    currency: "INR",
    category: "Agentic AI",
    difficulty: "intermediate",
    duration: "12 hours",
    status: "published",
    instructor: "Rajesh Kumar",
    modules: [
      {
        title: "Introduction to AI Agents",
        order: 1,
        lessons: [
          {
            title: "What Are AI Agents?",
            type: "video",
            content: "",
            duration: "15 min",
            order: 1,
            isFree: true,
          },
          {
            title: "Agent Architectures Overview",
            type: "video",
            content: "",
            duration: "20 min",
            order: 2,
            isFree: true,
          },
          {
            title: "Setting Up Your Development Environment",
            type: "markdown",
            content: `# Setting Up Your Development Environment

## Prerequisites

Before building AI agents, ensure you have the following installed:

- Python 3.10 or higher
- pip (Python package manager)
- A code editor (VS Code recommended)

## Installation

### Step 1: Create a Virtual Environment

\`\`\`bash
# Create a new project directory
mkdir ai-agent-project
cd ai-agent-project

# Create virtual environment
python -m venv venv

# Activate it
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\\Scripts\\activate
\`\`\`

### Step 2: Install LangChain

\`\`\`bash
pip install langchain langchain-openai langchain-community
pip install python-dotenv
\`\`\`

### Step 3: Configure API Keys

Create a \`.env\` file in your project root:

\`\`\`
OPENAI_API_KEY=sk-your-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here
\`\`\`

### Step 4: Verify Installation

\`\`\`python
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(model="gpt-4o-mini")
response = llm.invoke("Hello! Are you working?")
print(response.content)
\`\`\`

## Project Structure

\`\`\`
ai-agent-project/
  venv/
  .env
  agents/
    __init__.py
    research_agent.py
  tools/
    __init__.py
    web_search.py
  main.py
  requirements.txt
\`\`\`

You're now ready to start building AI agents!`,
            duration: "15 min",
            order: 3,
            isFree: false,
          },
        ],
      },
      {
        title: "LangChain Fundamentals",
        order: 2,
        lessons: [
          {
            title: "LangChain Core Concepts",
            type: "video",
            content: "",
            duration: "25 min",
            order: 1,
            isFree: false,
          },
          {
            title: "Chains and Prompts",
            type: "video",
            content: "",
            duration: "30 min",
            order: 2,
            isFree: false,
          },
          {
            title: "Memory and State Management",
            type: "video",
            content: "",
            duration: "25 min",
            order: 3,
            isFree: false,
          },
          {
            title: "Tools and Tool Calling",
            type: "video",
            content: "",
            duration: "30 min",
            order: 4,
            isFree: false,
          },
        ],
      },
      {
        title: "Building Your First Agent",
        order: 3,
        lessons: [
          {
            title: "ReAct Agent Pattern",
            type: "video",
            content: "",
            duration: "30 min",
            order: 1,
            isFree: false,
          },
          {
            title: "Custom Tools for Agents",
            type: "video",
            content: "",
            duration: "35 min",
            order: 2,
            isFree: false,
          },
          {
            title: "Error Handling and Guardrails",
            type: "video",
            content: "",
            duration: "20 min",
            order: 3,
            isFree: false,
          },
          {
            title: "Project: Research Agent",
            type: "document",
            content: "",
            duration: "90 min",
            order: 4,
            isFree: false,
          },
        ],
      },
      {
        title: "Advanced Agent Patterns",
        order: 4,
        lessons: [
          {
            title: "Multi-Agent Orchestration",
            type: "video",
            content: "",
            duration: "35 min",
            order: 1,
            isFree: false,
          },
          {
            title: "RAG-Powered Agents",
            type: "video",
            content: "",
            duration: "40 min",
            order: 2,
            isFree: false,
          },
          {
            title: "Human-in-the-Loop Agents",
            type: "video",
            content: "",
            duration: "25 min",
            order: 3,
            isFree: false,
          },
          {
            title: "Final Project: Production Agent System",
            type: "document",
            content: "",
            duration: "120 min",
            order: 4,
            isFree: false,
          },
        ],
      },
    ],
    createdAt: new Date("2025-07-01T00:00:00Z"),
    updatedAt: new Date("2025-07-01T00:00:00Z"),
  },
  {
    slug: "prompt-engineering-masterclass",
    title: "Prompt Engineering Masterclass",
    description:
      "Master the art and science of crafting effective prompts to get the best possible output from any AI model.",
    longDescription: `Become a prompt engineering expert with this hands-on masterclass.

Learn systematic techniques for writing prompts that consistently produce high-quality results from AI models like Claude, GPT-4, and others.

**What you'll learn:**
- Core prompt engineering principles and patterns
- Advanced techniques: chain-of-thought, few-shot, and self-consistency
- Domain-specific prompting for code, writing, and analysis
- Prompt optimization and evaluation methods
- Building prompt libraries for production use

**Who this course is for:**
- Anyone who uses AI tools regularly
- Developers building AI-powered applications
- Content creators leveraging AI for writing
- Business analysts using AI for data analysis`,
    thumbnail: "/images/placeholder-course.webp",
    price: 2999,
    currency: "INR",
    category: "Prompt Engineering",
    difficulty: "beginner",
    duration: "8 hours",
    status: "published",
    instructor: "Dr. Priya Sharma",
    modules: [
      {
        title: "Prompt Engineering Foundations",
        order: 1,
        lessons: [
          {
            title: "Why Prompt Engineering Matters",
            type: "video",
            content: "",
            duration: "10 min",
            order: 1,
            isFree: true,
          },
          {
            title: "Anatomy of a Good Prompt",
            type: "video",
            content: "",
            duration: "20 min",
            order: 2,
            isFree: true,
          },
          {
            title: "Common Prompt Patterns",
            type: "markdown",
            content: `# Common Prompt Patterns

## The CRISP Framework

A structured approach to crafting effective prompts:

- **C**ontext: Set the scene and provide background
- **R**ole: Define who the AI should act as
- **I**nstruction: State what you want clearly
- **S**pecifics: Add constraints, format, and details
- **P**urpose: Explain the end goal

## Pattern 1: Role-Based Prompting

\`\`\`
You are an experienced data scientist specializing in
natural language processing. Explain the concept of
word embeddings to a junior developer who knows Python
but has no ML background.
\`\`\`

## Pattern 2: Few-Shot Examples

\`\`\`
Convert the following product descriptions to bullet points:

Input: "The XR-500 headphones feature active noise cancellation,
40-hour battery life, and premium memory foam ear cushions."
Output:
- Active noise cancellation
- 40-hour battery life
- Premium memory foam ear cushions

Input: "Our organic green tea is sourced from Japanese highlands,
contains natural antioxidants, and comes in biodegradable packaging."
Output:
\`\`\`

## Pattern 3: Step-by-Step Instructions

\`\`\`
Analyze the following code for security vulnerabilities.

Follow these steps:
1. Identify each potential vulnerability
2. Classify its severity (High/Medium/Low)
3. Explain why it's a vulnerability
4. Provide the fixed code

Code:
[paste code here]
\`\`\`

## Pattern 4: Output Formatting

\`\`\`
Respond in the following JSON format:
{
  "summary": "brief overview",
  "key_points": ["point1", "point2"],
  "sentiment": "positive|negative|neutral",
  "confidence": 0.0-1.0
}
\`\`\``,
            duration: "15 min",
            order: 3,
            isFree: false,
          },
        ],
      },
      {
        title: "Advanced Techniques",
        order: 2,
        lessons: [
          {
            title: "Chain-of-Thought Prompting",
            type: "video",
            content: "",
            duration: "25 min",
            order: 1,
            isFree: false,
          },
          {
            title: "Few-Shot and Zero-Shot Learning",
            type: "video",
            content: "",
            duration: "20 min",
            order: 2,
            isFree: false,
          },
          {
            title: "System Prompts and Personas",
            type: "video",
            content: "",
            duration: "25 min",
            order: 3,
            isFree: false,
          },
          {
            title: "Structured Output Techniques",
            type: "video",
            content: "",
            duration: "20 min",
            order: 4,
            isFree: false,
          },
        ],
      },
      {
        title: "Domain-Specific Prompting",
        order: 3,
        lessons: [
          {
            title: "Prompts for Code Generation",
            type: "video",
            content: "",
            duration: "30 min",
            order: 1,
            isFree: false,
          },
          {
            title: "Prompts for Content Writing",
            type: "video",
            content: "",
            duration: "25 min",
            order: 2,
            isFree: false,
          },
          {
            title: "Prompts for Data Analysis",
            type: "video",
            content: "",
            duration: "25 min",
            order: 3,
            isFree: false,
          },
          {
            title: "Building a Prompt Library",
            type: "document",
            content: "",
            duration: "45 min",
            order: 4,
            isFree: false,
          },
        ],
      },
    ],
    createdAt: new Date("2025-08-01T00:00:00Z"),
    updatedAt: new Date("2025-08-01T00:00:00Z"),
  },
  {
    slug: "rag-systems-theory-to-production",
    title: "RAG Systems: From Theory to Production",
    description:
      "Build production-ready Retrieval-Augmented Generation systems with vector databases, embedding models, and advanced retrieval strategies.",
    longDescription: `Master the art of building RAG (Retrieval-Augmented Generation) systems from scratch.

This advanced course takes you from understanding the theory behind RAG to deploying production-grade systems that can answer questions from your own data with high accuracy.

**What you'll learn:**
- RAG architecture and design patterns
- Vector databases (Pinecone, Weaviate, ChromaDB)
- Embedding models and chunking strategies
- Advanced retrieval techniques (hybrid search, re-ranking)
- Evaluation and optimization of RAG pipelines
- Production deployment and monitoring

**Prerequisites:**
- Strong Python skills
- Experience with LLM APIs
- Basic understanding of embeddings and vector spaces`,
    thumbnail: "/images/placeholder-course.webp",
    price: 6999,
    currency: "INR",
    category: "AI Development",
    difficulty: "advanced",
    duration: "15 hours",
    status: "published",
    instructor: "Vikram Patel",
    modules: [
      {
        title: "RAG Fundamentals",
        order: 1,
        lessons: [
          {
            title: "What is RAG and Why It Matters",
            type: "video",
            content: "",
            duration: "15 min",
            order: 1,
            isFree: true,
          },
          {
            title: "RAG Architecture Deep Dive",
            type: "video",
            content: "",
            duration: "30 min",
            order: 2,
            isFree: false,
          },
          {
            title: "Embeddings and Vector Spaces",
            type: "video",
            content: "",
            duration: "25 min",
            order: 3,
            isFree: false,
          },
        ],
      },
      {
        title: "Building the Retrieval Pipeline",
        order: 2,
        lessons: [
          {
            title: "Document Processing and Chunking",
            type: "video",
            content: "",
            duration: "30 min",
            order: 1,
            isFree: false,
          },
          {
            title: "Vector Databases Compared",
            type: "video",
            content: "",
            duration: "35 min",
            order: 2,
            isFree: false,
          },
          {
            title: "Hybrid Search Strategies",
            type: "video",
            content: "",
            duration: "30 min",
            order: 3,
            isFree: false,
          },
          {
            title: "Re-Ranking and Filtering",
            type: "video",
            content: "",
            duration: "25 min",
            order: 4,
            isFree: false,
          },
        ],
      },
      {
        title: "Production RAG Systems",
        order: 3,
        lessons: [
          {
            title: "Evaluation Metrics for RAG",
            type: "video",
            content: "",
            duration: "25 min",
            order: 1,
            isFree: false,
          },
          {
            title: "Optimization Techniques",
            type: "video",
            content: "",
            duration: "30 min",
            order: 2,
            isFree: false,
          },
          {
            title: "Deployment and Monitoring",
            type: "video",
            content: "",
            duration: "35 min",
            order: 3,
            isFree: false,
          },
          {
            title: "Final Project: Enterprise RAG System",
            type: "document",
            content: "",
            duration: "120 min",
            order: 4,
            isFree: false,
          },
        ],
      },
    ],
    createdAt: new Date("2025-09-01T00:00:00Z"),
    updatedAt: new Date("2025-09-01T00:00:00Z"),
  },
  {
    slug: "agentic-ai-for-business-automation",
    title: "Agentic AI for Business Process Automation",
    description:
      "Transform business workflows with AI agents. Learn to identify automation opportunities and build agent-powered process solutions.",
    longDescription: `Learn how to revolutionize business operations by transforming manual processes into AI-agent-enabled workflows.

This course bridges the gap between AI technology and business outcomes, teaching you how to assess, design, build, and deploy AI agents that automate real business processes.

**What you'll learn:**
- Assess business processes for AI automation potential
- Design agent architectures for business workflows
- Build agents that integrate with existing tools (CRMs, ERPs)
- Implement human-in-the-loop approval workflows
- Measure ROI and optimize agent performance

**Who this course is for:**
- Business analysts and process consultants
- IT managers overseeing digital transformation
- Developers building enterprise AI solutions
- Entrepreneurs automating their business operations`,
    thumbnail: "/images/placeholder-course.webp",
    price: 7999,
    currency: "INR",
    category: "Agentic AI",
    difficulty: "intermediate",
    duration: "10 hours",
    status: "published",
    instructor: "Rajesh Kumar",
    modules: [
      {
        title: "Process Assessment",
        order: 1,
        lessons: [
          {
            title: "Identifying Automation Opportunities",
            type: "video",
            content: "",
            duration: "20 min",
            order: 1,
            isFree: true,
          },
          {
            title: "Process Mapping for AI",
            type: "video",
            content: "",
            duration: "25 min",
            order: 2,
            isFree: false,
          },
          {
            title: "ROI Framework for AI Automation",
            type: "markdown",
            content: `# ROI Framework for AI Automation

## Calculating Return on Investment for AI Projects

### The AI ROI Formula

\`\`\`
ROI = (Value Generated - Total Cost) / Total Cost x 100%
\`\`\`

### Value Generated Components

| Component | How to Measure |
|-----------|---------------|
| **Time Saved** | Hours saved per week x hourly cost |
| **Error Reduction** | Cost of errors before vs. after |
| **Throughput Increase** | Additional output capacity |
| **Customer Satisfaction** | NPS improvement, retention rate |

### Total Cost Components

| Component | Typical Range |
|-----------|--------------|
| **AI API Costs** | $50 - $500/month |
| **Development Time** | 2 - 8 weeks |
| **Integration Costs** | $5K - $50K |
| **Maintenance** | 10-20% of initial cost/year |

## Case Study: Customer Support Automation

### Before AI Agent
- 5 support agents handling 200 tickets/day
- Average resolution time: 45 minutes
- Monthly cost: $25,000

### After AI Agent
- AI handles 60% of tickets automatically
- 2 support agents for complex issues
- Average resolution time: 5 minutes (AI) / 30 minutes (human)
- Monthly cost: $10,500 (staff) + $500 (AI) = $11,000

### ROI Calculation
\`\`\`
Monthly Savings = $25,000 - $11,000 = $14,000
Implementation Cost = $30,000 (one-time)
Payback Period = $30,000 / $14,000 = 2.1 months
Annual ROI = ($14,000 x 12 - $30,000) / $30,000 x 100% = 460%
\`\`\`

## Decision Framework

Use this decision matrix to prioritize AI automation projects:

1. **High Impact, Low Complexity** - Do first
2. **High Impact, High Complexity** - Plan carefully
3. **Low Impact, Low Complexity** - Quick wins
4. **Low Impact, High Complexity** - Avoid`,
            duration: "15 min",
            order: 3,
            isFree: false,
          },
        ],
      },
      {
        title: "Designing Agent Workflows",
        order: 2,
        lessons: [
          {
            title: "Agent Architecture Patterns for Business",
            type: "video",
            content: "",
            duration: "30 min",
            order: 1,
            isFree: false,
          },
          {
            title: "Integration with Enterprise Tools",
            type: "video",
            content: "",
            duration: "25 min",
            order: 2,
            isFree: false,
          },
          {
            title: "Human-in-the-Loop Design",
            type: "video",
            content: "",
            duration: "20 min",
            order: 3,
            isFree: false,
          },
        ],
      },
      {
        title: "Building and Deploying",
        order: 3,
        lessons: [
          {
            title: "Building a Customer Support Agent",
            type: "video",
            content: "",
            duration: "40 min",
            order: 1,
            isFree: false,
          },
          {
            title: "Building a Data Processing Agent",
            type: "video",
            content: "",
            duration: "35 min",
            order: 2,
            isFree: false,
          },
          {
            title: "Monitoring and Optimization",
            type: "video",
            content: "",
            duration: "25 min",
            order: 3,
            isFree: false,
          },
          {
            title: "Final Project: End-to-End Business Agent",
            type: "document",
            content: "",
            duration: "90 min",
            order: 4,
            isFree: false,
          },
        ],
      },
    ],
    createdAt: new Date("2025-10-01T00:00:00Z"),
    updatedAt: new Date("2025-10-01T00:00:00Z"),
  },
  {
    slug: "ai-strategy-for-leaders",
    title: "AI Strategy for Business Leaders",
    description:
      "A non-technical course for executives and managers on developing an effective AI strategy, evaluating AI opportunities, and leading AI initiatives.",
    longDescription: `Designed for business leaders, this course provides a strategic framework for understanding and leveraging AI in your organization.

No coding required — this course focuses on decision-making, strategy, and leadership in the age of AI.

**What you'll learn:**
- Evaluate AI readiness and maturity of your organization
- Develop a practical AI strategy and roadmap
- Understand AI capabilities, limitations, and risks
- Make informed build-vs-buy decisions for AI
- Lead AI transformation with change management
- Measure and communicate AI impact

**Who this course is for:**
- C-suite executives and senior managers
- Department heads considering AI adoption
- Product managers and strategists
- Entrepreneurs planning AI-first businesses`,
    thumbnail: "/images/placeholder-course.webp",
    price: 3999,
    currency: "INR",
    category: "AI Consulting",
    difficulty: "beginner",
    duration: "5 hours",
    status: "published",
    instructor: "Dr. Priya Sharma",
    modules: [
      {
        title: "Understanding the AI Landscape",
        order: 1,
        lessons: [
          {
            title: "The State of AI in 2025",
            type: "video",
            content: "",
            duration: "15 min",
            order: 1,
            isFree: true,
          },
          {
            title: "AI Capabilities and Limitations",
            type: "video",
            content: "",
            duration: "20 min",
            order: 2,
            isFree: true,
          },
          {
            title: "AI Use Cases by Industry",
            type: "markdown",
            content: `# AI Use Cases by Industry

## Healthcare

- **Medical Image Analysis**: AI-powered radiology and pathology
- **Drug Discovery**: Accelerating compound screening
- **Clinical Documentation**: Automated note-taking and coding
- **Patient Triage**: AI chatbots for initial assessment

## Financial Services

- **Fraud Detection**: Real-time transaction monitoring
- **Risk Assessment**: Automated credit scoring
- **Document Processing**: Insurance claims and loan applications
- **Customer Service**: AI-powered financial advisors

## Retail & E-Commerce

- **Personalization**: Product recommendations at scale
- **Inventory Management**: Demand forecasting
- **Customer Support**: Automated order tracking and returns
- **Content Generation**: Product descriptions and marketing copy

## Manufacturing

- **Quality Control**: Visual inspection with computer vision
- **Predictive Maintenance**: Reducing unplanned downtime
- **Supply Chain Optimization**: Demand planning and logistics
- **Process Automation**: Robotic process automation with AI

## Education

- **Personalized Learning**: Adaptive learning paths
- **Content Creation**: Automated quiz and exercise generation
- **Student Support**: AI tutoring and Q&A systems
- **Administrative Automation**: Grading and scheduling

## Key Takeaway

Every industry has AI opportunities. The key is identifying which use cases deliver the highest ROI for your specific organization and starting with those.`,
            duration: "15 min",
            order: 3,
            isFree: false,
          },
        ],
      },
      {
        title: "Building Your AI Strategy",
        order: 2,
        lessons: [
          {
            title: "AI Readiness Assessment",
            type: "video",
            content: "",
            duration: "20 min",
            order: 1,
            isFree: false,
          },
          {
            title: "Developing an AI Roadmap",
            type: "video",
            content: "",
            duration: "25 min",
            order: 2,
            isFree: false,
          },
          {
            title: "Build vs Buy Decisions",
            type: "video",
            content: "",
            duration: "20 min",
            order: 3,
            isFree: false,
          },
          {
            title: "Measuring AI ROI",
            type: "video",
            content: "",
            duration: "15 min",
            order: 4,
            isFree: false,
          },
        ],
      },
      {
        title: "Leading AI Transformation",
        order: 3,
        lessons: [
          {
            title: "Change Management for AI",
            type: "video",
            content: "",
            duration: "20 min",
            order: 1,
            isFree: false,
          },
          {
            title: "AI Ethics and Governance",
            type: "video",
            content: "",
            duration: "20 min",
            order: 2,
            isFree: false,
          },
          {
            title: "Building an AI Team",
            type: "video",
            content: "",
            duration: "15 min",
            order: 3,
            isFree: false,
          },
        ],
      },
    ],
    createdAt: new Date("2025-11-01T00:00:00Z"),
    updatedAt: new Date("2025-11-01T00:00:00Z"),
  },
]);

print("Successfully inserted 6 courses into the courses collection.");
print("Run db.courses.find().count() to verify.");
