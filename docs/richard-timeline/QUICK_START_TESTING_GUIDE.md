# Richard Timeline Engine - Quick Start Testing Guide

**Purpose:** Validate the new calculation engine produces results matching Richard's Excel

---

## Immediate Test (5 minutes)

Copy this into your browser console or Node.js:

```javascript
// 1. Import the engine
import { calculateRichardTimeline, QUESTIONS } from './richard-timeline-engine.js';

// 2. Richard's EXACT example from Excel
const testAnswers = {
  D6: '3 to 9 months',
  D8: '1,000 to 5,000 users',
  D9: '5 to 10 use cases',
  D10: 'Yes',
  D11: 'No',
  D12: 'No',
  D13: 'No',
  D15: 'No defined cloud strategy yet',
  D16: 'No, we are new to Azure',
  D17: 'Windows 10 multisession or Windows Server 2016',
  D19: 'Standard corporate processes, less than 1 week per change request',
  D21: 'We have challenging security processes',
  D23: '100 to 300 applications',
  D24: 'Complex formats (MSI, EXE), no modernization required',
  D25: 'On-prem physical desktops to cloud VDI (Net/New DAAS)',
  D26: 'Yes, but there are few and/or they are low priority/latency insensitive',
  D27: 'Yes, needs RemoteFX plus 3rd party software',
  D28: 'Not really tested',
  D29: '1 to 2 years ago'
};

// 3. Run calculation
const result = calculateRichardTimeline(
  testAnswers,
  new Date('2025-07-30'), // Go-live date
  30 // 30% app completion before Azure prep
);

// 4. Check results
console.log('=== DURATION RESULTS ===');
console.log('Bucket 1 (App Transform):', result.durations.bucket1, 'weeks');
console.log('Bucket 2 (Azure Prep):', result.durations.bucket2, 'weeks');
console.log('Bucket 3 (Nerdio Deploy):', result.durations.bucket3, 'weeks');
console.log('Bucket 4 (AVD Design):', result.durations.bucket4, 'weeks');
console.log('Bucket 5 (Pilot):', result.durations.bucket5, 'weeks');
console.log('Bucket 6 (Migration):', result.durations.bucket6, 'weeks');

// 5. Expected results from Richard's Excel
const expected = {
  bucket1: 16,
  bucket2: 19,
  bucket3: 9,
  bucket4: 5,
  bucket5: 6,
  bucket6: 2
};

// 6. Validate variance
console.log('\n=== VARIANCE CHECK ===');
Object.keys(expected).forEach(bucket => {
  const variance = Math.abs(result.durations[bucket] - expected[bucket]);
  const status = variance < 0.5 ? '✅ PASS' : '❌ FAIL';
  console.log(`${bucket}: ${status} (${variance.toFixed(2)} weeks variance)`);
});

// 7. Check timeline validation
console.log('\n=== TIMELINE VALIDATION ===');
console.log('Is feasible?', result.validation.isValid);
console.log('Weeks needed:', result.validation.totalWeeksNeeded);
console.log('Weeks available:', result.validation.weeksAvailable);
console.log('Buffer:', result.validation.variance.toFixed(1), 'weeks');
```

---

## Expected Output

If the engine is working correctly, you should see:

```
=== DURATION RESULTS ===
Bucket 1 (App Transform): 16 weeks
Bucket 2 (Azure Prep): 19 weeks
Bucket 3 (Nerdio Deploy): 9 weeks
Bucket 4 (AVD Design): 5 weeks
Bucket 5 (Pilot): 6 weeks
Bucket 6 (Migration): 2 weeks

=== VARIANCE CHECK ===
bucket1: ✅ PASS (0.00 weeks variance)
bucket2: ✅ PASS (0.00 weeks variance)
bucket3: ✅ PASS (0.00 weeks variance)
bucket4: ✅ PASS (0.00 weeks variance)
bucket5: ✅ PASS (0.00 weeks variance)
bucket6: ✅ PASS (0.00 weeks variance)

=== TIMELINE VALIDATION ===
Is feasible? true
Weeks needed: 23
Weeks available: 23.3
Buffer: 0.3 weeks
```

---

## Test Case 2: App Modernization Impact

