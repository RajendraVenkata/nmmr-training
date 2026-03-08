# NMMR Training Platform

An interactive online learning platform built with **Next.js 14**, featuring course management, a learner dashboard, and **live Docker-based terminal environments** embedded directly in lessons.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router), TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Auth** | NextAuth v5 (JWT sessions, Credentials + Google) |
| **Database** | Azure Cosmos DB (MongoDB API) |
| **Hosting** | Azure Static Web Apps |
| **Terminal** | xterm.js + WebSocket relay + Docker |
| **CI/CD** | GitHub Actions |

## Features

- **Course Management** -- Admin CRUD for courses, modules, lessons (markdown, quiz, image types)
- **Learner Dashboard** -- Enrollment, progress tracking, course player
- **Markdown Editor** -- Rich editor with image upload, code blocks, and terminal insertion
- **Interactive Terminals** -- Live Docker containers embedded in lessons via `:::terminal labId:::`
- **Lab Management** -- Admin UI to configure Docker lab environments
- **Dark Mode** -- Full light/dark theme support
- **Auth** -- Google OAuth + credentials login with role-based access (admin/learner)

---

## Interactive Terminal Architecture

The platform's standout feature is **live terminal environments** embedded directly within lesson content. Learners can execute real commands in isolated Docker containers without leaving the lesson page.

### System Overview

```
                        NMMR Training Platform -- Terminal Architecture

 +-------------------------------------------------------------------------+
 |                          LEARNER'S BROWSER                               |
 |                                                                          |
 |  +-------------------------------------------------------------------+  |
 |  |  Course Player -- Lesson Page                                      |  |
 |  |                                                                    |  |
 |  |  +-----------------------------+  +----------------------------+   |  |
 |  |  |                             |  |  Terminal Widget (xterm.js)|   |  |
 |  |  |   Markdown Lesson Content   |  |                            |   |  |
 |  |  |   (ReactMarkdown)           |  |  $ python3 hello.py        |   |  |
 |  |  |                             |  |  Hello from NMMR Training! |   |  |
 |  |  |   Text, images, code...     |  |  $                         |   |  |
 |  |  |                             |  |                            |   |  |
 |  |  +-----------------------------+  +-------------+--------------+   |  |
 |  +----------------------------------------------+--+-----------------+  |
 |                                                 |                       |
 +-------------------------------------------------+---+-------------------+
                                                   |
                                      WebSocket (ws:// or wss://)
                                                   |
 +-------------------------------------------------+---+-------------------+
 |                      AZURE CLOUD                 |                       |
 |                                                  |                       |
 |  +----------------------+                        |                       |
 |  |  Azure Static Web    |   +------------------+ |                       |
 |  |  Apps (Frontend)     |   |  Cosmos DB        | |                       |
 |  |  - Next.js pages     |   |  (MongoDB API)    | |                       |
 |  |  - API routes        |   |  - Courses, Users | |                       |
 |  |  - Auth (NextAuth)   |   |  - Labs, Enroll.  | |                       |
 |  +----------------------+   +------------------+ |                       |
 |                                                  |                       |
 +-------------------------------------------------+---+-------------------+
                                                   |
                                      Nginx reverse proxy (port 80)
                                                   |
 +-------------------------------------------------+---+-------------------+
 |                   DOCKER HOST (Azure VM)         |                       |
 |                                                  |                       |
 |  +-----------------------------------------------+--+---------------+   |
 |  |  Terminal Relay Service (Node.js)              |                  |   |
 |  |  nmmr-terminal                                 |                  |   |
 |  |                                                |                  |   |
 |  |  +-----------+  +----------+  +-----------+    |                  |   |
 |  |  | WebSocket |  | JWT Auth |  | Session   |    |                  |   |
 |  |  | Server    +--+ Validate +--+ Store     |    |                  |   |
 |  |  +-----+-----+  +----------+  +-----------+    |                  |   |
 |  |        |                                        |                  |   |
 |  |  +-----v-----+  +-----------+  +-----------+   |                  |   |
 |  |  | Container  |  | Lab Cache |  | Cleanup   |   |                  |   |
 |  |  | Manager    +--+ (API +    |  | Service   |   |                  |   |
 |  |  | (dockerode)|  |  fallback)|  | (idle GC) |   |                  |   |
 |  |  +-----+------+  +-----------+  +-----------+   |                  |   |
 |  +--------+---------------------------------------------+-----------+   |
 |           |                                                              |
 |  +--------v----------------------------------------------------------+  |
 |  |  Docker Engine                                                     |  |
 |  |                                                                    |  |
 |  |  +--------------+  +--------------+  +--------------+              |  |
 |  |  |  Container   |  |  Container   |  |  Container   |              |  |
 |  |  |  (User A)    |  |  (User B)    |  |  (User C)    |   ...       |  |
 |  |  |              |  |              |  |              |              |  |
 |  |  | python 3.12  |  | node.js 20   |  | ubuntu CLI   |              |  |
 |  |  | numpy,pandas |  | typescript   |  | gcc,vim,git  |              |  |
 |  |  |              |  |              |  |              |              |  |
 |  |  | CPU: 0.5     |  | CPU: 0.5     |  | CPU: 0.5     |              |  |
 |  |  | MEM: 256MB   |  | MEM: 256MB   |  | MEM: 256MB   |              |  |
 |  |  +--------------+  +--------------+  +--------------+              |  |
 |  |                                                                    |  |
 |  +--------------------------------------------------------------------+  |
 |                                                                          |
 +--------------------------------------------------------------------------+
```

