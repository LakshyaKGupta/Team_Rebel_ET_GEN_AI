# Side-by-Side Code Comparison

## 1. AI INTEGRATION: The Core Difference

### Frontend (DEMO MODE - No Real LLM)
```typescript
// src/app/api/ai/briefing/route.ts
export async function POST(request: NextRequest) {
  // ... validation ...
  
  // ❌ DEMO: Just returns prompt structure, NOT actual AI response
  const structuredPrompt = getStructuredAIPrompt({
    topic,
    articles: articleContent,
    profile: userProfile,
    mode: "explain_simply"
  });

  return NextResponse.json({
    instructions,
    personalizedPrompt,
    structuredPrompt,  // 👈 Returns STRUCTURE, not content
    userProfile,
  });
}
```

### Backend (PRODUCTION - Real LLM)
```python
# backend/app/routes/story.py
@router.post("/summarize")
def summarize_story(payload: SummarizeRequest):
    story = get_story(payload.story_id)
    context = "\n".join([a["content"] for a in story["articles"][:5]])
    
    # ✅ REAL: Actually calls Google Generative AI
    briefing = generate_briefing(
        story["title"],
        context,
        payload.style
    )
    
    return {
        "story_id": story["id"],
        "title": story["title"],
        "briefing": briefing,  # 👈 Returns ACTUAL content
        "cache_status": "fresh",
        "ai": get_ai_runtime_status(),
    }

# In backend/app/services/ai.py
def generate_briefing(title: str, context: str, style: str) -> str:
    prompt = f"""
    Generate a {style} briefing for:
    {title}
    
    Context: {context}
    """
    
    # 🔥 REAL LLM CALL
    response = genai.generate_text(
        prompt=prompt,
        # ... config ...
    )
    return response.result
```

---

## 2. NEWS DATA: Static vs Live

### Frontend (Static Mock Data)
```typescript
// src/lib/data.ts
export const topicsByUserType = {
  investor: [
    {
      id: "market-crash-1",
      title: "Indian Stock Market Surge on FII Inflows",
      subtitle: "Nifty 50 breaks all-time high",
      // ... hardcoded data
    },
    // More hardcoded topics...
  ],
  // Other user types...
};

// Usage
const topics = topicsByUserType[userType];  // Always returns same data
```

### Backend (Live with Ingestion)
```python
# backend/app/routes/news.py
@router.get("/news")
def get_personalized_news(user_id: int = Query(...)):
    # ✅ LIVE: Fetch fresh data, not hardcoded
    feed = rank_articles_for_user(user_id=user_id, limit=10)
    
    # With reasons WHY it's recommended
    return {
        "items": [
            {
                "title": item["title"],
                "source": item["source"],
                "reasons": item["reasons"],  # ["Matches your interests", ...]
                "score": item["score"],      # Personalization score
            }
            for item in feed
        ]
    }

# In backend/app/services/personalization.py
def rank_articles_for_user(user_id: int, limit: int):
    user = get_user(user_id)
    articles = get_all_articles()  # Fresh from API/RSS
    
    # Calculate scores for each article
    for article in articles:
        score = (
            role_bonus(article, user.role) +
            goal_bonus(article, user.goal) +
            interest_overlap(article, user.interests) +
            recency_bonus(article) -
            source_diversity_penalty(article)
        )
        article["reasons"] = [
            f"Matches your interest: {tag}"
            for tag in article["tags"]
            if tag in user.interests
        ]
    
    return sorted(articles, key=lambda x: x["score"])[:limit]
```

---

## 3. USER AUTHENTICATION: Secure vs Basic

### Frontend (JWT + Cookies)
```typescript
// src/lib/auth.ts
export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { preferences: true },
  });
  
  if (!user) return null;
  
  // ✅ SECURE: Use bcrypt to compare hashed password
  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return null;
  
  return user;
}

// src/app/api/auth/login/route.ts
export async function POST(request: NextRequest) {
  const user = await authenticateUser(email, password);
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  // ✅ SECURE: Generate JWT
  const token = generateToken(user.id);
  
  // ✅ SECURE: Set HTTP-only cookie
  response.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
```

### Backend (No Auth - Demo Mode)
```python
# backend/app/routes/onboard.py
@router.post("")
def onboard_user(payload: OnboardRequest):
    # ❌ NO AUTH: Creates user without password
    cursor = conn.execute(
        "INSERT INTO users(name, role, style, interests, goals) VALUES(?, ?, ?, ?, ?)",
        (payload.name, payload.role, payload.style, 
         json.dumps(payload.interests), json.dumps(payload.goals)),
    )
    user_id = cursor.lastrowid
    
    # ❌ NO TOKEN: Returns just user_id
    return {
        "user_id": user_id,  # 👈 Anyone could guess this!
        "message": "Onboarding complete",
    }

# API Usage - demonstrates security risk:
fetch("/onboard", { body }).then(r => r.json())  // { user_id: 1 }
fetch("/news?user_id=2")  // 👈 Can query any user by guessing ID!
```

**🔴 SECURITY ISSUE:** Backend allows user enumeration

