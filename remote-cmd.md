# Remote Command Execution — Architecture Design

> **Goal:** Allow learners to run Linux commands and test programs directly from
> lesson pages. Commands execute inside Docker containers on an on-premise server.
>
> **Hosting Model:** Hybrid — Apps & databases on **Azure**, Docker containers on
> **on-premise server**.

---

## 1. Is It Possible?

**Yes, absolutely.** This is a well-established pattern used by platforms like
Katacoda, Play with Docker, GitHub Codespaces, and Killercoda. The core idea:

- Learner types a command in an **embedded terminal** on the lesson page
- The command is sent over **WebSocket** through Azure to your on-premise server
- The server executes the command inside an **isolated Docker container**
- Output streams back to the browser in real time

---

## 2. High-Level Architecture (Hybrid: Azure + On-Premise)

```
┌─────────────────────────────────────────────────────────────────┐
│                        LEARNER BROWSER                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Lesson Page (Markdown + Embedded Terminal)              │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────┐  ┌───────────────────┐  │   │
│  │  │   Markdown Content Area     │  │  Terminal Widget   │  │   │
│  │  │   (ReactMarkdown)           │  │  (xterm.js)        │  │   │
│  │  │                             │  │                    │  │   │
│  │  │   Lesson text, images,      │  │  $ python hello.py │  │   │
│  │  │   code blocks...            │  │  Hello World!      │  │   │
│  │  │                             │  │  $                 │  │   │
│  │  └─────────────────────────────┘  └────────┬──────────┘  │   │
│  └────────────────────────────────────────────┼─────────────┘   │
│                                               │                 │
└───────────────────────────────────────────────┼─────────────────┘
                                                │
                              HTTPS + WebSocket (wss://)
                                                │
┌───────────────────────────────────────────────┼─────────────────┐
│                     AZURE CLOUD                │                 │
│                                               │                 │
│  ┌────────────────────────┐  ┌───────────────┼─────────────┐   │
│  │  Azure Static Web Apps │  │ Azure Web PubSub /           │   │
│  │  (nmmr-training)       │  │ Cloudflare Tunnel            │   │
│  │  - Next.js frontend    │  │ (WebSocket relay to          │   │
│  │  - Lesson pages        │  │  on-premise server)          │   │
│  │  - Admin dashboard     │  └───────────────┼─────────────┘   │
│  └────────────────────────┘                   │                 │
│                                               │                 │
│  ┌────────────────────────┐  ┌──────────────────────────────┐  │
│  │  Azure Functions       │  │ Azure Cosmos DB              │  │
│  │  (nmmr-api)            │  │ (MongoDB API)                │  │
│  │  - Chat API            │  │ - Courses, users             │  │
│  │  - REST endpoints      │  │ - Lab definitions            │  │
│  └────────────────────────┘  │ - Enrollments, content       │  │
│                               └──────────────────────────────┘  │
│                                                                 │
└───────────────────────────────────────────────┼─────────────────┘
                                                │
                                   Outbound tunnel (Cloudflare)
                                   or Azure Web PubSub connection
                                                │
┌───────────────────────────────────────────────┼─────────────────┐
│              ON-PREMISE SERVER                │                 │
│                                               │                 │
│  ┌────────────────────────────────────────────┼─────────────┐   │
│  │  Terminal Relay Service (Node.js)          │             │   │
│  │  - Connects outbound to Azure/Cloudflare   │             │   │
│  │  - Authenticates user (JWT)                │             │   │
│  │  - Provisions/reuses Docker container      │             │   │
│  │  - Proxies I/O between WS and container   │             │   │
│  │  - Enforces timeouts & resource limits     │             │   │
│  └────────────────────────────────────────────┼─────────────┘   │
│                                               │                 │
│  ┌────────────────────────────────────────────▼─────────────┐   │
│  │  Docker Engine                                           │   │
│  │                                                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │   │
│  │  │Container │  │Container │  │Container │  ...           │   │
│  │  │(User A)  │  │(User B)  │  │(User C)  │               │   │
│  │  │          │  │          │  │          │               │   │
│  │  │ python   │  │ node     │  │ gcc      │               │   │
│  │  │ gcc      │  │ python   │  │ java     │               │   │
│  │  │ java     │  │ rust     │  │ python   │               │   │
│  │  └──────────┘  └──────────┘  └──────────┘               │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### What Lives Where

```
┌─────────────────────────────────────────────────────────────────┐
│  AZURE (Cloud)                                                  │
│                                                                 │
│  ✅ nmmr-training    — Next.js frontend (Static Web Apps)       │
│  ✅ nmmr-api         — Chat + REST API (Azure Functions)        │
│  ✅ MongoDB          — Cosmos DB (MongoDB API) or Atlas         │
│  ✅ Tunnel endpoint  — Cloudflare or Azure Web PubSub           │
│  ✅ DNS / SSL        — Managed by Azure + Cloudflare            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ON-PREMISE (Your Server)                                       │
│                                                                 │
│  ✅ Terminal Relay   — Node.js WebSocket service                │
│  ✅ Docker Engine    — Container runtime                        │
│  ✅ Lab containers   — python-lab, node-lab, linux-lab, etc.    │
│  ✅ cloudflared      — Tunnel daemon (connects outbound)        │
│                                                                 │
│  ❌ NO databases                                                │
│  ❌ NO web apps                                                 │
│  ❌ NO public-facing ports (tunnel is outbound-only)            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Breakdown

