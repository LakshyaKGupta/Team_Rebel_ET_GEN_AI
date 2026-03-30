# ET Gen AI - Comprehensive Test & Implementation Plan

## Overview
This document outlines the end-to-end testing strategy, identified issues, and the implementation roadmap for the ET Gen AI personalized news aggregation platform.

## Project Status

### Completed Features
✅ **Live News Integration** - NewsAPI integration with 6 categories (general, markets, economy, tech, startups, banking)
✅ **AI Briefing Generation** - Google Gemini API integration for story arc, impact analysis, sources
✅ **Personalized Chatbot** - Context-aware responses based on user profile (type, experience level, interests)
✅ **Dashboard** - Multi-section layout with briefing feed, live news, portfolio radar, engagement tracking
✅ **Database** - Supabase PostgreSQL setup with user authentication and preferences
✅ **Onboarding Flow** - User preference collection during signup
✅ **User Context** - Fixed infinite loop issue with proper error handling

### Critical Issues Found & Fixed

#### 1. ✅ Server-Side API URL Issue (FIXED)
**Problem:** In `/src/app/api/ai/chat/route.ts`, the `fetchRelevantNews` function used relative URLs:
```javascript
const res = await fetch(`/api/news?topic=...`);
```
This doesn't work in server-side context.

**Solution:** Fixed to use absolute URLs via FRONTEND_ORIGIN:
```javascript
const baseUrl = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
const res = await fetch(`${baseUrl}/api/news?topic=...`);
```

---

## Phase 1: End-to-End Testing Plan

### Test Scenario 1: User Signup & Onboarding
**Steps:**
1. Navigate to landing page (/)
2. Click "Get Started" or signup button
3. Enter email and password
4. Complete onboarding:
   - Select user type (Investor/Founder/Student/Exploring)
   - Select interests (min 1, max 5 from available list)
   - Set experience level (Beginner/Intermediate/Advanced)
   - Set goals (Invest/Stay Updated/Learn)
   - Set risk appetite & time horizon (for investors)

**Expected Results:**
- User preferences stored in database
- Dashboard loads with personalized content
- Selected interests used for news filtering
- User type reflected in chatbot responses

**Test Status:** PENDING (requires manual testing or Playwright automation)

---

### Test Scenario 2: Live News Integration
**Steps:**
1. Navigate to dashboard
2. Observe "Live News" section on right side
3. Click "View More News" button
4. Verify /news page loads with:
   - News grid layout
   - Category filter buttons
   - Articles from NewsAPI

**Expected Results:**
- News articles display with:
  - Title, summary, source, date
  - Article images (if available)
  - Publish date in human-readable format
- Category filters work correctly
- Articles refresh every 60 seconds auto-update
- Manual refresh button works

**Key API:** `/api/news?topic={query}&category={category}&limit={limit}`

**Test Status:** PENDING

---

### Test Scenario 3: Chatbot Personalization
**Steps:**
1. Open ChatBot widget (bottom right)
2. Ask a question aligned to interests, e.g.:
   - Investor: "Should I buy tech stocks?"
   - Founder: "What are latest startup funding trends?"
   - Student: "Explain what is inflation?"

3. Compare responses with different user profiles

**Expected Results:**
- Responses are personalized by:
  - **Tone**: Investor responses include portfolio impact, Founder responses include market opportunities, Student responses use simple language
  - **Content**: References relevant news articles fetched from `/api/news`
  - **Depth**: Advanced users get detailed analysis, beginners get simplified explanations
  - **Interests**: Content focused on user's selected interests

**Key API:** `/api/ai/chat` with `userProfile` parameter

**Test Status:** PENDING - Chatbot implementation verified but needs actual testing

---

### Test Scenario 4: Article Navigation & Briefing Generation
**Steps:**
1. Click on a live news article from dashboard or /news page
2. Article should:
   - Store data in localStorage before navigation
   - Generate full briefing with story arc

3. View briefing with:
   - Story Arc tab (phases, players, sentiment, scenarios)
   - Overview/Personal tabs
   - Sources tab

**Expected Results:**
- Article data persists through navigation
- Briefing generates successfully with:
  - Story arc (phases, players, sentiment)
  - Impact analysis by user type
  - Key takeaways
  - Sources
- Personalized personal view based on user type

**Key APIs:**
- `/api/generate-briefing` - generates full briefing from article
- `/api/news` - fetches article data

**Test Status:** PENDING - Structure looks good, needs testing

---

### Test Scenario 5: Portfolio Integration
**Steps:**
1. Click "Connect portfolio" button on dashboard
2. Navigate to /portfolio page
3. Add/edit holdings
4. Return to dashboard
5. Check "Portfolio radar" section

**Expected Results:**
- Portfolio holdings displayed
- Dashboard shows portfolio-related news stories
- "Portfolio-linked" count updated
- Clicking portfolio items shows relevant briefings

**Test Status:** PENDING

---

## Phase 2: Performance Optimization

### 1. News Caching Strategy
**Current State:** News fetched fresh on every page/category change
**Goal:** Reduce API calls while keeping content fresh

