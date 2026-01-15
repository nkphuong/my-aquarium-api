  
🐠

# **AquaCompanion**

*Người Bạn Đồng Hành Thông Minh Cho Hồ Cá*

*Your Intelligent Aquarium Partner*

**Software Requirements Specification**

Version 2.0 | January 2026

| Team Size: | Solo Developer |
| :---- | :---- |
| Target Market: | Vietnamese aquarists (primary), International (secondary) |
| Architecture: | Modular Monolith (React Native ready) |
| Stack: | Next.js 15, NestJS 11, Supabase, pgvector, Cohere, Claude |

# **Table of Contents**

# **1\. Executive Summary**

## **1.1 Project Overview**

AquaCompanion is an AI-powered web application for aquarium hobbyists, with a focus on Vietnamese users. The platform helps beginners confidently set up and maintain aquariums through intelligent guidance, while providing experienced aquarists with powerful management tools.

**Core Value Proposition:**

* AI Tank Builder: Transform vague ideas into complete, actionable tank plans

* Multilingual Knowledge Base: Vietnamese questions retrieve English expertise

* Peaceful UX: Hobby-friendly design that reduces stress, not adds to it

* Mobile-Ready Architecture: Built to extend to React Native

## **1.2 Key Technical Decisions**

| Decision | Choice | Rationale |
| :---- | :---- | :---- |
| Embedding Service | Cohere embed-multilingual-v3.0 | Best Vietnamese support, cross-lingual retrieval |
| Fish Data Source | FishBase API | Comprehensive, free, scientific accuracy |
| Architecture Pattern | Modular Monolith | Solo-dev friendly, RN code sharing |
| Deployment | Docker on VPS | Cost control, full flexibility |
| Gallery Feature | Deferred to Phase 2 | Focus MVP on AI Tank Builder |

## **1.3 MVP Scope**

**Included in MVP:**

* User authentication (Supabase Auth)

* Tank CRUD with cover images

* Livestock management with FishBase integration

* Water parameter tracking with charts

* AI Tank Builder with RAG

* Knowledge base (vectorized books)

* Responsive web design (PWA ready)

**Deferred to Phase 2:**

* Inspiration gallery

* Fish disease diagnosis (photo upload)

* Social features

* React Native mobile app

* Vietnamese UI localization

# **2\. Technology Stack**

## **2.1 Complete Stack Overview**

| Layer | Technology | Version / Notes |
| :---- | :---- | :---- |
| Frontend Framework | Next.js | 15.x with App Router |
| UI Components | shadcn/ui \+ Tailwind | Customized with aqua theme |
| State Management | TanStack Query \+ Zustand | Server state \+ minimal client state |
| Charts | Recharts | For parameter visualization |
| Backend Framework | NestJS | 11.x with TypeScript |
| Database | PostgreSQL (Supabase) | 15.x with RLS enabled |
| Vector Store | pgvector | 1024 dimensions for Cohere |
| Authentication | Supabase Auth | JWT-based, email/password |
| File Storage | Supabase Storage | For images, PDFs |
| Embeddings | Cohere | embed-multilingual-v3.0 |
| LLM | Claude (Anthropic) | claude-sonnet-4-20250514 |
| Fish Data | FishBase API | REST API, cached locally |
| PDF Processing | pdf-parse | For document ingestion |
| Containerization | Docker \+ Compose | Multi-container setup |
| Reverse Proxy | Nginx | SSL termination, routing |

## **2.2 Cohere Embeddings Configuration**

Cohere's embed-multilingual-v3.0 is chosen for its excellent Vietnamese support and cross-lingual capabilities. This allows users to ask questions in Vietnamese while retrieving relevant content from English-language aquarium books.

**Technical Specifications:**

* Model: embed-multilingual-v3.0

* Dimensions: 1024

* Max tokens per input: 512

* Languages supported: 100+ including Vietnamese

* Cost: $0.10 per 1M tokens

**Usage Pattern:**

// Document indexing

const embedding \= await cohere.embed({

  texts: \[chunkContent\],

  model: 'embed-multilingual-v3.0',

  inputType: 'search\_document'

});

// Query time

const queryEmbedding \= await cohere.embed({

  texts: \[userQuestion\],

  model: 'embed-multilingual-v3.0',

  inputType: 'search\_query'

});

## **2.3 FishBase API Integration**

FishBase provides authoritative fish species data. We cache responses to reduce API calls and improve performance.

**Endpoints Used:**

* GET /species \- Search by name

* GET /species/{SpecCode} \- Species details

* GET /comnames \- Common names in multiple languages

* GET /ecology \- Habitat and water parameters

**Caching Strategy:**

