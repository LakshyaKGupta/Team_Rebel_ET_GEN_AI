# Detailed Repository Comparison: Frontend vs Backend

**Generated:** March 28, 2026

---

## OVERVIEW

| Aspect | Frontend (Your Project) | Backend (Friend's Project) |
|--------|------------------------|---------------------------|
| **Repository** | Team_Rebel_ET_GEN_AI | ET_genAI |
| **Architecture** | Single Next.js app (all-in-one) | Separated: Python FastAPI backend + Next.js frontend |
| **Database** | Prisma ORM + SQLite (file-based) | Raw SQLite + manual SQL |
| **AI Provider** | Groq (mixtral-8x7b-32768) | Google Generative AI (genai) |
| **Auth System** | JWT + HTTP-only cookies | Not clearly implemented in onboarding |
| **Package Versions** | Next.js 14.2.0, TypeScript 5.3.0, Prisma 7.6.0 | Next.js 14.2.15, TypeScript 5.9.2, minimal dependencies |

---

## 1. API ROUTES DIFFERENCES

### Frontend API Routes (Next.js Route Handlers)

#### **Authentication Routes** (`/src/app/api/auth/`)
- `POST /api/auth/signup` ✅ SAME - Creates user + default preferences
- `POST /api/auth/login` ✅ SAME - JWT auth with cookie
- `POST /api/auth/logout` ✅ SAME - Clears cookie
- `GET /api/auth/me` ✅ SAME - Returns current user + preferences
- `GET/PUT /api/auth/preferences` ✅ SAME - Read/update preferences
- `POST /api/auth/change-password` ✅ SAME - Password management
- `POST /api/auth/upload-avatar` ✅ SAME - Avatar upload
- `GET/PATCH /api/profile` ✅ SAME - User profile management

#### **AI Routes** (`/src/app/api/ai/`)
- `POST /api/ai/briefing` ⚠️ DIFFERENT - Frontend returns mock prompt structures; Backend has full LLM integration
  - Frontend: Returns `instructions`, `personalizedPrompt`, `structuredPrompt` (no actual AI response)
  - Backend: Calls Google Generative AI for actual content generation
- `POST /api/ai/chat` ✨ IMPROVED - Frontend uses Groq API with system prompt building
  - Location: [src/app/api/ai/chat/route.ts](src/app/api/ai/chat/route.ts)
  - Features: Dynamic system prompt based on user profile, temperature control (0.7), max_tokens: 1024

#### **Other API Routes**
- `GET/POST /api/interests/*` - Listed but not detailed in specs
- `GET /api/market/search` - Listed but not detailed in specs
- `GET/PUT /api/preferences` - Alias for preferences endpoint
- **MISSING in Frontend**: No ingestion, story clustering, or news aggregation APIs

### Backend API Routes (FastAPI)

#### **Core Routes** - All built with FastAPI router pattern
- `POST /onboard` - User onboarding with role, interests, goals
  - Location: `backend/app/routes/onboard.py`
  - Takes: `OnboardRequest` with name, role, style, interests, goals
  - Returns: user_id and onboarding completion message
- `GET /news` - Personalized news feed with ranking
  - Parameters: `user_id`, `limit` (1-20, default 10)
  - Returns: scored articles with reasons why they're personalized for user
  - Cache: TTL configurable (default 60s)
  - 🆕 NEW - Frontend has no equivalent
- `GET /stories` - Story clustering index
  - Returns: clustered stories with metadata
  - 🆕 NEW - Frontend has no story clustering
- `GET /stories/{story_id}` - Full story with articles
  - Parameters: `style` (Simple/Detailed/Beginner-friendly)
  - 🆕 NEW
- `POST /story/{story_id}/regenerate` - Regenerate briefing for different style
  - 🆕 NEW
- `GET /story/{story_id}/contrarian` - Contrarian perspectives on story
  - Features: Sentiment analysis, alternative viewpoints
  - 🆕 NEW
- `POST /ask` - Interactive Q&A on story articles
  - Features: RAG (Retrieval-Augmented Generation), TF-IDF retrieval
  - History tracking: Last 3 hours of related questions
  - Citation mapping from articles
  - Confidence scoring with weakness detection
  - Location: `backend/app/routes/ask.py`
  - 🆕 NEW - Frontend chat is different (doesn't do RAG retrieval)
- `POST /summarize` - Story summarization with caching
  - Features: Briefing cache with fingerprinting, stale-while-revalidate pattern
  - Location: `backend/app/routes/summarize.py`
  - 🆕 NEW
- `POST /saved-items` - Save story for user
  - `DELETE /saved-items` - Unsave story
  - `GET /saved-items` - List saved stories
  - Location: `backend/app/routes/saved_items.py`
  - 🆕 NEW
- `POST /ingestion/refresh` - Trigger news ingestion
  - Supports: NewsAPI + RSS feeds
  - Features: Deduplication, NER for entities
  - 🆕 NEW
- `GET /health` - API health check + AI runtime status
  - 🆕 NEW

#### **Ingestion Routes** - News aggregation pipeline
- `POST /ingestion/refresh` - Manually trigger ingestion from NewsAPI/RSS
  - Location: `backend/app/routes/ingestion.py`
- `GET /ingestion/status` - Check ingestion job status
- Auto-ingestion scheduler runs on startup (configurable interval)
  - 🆕 NEW - Frontend has no live news ingestion

---

## 2. DATABASE SCHEMA DIFFERENCES

### Frontend Schema (Prisma SQLite)

**Located:** `prisma/schema.prisma`

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String
  name          String?
  avatarUrl     String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  preferences   UserPreference?
}

model UserPreference {
  id                    String   @id @default(uuid())
  userId               String   @unique
  theme                String   @default("light")
  notificationsEnabled Boolean  @default(true)
  emailUpdates         Boolean  @default(false)
  userType             String?
  selectedInterests    String?  # JSON stringified
  goal                 String?
  notificationPref     String?
  hasCompletedOnboarding Boolean @default(false)
  experienceLevel      String?
  riskAppetite         String?
  timeHorizon         String?
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  user                 User     @relation(fields: [userId])
}
```

**Key characteristics:**
- Uses UUID for user IDs
- Single `UserPreference` relation per user
- JSON strings for arrays (`selectedInterests`)
- Simple 2-table schema

### Backend Schema (Raw SQLite)

**Not found in repo** - Inferred from code analysis of `onboard.py` and `ask.py`:

```sql
-- Inferred from onboard.py and ask.py
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT,
  role TEXT,        -- "Student", "Investor", "Founder", "Professional"
  style TEXT,       -- "Simple", "Detailed", "Beginner-friendly"
  interests TEXT,   -- JSON array
  goals TEXT,       -- JSON array
  created_at TIMESTAMP
);