### 3a. Frontend — Terminal Widget (in nmmr-training, deployed on Azure)

```
What:     Embedded terminal component inside lesson pages
Library:  xterm.js  (+ xterm-addon-fit, xterm-addon-web-links)
Transport: WebSocket (native browser API or socket.io-client)
Trigger:  Markdown lessons can include a custom tag like:
            ```terminal
            container: python-lab
            ```
          which renders an interactive terminal panel
```

**How it fits into lessons:**

```
┌─────────────────────────────────────────────────┐
│  Lesson: "Python Basics"                        │
│                                                 │
│  ## Variables in Python                         │
│                                                 │
│  Variables store data. Try it yourself:          │
│                                                 │
│  ┌─────────────────────────────────────────────┐│
│  │ Terminal: python-lab               [↗] [✕]  ││
│  │─────────────────────────────────────────────││
│  │ $ python3                                   ││
│  │ >>> x = 42                                  ││
│  │ >>> print(x)                                ││
│  │ 42                                          ││
│  │ >>>                                         ││
│  │                                             ││
│  └─────────────────────────────────────────────┘│
│                                                 │
│  As you can see, Python doesn't need type...    │
└─────────────────────────────────────────────────┘
```

### 3b. Cloud Relay — Bridging Azure to On-Premise

The on-premise server sits behind a NAT/firewall. The browser can't connect
directly. A tunnel bridges the gap:

```
 BROWSER (anywhere)          AZURE / CLOUDFLARE          ON-PREMISE SERVER
       │                           │                           │
       │  wss://terminal.nmmr.tech │                           │
       │ ────────────────────────► │                           │
       │                           │  Cloudflare routes to     │
       │                           │  tunnel endpoint          │
       │                           │ ────────────────────────► │
       │                           │                           │
       │                           │  (cloudflared daemon      │
       │                           │   maintains outbound      │
       │                           │   persistent connection)  │
       │                           │                           │

Key: The on-premise server connects OUTBOUND to Cloudflare.
     No inbound ports need to be opened on your firewall.
```

**Tunnel Options:**

