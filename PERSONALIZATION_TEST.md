# Personalization Engine Test Cases

## Test: Same News (RBI Rate Decision) + Different Users → Different Outputs

### Scenario: RBI keeps interest rates unchanged at 6.5%

---

## Test 1: User Type = Investor (Aggressive, Long-term)

**Profile:**
- User Type: investor
- Experience: advanced
- Risk Appetite: aggressive
- Time Horizon: long
- Goal: invest

**Expected Output - Impact on Me:**
```
Portfolio Impact: Rate-sensitive sectors (banking, real estate) get relief. 
If you hold HDFC, ICICI, or Realty stocks, expect stability. Consider 
increasing allocation to rate-sensitive themes as cut probability increases 
in Q3. For your long-term horizon, this suggests maintaining exposure to 
quality banks and adding to realty on dips.
```

---

## Test 2: User Type = Student (Beginner)

**Profile:**
- User Type: student
- Experience: beginner
- Goal: learn

**Expected Output - Impact on Me:**
```
As someone learning about finance, this shows how central banks manage 
the economy. Your family's FD rates (~6.5-7%) remain stable. Watch how 
this decision affects prices of things you buy - stable rates mean less 
inflation pressure. This is a great example of how RBI balances growth 
and inflation!
```

---

## Test 3: User Type = Founder

**Profile:**
- User Type: founder
- Goal: stay_updated

**Expected Output - Impact on Me:**
```
Business Impact: Your startup's loan rates stay constant, aiding financial 
planning. Investors will factor this stable rate environment when valuing 
your company. Cost of capital remains predictable for fundraising. If you're 
in sectors like edtech or fintech, this stable rate environment is positive 
for growth.
```

---

## Test 4: User Type = Exploring (Casual)

**Profile:**
- User Type: exploring

**Expected Output - Impact on Me:**
```
If you have a home loan or FD, nothing changes right now. The bank is 
being careful about inflation. This is generally good for the economy - 
it means prices might stay stable, which is good for everyone.
```

---

## Test 5: Same Content - Different Depth Levels

### Simple (Beginner):
```
In simple terms: The RBI kept interest rates steady. Think of it like a 
pause button - banks won't change loan rates right now. If you have a home 
loan, your EMI stays the same. Your fixed deposits will continue earning 
at current rates.
```

### Detailed (Advanced):
```
RBI's MPC kept the repo rate at 6.5% unanimously, signaling a cautious 
approach. The decision reflects ongoing inflation concerns (CPI at 5.1%) 
while supporting growth. Rate cuts delayed until Q4 FY26. Key implications:
- Banking sector: Positive as NIMs stable
- Real estate: Relief from rate pressure
- FMCG: Marginal impact
- Strategy: Maintain barbell approach with quality financials
```

---

## UI Features to Test

1. **Tailored Label**: Shows "Tailored for [User Type]" badge
2. **User Switch Toggle**: Can simulate different user types
3. **Depth Toggle**: Can switch between Simple/Detailed
4. **Action Section**: Shows specific actions based on user type
5. **Future Section**: Shows bull/bear/base scenarios for deep dive