Test the MASSIVE weight of app modernization:

```javascript
const testModernization = {
  ...testAnswers,
  D24: 'Application modernization will be required' // Changes weight from 2 to 10!
};

const resultModern = calculateRichardTimeline(
  testModernization,
  new Date('2025-07-30'),
  30
);

console.log('WITHOUT modernization:', result.durations.bucket1, 'weeks');
console.log('WITH modernization:', resultModern.durations.bucket1, 'weeks');
console.log('Difference:', resultModern.durations.bucket1 - result.durations.bucket1, 'weeks');

// Expected: ~8-10 weeks difference (weight goes from 2 to 10)
```

---

## Test Case 3: Backend Connectivity Conditional Logic

Test Bucket 1's conditional formula:

```javascript
// Test WITHOUT backend resources
const testNoBackend = {
  ...testAnswers,
  D26: 'No'
};

const resultNoBackend = calculateRichardTimeline(
  testNoBackend,
  new Date('2025-07-30'),
  30
);

// Test WITH backend resources (latency sensitive)
const testWithBackend = {
  ...testAnswers,
  D26: 'Yes, these are core LOB apps that are latency sensitive'
};

const resultWithBackend = calculateRichardTimeline(
  testWithBackend,
  new Date('2025-07-30'),
  30
);

console.log('NO backend:', resultNoBackend.durations.bucket1, 'weeks');
console.log('WITH backend (latency sensitive):', resultWithBackend.durations.bucket1, 'weeks');
console.log('Difference:', resultWithBackend.durations.bucket1 - resultNoBackend.durations.bucket1, 'weeks');

// Expected: WITH backend should be 8-12 weeks MORE
// Because it includes D8, D9, D10-D13, D17, D26 (not just D23, D24, D27-D29)
```

---

## Test Case 4: App Completion Percentage

Test parallel execution logic:

```javascript
// Test at 0% app completion (Azure waits for full app phase)
const result0 = calculateRichardTimeline(
  testAnswers,
  new Date('2025-07-30'),
  0
);

// Test at 50% app completion
const result50 = calculateRichardTimeline(
  testAnswers,
  new Date('2025-07-30'),
  50
);

// Test at 100% app completion (Azure starts immediately)
const result100 = calculateRichardTimeline(
  testAnswers,
  new Date('2025-07-30'),
  100
);

console.log('App completion 0%:');
console.log('  Azure start delay:', result0.parallelExecution.azureStartDelay.toFixed(1), 'weeks');

console.log('App completion 50%:');
console.log('  Azure start delay:', result50.parallelExecution.azureStartDelay.toFixed(1), 'weeks');

console.log('App completion 100%:');
console.log('  Azure start delay:', result100.parallelExecution.azureStartDelay.toFixed(1), 'weeks');

// Expected pattern:
// 0%: Delay = bucket1 duration (16 weeks)
// 50%: Delay = bucket1 × 0.5 (8 weeks)
// 100%: Delay = 0 weeks (Azure starts immediately)
```

---

## Test Case 5: Minimum 1 Week Constraint (Bucket 3)

Test that Nerdio deployment is never less than 1 week:

```javascript
// Make change control and security SUPER simple
const testMinimal = {
  ...testAnswers,
  D19: 'Standard corporate processes, less than 1 week per change request',
  D21: 'We will accept OOTB default'
};

const resultMinimal = calculateRichardTimeline(
  testMinimal,
  new Date('2025-07-30'),
  30
);

console.log('Bucket 3 complexity:', resultMinimal.buckets.bucket3);
console.log('Bucket 3 duration:', resultMinimal.durations.bucket3, 'weeks');

// Expected: Even if complexity is 0.5, duration should be 1 week (minimum)
```

---

## Test Case 6: Migration Question Dynamic Weighting

Test that D10-D13 weight = D6 × D25:

