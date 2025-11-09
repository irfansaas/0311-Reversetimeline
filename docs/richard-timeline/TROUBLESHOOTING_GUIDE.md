# Timeline Calculator - Troubleshooting Guide

**Common issues and how to fix them**

---

## 🚨 Issue 1: Calculations Don't Match Excel

### Symptoms
- Bucket durations differ by more than 0.5 weeks from Richard's example
- Test suite failing

### Possible Causes & Fixes

#### Cause 1: Question text doesn't match exactly
**Fix:**
```javascript
// ❌ WRONG - Close but not exact
answers.D24 = "Complex formats, no modernization needed"

// ✅ CORRECT - Must match exactly
answers.D24 = "Complex formats (MSI, EXE), no modernization required"
```

Check: Option strings are **case-sensitive** and must match character-for-character.

#### Cause 2: Migration questions (D10-D13) calculated before D6 & D25
**Fix:**
```javascript
// ❌ WRONG ORDER
const scores = {};
Object.keys(QUESTIONS).forEach(qId => {
  scores[qId] = scoreQuestion(qId, answers[qId]);
});

// ✅ CORRECT ORDER
const scores = {};
// FIRST: Score D6 and D25
scores.D6 = scoreQuestion('D6', answers.D6);
scores.D25 = scoreQuestion('D25', answers.D25);

// THEN: Score all others (including D10-D13)
Object.keys(QUESTIONS).forEach(qId => {
  if (qId !== 'D6' && qId !== 'D25') {
    scores[qId] = scoreQuestion(qId, answers[qId], scores.D6, scores.D25);
  }
});
```

#### Cause 3: Bucket 1 conditional logic not implemented
**Fix:**
```javascript
// ❌ WRONG - Always uses same formula
bucket1 = SUM(D8, D9, D10-13, D17, D23-29);

// ✅ CORRECT - Conditional based on D26
if (answers.D26 === 'No') {
  bucket1 = SUM(D23, D24, D27, D28, D29); // 5 questions
} else {
  bucket1 = SUM(D8, D9, D10-13, D17, D23, D24, D26-29); // 13 questions
}
```

#### Cause 4: Rounding at wrong step
**Fix:**
```javascript
// ❌ WRONG - Round individual scores
const score = Math.round(D8.score * D8.weight);

// ✅ CORRECT - Round bucket complexity
const bucket1Complexity = D8.weighted + D9.weighted + ...;
const bucket1Duration = Math.round(bucket1Complexity);
```

#### Cause 5: Bucket 3 minimum not enforced
**Fix:**
```javascript
// ❌ WRONG
bucket3Duration = Math.round(bucket3Complexity);

// ✅ CORRECT
bucket3Duration = Math.max(1, Math.round(bucket3Complexity));
```

---

## 🚨 Issue 2: App Completion Percentage Not Working

### Symptoms
- Azure prep always starts at same time regardless of slider value
- Parallel execution doesn't reflect user input

### Fix

**Check the formula:**
```javascript
// ❌ WRONG - Fixed 50%
const azureDelay = appDuration * 0.5;

// ✅ CORRECT - User controlled
const azureDelay = appDuration * (1 - appCompletionPercent/100);

// Verify with examples:
// If appDuration = 16 weeks:
//   0% complete: delay = 16 * (1 - 0) = 16 weeks (wait for all apps)
//   30% complete: delay = 16 * (1 - 0.30) = 11.2 weeks
//   50% complete: delay = 16 * (1 - 0.50) = 8 weeks
//   100% complete: delay = 16 * (1 - 1) = 0 weeks (start immediately)
```

---

## 🚨 Issue 3: Migration Questions Give Wrong Results

### Symptoms
- D10-D13 weighted scores are wrong
- Total timeline much shorter/longer than expected when migration questions are "Yes"

### Fix

**Ensure dynamic weighting:**
```javascript
// ❌ WRONG - Using fixed weight from QUESTIONS definition
const d10Weight = QUESTIONS.D10.weight; // This is 'CALCULATED' string!

// ✅ CORRECT - Calculate weight from D6 × D25
function scoreQuestion(questionId, answer, d6Score, d25Score) {
  const question = QUESTIONS[questionId];
  
  if (question.isYesNo) {
    const score = answer === 'Yes' ? question.yesScore : question.noScore;
    const weight = d6Score.score * d25Score.score; // CALCULATE IT
    return {
      score,
      weight,
      weighted: score * weight
    };
  }
  
  // ... regular scoring
}
```

**Test it:**
```javascript
const d6 = scoreQuestion('D6', '3 to 9 months');
const d25 = scoreQuestion('D25', 'On-prem physical desktops to cloud VDI (Net/New DAAS)');
const d10 = scoreQuestion('D10', 'Yes', d6, d25);

console.log('D6 score:', d6.score); // Should be 2
console.log('D25 score:', d25.score); // Should be 3
console.log('D10 weight:', d10.weight); // Should be 6 (2 × 3)
console.log('D10 weighted:', d10.weighted); // Should be 18 (3 × 6)
```

---

## 🚨 Issue 4: Timeline Validation Always Shows "Feasible"