```
Option A: Cloudflare Tunnel (Recommended — Free)
   On-premise runs `cloudflared` daemon → creates outbound tunnel
   Browser connects to → wss://terminal.nmmr.tech
   Cloudflare routes traffic → your server
   ✅ Free, production-grade, no public IP needed

Option B: Azure Web PubSub (~$1-5/mo)
   Managed WebSocket service by Azure
   On-premise server connects as "server" endpoint
   Browser connects as "client" endpoint
   Azure handles routing
   ✅ Stays within Azure ecosystem, managed service

Option C: Azure Relay Hybrid Connections (~$4/mo)
   Azure-managed relay for hybrid connectivity
   On-premise listener connects outbound to Azure
   ✅ Azure-native, enterprise-grade

Option D: ngrok / Tailscale (Dev/Small Scale)
   Quick setup for development/small user base
   ngrok exposes a public URL for your server
```

**Recommendation:** Cloudflare Tunnel (free, production-grade, easy setup).
If you prefer Azure-native, use Azure Web PubSub.

### 3c. On-Premise — Terminal Relay Service

```
Language:  Node.js (TypeScript)
Libraries: ws (WebSocket server), dockerode (Docker API client)
Purpose:   Sits between browser WebSocket and Docker containers
Runs on:   Your on-premise server

Flow:
  1. On startup: connects outbound to Cloudflare Tunnel
  2. Browser opens WebSocket with JWT token (routed via tunnel)
  3. Service validates JWT (shared secret with Azure-hosted nmmr-api)
  4. Fetches lab config from Azure MongoDB (or local cache)
  5. Looks up or creates a Docker container for this user+lab
  6. Attaches to container's stdin/stdout/stderr
  7. Pipes I/O:  Browser ←→ WebSocket ←→ Docker exec stream
  8. On disconnect: keeps container alive (with timeout)
  9. On timeout (e.g., 30 min idle): stops & removes container
```

### 3d. On-Premise — Docker Containers

```
Pre-built images per lab type:

  nmmr/python-lab:latest
    - Python 3.12, pip, common packages
    - Non-root user "learner"
    - Working directory /home/learner

  nmmr/node-lab:latest
    - Node.js 20, npm, yarn
    - Non-root user "learner"

  nmmr/linux-lab:latest
    - Ubuntu minimal, gcc, make, vim, git
    - Common CLI tools

  nmmr/fullstack-lab:latest
    - Python + Node + PostgreSQL client
    - For complex exercises

Security constraints per container:
  - CPU: 0.5 cores max
  - Memory: 256MB max
  - Disk: 100MB max (tmpfs)
  - Network: disabled or restricted
  - No privilege escalation (--security-opt no-new-privileges)
  - Read-only root filesystem (with writable /tmp and /home)
  - Auto-kill after 30 min idle
```

---

## 4. Data Flow — Step by Step

```
 BROWSER                 AZURE CLOUD              ON-PREMISE SERVER
    │                        │                           │
    │  1. Load lesson page   │                           │
    │     from Azure SWA ◄──►│  (Static Web Apps)        │
    │                        │                           │
    │  2. Fetch lesson       │                           │
    │     content ──────────►│  (Cosmos DB / MongoDB)    │
    │     (has terminal      │                           │
    │      block)            │                           │
    │                        │                           │
    │  3. Open WebSocket ────────────────────────────── ►│
    │     wss://terminal.nmmr.tech                       │
    │     Headers: { token: JWT }                        │
    │                        │  (via Cloudflare Tunnel)  │
    │                        │                           │
    │                        │    4. Validate JWT        │
    │                        │       (shared secret      │
    │                        │        with Azure app)    │
    │                        │    5. Find/create Docker  │
    │                        │       container for user  │
    │                        │    6. docker exec -it     │
    │                        │       /bin/bash           │
    │                        │                           │
    │  7. Terminal ready  ◄──────────────────────────── │
    │     (show prompt)      │                           │
    │                        │                           │
    │  8. User types: ls ────────────────────────────── ►│
    │                        │    9. Pipe to container   │
    │                        │       stdin               │
    │                        │                           │
    │ 10. Output streams  ◄──────────────────────────── │
    │     back in real time  │   11. Read from           │
    │                        │       container stdout    │
    │                        │                           │
    │ 12. User disconnects ──────────────────────────── ►│
    │                        │   13. Start idle timer    │
    │                        │   14. After 30 min →      │
    │                        │       destroy container   │
```