CREATE TABLE user_preferences (
  user_id INTEGER PRIMARY KEY,
  role TEXT,
  style TEXT,
  interests TEXT,   -- JSON array
  goals TEXT,       -- JSON array
  updated_at TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE stories (
  id INTEGER PRIMARY KEY,
  title TEXT,
  summary TEXT,
  tag TEXT,
  created_at TIMESTAMP
);

CREATE TABLE story_articles (
  article_id TEXT,
  story_id INTEGER,
  FOREIGN KEY(story_id) REFERENCES stories(id)
);

CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT,
  content TEXT,
  source TEXT,
  url TEXT,
  published_at TIMESTAMP,
  tags TEXT,        -- JSON array
  reasons TEXT      -- JSON array (why it's recommended)
);

CREATE TABLE qa_logs (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  story_id INTEGER,
  question TEXT,
  answer TEXT,
  confidence FLOAT,
  citations TEXT,   -- JSON array
  created_at TIMESTAMP
);

CREATE TABLE saved_stories (
  user_id INTEGER,
  story_id INTEGER,
  created_at TIMESTAMP,
  PRIMARY KEY(user_id, story_id)
);

CREATE TABLE briefing_cache (
  id INTEGER PRIMARY KEY,
  story_id INTEGER,
  style TEXT,
  fingerprint TEXT,
  payload TEXT,     -- JSON
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Key Differences:

| Feature | Frontend | Backend |
|---------|----------|---------|
| **User ID Type** | UUID (string) | Integer (auto-increment) |
| **User Profile Fields** | userType (investor/student/founder/exploring) | role (Student/Investor/Founder/Professional) |
| **User Experience Levels** | experienceLevel (beginner/intermediate/advanced) | Not stored per user in visible schema |
| **Indexing/Clustering** | No story clustering | Stories table with clustering logic |
| **Q&A Logging** | Not present | `qa_logs` table for history |
| **Interaction Tracking** | Not present | Implicit in qa_logs |
| **Cache Strategy** | In-memory Map | SQLite-backed `briefing_cache` table |
| **Saved Stories** | Not present | `saved_stories` table with timestamps |

**⚠️ SCHEMA BREAKING DIFFERENCES:**
- Different user ID strategy (UUID vs integer)
- Different profile field naming (userType vs role, experienceLevel missing in backend schema)
- Backend requires migration for new tables (qa_logs, saved_stories, briefing_cache, articles, stories)

---

## 3. AUTHENTICATION LOGIC

### Frontend Authentication (`src/lib/auth.ts`)

**Login Flow:**
1. Email validation + password strength check (6+ chars)
2. `bcryptjs.compare()` password against stored hash
3. JWT generation with `jsonwebtoken` (expires: 7d)
4. HTTP-only cookie set with:
   - `maxAge: 7 * 24 * 60 * 60` (604800 seconds)
   - `secure: production-only`
   - `sameSite: lax`
   - `httpOnly: true`

**Key Functions:**
- `hashPassword(password)` - bcrypt hash
- `verifyPassword(password, hash)` - bcrypt compare
- `generateToken(userId)` - JWT creation
- `verifyToken(token)` - JWT verification with error handling
- `createUser()` - Prisma user creation with default preferences
- `authenticateUser()` - Find user + verify password
- `updateUserPreferences()` - Prisma update with partial fields

**Security Issues Found:**
- JWT_SECRET has fallback to "fallback-secret-change-me" (⚠️ INSECURE)
- No rate limiting on auth endpoints
- No check for account lockout after failed attempts

### Backend Authentication (`backend/app/routes/onboard.py`)

**Onboarding Flow:**
1. Takes `OnboardRequest` with: name, role, style, interests, goals
2. Direct SQL INSERT into users table
3. Separate INSERT/UPSERT into user_preferences
4. Returns user_id (no token generation visible)

**Key Observation:**
- ⚠️ **NO JWT AUTH VISIBLE** - Onboarding doesn't return token
- Uses integer user_id directly from last_insert_rowid
- No password hashing observed in onboarding route
- Appears to be demo/prototype auth only

**🐛 SECURITY CONCERN:** Backend has no visible JWT token generation, relies on user_id in query params

**Differences:**
| Aspect | Frontend | Backend |
|--------|----------|---------|
| Password Handling | bcrypt + hash storage | Not visible in code |
| Token Type | JWT with signingSecret | None observed |
| Cookie | HTTP-only, Secure, SameSite | Not applicable |
| Session Management | Per-user JWT | Query parameter based |
| Rate Limiting | Not implemented | Not visible |
| CSRF Protection | SameSite cookie | Not visible |

---

## 4. AI INTEGRATION

### Frontend AI (`src/app/api/ai/`)

#### Chat Route (`POST /api/ai/chat`)
**Location:** `src/app/api/ai/chat/route.ts`

```typescript
// Provider & Configuration
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
Model: 'mixtral-8x7b-32768' (free tier)
Temperature: 0.7
Max Tokens: 1024

// System Prompt Building
Function: buildSystemPrompt(userProfile)
- Includes: userType, experienceLevel, riskAppetite, timeHorizon, goal
- Tailored instructions for beginner/advanced
- Domain-specific guidelines for finance/economics
- Redirect logic for off-topic questions
```

**Features:**
- ✅ Groq SDK integration
- ✅ Dynamic system prompt based on profile
- ✅ Token usage tracking (prompt_tokens, completion_tokens)
- ⚠️ DEMO MODE: `/api/ai/briefing` returns mock structures, not real LLM responses

#### Briefing Route (Demo)
**Location:** `src/app/api/ai/briefing/route.ts`

```typescript
// Not calling Groq/LLM
Response contains:
- instructions (AIInstruction object)
- personalizedPrompt (structured string)
- structuredPrompt (formatted prompt for LLM)
- userProfile (for reference)
// No actual AI generation - prompt structure only
```

**🆕 NEW vs Backend:**
- Frontend: Only demonstrates how prompts SHOULD be structured
- Backend: Actually calls Google Generative AI for content

### Backend AI (`backend/app/services/ai.py`)

**Location:** `backend/app/services/ai.py`

```python
# Provider & Configuration
import google.generativeai as genai
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Functions observed:
- generate_briefing(story_title, context, style)
- answer_question(question, context_chunks, history, user_profile)
- get_ai_runtime_status()
```

**Features:**
- ✨ IMPROVED: Actual LLM integration (not demo mode)
- ✨ IMPROVED: Question answering with context retrieval
- ✨ IMPROVED: History-aware conversations
- ✨ IMPROVED: AI runtime status checking
- ✅ Google Generative AI (Gemini likely)

**Difference Table:**

| Aspect | Frontend | Backend |
|--------|----------|---------|
| **Provider** | Groq (Open-source models) | Google Generative AI |
| **Model** | mixtral-8x7b-32768 | Not specified (likely Gemini) |
| **Temperature** | 0.7 | Not visible |
| **Max Tokens** | 1024 | Configurable |
| **Integration Type** | SDK-based | SDK-based |
| **Briefing** | Mock demo (returns prompt structures) | Real AI-generated content |
| **Chat** | Works with real API calls | Not visible in chat context |
| **RAG** | None | TF-IDF based retrieval |
| **Caching** | In-memory cache (frontend) | SQLite with fingerprint fingerprinting |
| **Confidence Scoring** | Not implemented | Yes (with weakness detection) |

**🐛 BUGFIX Observation:**
- Backend has weakness detection: if top score < 0.05, caps confidence at 0.35
- Adds disclaimer: "Evidence is limited for this exact question..."
- Frontend chat doesn't implement this safety measure

---

## 5. REACT COMPONENTS & CONTEXT

### Frontend Contexts (`src/context/`)

#### **UserContext.tsx**
**Location:** `src/context/UserContext.tsx`

Features:
- ✅ Global user state + preferences management
- ✅ Setter functions for all preference fields
- ✅ `refreshUser()`, `logout()`, `uploadAvatar()`, `changePassword()`
- ✅ Bootstrap on mount with error handling
- ✅ Preference persistence via API

Methods:
```typescript
setUserType, setSelectedInterests, setGoal, setNotificationPref
setExperienceLevel, setRiskAppetite, setTimeHorizon
completeOnboarding, resetOnboarding
```

#### **BriefingContext.tsx**
**Location:** `src/context/BriefingContext.tsx`

Features:
- ✅ Topic selection management
- ✅ AI response caching (keyed by mode)
- ✅ Loading/error state handling
- ✅ Response mode switching (general_view, explain_simply, impact_on_me, deep_dive)

State:
```typescript
selectedTopic: Topic | null
isLoading: boolean
interactionMode: BriefingMode | null
aiResponses: AIResponse[] // cached per mode
error: string | null
```

#### **ChatContext.tsx**
**Location:** `src/context/ChatContext.tsx`
- Mentioned but not detailed in available code

### Backend Frontend Contexts

**Location:** `backend_repo/frontend/lib/`

Only `api.ts` is present - No context files visible
- 🆕 NEW in Frontend: React Context pattern not used in Backend frontend
- ⚠️ BREAKING: Backend frontend is *much simpler* - no context providers

### Frontend Components (`src/components/`)

| Component | Purpose | Notes |
|-----------|---------|-------|
| **HomeScreen** | Landing page | Main entry point |
| **Onboarding** | User profile setup | Collects: userType, interests, goals, experience level, etc. |
| **ChatBotWidget** | Chat interface | Uses UserContext + BriefingContext |
| **BriefingBlocks** | AI response display | Mode-based rendering |
| **ActionCard** | Interactive actions | Buttons for different briefing modes |
| **SkeletonLoader** | Loading state | Placeholder UI |
| **SourceList** | Citation display | Shows sources with metadata |
| **TopicCard** | Topic display | Card layout with image, summary |

### Backend Frontend Components (`backend_repo/frontend/components/`)

| Component | Purpose | Notes |
|-----------|---------|-------|
| **AppHeader** | Navigation bar | Minimal header |
| **OnboardingForm** | Profile setup | Takes: name, role, interests, goals, style |
| **StoryCard** | Story display | Shows story title, summary, article count |
| **SkeletonCard** | Loading state | Similar to frontend |
| **TimelineArc** | Story timeline | Event visualization |
| **AskPanel** | Q&A panel | Interactive questions on stories |
| **BriefingBlocks** | Briefing display | Shows generated content |

**Differences:**
- 🆕 NEW in Backend: TimelineArc component (story arc visualization)
- 🆕 NEW in Backend: AskPanel component (RAG-based Q&A)
- ✨ IMPROVED: Backend components are more feature-rich (story arcs, contrarian views)
- Backend has fewer dependencies (no Framer Motion, no Lucide icons mentioned)

---

## 6. CONFIGURATION FILES

### Package Dependencies Comparison

#### Frontend `package.json`
```json
// Core
"next": "14.2.0",
"react": "18.2.0",
"typescript": "5.3.0",

// Database
"@prisma/client": "7.6.0",
"@prisma/adapter-better-sqlite3": "7.6.0",
"better-sqlite3": "12.8.0",

// AI
"groq-sdk": "1.1.2",

// Authentication
"bcryptjs": "3.0.3",
"jsonwebtoken": "9.0.3",

// UI
"framer-motion": "11.0.0",
"lucide-react": "0.400.0",
"tailwindcss": "3.4.0",
```

#### Backend Frontend `package.json`
```json
// Core only
"next": "14.2.15",
"react": "18.3.1",
"typescript": "5.9.2",

// NO DATABASE
// NO AI SDK
// NO AUTHENTICATION LIBRARIES
// MINIMAL DEPENDENCIES
```

**🆕 NEW in Backend:**
- Google Generative AI (backend/app/services/ai.py)
- scikit-learn (TF-IDF, cosine similarity for RAG)
- NewsAPI integration
- RSS feed ingestion

**Missing in Backend Frontend:**
- Prisma (uses direct API calls instead)
- bcryptjs (auth not in frontend)
- jsonwebtoken (auth not in frontend)
- Framer Motion (simpler animations)
- Lucide icons (using basic HTML/CSS)

### Environment Variables

#### Frontend `.env`
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
GROQ_API_KEY="gsk_..."
```

**🐛 BUGFIX NEEDED:** Secret is exposed in version control

#### Backend `.env.example`
```
OPENAI_API_KEY=
NEWSAPI_KEY=
RSS_FEEDS=
FRONTEND_ORIGIN=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
INGEST_PROVIDER=live
INGEST_AUTO_START=false
INGEST_SOURCE=rss
INGEST_INTERVAL_MINUTES=30
NEWS_CACHE_TTL_SECONDS=60
STORY_CACHE_TTL_SECONDS=120
```

**✨ IMPROVED in Backend:**
- Configurable news ingestion intervals
- Cache TTL settings
- Separate frontend & backend origins
- Flexible provider selection (live/sample)

**⚠️ BREAKING:** Different variable names and structure

### TypeScript Configuration

| Setting | Frontend | Backend |
|---------|----------|---------|
| `target` | (default) | es5 |
| `strict` | (implicit) | true |
| `jsx` | (implicit) | preserve |
| `moduleResolution` | (implicit) | bundler |

---

## 7. TYPE DEFINITIONS

### Frontend Types (`src/lib/types.ts`)

**Complete type exports:**

```typescript
// Basic types
UserType = "investor" | "student" | "founder" | "exploring" | null
Interest = string
Goal = "invest" | "stay_updated" | "learn" | null
NotificationPref = "realtime" | "key_only" | "daily" | "none" | null
ExperienceLevel = "beginner" | "intermediate" | "advanced" | null
RiskAppetite = "conservative" | "moderate" | "aggressive" | null
TimeHorizon = "short" | "medium" | "long" | null

// Response modes
BriefingMode = "general_view" | "explain_simply" | "impact_on_me" | "deep_dive"
TopicSentiment = "positive" | "negative" | "neutral"
ConfidenceLevel = "high" | "medium" | "low"
SourceAgreement = "broad_agreement" | "mostly_aligned" | "mixed"

// Complex types
interface UserPreferences { ... }
interface Topic { ... }
interface StoryArc { ... }
interface AIResponse { ... }
interface Source { ... }
```

**🆕 NEW in Frontend:**
- Comprehensive story arc types (phases, players, sentiment, contrarian, watchNext)
- Topic category system
- Interaction tracking types
- Detailed source metadata

### Backend Types

**Not fully visible** - Inferred from routes:

```python
# From FastAPI schemas (backend/app/models/schemas.py)
class OnboardRequest:
    name: str
    role: str
    style: str
    interests: list
    goals: list

class AskRequest:
    user_id: int
    story_id: int
    question: str
    history: list = []

class SummarizeRequest:
    story_id: int
    style: str
```

**Differences:**
- ✨ IMPROVED: Frontend has much richer type definitions
- 🆕 NEW: Backend missing complex story arc types (but implements them in services)
- ⚠️ BREAKING: Backend uses string roles, Frontend uses predefined UserType

---

## 8. UTILITIES & HELPERS

### Frontend Utilities (`src/lib/`)

#### `personalization.ts`
**Location:** `src/lib/personalization.ts`

Functions:
- `generateAIInstructions(profile)` - Returns AIInstruction with tone, focus, format
- `getPersonalizedPrompt(topic, profile)` - Builds prompt string
- `getStructuredAIPrompt({topic, articles, profile, mode})` - Full structured prompt builder

**Features:**
```typescript
// Profile-based instruction generation
experienceLevelInstructions[level] // tone, complexity, examples
userTypeInstructions[type] // focus areas, output format
riskAppetiteInstructions[appetite] // emphasis, investment types
timeHorizonInstructions[horizon] // strategy details
goalInstructions[goal] // primary goal, advice type
```

✅ SAME methodology in Backend but different implementation

#### `auth.ts`
- Password hashing/verification
- JWT creation/verification
- User CRUD operations via Prisma

#### `data.ts`
- Static mock data for topics
- News topic cards keyed by userType

### Backend Utilities (`backend/app/services/`)

#### `ai.py`
- `generate_briefing(title, context, style)` - LLM-powered briefing
- `answer_question(question, chunks, history, profile)` - RAG-based Q&A
- `get_ai_runtime_status()` - AI provider status

#### `personalization.py`
- `rank_articles_for_user(user_id, limit)` - Scoring + ranking
- `cluster_stories()` - Story clustering

**Features:**
```python
# Role bonus, goal bonus, interest overlap, recency, source-diversity penalty
# Deterministic ranking with explainable reasons
# Keyword filtering from business keyword map
```

#### `rag.py` 
- 🆕 NEW: RAG services not in Frontend
- TF-IDF vectorizer for retrieval
- Cosine similarity matching
- Top-k chunk retrieval

#### `story_arc.py`
- 🆕 NEW: Story arc generation not in Frontend
- Players extraction
- Sentiment trend analysis
- Contrarian view generation
- Scenario modeling

#### `ingestion.py`
- 🆕 NEW: Live news ingestion not in Frontend
- NewsAPI integration
- RSS feed ingestion
- Deduplication (URL + title-similarity)
- NER for entity extraction
- Keyword tagging

#### `cache.py`
- SQLite-backed caching
- TTL-based expiration
- JSON serialization

#### `story_store.py`
- Story clustering + indexing
- Story retrieval
- Fingerprinting for change detection

**Differences Summary:**

| Function | Frontend | Backend |
|----------|----------|---------|
| **Personalization** | Profile-based instruction generation | Scoring + ranking algorithm |
| **RAG** | None | TF-IDF retrieval + similarity |
| **News Source** | Static mock data | Live NewsAPI + RSS feeds |
| **Story Clustering** | None | Automatic clustering |
| **Caching** | In-memory Map | SQLite with fingerprints |
| **NLP Processing** | None (UI only) | NER, entity extraction |
| **Q&A Logging** | None | Full history tracking |

---

## 9. MIDDLEWARE & REQUEST HANDLING

### Frontend Middleware (`src/middleware.ts`)

**Location:** `src/middleware.ts`

```typescript
// Protected routes (require auth)
/dashboard, /profile, /onboarding

// Public routes (no auth required)
/, /api/auth/*, /api/profile, /api/market/search, /api/interests/verify

// Logic:
- Check auth-token cookie
- If API route protected and no token → 401
- Else → pass through
- Page requests: currently allowed without redirect
```

**Issues:**
- ⚠️ INCOMPLETE: Doesn't redirect unauthenticated page requests (stubbed)
- ✅ API protection is functional

### Backend Middleware (FastAPI)

**Location:** `backend/app/main.py`

```python
# CORS middleware configured
allow_origins = from config
allow_credentials = True
allow_methods = ["*"]
allow_headers = ["*"]

# Startup events:
- init_db()
- refresh_story_index()
- start_auto_ingestion_scheduler()

# Error handlers:
- HTTPException handler
- RequestValidationError handler
- AI runtime status check
```

**✨ IMPROVED:**
- Auto-refreshing story index on startup
- Auto-ingestion scheduler
- Better error handling
- Health check endpoint

**⚠️ BREAKING:** Different authentication approach (no JWT middleware visible)

---

## 10. ROUTER & ROUTE ORGANIZATION

### Frontend Route Structure (`src/app/`)

```
src/app/
├── api/
│   ├── auth/
│   │   ├── login/route.ts
│   │   ├── signup/route.ts
│   │   ├── logout/route.ts
│   │   ├── me/route.ts
│   │   ├── preferences/route.ts
│   │   ├── change-password/route.ts
│   │   └── upload-avatar/route.ts
│   ├── ai/
│   │   ├── briefing/route.ts
│   │   └── chat/route.ts
│   ├── interests/
│   ├── market/
│   ├── profile/
│   └── preferences/
├── briefing/[id]/
├── chat/page.tsx
├── dashboard/page.tsx
├── onboarding/page.tsx
├── portfolio/page.tsx
├── profile/page.tsx
├── topics/page.tsx
├── layout.tsx
├── page.tsx
└── root.tsx
```

### Backend Route Structure (FastAPI)

```
backend/app/
├── routes/
│   ├── onboard.py → POST /onboard
│   ├── news.py → GET /news, /stories, /profile
│   ├── story.py → GET /story/{id}, /story/{id}/contrarian
│   ├── ask.py → POST /ask
│   ├── summarize.py → POST /summarize
│   ├── ingestion.py → POST /ingestion/refresh
│   └── saved_items.py → POST/DELETE/GET /saved-items
└── main.py
```

**Organizational Differences:**
- Frontend: File-per-route (Next.js convention)
- Backend: Logical grouping by domain (FastAPI routes)
- 🆕 NEW: Backend has dedicated ingestion routes
- 🆕 NEW: Backend has saved items management

---

## SUMMARY TABLE: INDICATOR LEGEND

| Indicator | Meaning | Example |
|-----------|---------|---------|
| ✅ **SAME** | Identical or equivalent functionality | Login/logout endpoints |
| 🆕 **NEW** | Doesn't exist in Frontend | RAG retrieval, story clustering |
| ✨ **IMPROVED** | Better/more feature-rich version | Backend chat, AI integration |
| 🐛 **BUGFIX** | Addresses a known issue | Weakness detection in confidence scoring |
| ⚠️ **BREAKING** | Incompatible, needs careful migration | Different user ID strategy (UUID vs int) |

---

## KEY FINDINGS & RECOMMENDATIONS

### 1. **Architecture Complexity**
- Frontend: Single Next.js monolith (simpler deployment, shared concerns)
- Backend: Separated Python + Node (microservices style, easier scaling)
- **Recommendation:** Depends on team size. Single app easier to start, separation easier to scale.

### 2. **AI Implementation Gap** 🐛
- Frontend is in **DEMO MODE** - returns prompt structures, not actual content
- Backend has **REAL LLM INTEGRATION** with Google Generative AI
- **Recommendation:** Implement actual LLM calls in Frontend `/api/ai/briefing`

### 3. **Database Schema Mismatch** ⚠️
- UUID vs Integer user IDs (breaking change)
- Different field naming (userType vs role)
- **Recommendation:** Choose one schema and migrate, or create mapping layer

### 4. **News Ingestion Missing** 🆕
- Backend has NewsAPI + RSS ingestion pipeline (production-ready)
- Frontend has static mock data
- **Recommendation:** Integrate ingestion pipeline from Backend to Frontend

### 5. **Advanced Features** 🆕
- Backend: RAG-based Q&A, story arcs, contrarian views, sentiment analysis
- Frontend: Basic chat, static briefings
- **Recommendation:** Port story arc and RAG features to Frontend

### 6. **Authentication Security** ⚠️
```
Frontend:
- JWT implementation exists
- ❌ Secret exposed in version control
- ✅ HTTP-only cookies, rate limiting missing

Backend:
- ❌ No visible auth implementation
- Uses raw user_id in query params
- Ideal for demo/POC, not production
```
- **Recommendation:** Implement proper auth in Backend

### 7. **Caching Strategy**
- Frontend: In-memory Map (lost on restart)
- Backend: SQLite + fingerprinting (persistent)
- **Recommendation:** Add persistent caching to Frontend

### 8. **Type Safety** ✨
- Frontend: Rich TypeScript definitions
- Backend: Lighter schema validation
- **Recommendation:** Frontend types are production-ready

---

## MERGE PRIORITY RANKING

If merging Backend into Frontend, prioritize in this order:

| Priority | Feature | Impact | Effort |
|----------|---------|--------|--------|
| 🔴 **HIGH** | Real LLM integration (Groq vs Google AI) | Demo → Production | Medium |
| 🔴 **HIGH** | News ingestion pipeline | Static data → Live | High |
| 🟠 **MEDIUM** | RAG-based Q&A service | Basic chat → Smart retrieval | Medium |
| 🟠 **MEDIUM** | Story arc generation | None → Full story tracking | High |
| 🟠 **MEDIUM** | Persistent caching (SQLite) | In-memory → Resilient | Low |
| 🟡 **LOW** | Contrarian view generation | None → Extra feature | Medium |
| 🟡 **LOW** | Saved stories/interactions | Missing → User features | Low |

---

End of Comparison Report