* Cache species data in PostgreSQL (species\_cache table)

* TTL: 30 days (fish data rarely changes)

* Cache key: FishBase SpecCode

* Fallback: Return cached data if API unavailable

# **3\. System Architecture**

## **3.1 Modular Monolith Pattern**

The Modular Monolith pattern provides the simplicity of a monolith with the maintainability of modular design. This is ideal for solo development while keeping the codebase ready for future extraction to microservices or code sharing with React Native.

**Key Benefits:**

* Single deployable unit \- simple DevOps

* Clear module boundaries \- easy to understand

* Shared DTOs \- reusable in React Native

* No distributed system complexity

* Easy to refactor into microservices if needed

## **3.2 Module Structure**

backend/src/

├── modules/

│   ├── auth/           \# Authentication module

│   │   ├── auth.controller.ts

│   │   ├── auth.service.ts

│   │   ├── auth.module.ts

│   │   └── dto/

│   │

│   ├── tanks/          \# Tank management

│   │   ├── tanks.controller.ts

│   │   ├── tanks.service.ts

│   │   ├── tanks.repository.ts

│   │   ├── tanks.module.ts

│   │   └── dto/

│   │

│   ├── livestock/      \# Livestock \+ FishBase

│   │   ├── livestock.controller.ts

│   │   ├── livestock.service.ts

│   │   ├── fishbase.service.ts

│   │   └── dto/

│   │

│   ├── parameters/     \# Water parameters

│   │   ├── parameters.controller.ts

│   │   ├── parameters.service.ts

│   │   └── dto/

│   │

│   ├── ai/             \# AI features

│   │   ├── ai.controller.ts

│   │   ├── tank-builder.service.ts

│   │   ├── rag.service.ts

│   │   ├── embedding.service.ts

│   │   └── dto/

│   │

│   └── knowledge/      \# Knowledge base admin

│       ├── knowledge.controller.ts

│       ├── ingestion.service.ts

│       └── dto/

│

├── shared/             \# Shared utilities

│   ├── database/

│   ├── guards/

│   └── utils/

│

└── config/             \# Configuration

## **3.3 Frontend Structure**

frontend/

├── app/                    \# Next.js App Router

│   ├── (auth)/             \# Auth pages

│   │   ├── login/page.tsx

│   │   └── register/page.tsx

│   ├── (dashboard)/        \# Protected pages

│   │   ├── page.tsx        \# Dashboard home

│   │   ├── tanks/

│   │   │   ├── page.tsx

│   │   │   ├── new/page.tsx

│   │   │   └── \[id\]/page.tsx

│   │   └── builder/page.tsx  \# AI Tank Builder

│   └── layout.tsx

│

├── components/

│   ├── ui/                 \# shadcn components

│   ├── tanks/              \# Tank components

│   ├── ai/                 \# Chat components

│   └── shared/             \# Common components

│

├── lib/

│   ├── api.ts              \# API client

│   ├── supabase.ts         \# Supabase client

│   └── utils.ts

│

└── stores/                 \# Zustand stores

    └── ui-store.ts

# **4\. Database Schema**

## **4.1 Core Tables**

**users**

Extends Supabase auth.users with profile data.

| Column | Type | Description |
| :---- | :---- | :---- |
| id | UUID PK | References auth.users.id |
| display\_name | VARCHAR(100) | User's display name |
| avatar\_url | TEXT | Profile picture URL |
| experience\_level | VARCHAR(20) | beginner | intermediate | advanced |
| preferred\_language | VARCHAR(5) | vi | en |
| preferences | JSONB | {units, notifications} |
| created\_at | TIMESTAMPTZ | Creation timestamp |

**tanks**

| Column | Type | Description |
| :---- | :---- | :---- |
| id | UUID PK | Primary key |
| user\_id | UUID FK | Owner reference |
| name | VARCHAR(100) | Tank name |
| volume\_liters | DECIMAL(10,2) | Volume in liters |
| dimensions | JSONB | {length, width, height} cm |
| tank\_type | VARCHAR(20) | freshwater | saltwater | planted | reef |
| style | VARCHAR(50) | Aquascape style |
| substrate | VARCHAR(100) | Substrate type |
| filter\_type | VARCHAR(100) | Filter description |
| cover\_image\_url | TEXT | Main tank photo |
| setup\_date | DATE | Tank setup date |
| is\_archived | BOOLEAN | Soft delete flag |

**livestock**

| Column | Type | Description |
| :---- | :---- | :---- |
| id | UUID PK | Primary key |
| tank\_id | UUID FK | Tank reference |
| fishbase\_id | INTEGER | FishBase SpecCode |
| common\_name | VARCHAR(100) | Common name |
| scientific\_name | VARCHAR(150) | Scientific name |
| livestock\_type | VARCHAR(20) | fish | plant | invertebrate |
| quantity | INTEGER | Count |
| status | VARCHAR(20) | healthy | sick | deceased | removed |
| added\_date | DATE | Date added to tank |

