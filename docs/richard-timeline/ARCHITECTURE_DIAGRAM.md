# Timeline Calculator Architecture - Visual Guide

**How everything fits together**

---

## 📐 System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                            │
│                    (TimelineCalculator.jsx)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────┐  ┌────────────────────┐                 │
│  │ Discovery Questions│  │ Project Parameters │                  │
│  │  - 21 questions    │  │  - Go-live date   │                  │
│  │  - Dropdowns/YesNo │  │  - App completion %│                  │
│  └────────┬───────────┘  └────────┬───────────┘                  │
│           │                       │                               │
│           └───────────┬───────────┘                               │
│                       │                                           │
│                       ▼                                           │
│           ┌───────────────────────┐                               │
│           │ calculateRichardTimeline()                            │
│           │  (richard-timeline-engine.js)                         │
│           └───────────┬───────────┘                               │
│                       │                                           │
│           ┌───────────┴───────────┐                               │
│           │                       │                               │
│           ▼                       ▼                               │
│  ┌────────────────┐      ┌────────────────┐                      │
│  │ Timeline Results│      │  Gantt Chart   │                      │
│  │  - Bucket durations    │  - Visual timeline                   │
│  │  - Key dates    │      │  - Phase overlaps                    │
│  └────────────────┘      └────────────────┘                      │
│           │                       │                               │
│           └───────────┬───────────┘                               │
│                       │                                           │
│                       ▼                                           │
│           ┌───────────────────────┐                               │
│           │ Validation Report      │                              │
│           │  - Feasibility check   │                              │
│           │  - Risk indicators     │                              │
│           └───────────────────────┘                               │
│                                                                   │
└───────────────────────────┬───────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                   BUSINESS CASE CONTEXT                           │
│               (BusinessCaseContext.jsx)                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  State Management:                                                │
│  - Timeline answers & results                                     │
│  - Customer profile                                               │
│  - Current/future state configs                                   │
│  - TCO/ROI calculations                                           │
│                                                                   │
│  Integration Points:                                              │
│  - timeline.weeksToGoLive → TCO time horizon                      │
│  - timeline.validation → Project risk assessment                  │
│  - timeline.durations → Implementation cost estimation            │
│                                                                   │
└───────────────────────────┬───────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
┌──────────────────────┐        ┌──────────────────────┐
│  Cost Calculator     │        │   ROI Calculator     │
│  (cost-calculator.js)│        │  (roi-calculator.js) │
├──────────────────────┤        ├──────────────────────┤
│  - Azure costs       │        │  - Comprehensive ROI │
│  - Current state     │        │  - Value metrics     │
│  - TCO analysis      │        │  - Payback period    │
└──────────────────────┘        └──────────────────────┘
```

---

## 🔄 Data Flow - How Calculations Work

```
STEP 1: User Input
──────────────────
User answers 21 questions in UI
Example: D24 = "App modernization required"
         D6  = "3 to 9 months"
         D25 = "On-prem physical desktops"

         ↓

STEP 2: Question Scoring
─────────────────────────
Each answer gets: score (1-3) × weight (0-10) = weighted score

D24: score 3 × weight 10 = 30 ⚠️ HUGE IMPACT
D10: score 3 × weight (D6×D25 = 2×3 = 6) = 18

         ↓

STEP 3: Bucket Complexity Calculation
──────────────────────────────────────
Sum weighted scores for each bucket's questions

Bucket 1 (Apps): SUM(D8,D9,D10-13,D17,D23-29) = 68.5
Bucket 2 (Azure): SUM(D10-13,D15,D16,D19,D21) = 45.2
Bucket 3 (Nerdio): SUM(D19,D21) = 8.7
...

         ↓

STEP 4: Duration Calculation
─────────────────────────────
Round bucket complexity to weeks, apply constraints

Bucket 1: ROUND(68.5) = 69 weeks (!!)
Bucket 2: ROUND(45.2) = 45 weeks
Bucket 3: MAX(1, ROUND(8.7)) = 9 weeks (challenging security)
...

         ↓