---

## 5. Admin Configuration — How Labs Are Defined

Admins configure labs at the **course/lesson level**. Lab definitions are
stored in **Azure Cosmos DB** (same database as courses/users):

```
Lab Definition (stored in MongoDB on Azure):

{
  "labId": "python-basics",
  "name": "Python Basics Lab",
  "dockerImage": "nmmr/python-lab:latest",
  "description": "Python 3.12 with common packages",
  "resources": {
    "cpuLimit": 0.5,
    "memoryLimit": "256m",
    "diskLimit": "100m",
    "timeoutMinutes": 30
  },
  "preloadFiles": [
    { "path": "/home/learner/hello.py", "content": "print('Hello!')" },
    { "path": "/home/learner/data.csv", "content": "name,age\nAlice,30" }
  ],
  "startupCommand": null,
  "networkEnabled": false
}
```

The on-premise relay service fetches lab configs from Azure MongoDB via the
nmmr-api REST endpoint (or caches them locally on first fetch).

**In the Markdown Editor**, a new toolbar button "Insert Terminal" adds:

```markdown
Some lesson text here...

:::terminal python-basics
:::

More lesson text below...
```

The frontend detects `:::terminal <labId>:::` blocks and renders the
interactive terminal widget in place.

---

## 6. Security Considerations

```
┌─────────────────────────────────────────────────────────┐
│                   SECURITY LAYERS                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Layer 1: Authentication                                │
│    - JWT token required to open WebSocket               │
│    - Token validated against same AUTH_SECRET            │
│      (shared between Azure apps and on-premise relay)   │
│    - Only enrolled users can access lab for that course  │
│                                                         │
│  Layer 2: Tunnel Security                               │
│    - Cloudflare Tunnel: encrypted, outbound-only        │
│    - No inbound ports opened on on-premise server       │
│    - Tunnel authenticated with Cloudflare credentials   │
│    - DDoS protection handled by Cloudflare              │
│                                                         │
│  Layer 3: Container Isolation                           │
│    - Each user gets their OWN container (no sharing)    │
│    - Non-root user inside container                     │
│    - No Docker socket mounted                           │
│    - No host network access                             │
│    - Seccomp profile applied                            │
│    - Capabilities dropped (no SYS_ADMIN, etc.)          │
│                                                         │
│  Layer 4: Resource Limits                               │
│    - CPU, memory, disk capped per container             │
│    - Idle timeout: auto-cleanup after 30 min            │
│    - Max concurrent containers per user: 1              │
│    - Max concurrent containers total: configurable      │
│                                                         │
│  Layer 5: Network Restrictions                          │
│    - Containers have NO outbound internet by default    │
│    - Can be enabled per-lab if needed (e.g., pip inst.) │
│    - Inter-container communication blocked              │
│                                                         │
│  Layer 6: Input Sanitization                            │
│    - Max command length enforced                        │
│    - Rate limiting on WebSocket messages                │
│    - Fork bomb protection via cgroup limits             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Technology Choices

| Component | Technology | Where | Why |
|-----------|-----------|-------|-----|
| **Frontend** | Next.js (Azure SWA) | Azure | Already deployed there |
| **Terminal UI** | xterm.js | Browser | Industry standard, used by VS Code |
| **WebSocket (browser)** | Native WebSocket API | Browser | No extra dependency |
| **API + Database** | Azure Functions + Cosmos DB | Azure | Existing infrastructure |
| **Tunnel** | Cloudflare Tunnel | Cloud ↔ On-prem | Free, production-grade, outbound-only |
| **Relay Service** | Node.js + ws + dockerode | On-premise | Lightweight, TypeScript, direct Docker API |
| **Containers** | Docker Engine | On-premise | Industry standard, great isolation |
| **Container Orchestration** | Docker Compose (simple) | On-premise | No need for K8s at small scale |
| **Session Storage** | Redis or in-memory Map | On-premise | Track active containers per user |

---

## 8. Infrastructure Requirements

### Azure (Cloud) — Uses Existing Infrastructure

```
Already in place:
  - Azure Static Web Apps (nmmr-training) — Free tier
  - Azure Functions (nmmr-api) — Consumption plan
  - Cosmos DB / MongoDB Atlas — existing database