### Symptoms
- Even impossible timelines show as feasible
- Validation doesn't match reality

### Fix

**Check weeks calculation:**
```javascript
// ❌ WRONG - Comparing wrong things
const isValid = bucket1 + bucket2 + ... <= goLiveDate;

// ✅ CORRECT - Compare total weeks needed vs available
const today = new Date();
const goLive = new Date(goLiveDate);
const msToGoLive = goLive - today;
const weeksToGoLive = msToGoLive / (1000 * 60 * 60 * 24 * 7);

const totalWeeksNeeded = Math.abs(timeline.markers.appTransformStart);

const isValid = totalWeeksNeeded <= weeksToGoLive;
```

---

## 🚨 Issue 5: React Component Not Re-rendering

### Symptoms
- Answers update but results don't change
- UI doesn't reflect new calculations

### Fix

**Ensure state updates trigger re-calculation:**
```javascript
// ❌ WRONG - Mutating state directly
answers.D24 = newValue; // React won't detect this

// ✅ CORRECT - Create new object
setAnswers(prev => ({
  ...prev,
  D24: newValue
}));

// And trigger calculation
useEffect(() => {
  if (Object.keys(answers).length === 21 && goLiveDate) {
    const results = calculateRichardTimeline(answers, goLiveDate, appCompletionPercent);
    setResults(results);
  }
}, [answers, goLiveDate, appCompletionPercent]);
```

---

## 🚨 Issue 6: "Cannot read property 'score' of undefined"

### Symptoms
- Error when accessing question scores
- Crashes during calculation

### Causes & Fixes

#### Cause 1: Question not answered
**Fix:**
```javascript
// ❌ WRONG - No validation
const d8Weighted = scores.D8.weighted;

// ✅ CORRECT - Validate first
const d8Weighted = scores.D8?.weighted || 0;

// OR better: Validate before calculation
if (Object.keys(answers).length < 21) {
  console.error('Not all questions answered');
  return null;
}
```

#### Cause 2: Invalid question ID
**Fix:**
```javascript
// ❌ WRONG - Typo in question ID
const score = scoreQuestion('D08', answer); // Leading zero!

// ✅ CORRECT - Use exact ID
const score = scoreQuestion('D8', answer);
```

---

## 🚨 Issue 7: Gantt Chart Phases Overlap Incorrectly

### Symptoms
- Visual timeline shows phases in wrong order
- Phases overlap when they shouldn't
- Azure prep appears before app transformation

### Fix

**Check timeline marker calculations:**
```javascript
// All markers are NEGATIVE weeks (counting backwards from go-live)
const markers = {
  appTransformStart: -weeksToGoLive,
  appTransformFinish: -weeksToGoLive + bucket1,
  azurePrepStart: -weeksToGoLive + azureStartDelay,
  azurePrepFinish: -weeksToGoLive + azureStartDelay + bucket2,
  // ... etc
};

// For Gantt visualization, convert to positive positions:
const minWeek = Math.min(...allMarkers); // Most negative
const phaseStartPercent = ((phase.startWeek - minWeek) / totalRange) * 100;
```

---

## 🚨 Issue 8: Performance Issues / Slow Calculations

### Symptoms
- UI freezes when calculating
- Takes >1 second to update

### Causes & Fixes

#### Cause 1: Recalculating on every keystroke
**Fix:**
```javascript
// ❌ WRONG - Calculate on every change
onChange={(e) => {
  setAnswers({...answers, [qId]: e.target.value});
  calculate(); // TOO FREQUENT
}}

// ✅ CORRECT - Debounce or calculate on button click
onChange={(e) => {
  setAnswers({...answers, [qId]: e.target.value});
  // Calculate only when user clicks "Calculate" button
}}
```

#### Cause 2: Expensive operations in render
**Fix:**
```javascript
// ❌ WRONG - Calculate in render
function MyComponent() {
  const result = calculateRichardTimeline(answers, goLiveDate, percent); // Every render!
  
  return <div>...</div>;
}

// ✅ CORRECT - Calculate in effect or callback
function MyComponent() {
  const [result, setResult] = useState(null);
  
  const handleCalculate = () => {
    const newResult = calculateRichardTimeline(answers, goLiveDate, percent);
    setResult(newResult);
  };
  
  return <div>...</div>;
}
```

---

## 🚨 Issue 9: Exported PDF/Document is Incorrect

### Symptoms
- PDF shows wrong dates
- Gantt chart doesn't match screen
- Missing phases

### Fix

**Ensure fresh calculation before export:**
```javascript
// ❌ WRONG - Export stale results
const exportToPDF = () => {
  generatePDF(results); // Might be outdated
};

// ✅ CORRECT - Recalculate before export
const exportToPDF = () => {
  const freshResults = calculateRichardTimeline(
    answers,
    goLiveDate,
    appCompletionPercent
  );
  generatePDF(freshResults);
};
```

---

## 🚨 Issue 10: localStorage Migration Fails

### Symptoms
- Old scenarios won't convert
- Data loss after migration
- "JSON parse error"

### Fix