STEP 5: Parallel Execution
───────────────────────────
User specifies: "30% of app work done before Azure starts"

App duration: 69 weeks
Azure start delay: 69 × (1 - 0.30) = 48.3 weeks
Azure starts at: Week 48.3 (30% through app phase)

         ↓

STEP 6: Timeline Markers
────────────────────────
Calculate when each phase starts/ends (relative to go-live)

App transform: Week -69 to -21
Azure prep: Week -48.3 to -12
Nerdio deploy: Week -12 to -3
AVD design: Week -3 to +5 ⚠️ PROBLEM!
...

         ↓

STEP 7: Validation
──────────────────
Check if timeline fits before go-live date

Weeks needed: 69 (from calculations)
Weeks available: 23 (from today to go-live)
Result: ❌ NOT FEASIBLE - Timeline too tight!

         ↓

STEP 8: Results Display
───────────────────────
Show user:
- Phase durations and dates
- Gantt chart visualization
- Feasibility warning
- Recommendations (extend timeline, reduce scope, add resources)
```

---

## 🎯 Critical Calculation Points

### 1. Question Scoring Logic

```javascript
// STANDARD QUESTION
Question D8: "1,000 to 5,000 users"
  → score: 2 (medium)
  → weight: 2 (hardcoded)
  → weighted: 2 × 2 = 4 weeks impact

// MIGRATION QUESTION (SPECIAL)
Question D10: "Migrating from on-prem physical?"
Answer: "Yes"
  → score: 3 (complex)
  → weight: CALCULATED = D6.score × D25.score = 2 × 3 = 6
  → weighted: 3 × 6 = 18 weeks impact
```

### 2. Bucket 1 Conditional Logic

```javascript
// Decision tree based on D26
┌─────────────────────────┐
│ D26: Backend resources? │
└───────┬─────────────────┘
        │
   ┌────┴────┐
   │         │
   ▼         ▼
  No        Yes
   │         │
   │         │
   ▼         ▼
┌──────┐  ┌─────────────┐
│ Use  │  │ Use FULL    │
│ 5 Q's│  │ 13 questions│
└──────┘  └─────────────┘
   │         │
   │         │
   ▼         ▼
 8-15w     15-30w
(simpler) (complex)
```

### 3. Parallel Execution Visual

```
App Transformation (16 weeks)
├────────────────────────────────┤
0%  10%  20%  30%  40%  50%  60%  70%  80%  90%  100%

If user says "30% complete before Azure":
├────────────────────────────────┤
                    ↑ Azure prep starts here (Week 11.2)
                    
Azure Prep (9 weeks)
                    ├──────────────────┤

Result: Phases OVERLAP
Total: 16 + 9 - 4.8 = 20.2 weeks (not 25 sequential)
```

### 4. Minimum Constraint (Bucket 3)

```javascript
// Nerdio deployment
Bucket 3 Complexity = SUM(D19, D21)

Scenario A: Simple environment
D19 = score 1 × weight 1 = 1
D21 = score 1 × weight 1 = 1
Total = 2, ROUND(2) = 2 weeks ✓

Scenario B: Super simple environment  
D19 = score 1 × weight 1 = 1
D21 = score 1 × weight 0 = 0
Total = 1, ROUND(1) = 1 week ✓

Scenario C: Change control only
D19 = score 2 × weight 1 = 2
D21 = score 1 × weight 0 = 0
Total = 2, ROUND(2) = 2 weeks ✓

Scenario D: Theoretical zero
D19 = 0
D21 = 0
Total = 0, MAX(1, ROUND(0)) = 1 week ✓
                   ↑ MINIMUM enforced
```

---

## 🔍 Comparison: Old vs New Architecture

### ❌ OLD (phaseOverlap.js)

```
User Input: (None - no questions)
     ↓
Hardcoded Durations:
  - App transform: 16 weeks (always)
  - Azure prep: 6 weeks (always)
  - Nerdio: 2 weeks (always)
  ...
     ↓