```javascript
console.log('=== MIGRATION QUESTION WEIGHTING ===');

// Get D6 and D25 scores
const d6Score = result.scores.D6.score; // Should be 2 (3-9 months)
const d25Score = result.scores.D25.score; // Should be 3 (on-prem physical)

console.log('D6 score:', d6Score);
console.log('D25 score:', d25Score);
console.log('Expected D10 weight:', d6Score * d25Score);

// Check D10 actual weight
const d10Weight = result.scores.D10.weight;
console.log('D10 actual weight:', d10Weight);
console.log('Match:', d10Weight === (d6Score * d25Score) ? '✅' : '❌');

// D10 answered "Yes" (score 3)
console.log('\nD10 weighted score:', result.scores.D10.weighted);
console.log('Expected:', 3 * (d6Score * d25Score));
console.log('Match:', result.scores.D10.weighted === (3 * d6Score * d25Score) ? '✅' : '❌');
```

---

## Test Case 7: Timeline Feasibility Validation

Test different go-live dates:

```javascript
// Very tight timeline
const tightResult = calculateRichardTimeline(
  testAnswers,
  new Date('2025-05-01'), // Only 10 weeks from Feb 20
  30
);

console.log('TIGHT TIMELINE:');
console.log('  Weeks available:', tightResult.validation.weeksAvailable);
console.log('  Weeks needed:', tightResult.validation.totalWeeksNeeded);
console.log('  Is feasible?', tightResult.validation.isValid ? '✅' : '❌');
console.log('  Variance:', tightResult.validation.variance.toFixed(1), 'weeks');

// Comfortable timeline
const comfortableResult = calculateRichardTimeline(
  testAnswers,
  new Date('2025-12-31'), // Many months away
  30
);

console.log('\nCOMFORTABLE TIMELINE:');
console.log('  Weeks available:', comfortableResult.validation.weeksAvailable);
console.log('  Weeks needed:', comfortableResult.validation.totalWeeksNeeded);
console.log('  Is feasible?', comfortableResult.validation.isValid ? '✅' : '✅');
console.log('  Buffer:', comfortableResult.validation.variance.toFixed(1), 'weeks');
```

---

## Comprehensive Test Suite

Run ALL tests at once:

```javascript
function runComprehensiveTests() {
  console.log('🧪 COMPREHENSIVE TEST SUITE\n');
  
  const tests = [
    {
      name: 'Richard Example Case',
      test: () => {
        const result = calculateRichardTimeline(testAnswers, new Date('2025-07-30'), 30);
        const expected = { bucket1: 16, bucket2: 19, bucket3: 9, bucket4: 5, bucket5: 6, bucket6: 2 };
        return Object.keys(expected).every(k => 
          Math.abs(result.durations[k] - expected[k]) < 0.5
        );
      }
    },
    {
      name: 'App Modernization Impact',
      test: () => {
        const baseline = calculateRichardTimeline(testAnswers, new Date('2025-07-30'), 30);
        const modern = calculateRichardTimeline(
          {...testAnswers, D24: 'Application modernization will be required'},
          new Date('2025-07-30'),
          30
        );
        return modern.durations.bucket1 > baseline.durations.bucket1 + 7; // At least 8 weeks more
      }
    },
    {
      name: 'Backend Conditional Logic',
      test: () => {
        const noBackend = calculateRichardTimeline(
          {...testAnswers, D26: 'No'},
          new Date('2025-07-30'),
          30
        );
        const yesBackend = calculateRichardTimeline(
          {...testAnswers, D26: 'Yes, these are core LOB apps that are latency sensitive'},
          new Date('2025-07-30'),
          30
        );
        return yesBackend.durations.bucket1 > noBackend.durations.bucket1;
      }
    },
    {
      name: 'Minimum 1 Week Bucket 3',
      test: () => {
        const minimal = calculateRichardTimeline(
          {
            ...testAnswers,
            D19: 'Standard corporate processes, less than 1 week per change request',
            D21: 'We will accept OOTB default'
          },
          new Date('2025-07-30'),
          30
        );
        return minimal.durations.bucket3 >= 1;
      }
    },
    {
      name: 'App Completion % Logic',
      test: () => {
        const r0 = calculateRichardTimeline(testAnswers, new Date('2025-07-30'), 0);
        const r50 = calculateRichardTimeline(testAnswers, new Date('2025-07-30'), 50);
        const r100 = calculateRichardTimeline(testAnswers, new Date('2025-07-30'), 100);
        return (
          r0.parallelExecution.azureStartDelay > r50.parallelExecution.azureStartDelay &&
          r50.parallelExecution.azureStartDelay > r100.parallelExecution.azureStartDelay
        );
      }
    },
    {
      name: 'Migration Weight Calculation',
      test: () => {
        const result = calculateRichardTimeline(testAnswers, new Date('2025-07-30'), 30);
        const expectedWeight = result.scores.D6.score * result.scores.D25.score;
        return result.scores.D10.weight === expectedWeight;
      }
    },
    {
      name: 'Timeline Validation',
      test: () => {
        const tight = calculateRichardTimeline(testAnswers, new Date('2025-05-01'), 30);
        const comfortable = calculateRichardTimeline(testAnswers, new Date('2025-12-31'), 30);
        return !tight.validation.isValid && comfortable.validation.isValid;
      }
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  tests.forEach(({name, test}) => {
    try {
      const result = test();
      if (result) {
        console.log(`✅ ${name}`);
        passed++;
      } else {
        console.log(`❌ ${name}`);
        failed++;
      }
    } catch (error) {
      console.log(`💥 ${name} - ERROR: ${error.message}`);
      failed++;
    }
  });
  
  console.log(`\n📊 RESULTS: ${passed}/${tests.length} passed, ${failed}/${tests.length} failed`);
  
  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED - Engine is ready!');
  } else {
    console.log('⚠️  Some tests failed - review implementation');
  }
}

// Run it!
runComprehensiveTests();
```

