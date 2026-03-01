import type { CourseCategory, CourseDifficulty } from "@/types";

export interface SampleCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  price: number;
  currency: string;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  duration: string;
  status: "draft" | "published" | "archived";
  instructor: string;
  modules: {
    id: string;
    title: string;
    order: number;
    lessons: {
      id: string;
      title: string;
      type: "video" | "document" | "quiz" | "markdown";
      duration: string;
      order: number;
      isFree: boolean;
    }[];
  }[];
}

export const sampleCourses: SampleCourse[] = [
  {
    id: "1",
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
        id: "m1",
        title: "Getting Started with AI",
        order: 1,
        lessons: [
          { id: "l1", title: "What is Generative AI?", type: "video", duration: "15 min", order: 1, isFree: true },
          { id: "l2", title: "History of AI: From Rule-Based to Generative", type: "video", duration: "20 min", order: 2, isFree: true },
          { id: "l3", title: "Key Concepts and Terminology", type: "markdown", duration: "10 min", order: 3, isFree: false },
          { id: "l4", title: "Quiz: AI Fundamentals", type: "quiz", duration: "5 min", order: 4, isFree: false },
        ],
      },
      {
        id: "m2",
        title: "Understanding Large Language Models",
        order: 2,
        lessons: [
          { id: "l5", title: "How LLMs Work", type: "video", duration: "25 min", order: 1, isFree: false },
          { id: "l6", title: "Transformer Architecture Explained", type: "video", duration: "30 min", order: 2, isFree: false },
          { id: "l7", title: "Tokenization and Embeddings", type: "markdown", duration: "15 min", order: 3, isFree: false },
          { id: "l8", title: "Popular LLMs: GPT, Claude, Llama", type: "video", duration: "20 min", order: 4, isFree: false },
        ],
      },
      {
        id: "m3",
        title: "Practical Applications",
        order: 3,
        lessons: [
          { id: "l9", title: "Text Generation and Summarization", type: "video", duration: "20 min", order: 1, isFree: false },
          { id: "l10", title: "Code Generation with AI", type: "video", duration: "25 min", order: 2, isFree: false },
          { id: "l11", title: "Building Your First AI App", type: "video", duration: "35 min", order: 3, isFree: false },
          { id: "l12", title: "Final Project: AI-Powered Tool", type: "document", duration: "60 min", order: 4, isFree: false },
        ],
      },
    ],
  },
  {
    id: "2",
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
        id: "m4",
        title: "Introduction to AI Agents",
        order: 1,
        lessons: [
          { id: "l13", title: "What Are AI Agents?", type: "video", duration: "15 min", order: 1, isFree: true },
          { id: "l14", title: "Agent Architectures Overview", type: "video", duration: "20 min", order: 2, isFree: true },
          { id: "l15", title: "Setting Up Your Development Environment", type: "markdown", duration: "15 min", order: 3, isFree: false },
        ],
      },
      {
        id: "m5",
        title: "LangChain Fundamentals",
        order: 2,
        lessons: [
          { id: "l16", title: "LangChain Core Concepts", type: "video", duration: "25 min", order: 1, isFree: false },
          { id: "l17", title: "Chains and Prompts", type: "video", duration: "30 min", order: 2, isFree: false },
          { id: "l18", title: "Memory and State Management", type: "video", duration: "25 min", order: 3, isFree: false },
          { id: "l19", title: "Tools and Tool Calling", type: "video", duration: "30 min", order: 4, isFree: false },
        ],
      },
      {
        id: "m6",
        title: "Building Your First Agent",
        order: 3,
        lessons: [
          { id: "l20", title: "ReAct Agent Pattern", type: "video", duration: "30 min", order: 1, isFree: false },
          { id: "l21", title: "Custom Tools for Agents", type: "video", duration: "35 min", order: 2, isFree: false },
          { id: "l22", title: "Error Handling and Guardrails", type: "video", duration: "20 min", order: 3, isFree: false },
          { id: "l23", title: "Project: Research Agent", type: "document", duration: "90 min", order: 4, isFree: false },
        ],
      },
      {
        id: "m7",
        title: "Advanced Agent Patterns",
        order: 4,
        lessons: [
          { id: "l24", title: "Multi-Agent Orchestration", type: "video", duration: "35 min", order: 1, isFree: false },
          { id: "l25", title: "RAG-Powered Agents", type: "video", duration: "40 min", order: 2, isFree: false },
          { id: "l26", title: "Human-in-the-Loop Agents", type: "video", duration: "25 min", order: 3, isFree: false },
          { id: "l27", title: "Final Project: Production Agent System", type: "document", duration: "120 min", order: 4, isFree: false },
        ],
      },
    ],
  },
  {
    id: "3",
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
        id: "m8",
        title: "Prompt Engineering Foundations",
        order: 1,
        lessons: [
          { id: "l28", title: "Why Prompt Engineering Matters", type: "video", duration: "10 min", order: 1, isFree: true },
          { id: "l29", title: "Anatomy of a Good Prompt", type: "video", duration: "20 min", order: 2, isFree: true },
          { id: "l30", title: "Common Prompt Patterns", type: "markdown", duration: "15 min", order: 3, isFree: false },
        ],
      },
      {
        id: "m9",
        title: "Advanced Techniques",
        order: 2,
        lessons: [
          { id: "l31", title: "Chain-of-Thought Prompting", type: "video", duration: "25 min", order: 1, isFree: false },
          { id: "l32", title: "Few-Shot and Zero-Shot Learning", type: "video", duration: "20 min", order: 2, isFree: false },
          { id: "l33", title: "System Prompts and Personas", type: "video", duration: "25 min", order: 3, isFree: false },
          { id: "l34", title: "Structured Output Techniques", type: "video", duration: "20 min", order: 4, isFree: false },
        ],
      },
      {
        id: "m10",
        title: "Domain-Specific Prompting",
        order: 3,
        lessons: [
          { id: "l35", title: "Prompts for Code Generation", type: "video", duration: "30 min", order: 1, isFree: false },
          { id: "l36", title: "Prompts for Content Writing", type: "video", duration: "25 min", order: 2, isFree: false },
          { id: "l37", title: "Prompts for Data Analysis", type: "video", duration: "25 min", order: 3, isFree: false },
          { id: "l38", title: "Building a Prompt Library", type: "document", duration: "45 min", order: 4, isFree: false },
        ],
      },
    ],
  },
  {
    id: "4",
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
        id: "m11",
        title: "RAG Fundamentals",
        order: 1,
        lessons: [
          { id: "l39", title: "What is RAG and Why It Matters", type: "video", duration: "15 min", order: 1, isFree: true },
          { id: "l40", title: "RAG Architecture Deep Dive", type: "video", duration: "30 min", order: 2, isFree: false },
          { id: "l41", title: "Embeddings and Vector Spaces", type: "video", duration: "25 min", order: 3, isFree: false },
        ],
      },
      {
        id: "m12",
        title: "Building the Retrieval Pipeline",
        order: 2,
        lessons: [
          { id: "l42", title: "Document Processing and Chunking", type: "video", duration: "30 min", order: 1, isFree: false },
          { id: "l43", title: "Vector Databases Compared", type: "video", duration: "35 min", order: 2, isFree: false },
          { id: "l44", title: "Hybrid Search Strategies", type: "video", duration: "30 min", order: 3, isFree: false },
          { id: "l45", title: "Re-Ranking and Filtering", type: "video", duration: "25 min", order: 4, isFree: false },
        ],
      },
      {
        id: "m13",
        title: "Production RAG Systems",
        order: 3,
        lessons: [
          { id: "l46", title: "Evaluation Metrics for RAG", type: "video", duration: "25 min", order: 1, isFree: false },
          { id: "l47", title: "Optimization Techniques", type: "video", duration: "30 min", order: 2, isFree: false },
          { id: "l48", title: "Deployment and Monitoring", type: "video", duration: "35 min", order: 3, isFree: false },
          { id: "l49", title: "Final Project: Enterprise RAG System", type: "document", duration: "120 min", order: 4, isFree: false },
        ],
      },
    ],
  },
  {
    id: "5",
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
        id: "m14",
        title: "Process Assessment",
        order: 1,
        lessons: [
          { id: "l50", title: "Identifying Automation Opportunities", type: "video", duration: "20 min", order: 1, isFree: true },
          { id: "l51", title: "Process Mapping for AI", type: "video", duration: "25 min", order: 2, isFree: false },
          { id: "l52", title: "ROI Framework for AI Automation", type: "markdown", duration: "15 min", order: 3, isFree: false },
        ],
      },
      {
        id: "m15",
        title: "Designing Agent Workflows",
        order: 2,
        lessons: [
          { id: "l53", title: "Agent Architecture Patterns for Business", type: "video", duration: "30 min", order: 1, isFree: false },
          { id: "l54", title: "Integration with Enterprise Tools", type: "video", duration: "25 min", order: 2, isFree: false },
          { id: "l55", title: "Human-in-the-Loop Design", type: "video", duration: "20 min", order: 3, isFree: false },
        ],
      },
      {
        id: "m16",
        title: "Building and Deploying",
        order: 3,
        lessons: [
          { id: "l56", title: "Building a Customer Support Agent", type: "video", duration: "40 min", order: 1, isFree: false },
          { id: "l57", title: "Building a Data Processing Agent", type: "video", duration: "35 min", order: 2, isFree: false },
          { id: "l58", title: "Monitoring and Optimization", type: "video", duration: "25 min", order: 3, isFree: false },
          { id: "l59", title: "Final Project: End-to-End Business Agent", type: "document", duration: "90 min", order: 4, isFree: false },
        ],
      },
    ],
  },
  {
    id: "6",
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
        id: "m17",
        title: "Understanding the AI Landscape",
        order: 1,
        lessons: [
          { id: "l60", title: "The State of AI in 2025", type: "video", duration: "15 min", order: 1, isFree: true },
          { id: "l61", title: "AI Capabilities and Limitations", type: "video", duration: "20 min", order: 2, isFree: true },
          { id: "l62", title: "AI Use Cases by Industry", type: "markdown", duration: "15 min", order: 3, isFree: false },
        ],
      },
      {
        id: "m18",
        title: "Building Your AI Strategy",
        order: 2,
        lessons: [
          { id: "l63", title: "AI Readiness Assessment", type: "video", duration: "20 min", order: 1, isFree: false },
          { id: "l64", title: "Developing an AI Roadmap", type: "video", duration: "25 min", order: 2, isFree: false },
          { id: "l65", title: "Build vs Buy Decisions", type: "video", duration: "20 min", order: 3, isFree: false },
          { id: "l66", title: "Measuring AI ROI", type: "video", duration: "15 min", order: 4, isFree: false },
        ],
      },
      {
        id: "m19",
        title: "Leading AI Transformation",
        order: 3,
        lessons: [
          { id: "l67", title: "Change Management for AI", type: "video", duration: "20 min", order: 1, isFree: false },
          { id: "l68", title: "AI Ethics and Governance", type: "video", duration: "20 min", order: 2, isFree: false },
          { id: "l69", title: "Building an AI Team", type: "video", duration: "15 min", order: 3, isFree: false },
        ],
      },
    ],
  },
];

export function getPublishedCourses() {
  return sampleCourses.filter((c) => c.status === "published");
}

export function getCourseBySlug(slug: string) {
  return sampleCourses.find((c) => c.slug === slug && c.status === "published");
}

export function getCoursesByCategory(category: string) {
  return getPublishedCourses().filter((c) => c.category === category);
}

export function searchCourses(query: string) {
  const q = query.toLowerCase();
  return getPublishedCourses().filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q)
  );
}

export function getLessonsCount(course: SampleCourse) {
  return course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
}