Arbitrary Overlaps:
  - Azure starts at 50% of apps (always)
  - Nerdio starts at 25% of Azure (always)
     ↓
Timeline: 39 weeks (always wrong)
```

### ✅ NEW (richard-timeline-engine.js)

```
User Input: 21 discovery questions
     ↓
Weighted Scoring: score × weight per question
     ↓
Bucket Complexity: SUM(weighted scores)
     ↓
Dynamic Durations: ROUND(complexity) with constraints
     ↓
User-Controlled Overlaps: % complete slider
     ↓
Timeline: 12-45 weeks (accurately reflects complexity)
     ↓
Validation: Feasibility check vs go-live date
```

---

## 📊 Decision Flow for Bucket 1

```
START: Calculate Bucket 1 (App Transform)
  │
  ├─> Read D26 answer
  │
  ├─> IF D26 = "No" (no backend resources)
  │     │
  │     └─> Formula: SUM(D23, D24, D27, D28, D29)
  │           │
  │           └─> Questions:
  │                 - D23: Number of apps
  │                 - D24: Deployment methods
  │                 - D27: Peripheral devices
  │                 - D28: Cloud testing
  │                 - D29: Last modernization
  │           │
  │           └─> Result: 8-15 weeks typically
  │
  └─> ELSE (backend resources needed)
        │
        └─> Formula: SUM(D8,D9,D10-13,D17,D23,D24,D26-29)
              │
              └─> Questions:
                    - D8, D9: User count, use cases
                    - D10-D13: Migration complexity
                    - D17: OS compatibility
                    - D23-D29: All app questions
              │
              └─> Result: 15-30 weeks typically
```

---

## 🎨 UI Component Hierarchy

```
<App>
  │
  ├─> <BusinessCaseProvider>  (Context wrapper)
  │     │
  │     └─> <TimelineCalculator>  (Main component)
  │           │
  │           ├─> <DiscoveryQuestionsSection>
  │           │     │
  │           │     ├─> <QuestionGroup category="Project Fundamentals">
  │           │     │     ├─> <QuestionCard id="D6" type="select" />
  │           │     │     ├─> <QuestionCard id="D8" type="select" />
  │           │     │     └─> <QuestionCard id="D9" type="select" />
  │           │     │
  │           │     ├─> <QuestionGroup category="Migration Source">
  │           │     │     ├─> <QuestionCard id="D10" type="yesno" />
  │           │     │     ├─> <QuestionCard id="D11" type="yesno" />
  │           │     │     └─> ...
  │           │     │
  │           │     └─> <QuestionGroup category="Applications">
  │           │           ├─> <QuestionCard id="D23" type="select" />
  │           │           ├─> <QuestionCard id="D24" type="select" />
  │           │           └─> ...
  │           │
  │           ├─> <ProjectParametersSection>
  │           │     ├─> <DatePicker label="Go-Live Date" />
  │           │     └─> <RangeSlider label="App Completion %" />
  │           │
  │           ├─> <CalculateButton />
  │           │
  │           └─> {results && (
  │                 <>
  │                   <TimelineResultsSection>
  │                     ├─> <BucketDurationsList />
  │                     ├─> <KeyDatesSummary />
  │                     └─> <ValidationStatus />
  │                   </TimelineResultsSection>
  │                   
  │                   <GanttChartSection>
  │                     ├─> <PhaseBar bucket={1} />
  │                     ├─> <PhaseBar bucket={2} />
  │                     └─> ...
  │                   </GanttChartSection>
  │                   
  │                   <ValidationReportSection>
  │                     ├─> <FeasibilityIndicator />
  │                     ├─> <RiskFactors />
  │                     └─> <Recommendations />
  │                   </ValidationReportSection>
  │                   
  │                   <ExportSection>
  │                     ├─> <ExportToPDFButton />
  │                     ├─> <SaveScenarioButton />
  │                     └─> <ShareLinkButton />
  │                   </ExportSection>
  │                 </>
  │               )}
  │
  └─> Other business case components (TCO, ROI, etc.)