**Use the migration helper safely:**
```javascript
// ALWAYS backup first
const backup = localStorage.getItem('timelineScenarios');
console.log('Backup:', backup);
localStorage.setItem('timelineScenarios_BACKUP', backup);

// Then migrate
try {
  const result = migrateLocalStorage();
  console.log('Migration result:', result);
  
  if (result.errors.length > 0) {
    console.error('Some scenarios failed:', result.errors);
    // Don't delete old data yet
  } else {
    console.log('✅ Migration successful');
    // Can safely delete old data
  }
} catch (error) {
  console.error('Migration failed:', error);
  // Restore from backup if needed
}
```

---

## 🔍 Debugging Checklist

When calculations are wrong, check these in order:

1. **[ ] Question text matches exactly**
   - Print out `answers` object
   - Compare to QUESTIONS definition

2. **[ ] D6 and D25 scored first**
   - Check scoring function order
   - Verify D10-D13 use calculated weight

3. **[ ] Bucket 1 conditional logic**
   - Log D26 answer
   - Log which formula is used

4. **[ ] Rounding at correct step**
   - Log bucket complexity (unrounded)
   - Log bucket duration (rounded)

5. **[ ] Bucket 3 minimum enforced**
   - Log Bucket 3 complexity
   - Verify duration ≥ 1

6. **[ ] Parallel execution formula**
   - Log app duration
   - Log app completion %
   - Log azure start delay
   - Verify: delay = duration × (1 - percent/100)

7. **[ ] Timeline marker calculations**
   - All markers should be negative (relative to go-live)
   - Later phases should have less negative values

8. **[ ] Validation logic**
   - Log weeks to go-live
   - Log total weeks needed
   - Compare the two

---

## 🛠️ Debug Logging Template

Add this to your calculation function:

```javascript
export function calculateRichardTimeline(answers, goLiveDate, appCompletionPercent) {
  const DEBUG = true; // Toggle debug mode
  
  if (DEBUG) console.log('=== CALCULATION START ===');
  
  // Step 1
  const scores = scoreAllQuestions(answers);
  if (DEBUG) console.log('Scores:', scores);
  
  // Step 2
  const buckets = calculateBucketComplexities(scores, answers);
  if (DEBUG) console.log('Bucket complexities:', buckets);
  
  // Step 3
  const durations = {
    bucket1: Math.round(buckets.bucket1),
    bucket2: Math.round(buckets.bucket2),
    bucket3: Math.max(1, Math.round(buckets.bucket3)),
    bucket4: Math.round(buckets.bucket4),
    bucket5: Math.round(buckets.bucket5),
    bucket6: Math.round(buckets.bucket6)
  };
  if (DEBUG) console.log('Durations:', durations);
  
  // Step 4
  const parallelExecution = calculateParallelExecution(
    durations.bucket1,
    appCompletionPercent
  );
  if (DEBUG) console.log('Parallel execution:', parallelExecution);
  
  // Step 5
  const weeksToGoLive = calculateWeeksToGoLive(goLiveDate);
  if (DEBUG) console.log('Weeks to go-live:', weeksToGoLive);
  
  // Step 6
  const timeline = calculateTimelineMarkers(durations, parallelExecution, weeksToGoLive);
  if (DEBUG) console.log('Timeline:', timeline);
  
  // Step 7
  const validation = validateProjectTimeline(timeline, weeksToGoLive);
  if (DEBUG) console.log('Validation:', validation);
  
  if (DEBUG) console.log('=== CALCULATION END ===');
  
  return {
    scores,
    buckets,
    durations,
    parallelExecution,
    timeline,
    validation,
    metadata: {
      goLiveDate,
      today: new Date(),
      weeksToGoLive,
      appCompletionPercent,
      calculatedAt: new Date().toISOString()
    }
  };
}
```

---

## 📞 Getting Help

### Before Asking for Help

1. **[ ] Check this troubleshooting guide**
2. **[ ] Run the test suite** (`timeline-validator.test.js`)
3. **[ ] Enable debug logging** (see template above)
4. **[ ] Compare your output to Richard's example**
5. **[ ] Check for typos in question text**

### When Asking for Help

Provide:
1. Your answers object (JSON)
2. Your go-live date
3. Your app completion %
4. Expected result (from Excel)
5. Actual result (from your code)
6. Debug logs
7. Variance calculation

### Contact

- **Richard** - For Excel validation and business logic questions
- **UK Sellers** (Rob, Richard P, Gav) - For real-world usage questions
- **Your team** - For React/implementation questions

---

## ✅ Verification Checklist

After fixing any issue, verify:

- [ ] Richard example test passes (<0.5 week variance)
- [ ] All 7 core tests pass
- [ ] App modernization adds ~8 weeks
- [ ] Backend connectivity affects Bucket 1
- [ ] Minimum 1 week in Bucket 3
- [ ] App completion % changes Azure delay
- [ ] Migration questions use D6 × D25
- [ ] Timeline validation works correctly
- [ ] UI updates properly
- [ ] Export generates correct data

---

**Most common mistake:** Question text doesn't match exactly. Always double-check the option strings!