---

## 4. Q&A SYSTEM: Basic vs RAG with Retrieval

### Frontend (Simple Chat)
```typescript
// src/app/api/ai/chat/route.ts
export async function POST(req: NextRequest) {
  const { messages, userProfile } = await req.json();
  
  const systemPrompt = buildSystemPrompt(userProfile);
  
  // ⚠️ BASIC: Just passes messages to LLM, no retrieval
  const response = await groq.chat.completions.create({
    model: 'mixtral-8x7b-32768',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,  // 👈 Just raw user input
    ],
    max_tokens: 1024,
    temperature: 0.7,
  });

  return NextResponse.json({
    success: true,
    message: assistantMessage,
  });
}
```

### Backend (RAG with Retrieval)
```python
# backend/app/routes/ask.py
@router.post("/ask")
def ask_question(payload: AskRequest):
    story = get_story(payload.story_id)
    
    # 1️⃣ RETRIEVE: Get relevant chunks from story
    context_chunks = [
        f"{article['title']}\n{article['content']}"
        for article in story["articles"]
    ]
    
    # ✅ SMART: Use TF-IDF + cosine similarity for retrieval
    retrieval = retrieve_top_chunks(
        payload.question,
        context_chunks,
        top_k=4
    )
    
    selected_chunks = [chunk for _, chunk, score in retrieval if score > 0.0]
    
    # 2️⃣ AUGMENT: Build history context
    history = _merge_history(
        recent_turns=_recent_qa_turns(payload.user_id, payload.story_id),
        incoming_turns=payload.history,
    )
    
    # 3️⃣ GENERATE: LLM with rich context
    response = answer_question(
        payload.question,
        selected_chunks,  # 👈 Retrieved evidence
        history_turns=history,  # 👈 Conversation history
        user_profile=user_profile,  # 👈 User context
    )
    
    # 4️⃣ SCORE: Confidence with evidence quality check
    top_score = retrieval[0][2] if retrieval else 0.0
    weak_evidence = top_score < 0.05
    
    if weak_evidence:
        response["confidence"] = min(response["confidence"], 0.35)
        response["answer"] = (
            "Evidence is limited, but here's what we found: "
            + response["answer"]
        )
    
    # 5️⃣ LOG: Track for future use
    _log_qa(payload.user_id, payload.story_id, 
            payload.question, response)
    
    return response

# In backend/app/services/rag.py
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def retrieve_top_chunks(question: str, chunks: list, top_k: int = 4):
    vectorizer = TfidfVectorizer(
        max_features=100,
        stop_words='english'
    )
    
    # ✅ VECTORIZE: Convert to embeddings
    vectors = vectorizer.fit_transform([question] + chunks)
    
    # ✅ SCORE: Calculate relevance
    similarities = cosine_similarity(vectors[0:1], vectors[1:])
    
    # ✅ RANK: Return top matches with scores
    scored = [
        (idx, chunks[idx], float(score))
        for idx, score in enumerate(similarities[0])
    ]
    return sorted(scored, key=lambda x: x[2], reverse=True)[:top_k]
```

---

## 5. CACHING: In-Memory vs Persistent

### Frontend (In-Memory - Lost on Restart)
```typescript
// src/app/api/ai/briefing/route.ts
const generalViewCache = new Map<string, unknown>();

export async function POST(request: NextRequest) {
  const cacheKey = JSON.stringify({
    topic,
    mode,
    userType: userProfile.userType,
    interests: userProfile.interests,
    goal: userProfile.goal,
  });

  // ⚠️ CHECK IN-MEMORY CACHE
  if (mode === "general_view" && generalViewCache.has(cacheKey)) {
    return NextResponse.json(generalViewCache.get(cacheKey));
  }
  
  // ... generate response ...
  
  // ⚠️ CACHE IN MEMORY
  if (mode === "general_view") {
    generalViewCache.set(cacheKey, responsePayload);
  }

  return NextResponse.json(responsePayload);
}

// ❌ PROBLEM: Lost when server restarts
```