```

---

## 🔢 Formula Reference

### Core Formulas

```javascript
// 1. QUESTION SCORING
weighted_score = score × weight

// 2. MIGRATION QUESTION WEIGHTING (D10-D13)
migration_weight = D6.score × D25.score

// 3. BUCKET COMPLEXITY
bucket_N = SUM(weighted_scores_for_bucket_N_questions)

// 4. BUCKET DURATION
duration = ROUND(bucket_complexity)

// 5. BUCKET 3 MINIMUM
duration_bucket_3 = MAX(1, ROUND(bucket_3_complexity))

// 6. PARALLEL EXECUTION
azure_start_delay = app_duration × (1 - app_completion_percent/100)

// 7. TIMELINE MARKER
phase_start = previous_phase_end  // or overlapped start
phase_end = phase_start + phase_duration

// 8. VALIDATION
is_feasible = total_weeks_needed ≤ weeks_to_golive
variance = weeks_to_golive - total_weeks_needed
```

### Example Calculation (Step-by-Step)

```
Given:
  D24 answer = "App modernization required"
  D6 answer = "3 to 9 months"
  D25 answer = "On-prem physical desktops"
  D10 answer = "Yes"
  App completion % = 30%
  Go-live date = July 30, 2025 (23 weeks away)

Calculations:
  D24: score 3 × weight 10 = 30
  D6: score 2 × weight 2 = 4
  D25: score 3 × weight varies = (used for D10)
  D10: score 3 × weight (2×3=6) = 18
  
  Bucket 1 = ... + 30 + 18 + ... = 69 (example)
  Duration 1 = ROUND(69) = 69 weeks
  
  Azure delay = 69 × (1 - 0.30) = 48.3 weeks
  
  Total needed = 69 + other_buckets = ~78 weeks
  Available = 23 weeks
  
  Validation: ❌ NOT FEASIBLE (78 > 23)
  Variance: -55 weeks (need 55 more weeks!)
```

---

## 📁 File Organization

```
src/
├── utils/
│   ├── timeline/
│   │   ├── richard-timeline-engine.js   ← CORE ENGINE
│   │   └── timeline-validator.js        ← TESTING UTILS
│   │
│   └── business-case/
│       ├── cost-calculator.js           ← KEEP (separate)
│       └── roi-calculator.js            ← KEEP (separate)
│
├── components/
│   ├── TimelineCalculator.jsx           ← MAJOR REWRITE
│   │
│   └── timeline/
│       ├── DiscoveryQuestions.jsx       ← NEW
│       ├── QuestionCard.jsx             ← NEW
│       ├── ProjectParameters.jsx        ← NEW
│       ├── TimelineResults.jsx          ← NEW
│       ├── GanttChart.jsx              ← NEW
│       └── ValidationReport.jsx        ← NEW
│
├── contexts/
│   └── BusinessCaseContext.jsx          ← MINOR UPDATES
│
└── data/
    ├── azure-pricing.json               ← KEEP
    └── nerdio-value-metrics.json        ← KEEP
```

---

## 🎓 Key Concepts Summary

### 1. Weighted Scoring
Each question contributes: **score (1-3) × weight (0-10) = weeks**

### 2. Dynamic Weighting
Migration questions (D10-D13): **weight = D6 × D25**

### 3. Conditional Logic
Bucket 1 formula changes based on D26 answer

### 4. Constraints
Bucket 3 minimum: **MAX(1, calculated)**

### 5. Parallel Execution
User controls: **Azure starts at X% app completion**

### 6. Validation
Check: **total weeks needed ≤ weeks available**

---

This architecture diagram shows how everything connects. The engine (`richard-timeline-engine.js`) is the brain, the UI asks questions and displays results, and the Business Case Context integrates it all with TCO/ROI calculations.

**Bottom line:** Replace `phaseOverlap.js` with `richard-timeline-engine.js`, build the UI components, integrate with context, test thoroughly, ship.