**Implementation Plan:**
```javascript
// Add cache with TTL to news API
const CACHE_TTL = 300; // 5 minutes
const newsCache = new Map<string, { data: any; timestamp: number }>();

function getCachedNews(key: string) {
  const cached = newsCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL * 1000) {
    return cached.data;
  }
  return null;
}
```

**Benefits:**
- Reduce NewsAPI quota usage (100 requests/day free)
- Faster page loads from cache hits
- Better UX with instant category switching

---

### 2. Pagination for /news Page
**Current State:** Shows 20 articles, uses "Load More Headlines" button
**Goal:** Implement proper pagination with infinite scroll or pagination controls

**Implementation:**
```javascript
// Add pagination state to /news page
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

// Load more on scroll
useEffect(() => {
  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setPage(p => p + 1);
    }
  };
  window.addEventListener('scroll', handleScroll);
}, []);
```

---

### 3. Database Query Optimization
**Current State:** Using demo state (localStorage)
**Improvements Needed:**
- Index on user_id for preferences lookups
- Index on topic_id for engagement tracking
- Batch queries for related topics

---

## Phase 3: New Features

### 1. Portfolio Tracking Enhancement
**Current Implementation:**
- Basic portfolio asset display
- Portfolio-linked story filtering

**Enhancements:**
- Real-time price updates
- Portfolio performance tracking
- P&L calculation
- Asset allocation visualization
- Risk metrics (beta, standard deviation)

**Implementation Timeline:** 1-2 weeks

---

### 2. Real-Time Alerts
**Feature:** Notify user when portfolio-related news breaks

**Implementation:**
- WebSocket connection for real-time news
- Alert rules (e.g., "alert when RELIANCE drops 5%")
- Email/push notifications
- Alert history dashboard

**Implementation Timeline:** 2-3 weeks

---

### 3. Advanced Analytics Dashboard
**Metrics to Track:**
- Content engagement (most read topics, favorite categories)
- Reading patterns (time of day, frequency, duration)
- Portfolio impact analysis
- Recommendation accuracy scoring

**UI Components:**
- Time-series charts for engagement
- Heatmaps for reading patterns
- Portfolio correlation analysis

**Implementation Timeline:** 2-3 weeks

---

## Known Limitations & Workarounds

### 1. NewsAPI Free Tier Limits
- **Limit:** 100 requests/day
- **Workaround:** Implement caching (500 requests → ~50 cached hits)
- **Future:** Upgrade to paid tier or add RSS feed fallback

### 2. Gemini API Rate Limiting
- **Issue:** High demand errors during peak usage
- **Current Handling:** Error message + retry prompt
- **Future:** Implement exponential backoff + queue system

### 3. Live News Expiry
- **Issue:** Article data in localStorage expires after page refresh
- **Current Handling:** Shows "Article not found" error
- **Solution:** Cache briefings for 24 hours for repeat access

---

## Testing Checklist

### Functional Testing
- [ ] Signup and onboarding flow
- [ ] User preferences saved correctly
- [ ] Dashboard loads with personalized content
- [ ] Live news fetches and displays
- [ ] Category filters work (general, markets, economy, tech, startups, banking)
- [ ] Chatbot responds with personalized content
- [ ] Article opens and generates briefing
- [ ] Portfolio tracking works
- [ ] Engagement tracking (like, save, dislike) persists

### Performance Testing
- [ ] Dashboard loads in < 3 seconds
- [ ] News page loads in < 2 seconds
- [ ] Briefing generation in < 5 seconds
- [ ] Chatbot response in < 3 seconds
- [ ] No memory leaks in UserContext

### Edge Cases
- [ ] Unauthenticated user sees landing page
- [ ] Network error handling
- [ ] Empty results (no news found)
- [ ] Malformed article data
- [ ] API key missing/invalid
- [ ] Database connection timeout

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile (iOS Safari, Chrome)

---

## API Endpoints Summary

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### News
- `GET /api/news?topic={query}&category={category}&limit={limit}` - Fetch news

### AI
- `POST /api/ai/chat` - Chat with personalized responses
- `POST /api/generate-briefing` - Generate briefing from article

### User
- `GET /api/preferences` - Get user preferences
- `POST /api/preferences` - Update preferences
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Update profile

---

## Environment Variables Required
```
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-2.0-flash
FRONTEND_ORIGIN=http://localhost:3000
NEWSAPI_KEY=your-newsapi-key
```

---

## Next Steps

### Immediate (This Week)
1. ✅ Fix server-side API URL issue in chat route
2. **Run end-to-end tests** on all 5 scenarios
3. **Document any bugs found** with reproduction steps
4. **Fix identified bugs**

### Short Term (Next 2 Weeks)
1. Implement news caching
2. Add pagination to /news page
3. Optimize database queries
4. Performance testing and optimization

### Medium Term (Next Month)
1. Implement portfolio tracking enhancements
2. Add real-time alerts
3. Build analytics dashboard
4. Add mobile optimization

### Long Term (Phase 2)
1. Email briefing digest
2. Social sharing
3. Mobile app
4. API documentation

---

## Contact & Support
For issues or clarifications, refer to:
- Project documentation: README.md
- Chatbot setup: CHATBOT_API_SETUP.md
- Code structure: AGENTS.md