### Backend (Persistent SQLite)
```python
# backend/app/routes/story.py
from app.services.briefing_cache import (
    build_story_fingerprint,
    get_cached_briefing,
    upsert_briefing_cache,
)

@router.post("/summarize")
def summarize_story(payload: SummarizeRequest):
    story = get_story(payload.story_id)
    
    # ✅ BUILD FINGERPRINT: Detect changes
    fingerprint = build_story_fingerprint(story)
    
    # ✅ CHECK CACHE: Query SQLite
    cached, status = get_cached_briefing(
        story_id=story["id"],
        style=payload.style,
        fingerprint=fingerprint
    )

    if cached:
        briefing = cached
        cache_status = status  # "cached" or "stale"
    else:
        # Generate fresh content
        context = "\n".join([a["content"] for a in story["articles"][:5]])
        briefing = generate_briefing(story["title"], context, payload.style)
        
        # ✅ PERSIST TO DB
        upsert_briefing_cache(
            story_id=story["id"],
            style=payload.style,
            fingerprint=fingerprint,
            payload=briefing
        )
        cache_status = "fresh"

    return {
        "briefing": briefing,
        "cache_status": cache_status,  # "cached", "stale", or "fresh"
    }

# In backend/app/services/briefing_cache.py
def build_story_fingerprint(story: dict) -> str:
    """Create hash of story articles to detect changes"""
    article_hashes = [
        hashlib.md5(article["content"].encode()).hexdigest()
        for article in story["articles"]
    ]
    return hashlib.md5(
        "".join(article_hashes).encode()
    ).hexdigest()

def upsert_briefing_cache(story_id, style, fingerprint, payload):
    with get_connection() as conn:
        conn.execute("""
            INSERT INTO briefing_cache(story_id, style, fingerprint, payload)
            VALUES(?, ?, ?, ?)
            ON CONFLICT(story_id, style) DO UPDATE SET
                fingerprint=excluded.fingerprint,
                payload=excluded.payload,
                updated_at=CURRENT_TIMESTAMP
        """, (story_id, style, fingerprint, json.dumps(payload)))
        conn.commit()
```

---

## 6. STORY ARC ANALYSIS: Frontend Missing

### Frontend (None - Doesn't Exist)
```typescript
// Story arc visualization not implemented
// Users only see basic topic cards and briefings
```

### Backend (Full Implementation)
```python
# backend/app/routes/story.py
@router.get("/story/{story_id}")
def get_story(story_id: int):
    story = get_story(story_id)
    
    # ✅ GET TIMELINE: Phases of development
    arc = build_story_arc(story)
    
    # arc.phases = [
    #   {label: "Announcement", time: "Jan 1", detail: "..."},
    #   {label: "Controversy", time: "Jan 5", detail: "..."},
    #   {label: "Resolution", time: "Jan 10", detail: "..."},
    # ]
    
    # arc.players = [
    #   {name: "CEO", role: "...", stance: "pro", influence: "high"},
    #   {name: "Regulator", role: "...", stance: "against", influence: "high"},
    # ]
    
    # arc.sentiment = [
    #   {label: "Day 1", score: 0.2, note: "Skeptical"},
    #   {label: "Day 5", score: 0.7, note: "Optimistic"},
    # ]
    
    # arc.contrarian = [
    #   {title: "Bears argue...", body: "..."},
    #   {title: "Counter-argument...", body: "..."},
    # ]
    
    # arc.watchNext = [
    #   {title: "Regulatory approval", trigger: "If...", impact: "Stock could +20%"},
    # ]
    
    return {
        "story": story,
        "arc": arc,
    }

# In backend/app/services/story_arc.py
def build_story_arc(story: dict):
    title = story["title"]
    articles = story["articles"]
    
    # Extract timeline from articles
    phases = extract_timeline(articles)
    
    # NER + clustering to find key players
    players = extract_key_players(articles)
    
    # Sentiment analysis over time
    sentiment_trend = analyze_sentiment_trend(articles)
    
    # Generate contrarian views
    contrarian = build_contrarian_perspectives(articles)
    
    # Predict next steps
    watch_next = generate_predictions(story, player_stances=players)
    
    return StoryArc(
        summary=title,
        phases=phases,
        players=players,
        sentiment=sentiment_trend,
        contrarian=contrarian,
        watchNext=watch_next,
    )
```

---

## SUMMARY: What Needs to Merge

| Component | Complexity | Impact | Code to Port |
|-----------|-----------|--------|-------------|
| **Real LLM** | Easy | 🔴 CRITICAL | `ai.py` summarize logic |
| **News Ingestion** | Hard | 🔴 CRITICAL | `ingestion.py` + `services/` |
| **RAG Retrieval** | Medium | 🟠 IMPORTANT | `rag.py` + `ask.py` |
| **Story Arcs** | Hard | 🟠 IMPORTANT | `story_arc.py` + `story.py` |
| **Persistent Cache** | Easy | 🟡 NICE | SQLite cache table + `briefing_cache.py` |
| **Saved Items** | Easy | 🟡 NICE | `saved_items.py` + table |
| **Auth Fix** | Medium | 🔴 CRITICAL | Implement JWT in backend |

---

## 🚀 Quick Implementation Order

1. **Fix Backend Auth first** (5-10 minutes)
   ```python
   # Add JWT token generation to onboard.py
   from app.services.auth import generate_token
   
   token = generate_token(user_id)
   return {"user_id": user_id, "token": token}
   ```

2. **Replace Frontend demo** (10-20 minutes)
   ```typescript
   // Change /api/ai/briefing to call Groq like /api/ai/chat does
   // Return actual text, not prompt structure
   ```

3. **Add news ingestion** (1-2 hours)
   - Port `ingestion.py` logic
   - Schedule auto-refresh
   - Build API endpoint

4. **Add RAG to Q&A** (1-2 hours)
   - Port `rag.py` vector logic
   - Integrate with chat system
   - Add confidence scoring

5. **Add story arcs** (2-3 hours)
   - Port `story_arc.py`
   - Create visualization components
   - Integrate with existing UI