**water\_parameters**

| Column | Type | Description |
| :---- | :---- | :---- |
| id | UUID PK | Primary key |
| tank\_id | UUID FK | Tank reference |
| tested\_at | TIMESTAMPTZ | Test timestamp |
| temperature | DECIMAL(4,1) | Celsius |
| ph | DECIMAL(3,1) | pH level |
| ammonia | DECIMAL(5,3) | ppm |
| nitrite | DECIMAL(5,3) | ppm |
| nitrate | DECIMAL(6,2) | ppm |
| gh | DECIMAL(5,1) | dGH |
| kh | DECIMAL(5,1) | dKH |

## **4.2 Knowledge Base Tables**

**knowledge\_documents**

| Column | Type | Description |
| :---- | :---- | :---- |
| id | UUID PK | Primary key |
| title | VARCHAR(255) | Document title |
| source\_type | VARCHAR(20) | book | article | fishbase |
| language | VARCHAR(5) | en | vi |
| metadata | JSONB | {author, year, topics} |
| status | VARCHAR(20) | pending | completed | failed |

**knowledge\_chunks**

| Column | Type | Description |
| :---- | :---- | :---- |
| id | UUID PK | Primary key |
| document\_id | UUID FK | Document reference |
| content | TEXT | Chunk text (500-800 tokens) |
| embedding | vector(1024) | Cohere embedding |
| chunk\_index | INTEGER | Order in document |
| metadata | JSONB | {chapter, page} |

# **5\. UI/UX Design**

## **5.1 Design Philosophy**

The design evokes the peaceful feeling of looking into a well-maintained aquarium — calm, natural, and meditative. Every element should reduce stress and bring joy to the hobby.

**Core Principles:**

1. Peaceful over complex: Generous whitespace, minimal visual noise

2. Nature-inspired: Organic shapes, water and plant colors

3. Hobby-friendly: Speak aquarist language, celebrate passion

4. Mobile-first: Many users work on tanks with phone in hand

5. Encouraging: Celebrate progress, guide gently, never judge

## **5.2 Color System**

| Name | Hex | Usage |
| :---- | :---- | :---- |
| Deep Teal (Primary) | \#2D7D9A | Primary buttons, links, active states |
| Natural Green (Secondary) | \#7CB342 | Success, healthy indicators, plants |
| Warm Amber (Accent) | \#FFB74D | Warnings, highlights, CTAs |
| Mist (Background) | \#F5F9FC | Page backgrounds |
| White (Surface) | \#FFFFFF | Cards, modals, inputs |
| Deep Ocean (Text) | \#1A3A4A | Primary text, headings |
| Stone (Muted) | \#6B8E9B | Secondary text, placeholders |
| Coral (Error) | \#EF5350 | Error states, danger alerts |

## **5.3 Typography**

* Headings: Plus Jakarta Sans (friendly, modern)

* Body: Inter (highly readable, Vietnamese support)

* Base size: 16px (1rem)

* Line height: 1.6

* Scale: H1=32px, H2=24px, H3=20px, Body=16px, Small=14px

## **5.4 Component Styling**

**Cards:**

* Border radius: 16px

* Shadow: soft, subtle (0 4px 6px rgba(0,0,0,0.05))

* Padding: 24px

* Hover: slight scale (1.02) \+ shadow increase

**Buttons:**

* Primary: bg-teal-600, text-white

* Secondary: border-teal-600, text-teal-600

* Border radius: 12px

* Min height: 44px (touch friendly)

**Inputs:**

* Border radius: 12px

* Border: 1px solid \#E2E8F0

* Focus: ring-2 ring-teal-500/20

* Padding: 12px 16px

## **5.5 Animation Guidelines**

* Page transitions: Fade \+ slide, 200ms

* Card hover: Scale 1.02, 150ms

* Button press: Scale 0.98, 100ms

* Loading: Gentle pulse, never spinning

* Charts: Draw progressively, 500ms

* Respect prefers-reduced-motion

# **6\. Development Phases**

## **6.1 Phase 1: Foundation (Weeks 1-3)**

1. Project setup: Next.js 15 \+ NestJS 11 \+ Supabase

2. Docker configuration (docker-compose.yml)

3. Supabase Auth integration

4. Database schema \+ migrations

5. Basic UI components \+ theme setup

6. Tank CRUD operations

Deliverable: Users can register, login, create and manage tanks.