### Data Flow

```
 BROWSER                    AZURE                     DOCKER HOST (VM)
    |                          |                            |
    |  1. Load lesson page     |                            |
    |     (Next.js SSR/SSG) <->|                            |
    |                          |                            |
    |  2. Fetch lesson content |                            |
    |     (has :::terminal     |                            |
    |      python-basics:::)   |                            |
    |                          |                            |
    |  3. Fetch terminal token |                            |
    |     POST /api/terminal/  |                            |
    |     token -------------->|                            |
    |     <-- { token: JWT }   |                            |
    |                          |                            |
    |  4. Click "Launch        |                            |
    |     Terminal"            |                            |
    |                          |                            |
    |  5. Open WebSocket ------------------------------------->
    |     ws://VM_IP?token=    |                            |
    |     JWT&labId=python-    |                            |
    |     basics               |                            |
    |                          |           6. Validate JWT  |
    |                          |           7. Fetch lab cfg |
    |                          |           8. Create/reuse  |
    |                          |              Docker        |
    |                          |              container     |
    |                          |           9. docker exec   |
    |                          |              -it /bin/bash |
    |                          |                            |
    | 10. { type: "ready" } <-------------------------------------
    |     Terminal active!     |                            |
    |                          |                            |
    | 11. User types --------------------------------------------->
    |     "python3 hello.py"   |          12. Pipe to       |
    |                          |              container     |
    |                          |              stdin         |
    |                          |                            |
    | 13. Output streams <-----------------------------------------
    |     "Hello from NMMR!"   |          14. Read from     |
    |                          |              stdout        |
    |                          |                            |
    | 15. Disconnect ------------------------------------------->
    |                          |          16. Start idle    |
    |                          |              timer (30min) |
    |                          |          17. Timeout ->    |
    |                          |              destroy       |
    |                          |              container     |
```

### How Terminals Are Embedded in Lessons

Admins use the **Markdown Editor** toolbar button "Insert Terminal" to add a terminal block:

```markdown
## Variables in Python

Variables store data. Try it yourself:

:::terminal python-basics:::

As you can see, Python variables are dynamically typed...
```

The `:::terminal python-basics:::` syntax is parsed by `LessonContent.tsx`, which splits the markdown and renders a `TerminalBlock` component inline. When a learner clicks **"Launch Terminal"**, it connects via WebSocket to the relay service, which provisions a Docker container.

### Lab Environments

Pre-built Docker images are available:

| Image | Contents | Use Case |
|-------|----------|----------|
| `nmmr-python-lab` | Python 3.12, numpy, pandas, flask, matplotlib | Python courses |
| `nmmr-node-lab` | Node.js 20, TypeScript, ts-node, nodemon | JavaScript/Node courses |
| `nmmr-linux-lab` | Ubuntu 22.04, gcc, make, vim, git, curl | Linux/CLI courses |

