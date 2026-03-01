const sampleLessonContent: Record<string, string> = {
  l3: `# Key Concepts and Terminology

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

Understanding these key concepts is essential for working effectively with Generative AI. In the next lesson, we'll test your knowledge with a quiz.
`,

  l7: `# Tokenization and Embeddings

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
- **RAG systems**: Retrieve relevant context for LLM responses
`,

  l15: `# Setting Up Your Development Environment

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

You're now ready to start building AI agents!
`,

  l30: `# Common Prompt Patterns

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
\`\`\`
`,

  l52: `# ROI Framework for AI Automation

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
4. **Low Impact, High Complexity** - Avoid
`,

  l62: `# AI Use Cases by Industry

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

Every industry has AI opportunities. The key is identifying which use cases deliver the highest ROI for your specific organization and starting with those.
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