## **6.2 Phase 2: Core Features (Weeks 4-6)**

1. FishBase API integration \+ caching

2. Livestock management with species search

3. Water parameter logging

4. Parameter history charts (Recharts)

5. Tank dashboard with health indicators

6. Responsive design polish

Deliverable: Complete tank management without AI features.

## **6.3 Phase 3: Knowledge Base (Weeks 7-8)**

1. pgvector setup in Supabase

2. PDF text extraction pipeline

3. Chunking strategy implementation

4. Cohere embedding integration

5. Admin interface for document upload

6. Vector similarity search

Deliverable: Searchable knowledge base ready for RAG.

## **6.4 Phase 4: AI Tank Builder (Weeks 9-11)**

1. Claude API integration

2. RAG retrieval service

3. Conversation management

4. Chat UI with streaming responses

5. Tank plan generation

6. Plan-to-tank creation flow

7. Rate limiting \+ error handling

Deliverable: AI Tank Builder feature complete.

## **6.5 Phase 5: Polish & Launch (Weeks 12-14)**

1. Onboarding flow for new users

2. Performance optimization

3. Accessibility audit (WCAG 2.1 AA)

4. Security review

5. Beta testing with real users

6. Documentation

7. Production deployment

Deliverable: Production-ready MVP.

# **7\. Risks and Concerns**

## **7.1 Identified Risks**

| Risk | Likelihood | Impact | Mitigation |
| :---- | :---- | :---- | :---- |
| Poor RAG quality | Medium | High | Test chunking strategies, monitor retrieval quality |
| AI cost overrun | Medium | Medium | Rate limiting, caching common queries |
| FishBase API reliability | Low | Medium | Aggressive caching, graceful fallback |
| Cross-lingual retrieval | Medium | Medium | Test Cohere thoroughly, consider translation |
| Solo dev burnout | Medium | High | Realistic timelines, MVP focus, automation |
| VPS security | Low | High | Firewall, SSL, regular updates, backups |

## **7.2 Open Questions**

1. What old aquarium books are available in PDF format?

2. Should we pre-index FishBase data or query on-demand?

3. What's the acceptable AI response latency for Vietnamese users?

4. Do we need Vietnamese content in knowledge base, or just Vietnamese queries?

5. Should we implement user feedback on AI responses?

6. What VPS provider offers best Vietnam latency? (Vultr SGP? DigitalOcean SGP?)

# **8\. Success Metrics**

## **8.1 MVP Success Criteria (3 months post-launch)**

| Metric | Target | Measurement |
| :---- | :---- | :---- |
| Registered users | 500+ | Supabase Auth |
| Weekly active users | 30% of registered | Login analytics |
| Tanks created | 1,000+ | Database count |
| AI conversations started | 2,000+ | Conversation records |
| Plans generated from AI | 500+ | Plan completion |
| User satisfaction | 4.0+ / 5.0 | In-app feedback |

## **8.2 Technical Quality Metrics**

* Page load (First Contentful Paint): \< 1.5s

* Time to Interactive: \< 3s

* API response time (p95): \< 200ms

* AI response start (first token): \< 1s

* Error rate: \< 0.1%

* Uptime: \> 99.5%

# **9\. Appendix**

## **9.1 Glossary**

| Term | Definition |
| :---- | :---- |
| RAG | Retrieval-Augmented Generation \- AI retrieves relevant documents to improve responses |
| pgvector | PostgreSQL extension for vector similarity search |
| Embedding | Numerical vector representation of text for semantic search |
| FishBase | Global database of fish species (fishbase.org) |
| Cycling | Process of establishing beneficial bacteria in new aquarium |
| Iwagumi | Japanese aquascaping style with stone focus |
| GH/KH | General Hardness / Carbonate Hardness \- water chemistry |

## **9.2 References**

* Next.js 15: https://nextjs.org/docs

* NestJS 11: https://docs.nestjs.com

* Supabase: https://supabase.com/docs

* pgvector: https://github.com/pgvector/pgvector

* Cohere Embed: https://docs.cohere.com/docs/embeddings

* Claude API: https://docs.anthropic.com

* FishBase API: https://fishbase.org/api

* shadcn/ui: https://ui.shadcn.com

* Tailwind CSS: https://tailwindcss.com

## **9.3 Document History**

| Version | Date | Author | Changes |
| :---- | :---- | :---- | :---- |
| 1.0 | Jan 2026 | Dev Team | Initial SRS document |
| 2.0 | Jan 2026 | Dev Team | Added: Cohere embeddings, FishBase API, modular architecture, deferred gallery to Phase 2, UI/UX spec |

*End of Document*

🐠

AquaCompanion \- Your Intelligent Aquarium Partner