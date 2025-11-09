/**
 * Timeline Engine Validation Test Suite
 * 
 * Drop this file into: src/utils/timeline/timeline-validator.test.js
 * Run with: npm test
 * 
 * Tests the richard-timeline-engine.js against Richard's Excel examples
 */

import { calculateRichardTimeline, QUESTIONS, BUCKETS } from './richard-timeline-engine';

// ============================================================================
// TEST DATA - Richard's EXACT Example from Excel
// ============================================================================

export const RICHARD_EXAMPLE_CASE = {
  name: 'Richard Example - Moderate Complexity',
  answers: {
    D6: '3 to 9 months',
    D8: '1,000 to 5,000 users',
    D9: '5 to 10 use cases',
    D10: 'Yes', // On-prem physical to cloud
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
  },
  goLiveDate: new Date('2025-07-30'),
  appCompletionPercent: 30,
  expectedResults: {
    bucket1: 16,
    bucket2: 19,
    bucket3: 9,
    bucket4: 5,
    bucket5: 6,
    bucket6: 2,
    totalWeeks: 23
  }
};

// Additional test cases for edge conditions
export const TEST_CASES = {
  SIMPLE_PROJECT: {
    name: 'Simple Project - Azure Native',
    answers: {
      D6: 'More than 12 months',
      D8: 'Less than 1,000 users',
      D9: '3 to 5 use cases',
      D10: 'No',
      D11: 'No',
      D12: 'No',
      D13: 'No',
      D15: 'Azure',
      D16: 'Yes',
      D17: 'Windows 11 multisession or Windows Server 2019 or higher',
      D19: 'Standard corporate processes, less than 1 week per change request',
      D21: 'We will accept OOTB default',
      D23: 'Less than 100 applications',
      D24: 'All modern format, minimal/no migration work required',
      D25: 'On-prem physical desktops to cloud VDI (Net/New DAAS)',
      D26: 'No',
      D27: 'No',
      D28: 'Yes, they work',
      D29: 'Recently'
    },
    goLiveDate: new Date('2026-01-01'),
    appCompletionPercent: 50,
    expectedRanges: {
      bucket1: { min: 5, max: 10 },
      bucket2: { min: 3, max: 6 },
      bucket3: { min: 1, max: 2 },
      totalWeeks: { min: 15, max: 25 }
    }
  },
  
  COMPLEX_PROJECT: {
    name: 'Complex Project - App Modernization Required',
    answers: {
      D6: 'Less than 3 months',
      D8: 'More than 5,000 users',
      D9: '10 or more use cases',
      D10: 'Yes',
      D11: 'No',
      D12: 'No',
      D13: 'No',
      D15: 'GCP or AWS',
      D16: 'No, we are new to Azure',
      D17: 'Windows Server 2012 or below/Win 7 or 8 (OS migration needed)',
      D19: 'Complex change processes, a month per change request',
      D21: 'We have challenging security processes',
      D23: 'More than 300 applications',
      D24: 'Application modernization will be required', // Weight 10!
      D25: 'On-prem physical desktops to cloud VDI (Net/New DAAS)',
      D26: 'Yes, these are core LOB apps that are latency sensitive',
      D27: 'Yes, needs RemoteFX plus 3rd party software',
      D28: 'Not really tested',
      D29: '2 or more years'
    },
    goLiveDate: new Date('2025-12-31'),
    appCompletionPercent: 30,
    expectedRanges: {
      bucket1: { min: 35, max: 50 }, // App modernization adds 30 weeks!
      bucket2: { min: 20, max: 30 },
      bucket3: { min: 6, max: 10 },
      totalWeeks: { min: 70, max: 100 }
    }
  }
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate calculated results against expected results
 * @param {Object} calculated - Results from calculateRichardTimeline
 * @param {Object} expected - Expected bucket durations
 * @param {number} tolerance - Acceptable variance in weeks (default 0.5)
 * @returns {Object} Validation results
 */
export function validateAgainstExpected(calculated, expected, tolerance = 0.5) {
  const variance = {
    bucket1: Math.abs(calculated.durations.bucket1 - expected.bucket1),
    bucket2: Math.abs(calculated.durations.bucket2 - expected.bucket2),
    bucket3: Math.abs(calculated.durations.bucket3 - expected.bucket3),
    bucket4: Math.abs(calculated.durations.bucket4 - expected.bucket4),
    bucket5: Math.abs(calculated.durations.bucket5 - expected.bucket5),
    bucket6: Math.abs(calculated.durations.bucket6 - expected.bucket6)
  };
  
  const maxVariance = Math.max(...Object.values(variance));
  const passed = maxVariance < tolerance;
  
  const details = Object.entries(variance).map(([bucket, v]) => ({
    bucket,
    expected: expected[bucket],
    calculated: calculated.durations[bucket],
    variance: v,
    passed: v < tolerance,
    status: v < tolerance ? '✅' : '❌'
  }));
  
  return {
    passed,
    maxVariance,
    tolerance,
    variance,
    details,
    summary: passed 
      ? `✅ PASS - All buckets within ${tolerance} week tolerance`
      : `❌ FAIL - Max variance ${maxVariance.toFixed(2)} weeks exceeds ${tolerance} week tolerance`
  };
}

/**
 * Validate against ranges (for cases where we don't have exact expected values)
 */
export function validateAgainstRanges(calculated, expectedRanges) {
  const results = {};
  
  Object.entries(expectedRanges).forEach(([key, range]) => {
    const value = key === 'totalWeeks' 
      ? calculated.validation.totalWeeksNeeded 
      : calculated.durations[key];
    
    results[key] = {
      value,
      min: range.min,
      max: range.max,
      passed: value >= range.min && value <= range.max,
      status: (value >= range.min && value <= range.max) ? '✅' : '❌'
    };
  });
  
  const allPassed = Object.values(results).every(r => r.passed);
  
  return {
    passed: allPassed,
    results,
    summary: allPassed 
      ? '✅ PASS - All values within expected ranges'
      : '❌ FAIL - Some values outside expected ranges'
  };
}

// ============================================================================
// TEST SUITE
// ============================================================================

describe('Richard Timeline Engine - Validation Tests', () => {
  
  test('Richard Example Case - Exact Match', () => {
    const result = calculateRichardTimeline(
      RICHARD_EXAMPLE_CASE.answers,
      RICHARD_EXAMPLE_CASE.goLiveDate,
      RICHARD_EXAMPLE_CASE.appCompletionPercent
    );
    
    const validation = validateAgainstExpected(
      result,
      RICHARD_EXAMPLE_CASE.expectedResults,
      0.5 // 0.5 week tolerance
    );
    
    console.log('\n=== RICHARD EXAMPLE VALIDATION ===');
    console.log(validation.summary);
    validation.details.forEach(d => {
      console.log(`${d.status} ${d.bucket}: Expected ${d.expected}w, Got ${d.calculated}w (variance: ${d.variance.toFixed(2)}w)`);
    });
    
    expect(validation.passed).toBe(true);
    expect(validation.maxVariance).toBeLessThan(0.5);
  });
  
  test('App Modernization Impact - Weight 10', () => {
    // Without modernization
    const baselineAnswers = {
      ...RICHARD_EXAMPLE_CASE.answers,
      D24: 'Complex formats (MSI, EXE), no modernization required' // Weight 2
    };
    
    const baseline = calculateRichardTimeline(
      baselineAnswers,
      RICHARD_EXAMPLE_CASE.goLiveDate,
      30
    );
    
    // With modernization
    const modernizationAnswers = {
      ...RICHARD_EXAMPLE_CASE.answers,
      D24: 'Application modernization will be required' // Weight 10!
    };
    
    const withModernization = calculateRichardTimeline(
      modernizationAnswers,
      RICHARD_EXAMPLE_CASE.goLiveDate,
      30
    );
    
    const difference = withModernization.durations.bucket1 - baseline.durations.bucket1;
    
    console.log('\n=== APP MODERNIZATION IMPACT ===');
    console.log(`Baseline (no modernization): ${baseline.durations.bucket1} weeks`);
    console.log(`With modernization: ${withModernization.durations.bucket1} weeks`);
    console.log(`Difference: ${difference} weeks`);
    
    // Should add approximately 8 weeks (weight difference 10 - 2 = 8)
    expect(difference).toBeGreaterThan(7);
    expect(difference).toBeLessThan(10);
  });
  
  test('Backend Connectivity Conditional Logic', () => {
    // No backend resources
    const noBackendAnswers = {
      ...RICHARD_EXAMPLE_CASE.answers,
      D26: 'No'
    };
    
    const noBackend = calculateRichardTimeline(
      noBackendAnswers,
      RICHARD_EXAMPLE_CASE.goLiveDate,
      30
    );
    
    // Yes, latency sensitive backend
    const withBackendAnswers = {
      ...RICHARD_EXAMPLE_CASE.answers,
      D26: 'Yes, these are core LOB apps that are latency sensitive'
    };
    
    const withBackend = calculateRichardTimeline(
      withBackendAnswers,
      RICHARD_EXAMPLE_CASE.goLiveDate,
      30
    );
    
    console.log('\n=== BACKEND CONNECTIVITY IMPACT ===');
    console.log(`No backend: ${noBackend.durations.bucket1} weeks`);
    console.log(`With backend (latency sensitive): ${withBackend.durations.bucket1} weeks`);
    console.log(`Difference: ${withBackend.durations.bucket1 - noBackend.durations.bucket1} weeks`);
    
    // With backend should be significantly longer (uses 13 questions vs 5)
    expect(withBackend.durations.bucket1).toBeGreaterThan(noBackend.durations.bucket1);
  });
  
  test('Minimum 1 Week Constraint - Bucket 3', () => {
    // Super simple environment
    const minimalAnswers = {
      ...RICHARD_EXAMPLE_CASE.answers,
      D19: 'Standard corporate processes, less than 1 week per change request',
      D21: 'We will accept OOTB default'
    };
    
    const result = calculateRichardTimeline(
      minimalAnswers,
      RICHARD_EXAMPLE_CASE.goLiveDate,
      30
    );
    
    console.log('\n=== MINIMUM CONSTRAINT TEST ===');
    console.log(`Bucket 3 complexity: ${result.buckets.bucket3}`);
    console.log(`Bucket 3 duration: ${result.durations.bucket3} weeks`);
    
    // Should never be less than 1 week
    expect(result.durations.bucket3).toBeGreaterThanOrEqual(1);
  });
  
  test('App Completion Percentage Logic', () => {
    const results = {
      '0%': calculateRichardTimeline(RICHARD_EXAMPLE_CASE.answers, RICHARD_EXAMPLE_CASE.goLiveDate, 0),
      '30%': calculateRichardTimeline(RICHARD_EXAMPLE_CASE.answers, RICHARD_EXAMPLE_CASE.goLiveDate, 30),
      '50%': calculateRichardTimeline(RICHARD_EXAMPLE_CASE.answers, RICHARD_EXAMPLE_CASE.goLiveDate, 50),
      '100%': calculateRichardTimeline(RICHARD_EXAMPLE_CASE.answers, RICHARD_EXAMPLE_CASE.goLiveDate, 100)
    };
    
    console.log('\n=== APP COMPLETION PERCENTAGE IMPACT ===');
    Object.entries(results).forEach(([pct, result]) => {
      console.log(`${pct}: Azure starts at week ${result.parallelExecution.azureStartDelay.toFixed(1)}`);
    });
    
    // Delays should decrease as percentage increases
    expect(results['0%'].parallelExecution.azureStartDelay).toBeGreaterThan(
      results['50%'].parallelExecution.azureStartDelay
    );
    expect(results['50%'].parallelExecution.azureStartDelay).toBeGreaterThan(
      results['100%'].parallelExecution.azureStartDelay
    );
    expect(results['100%'].parallelExecution.azureStartDelay).toBe(0);
  });
  
  test('Migration Question Dynamic Weighting', () => {
    const result = calculateRichardTimeline(
      RICHARD_EXAMPLE_CASE.answers,
      RICHARD_EXAMPLE_CASE.goLiveDate,
      30
    );
    
    const d6Score = result.scores.D6.score;
    const d25Score = result.scores.D25.score;
    const expectedWeight = d6Score * d25Score;
    const actualWeight = result.scores.D10.weight;
    
    console.log('\n=== MIGRATION QUESTION WEIGHTING ===');
    console.log(`D6 score: ${d6Score}`);
    console.log(`D25 score: ${d25Score}`);
    console.log(`Expected D10 weight: ${expectedWeight}`);
    console.log(`Actual D10 weight: ${actualWeight}`);
    
    expect(actualWeight).toBe(expectedWeight);
  });
  
  test('Timeline Validation - Tight vs Comfortable', () => {
    // Tight timeline (only 10 weeks available)
    const tight = calculateRichardTimeline(
      RICHARD_EXAMPLE_CASE.answers,
      new Date('2025-05-01'),
      30
    );
    
    // Comfortable timeline (many months)
    const comfortable = calculateRichardTimeline(
      RICHARD_EXAMPLE_CASE.answers,
      new Date('2026-01-01'),
      30
    );
    
    console.log('\n=== TIMELINE VALIDATION ===');
    console.log(`Tight: ${tight.validation.isValid ? '✅' : '❌'} (${tight.validation.weeksAvailable} weeks available, ${tight.validation.totalWeeksNeeded} needed)`);
    console.log(`Comfortable: ${comfortable.validation.isValid ? '✅' : '❌'} (${comfortable.validation.weeksAvailable} weeks available, ${comfortable.validation.totalWeeksNeeded} needed)`);
    
    expect(tight.validation.isValid).toBe(false);
    expect(comfortable.validation.isValid).toBe(true);
  });
  
  test('Simple Project - Range Validation', () => {
    const result = calculateRichardTimeline(
      TEST_CASES.SIMPLE_PROJECT.answers,
      TEST_CASES.SIMPLE_PROJECT.goLiveDate,
      TEST_CASES.SIMPLE_PROJECT.appCompletionPercent
    );
    
    const validation = validateAgainstRanges(
      result,
      TEST_CASES.SIMPLE_PROJECT.expectedRanges
    );
    
    console.log('\n=== SIMPLE PROJECT VALIDATION ===');
    console.log(validation.summary);
    Object.entries(validation.results).forEach(([key, r]) => {
      console.log(`${r.status} ${key}: ${r.value} (expected ${r.min}-${r.max})`);
    });
    
    expect(validation.passed).toBe(true);
  });
  
  test('Complex Project - Range Validation', () => {
    const result = calculateRichardTimeline(
      TEST_CASES.COMPLEX_PROJECT.answers,
      TEST_CASES.COMPLEX_PROJECT.goLiveDate,
      TEST_CASES.COMPLEX_PROJECT.appCompletionPercent
    );
    
    const validation = validateAgainstRanges(
      result,
      TEST_CASES.COMPLEX_PROJECT.expectedRanges
    );
    
    console.log('\n=== COMPLEX PROJECT VALIDATION ===');
    console.log(validation.summary);
    Object.entries(validation.results).forEach(([key, r]) => {
      console.log(`${r.status} ${key}: ${r.value} (expected ${r.min}-${r.max})`);
    });
    
    expect(validation.passed).toBe(true);
  });
});

// ============================================================================
// MANUAL TEST RUNNER (if not using Jest)
// ============================================================================

export function runAllTests() {
  console.log('🧪 RUNNING COMPREHENSIVE VALIDATION TESTS\n');
  console.log('='.repeat(60));
  
  const tests = [
    { name: 'Richard Example Case', fn: testRichardExample },
    { name: 'App Modernization Impact', fn: testAppModernization },
    { name: 'Backend Conditional Logic', fn: testBackendLogic },
    { name: 'Minimum Constraint', fn: testMinimumConstraint },
    { name: 'App Completion %', fn: testAppCompletion },
    { name: 'Migration Weighting', fn: testMigrationWeighting },
    { name: 'Timeline Validation', fn: testTimelineValidation }
  ];
  
  let passed = 0;
  let failed = 0;
  
  tests.forEach(({ name, fn }) => {
    try {
      fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}: ${error.message}`);
      failed++;
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`📊 RESULTS: ${passed}/${tests.length} passed, ${failed}/${tests.length} failed`);
  
  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED - Engine is ready for production!');
  } else {
    console.log('⚠️  Some tests failed - review implementation');
  }
  
  return { passed, failed, total: tests.length };
}

// Individual test functions for manual runner
function testRichardExample() {
  const result = calculateRichardTimeline(
    RICHARD_EXAMPLE_CASE.answers,
    RICHARD_EXAMPLE_CASE.goLiveDate,
    RICHARD_EXAMPLE_CASE.appCompletionPercent
  );
  
  const validation = validateAgainstExpected(
    result,
    RICHARD_EXAMPLE_CASE.expectedResults,
    0.5
  );
  
  if (!validation.passed) {
    throw new Error(`Max variance ${validation.maxVariance.toFixed(2)} exceeds 0.5 weeks`);
  }
}

function testAppModernization() {
  const baseline = calculateRichardTimeline(
    { ...RICHARD_EXAMPLE_CASE.answers, D24: 'Complex formats (MSI, EXE), no modernization required' },
    RICHARD_EXAMPLE_CASE.goLiveDate,
    30
  );
  
  const withMod = calculateRichardTimeline(
    { ...RICHARD_EXAMPLE_CASE.answers, D24: 'Application modernization will be required' },
    RICHARD_EXAMPLE_CASE.goLiveDate,
    30
  );
  
  const diff = withMod.durations.bucket1 - baseline.durations.bucket1;
  if (diff < 7 || diff > 10) {
    throw new Error(`Expected 7-10 weeks difference, got ${diff}`);
  }
}

function testBackendLogic() {
  const noBackend = calculateRichardTimeline(
    { ...RICHARD_EXAMPLE_CASE.answers, D26: 'No' },
    RICHARD_EXAMPLE_CASE.goLiveDate,
    30
  );
  
  const withBackend = calculateRichardTimeline(
    { ...RICHARD_EXAMPLE_CASE.answers, D26: 'Yes, these are core LOB apps that are latency sensitive' },
    RICHARD_EXAMPLE_CASE.goLiveDate,
    30
  );
  
  if (withBackend.durations.bucket1 <= noBackend.durations.bucket1) {
    throw new Error('Backend should increase Bucket 1 duration');
  }
}

function testMinimumConstraint() {
  const result = calculateRichardTimeline(
    {
      ...RICHARD_EXAMPLE_CASE.answers,
      D19: 'Standard corporate processes, less than 1 week per change request',
      D21: 'We will accept OOTB default'
    },
    RICHARD_EXAMPLE_CASE.goLiveDate,
    30
  );
  
  if (result.durations.bucket3 < 1) {
    throw new Error(`Bucket 3 should be minimum 1 week, got ${result.durations.bucket3}`);
  }
}

function testAppCompletion() {
  const r0 = calculateRichardTimeline(RICHARD_EXAMPLE_CASE.answers, RICHARD_EXAMPLE_CASE.goLiveDate, 0);
  const r100 = calculateRichardTimeline(RICHARD_EXAMPLE_CASE.answers, RICHARD_EXAMPLE_CASE.goLiveDate, 100);
  
  if (r0.parallelExecution.azureStartDelay <= r100.parallelExecution.azureStartDelay) {
    throw new Error('0% should have longer delay than 100%');
  }
  
  if (r100.parallelExecution.azureStartDelay !== 0) {
    throw new Error('100% completion should have 0 delay');
  }
}

function testMigrationWeighting() {
  const result = calculateRichardTimeline(
    RICHARD_EXAMPLE_CASE.answers,
    RICHARD_EXAMPLE_CASE.goLiveDate,
    30
  );
  
  const expected = result.scores.D6.score * result.scores.D25.score;
  const actual = result.scores.D10.weight;
  
  if (expected !== actual) {
    throw new Error(`Expected weight ${expected}, got ${actual}`);
  }
}

function testTimelineValidation() {
  const tight = calculateRichardTimeline(
    RICHARD_EXAMPLE_CASE.answers,
    new Date('2025-05-01'),
    30
  );
  
  const comfortable = calculateRichardTimeline(
    RICHARD_EXAMPLE_CASE.answers,
    new Date('2026-01-01'),
    30
  );
  
  if (tight.validation.isValid) {
    throw new Error('Tight timeline should be invalid');
  }
  
  if (!comfortable.validation.isValid) {
    throw new Error('Comfortable timeline should be valid');
  }
}

export default {
  validateAgainstExpected,
  validateAgainstRanges,
  RICHARD_EXAMPLE_CASE,
  TEST_CASES,
  runAllTests
};