New additions:
  - Lab collection in MongoDB (lab definitions)
  - Terminal API endpoint in nmmr-api (optional, for lab config)
  - DNS CNAME: terminal.nmmr.tech → Cloudflare Tunnel
```

### On-Premise Server — New Setup

```
Hardware (minimum):
  - CPU:    4 cores (supports ~8 concurrent containers)
  - RAM:    8 GB (256MB × 8 containers + OS + relay service)
  - Disk:   50 GB SSD (Docker images + container writable layers)
  - Network: Stable internet (for Cloudflare Tunnel outbound)

Software:
  - Ubuntu 22.04 / Debian 12 (or any Linux with Docker support)
  - Docker Engine 24+
  - Node.js 18+ (for relay service)
  - cloudflared (Cloudflare Tunnel daemon)

No inbound ports needed! The tunnel is outbound-only.

Scaling:
  - 4 cores  → ~8  concurrent learners
  - 8 cores  → ~16 concurrent learners
  - 16 cores → ~32 concurrent learners
  - Beyond that → multiple servers with load balancing
```

---

## 9. New Repositories / Services

```
On Azure (existing repos — minor additions):

  nmmr-training/     ← Next.js frontend (Azure Static Web Apps)
    + New: terminal components, custom markdown renderer

  nmmr-api/          ← Chat + REST API (Azure Functions)
    + New: /api/labs endpoint (CRUD lab definitions from MongoDB)

On-Premise (new repo):

  nmmr-terminal/     ← Terminal relay service (on-premise ONLY)
    ├── src/
    │   ├── server.ts            # WebSocket server (ws)
    │   ├── auth.ts              # JWT validation (shared secret)
    │   ├── container-manager.ts # Docker lifecycle (dockerode)
    │   ├── session-store.ts     # Track active sessions
    │   ├── lab-cache.ts         # Cache lab configs from Azure API
    │   └── config.ts            # Server config, limits
    ├── docker/
    │   ├── python-lab/
    │   │   └── Dockerfile
    │   ├── node-lab/
    │   │   └── Dockerfile
    │   └── linux-lab/
    │       └── Dockerfile
    ├── docker-compose.yml       # For the relay service itself
    ├── cloudflared-config.yml   # Tunnel configuration
    ├── package.json
    └── README.md
```

---

## 10. Changes Needed in nmmr-training (Frontend on Azure)

```
New dependencies:
  - xterm                    (terminal emulator)
  - xterm-addon-fit          (auto-resize terminal)
  - xterm-addon-web-links    (clickable URLs in terminal)

New components:
  src/components/terminal/
    ├── TerminalWidget.tsx       # Main terminal with xterm.js
    ├── TerminalBlock.tsx        # Wrapper rendered from markdown
    └── TerminalConnectionStatus.tsx  # Connected/disconnected indicator

Modified components:
  src/components/dashboard/LessonContent.tsx
    → Add custom ReactMarkdown renderer for :::terminal::: blocks

New environment variable:
  NEXT_PUBLIC_TERMINAL_WS_URL=wss://terminal.nmmr.tech

New model (MongoDB on Azure):
  src/lib/models/Lab.ts          # Lab definitions (image, limits, etc.)

New admin page:
  src/app/admin/labs/page.tsx    # Manage lab configurations
```

---

## 11. Changes Needed in nmmr-api (API on Azure Functions)

```
New endpoints:
  GET    /api/labs           # List all lab definitions
  GET    /api/labs/:id       # Get specific lab config
  POST   /api/labs           # Create new lab (admin only)
  PUT    /api/labs/:id       # Update lab config (admin only)
  DELETE /api/labs/:id       # Delete lab config (admin only)