Labs are configured in **Admin > Labs** with resource limits (CPU, memory, disk, timeout) and optional preloaded files.

### Security

| Layer | Protection |
|-------|-----------|
| **Authentication** | Short-lived JWT (15 min) for WebSocket auth |
| **Container Isolation** | Each user gets their own container, non-root user |
| **Resource Limits** | CPU (0.5 cores), Memory (256MB), auto-kill on idle |
| **No Privilege Escalation** | `--security-opt no-new-privileges` |
| **Network** | Disabled by default per container |
| **Cleanup** | Idle containers destroyed after 30 min, periodic orphan cleanup |

---

## Project Structure

```
nmmr-training/                    # Next.js frontend (Azure Static Web Apps)
|-- src/
|   |-- app/
|   |   |-- layout.tsx            # Root layout
|   |   |-- page.tsx              # Homepage
|   |   |-- admin/
|   |   |   |-- courses/          # Course CRUD
|   |   |   |-- labs/             # Lab management (Docker environments)
|   |   |   +-- users/            # User management
|   |   |-- dashboard/
|   |   |   |-- courses/[slug]/   # Course player with terminal support
|   |   |   +-- profile/
|   |   |-- api/
|   |   |   |-- admin/labs/       # Lab CRUD API
|   |   |   +-- terminal/token/   # JWT token for WebSocket auth
|   |   +-- ...
|   |-- components/
|   |   |-- terminal/
|   |   |   |-- TerminalWidget.tsx          # xterm.js + WebSocket
|   |   |   |-- TerminalBlock.tsx           # Lazy-launch wrapper
|   |   |   +-- TerminalConnectionStatus.tsx
|   |   |-- admin/
|   |   |   +-- MarkdownEditor.tsx          # "Insert Terminal" button
|   |   |-- dashboard/
|   |   |   +-- LessonContent.tsx           # :::terminal::: parser
|   |   +-- layout/
|   |-- lib/
|   |   |-- models/Lab.ts                   # Mongoose Lab model
|   |   +-- auth.ts
|   +-- types/
|-- .github/workflows/
|   +-- azure-static-web-apps.yml
+-- package.json

nmmr-terminal/                    # WebSocket relay service (Azure VM)
|-- src/
|   |-- server.ts                 # WebSocket server entry point
|   |-- auth.ts                   # JWT validation
|   |-- container-manager.ts      # Docker lifecycle (dockerode)
|   |-- session-store.ts          # Active session tracking
|   |-- lab-cache.ts              # Lab config cache + API fallback
|   |-- cleanup.ts                # Idle container garbage collection
|   +-- config.ts                 # Environment configuration
|-- docker/
|   |-- python-lab/Dockerfile
|   |-- node-lab/Dockerfile
|   +-- linux-lab/Dockerfile
|-- nginx/terminal.conf
+-- docker-compose.yml
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (or Azure Cosmos DB connection string)
- Docker (for terminal feature)

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Description |
|----------|-----------|
| `DATABASE_URL` | MongoDB/Cosmos DB connection string |
| `AUTH_SECRET` | NextAuth JWT secret |
| `NEXTAUTH_URL` | App URL (e.g., `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_TERMINAL_ENABLED` | `true` to enable terminal feature |
| `NEXT_PUBLIC_TERMINAL_WS_URL` | WebSocket URL (e.g., `ws://VM_IP`) |

### Commands

```bash
npm run dev          # Development server (port 3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
```

---

## Deployment

### Azure Static Web Apps

The frontend deploys automatically via GitHub Actions on push to `main` or `remote-cmd`.

### Terminal Relay (Azure VM)

```bash
# On the VM
git clone https://github.com/RajendraVenkata/nmmr-terminal.git
cd nmmr-terminal
npm install && npm run build

# Create .env with JWT_SECRET matching AUTH_SECRET
# Build Docker lab images
docker build -t nmmr-python-lab:latest -f docker/python-lab/Dockerfile docker/python-lab/
docker build -t nmmr-node-lab:latest -f docker/node-lab/Dockerfile docker/node-lab/
docker build -t nmmr-linux-lab:latest -f docker/linux-lab/Dockerfile docker/linux-lab/

# Start with PM2
pm2 start dist/server.js --name nmmr-terminal
pm2 save
```