---

## Integration Test with React

Test in your React component:

```jsx
// In TimelineCalculator.jsx
import { calculateRichardTimeline } from '../utils/timeline/richard-timeline-engine';

function TimelineCalculator() {
  const handleTestButton = () => {
    const testAnswers = {
      D6: '3 to 9 months',
      D8: '1,000 to 5,000 users',
      // ... all 21 questions
    };
    
    const result = calculateRichardTimeline(
      testAnswers,
      new Date('2025-07-30'),
      30
    );
    
    console.log('Result:', result);
    
    // Verify against expected
    const variance = {
      bucket1: Math.abs(result.durations.bucket1 - 16),
      bucket2: Math.abs(result.durations.bucket2 - 19),
      bucket3: Math.abs(result.durations.bucket3 - 9),
      bucket4: Math.abs(result.durations.bucket4 - 5),
      bucket5: Math.abs(result.durations.bucket5 - 6),
      bucket6: Math.abs(result.durations.bucket6 - 2)
    };
    
    const maxVariance = Math.max(...Object.values(variance));
    
    if (maxVariance < 0.5) {
      alert('✅ Engine working correctly! Variance < 0.5 weeks');
    } else {
      alert(`❌ Engine has issues. Max variance: ${maxVariance.toFixed(2)} weeks`);
    }
  };
  
  return (
    <div>
      <button onClick={handleTestButton}>Test Engine</button>
    </div>
  );
}
```

---

## Debugging Checklist

If tests fail, check:

1. **Question IDs match exactly** (D6, D8, D9, etc.)
2. **Option text matches exactly** (case-sensitive)
3. **Migration questions (D10-D13)** calculate weight as D6 × D25
4. **Bucket 1 conditional** uses correct formula based on D26
5. **Bucket 3 minimum** enforces 1 week floor
6. **Rounding** happens AFTER bucket complexity calculation

---

## Performance Benchmark

The engine should be FAST:

```javascript
console.time('Calculation');
for (let i = 0; i < 1000; i++) {
  calculateRichardTimeline(testAnswers, new Date('2025-07-30'), 30);
}
console.timeEnd('Calculation');

// Expected: <100ms for 1000 calculations
```

---

## Next Steps After Testing

1. ✅ All tests pass → Proceed to UI development
2. ❌ Some tests fail → Debug using variance reports
3. 📊 Tests pass but slow → Optimize calculation logic

---

## Getting Help

If tests fail:

1. Check the console output for variance details
2. Compare your bucket calculations to Excel
3. Use `console.log(result.scores)` to see all question scores
4. Use `console.log(result.buckets)` to see bucket complexities

---

**REMEMBER:** <0.5 week variance is the success criteria. Richard validated his Excel against 7 real customer scenarios. Your engine must match that accuracy.