These endpoints serve lab definitions from Azure MongoDB.
The on-premise relay service calls GET /api/labs/:id to fetch
container configs when a learner connects.
```

---

## 12. Cost Estimate

| Item | Where | Monthly Cost |
|------|-------|-------------|
| Azure Static Web Apps (existing) | Azure | $0 (free tier) |
| Azure Functions (existing) | Azure | $0 (consumption, free tier) |
| Cosmos DB / MongoDB Atlas (existing) | Azure | $0-25/mo (depending on tier) |
| Cloudflare Tunnel | Cloud bridge | $0 (free tier) |
| On-premise server (already owned) | On-premise | $0 (electricity only) |
| Docker Engine (open source) | On-premise | $0 |
| Domain / subdomain (terminal.nmmr.tech) | Cloudflare | $0 (CNAME on existing domain) |
| **Total new cost** | | **$0** (assuming server exists) |

If using Azure Web PubSub instead of Cloudflare Tunnel: add ~$1-5/mo.

---

## 13. Implementation Phases

```
Phase A: Foundation (Terminal Relay Service — On-Premise)
  - Set up nmmr-terminal repo
  - WebSocket server with JWT auth
  - Docker container lifecycle (create, attach, destroy)
  - Basic container image (python-lab)
  - Test with wscat/websocat CLI locally

Phase B: Tunnel Setup (Connect On-Premise to Cloud)
  - Install Cloudflare Tunnel on on-premise server
  - Configure DNS: terminal.nmmr.tech → Cloudflare Tunnel
  - Add Lab model to Azure MongoDB (via nmmr-api)
  - Relay service fetches lab configs from Azure API
  - End-to-end test: browser → Cloudflare → tunnel → relay → container

Phase C: Frontend Integration (nmmr-training on Azure)
  - Install xterm.js in nmmr-training
  - Build TerminalWidget component
  - Custom markdown renderer for :::terminal::: blocks
  - Connect to relay service via WebSocket
  - Deploy to Azure Static Web Apps

Phase D: Admin & Management
  - Lab CRUD endpoints in nmmr-api (Azure Functions)
  - Admin UI for managing lab definitions (nmmr-training)
  - Lab assignment to lessons (admin content editor)
  - "Insert Terminal" button in Markdown Editor toolbar

Phase E: Polish & Security
  - Resource monitoring dashboard (on-premise metrics)
  - Container cleanup cron job (on-premise)
  - Rate limiting and abuse protection
  - Multiple Docker images (node-lab, linux-lab)
  - File upload/download from container
```

---

## 14. Alternative: Lightweight Approach (No WebSocket)

If full terminal is overkill for your use case, consider a simpler
**"Run Code" button** approach:

```
┌─────────────────────────────────────────┐
│  Lesson Content                         │
│                                         │
│  Try this Python code:                  │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ x = 42                         │    │
│  │ print(f"The answer is {x}")    │    │
│  │                          [▶ Run]│    │
│  └─────────────────────────────────┘    │
│                                         │
│  Output:                                │
│  ┌─────────────────────────────────┐    │
│  │ The answer is 42               │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘

Flow:
  1. User clicks "Run"
  2. POST to Azure Function → relayed to on-premise
  3. On-premise does: docker run --rm -t 5s image python -c "code"
  4. Returns stdout/stderr via Azure
  5. Display output below code block

Pros: Much simpler, no WebSocket, works with REST API
Cons: No interactive terminal, no multi-step workflows
```

---

## 15. Recommendation

**Start with Phase A + B + C** (full interactive terminal). The hybrid
architecture keeps your apps and data secure on Azure while leveraging your
on-premise server's compute power for Docker containers. The Cloudflare
Tunnel approach keeps additional costs at $0 and requires no inbound ports
on your server.

If you want to **start simple**, begin with the "Run Code" button approach
(Section 14) as a stepping stone — it can be built in 1-2 days and doesn't
require WebSocket infrastructure.
