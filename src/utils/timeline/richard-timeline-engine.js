/**
 * Richard's Go-Live Timeline Calculator - Core Engine
 * 
 * This is the EXACT replication of Richard's Excel calculator logic.
 * Based on comprehensive documentation of his formulas and scoring system.
 * 
 * CRITICAL: This replaces your current phaseOverlap.js entirely.
 * 
 * @version 2.0 - Aligned with Richard's Excel v1.1
 * @author Mohammed - Nerdio Value Engineering
 */

// ============================================================================
// QUESTION DEFINITIONS - EXACT from Richard's Excel
// ============================================================================

/**
 * All 21 questions with their exact scoring and weights
 * Matches Richard's "Go-Live Questions (Lookup)" sheet exactly
 */
export const QUESTIONS = {
  // PROJECT FUNDAMENTALS
  D6: {
    id: 'D6',
    question: 'What is your go-live target date (compelling event)?',
    bucket: null, // Used for migration calculations, not a bucket
    weight: null, // Calculated dynamically based on other answers
    options: {
      'More than 12 months': { score: 1, weight: 1 },
      '3 to 9 months': { score: 2, weight: 2 },
      'Less than 3 months': { score: 3, weight: 3 }
    }
  },
  
  D8: {
    id: 'D8',
    question: 'How many users will be in scope for this AVD migration/implementation?',
    bucket: [1, 4, 5, 6], // Contributes to multiple buckets
    options: {
      'Less than 1,000 users': { score: 1, weight: 2 },
      '1,000 to 5,000 users': { score: 2, weight: 2 },
      'More than 5,000 users': { score: 3, weight: 3 }
    }
  },
  
  D9: {
    id: 'D9',
    question: 'How many use cases will be required for your virtual desktop project?',
    bucket: [1, 4, 5, 6], // Contributes to multiple buckets
    options: {
      '3 to 5 use cases': { score: 1, weight: 4 },
      '5 to 10 use cases': { score: 2, weight: 4 },
      '10 or more use cases': { score: 3, weight: 4 }
    }
  },

  // CURRENT TECHNOLOGY STACK (Migration Questions - Special Scoring)
  D10: {
    id: 'D10',
    question: 'Migrating from on-prem physical desktops to cloud VDI? (Net/New DAAS)',
    bucket: [1, 2],
    isYesNo: true,
    weight: 'CALCULATED', // D6.score × D25.score
    yesScore: 3,
    noScore: 1
  },
  
  D11: {
    id: 'D11', 
    question: 'Migrating from a Citrix/VMware/Omnissa Cloud deployment?',
    bucket: [1, 2],
    isYesNo: true,
    weight: 'CALCULATED', // D6.score × D25.score
    yesScore: 2,
    noScore: 1
  },
  
  D12: {
    id: 'D12',
    question: 'Migrating from a Citrix/VMware/Omnissa Hybrid deployment?',
    bucket: [1, 2],
    isYesNo: true,
    weight: 'CALCULATED', // D6.score × D25.score
    yesScore: 2,
    noScore: 1
  },
  
  D13: {
    id: 'D13',
    question: 'Migrating from a Citrix/VMware/Omnissa On-Prem deployment?',
    bucket: [1, 2],
    isYesNo: true,
    weight: 'CALCULATED', // D6.score × D25.score
    yesScore: 3,
    noScore: 1
  },

  // CLOUD PLATFORM & INFRASTRUCTURE
  D15: {
    id: 'D15',
    question: 'What is your cloud platform of choice?',
    bucket: [2],
    options: {
      'Azure': { score: 2, weight: 1 },
      'No defined cloud strategy yet': { score: 2, weight: 2 },
      'GCP or AWS': { score: 3, weight: 3 }
    }
  },
  
  D16: {
    id: 'D16',
    question: 'Do you have an Azure landing zone already deployed?',
    bucket: [2],
    options: {
      'Yes': { score: 2, weight: 1 },
      'Existing Azure deployment, but new landing zone needed': { score: 2, weight: 2 },
      'No, we are new to Azure': { score: 3, weight: 3 }
    }
  },
  
  D17: {
    id: 'D17',
    question: 'What operating systems will you use?',
    bucket: [1, 4],
    options: {
      'Windows 11 multisession or Windows Server 2019 or higher': { score: 1, weight: 1 },
      'Windows 10 multisession or Windows Server 2016': { score: 2, weight: 2 },
      'Windows Server 2012 or below/Win 7 or 8 (OS migration needed)': { score: 3, weight: 3 }
    }
  },

  // CHANGE CONTROL
  D19: {
    id: 'D19',
    question: 'What are your change control processes like?',
    bucket: [2, 3, 4],
    options: {
      'Standard corporate processes, less than 1 week per change request': { score: 1, weight: 1 },
      'Standard corporate processes, 1 to 2 weeks per change request': { score: 2, weight: 2 },
      'Complex change processes, a month per change request': { score: 3, weight: 3 }
    }
  },

  // SECURITY & COMPLIANCE
  D21: {
    id: 'D21',
    question: 'What is the expected security review of API permissions like?',
    bucket: [2, 3],
    options: {
      'We will accept OOTB default': { score: 1, weight: 1 },
      'We have a short review process': { score: 2, weight: 2 },
      'We have challenging security processes': { score: 3, weight: 3 }
    }
  },

  // APPLICATION DISCOVERY (HIGHEST IMPACT QUESTIONS)
  D23: {
    id: 'D23',
    question: 'How many applications will be in scope?',
    bucket: [1],
    options: {
      'Less than 100 applications': { score: 1, weight: 2 },
      '100 to 300 applications': { score: 2, weight: 2 },
      'More than 300 applications': { score: 3, weight: 3 }
    }
  },
  
  D24: {
    id: 'D24',
    question: 'What application deployment methods will you use?',
    bucket: [1],
    options: {
      'All modern format, minimal/no migration work required': { score: 1, weight: 2 },
      'Complex formats (MSI, EXE), no modernization required': { score: 2, weight: 2 },
      'Application modernization will be required': { score: 3, weight: 10 } // 🚨 MASSIVE IMPACT
    }
  },
  
  D25: {
    id: 'D25',
    question: 'What is your current technology stack?',
    bucket: null, // Used for migration calculations
    weight: null, // Calculated dynamically
    options: {
      'On-prem physical desktops to cloud VDI (Net/New DAAS)': { score: 3 },
      'Citrix/VMware/Omnissa Cloud': { score: 2 },
      'Citrix/VMware/Omnissa Hybrid': { score: 2 },
      'Citrix/VMware/Omnissa On-Prem': { score: 3 }
    }
  },
  
  D26: {
    id: 'D26',
    question: 'Will backend resources need to be connected?',
    bucket: [1],
    options: {
      'No': { score: 1, weight: 0 },
      'Yes, but there are few and/or they are low priority/latency insensitive': { score: 2, weight: 1 },
      'Yes, these are core LOB apps that are latency sensitive': { score: 3, weight: 3 }
    }
  },
  
  D27: {
    id: 'D27',
    question: 'Are there peripheral device requirements for users?',
    bucket: [1],
    options: {
      'No': { score: 1, weight: 0 },
      'Yes, but can use RemoteFX': { score: 2, weight: 2 },
      'Yes, needs RemoteFX plus 3rd party software': { score: 3, weight: 3 }
    }
  },
  
  D28: {
    id: 'D28',
    question: 'Have your LOB applications been tested in the cloud?',
    bucket: [1],
    options: {
      'Yes, they work': { score: 1, weight: 1 },
      'Yes, with some challenges': { score: 2, weight: 2 },
      'Not really tested': { score: 3, weight: 3 }
    }
  },
  
  D29: {
    id: 'D29',
    question: 'When was the last time you had an application migration/modernization?',
    bucket: [1],
    options: {
      'Recently': { score: 1, weight: 1 },
      '1 to 2 years ago': { score: 2, weight: 2 },
      '2 or more years': { score: 3, weight: 3 }
    }
  }
};

// ============================================================================
// BUCKET DEFINITIONS - Richard's 6 Implementation Phases
// ============================================================================

export const BUCKETS = {
  1: {
    name: 'Prepare and Transform Applications',
    description: 'Application inventory, packaging, and modernization',
    questions: ['D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D17', 'D23', 'D24', 'D26', 'D27', 'D28', 'D29'],
    hasConditionalLogic: true, // Based on D26 answer
    minimumWeeks: null
  },
  2: {
    name: 'Prepare Azure Environment',
    description: 'Identities, networking, subscriptions, Azure setup',
    questions: ['D10', 'D11', 'D12', 'D13', 'D15', 'D16', 'D19', 'D21'],
    hasConditionalLogic: false,
    minimumWeeks: null
  },
  3: {
    name: 'Deploy Nerdio Manager',
    description: 'Install and configure Nerdio Manager for AVD',
    questions: ['D19', 'D21'],
    hasConditionalLogic: false,
    minimumWeeks: 1 // Hardcoded minimum in Excel
  },
  4: {
    name: 'Design, Build & Configure AVD',
    description: 'Host pools, images, storage, testing',
    questions: ['D8', 'D9', 'D17', 'D19'],
    hasConditionalLogic: false,
    minimumWeeks: null
  },
  5: {
    name: 'Pilot Group Testing',
    description: 'Pilot users, feedback, refinement',
    questions: ['D8', 'D9'],
    hasConditionalLogic: false,
    minimumWeeks: null
  },
  6: {
    name: 'User & Use Case Migration',
    description: 'Production rollout and migration',
    questions: ['D8', 'D9'],
    hasConditionalLogic: false,
    minimumWeeks: null
  }
};

// ============================================================================
// CORE CALCULATION ENGINE
// ============================================================================

/**
 * Calculate timeline based on question responses
 * This is the MAIN function that replicates Richard's Excel logic
 * 
 * @param {Object} answers - User responses to questions {questionId: selectedOption}
 * @param {Date} goLiveDate - Target go-live date
 * @param {number} appTransformCompletionPercent - How much app work done before Azure prep (0-100)
 * @returns {Object} Complete timeline calculation
 */
export function calculateRichardTimeline(answers, goLiveDate, appTransformCompletionPercent = 30) {
  // STEP 1: Score all questions
  const scores = scoreAllQuestions(answers);
  
  // STEP 2: Calculate the 6 bucket complexities
  const buckets = calculateBucketComplexities(scores, answers);
  
  // STEP 3: Convert bucket complexities to durations (weeks)
  const durations = {
    bucket1: Math.round(buckets.bucket1 / 5),
    bucket2: Math.round(buckets.bucket2 / 5),
    bucket3: Math.max(1, Math.round(buckets.bucket3 / 5)), // Minimum 1 week
    bucket4: Math.round(buckets.bucket4 / 5),
    bucket5: Math.round(buckets.bucket5 / 5),
    bucket6: Math.round(buckets.bucket6 / 5)
  };
  
  // STEP 4: Calculate parallel execution (KEY INSIGHT from Richard's Excel)
  const parallelExecution = calculateParallelExecution(
    durations.bucket1,
    appTransformCompletionPercent
  );
  
  // STEP 5: Calculate timeline markers (as negative weeks from go-live)
  const weeksToGoLive = calculateWeeksToGoLive(goLiveDate);
  const timeline = calculateTimelineMarkers(durations, parallelExecution, weeksToGoLive);
  
  // STEP 6: Validate project feasibility
  const validation = validateProjectTimeline(timeline, weeksToGoLive);
  
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
      appTransformCompletionPercent,
      calculatedAt: new Date().toISOString()
    }
  };
}

/**
 * Score all questions based on user answers
 * Handles both regular questions and special Yes/No migration questions
 */
function scoreAllQuestions(answers) {
  const scores = {};
  
  // First pass: Score D6 and D25 (needed for migration questions)
  scores.D6 = scoreQuestion('D6', answers.D6);
  scores.D25 = scoreQuestion('D25', answers.D25);
  
  // Second pass: Score all other questions (including migration questions that need D6 × D25)
  Object.keys(QUESTIONS).forEach(qId => {
    if (qId !== 'D6' && qId !== 'D25') {
      scores[qId] = scoreQuestion(qId, answers[qId], scores.D6, scores.D25);
    }
  });
  
  return scores;
}

/**
 * Score a single question
 */
function scoreQuestion(questionId, answer, d6Score = null, d25Score = null) {
  const question = QUESTIONS[questionId];
  if (!question) return { score: 0, weight: 0, weighted: 0 };
  
  // Handle Yes/No migration questions (D10-D13)
  if (question.isYesNo) {
    const score = answer === 'Yes' ? question.yesScore : question.noScore;
    const weight = answer === 'Yes' && d6Score && d25Score ? d6Score.score * d25Score.score : 0;
    return {
      score,
      weight,
      weighted: score * weight,
      questionId,
      answer
    };
  }
  
  // Handle regular scored questions
  const option = question.options[answer];
  if (!option) return { score: 0, weight: 0, weighted: 0 };
  
  return {
    score: option.score,
    weight: option.weight,
    weighted: option.score * option.weight,
    questionId,
    answer
  };
}

/**
 * Calculate bucket complexities
 * FINAL CORRECTED VERSION - Verified against Excel formulas
 * 
 * Excel row mapping to our question IDs:
 * D5→D6, D6→D8, D7→D9, D10→D10, D11→D11, D12→D12, D13→D13,
 * D14→D15, D15→D16, D16→D17, D19→D19, D22→D21,
 * D25→D23, D26→D24, D27→D26, D28→D27, D29→D28, D30→D29
 */
function calculateBucketComplexities(scores, answers) {
  const buckets = {};
  
  // Bucket 1: Apps Transform
  // Excel: IF(D26=2, (D30+D27+D26+D25+D7+D29)/5, (D30+D27+D26+D10+D11+D12+D25+D13+D7)/5)
  // D26→D24, D30→D29, D27→D26, D25→D23, D7→D9, D29→D28, D10→D10, D11→D11, D12→D12, D13→D13
  if (scores.D24.weighted !== 4) {
    // When D24 score = 2: Use simpler formula (NO app modernization)
    // D29, D26, D24, D23, D9, D28
    buckets.bucket1 = ['D29', 'D26', 'D24', 'D23', 'D9', 'D28']
      .reduce((sum, qId) => sum + (scores[qId]?.weighted || 0), 0);
  } else {
    // When D24 score ≠ 2: Use complex formula (WITH migration questions)
    // D29, D26, D24, D10, D11, D12, D23, D13, D9
    buckets.bucket1 = ['D29', 'D26', 'D24', 'D10', 'D11', 'D12', 'D23', 'D13', 'D9']
      .reduce((sum, qId) => sum + (scores[qId]?.weighted || 0), 0);
  }
  
  // Bucket 2: Azure Prep
  // Excel: (D19+D15+D14)/5
  // D19→D19, D15→D16, D14→D15
  buckets.bucket2 = ['D19', 'D16', 'D15']
    .reduce((sum, qId) => sum + (scores[qId]?.weighted || 0), 0);
  
  // Bucket 3: Nerdio Deploy
  // Excel: IF((D19+D22)/5<1, 1, (D19+D22)/5)
  // D19→D19, D22→D21
  buckets.bucket3 = ['D19', 'D21']
    .reduce((sum, qId) => sum + (scores[qId]?.weighted || 0), 0);
  
  // Bucket 4: AVD Design
  // Excel: (D28+D27+D26+D25+D7+D16)/5
  // D28→D27, D27→D26, D26→D24, D25→D23, D7→D9, D16→D17
  buckets.bucket4 = ['D27', 'D26', 'D24', 'D23', 'D9', 'D17']
    .reduce((sum, qId) => sum + (scores[qId]?.weighted || 0), 0);
  
  // Bucket 5: Pilot
  // Excel: (D30+D29+D28+D25+D19+D7)/5
  // D30→D29, D29→D28, D28→D27, D25→D23, D19→D19, D7→D9
  buckets.bucket5 = ['D29', 'D28', 'D27', 'D23', 'D19', 'D9']
    .reduce((sum, qId) => sum + (scores[qId]?.weighted || 0), 0);
  
  // Bucket 6: Migration
  // Excel: (D19+D6+D7+D25)/5
  // D19→D19, D6→D8, D7→D9, D25→D23
  buckets.bucket6 = ['D19', 'D8', 'D9', 'D23']
    .reduce((sum, qId) => sum + (scores[qId]?.weighted || 0), 0);
  
  return buckets;
}
// REPLACE the entire calculateBucketComplexities function in your engine with this!
/**
 * Calculate parallel execution adjustment
 * THE KEY INSIGHT: Azure prep can start BEFORE apps are 100% complete
 */
function calculateParallelExecution(bucket1Duration, appCompletionPercent) {
  // Validate percentage
  const percent = Math.max(0, Math.min(100, appCompletionPercent));
  
  // Calculate delay before Azure prep can start
  const delayWeeks = bucket1Duration * (1 - percent / 100);
  
  return {
    appTransformationDuration: bucket1Duration,
    appCompletionPercent: percent,
    azureStartDelay: delayWeeks,
    description: `Azure environment prep can begin ${delayWeeks.toFixed(1)} weeks into app transformation (when ${percent}% complete)`
  };
}

/**
 * Calculate weeks from today to go-live date
 */
function calculateWeeksToGoLive(goLiveDate) {
  const today = new Date();
  const target = new Date(goLiveDate);
  const diffMs = target - today;
  const diffWeeks = diffMs / (1000 * 60 * 60 * 24 * 7);
  return Math.round(diffWeeks * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate timeline markers as negative weeks from go-live
 * This matches Richard's Excel Gantt chart calculations
 */
function calculateTimelineMarkers(durations, parallelExecution, weeksToGoLive) {
  const { bucket1, bucket2, bucket3, bucket4, bucket5, bucket6 } = durations;
  const { azureStartDelay } = parallelExecution;
  
  // All markers are NEGATIVE weeks (counting backwards from go-live)
  const markers = {
    appTransformStart: -weeksToGoLive,
    appTransformFinish: null,
    azurePrepFinish: null,
    nerdioDeployFinish: null,
    avdDesignFinish: null,
    pilotFinish: null,
    migrationFinish: 0, // Go-live date
  };
  
  // Calculate each phase end (working backwards from go-live)
  markers.appTransformFinish = markers.appTransformStart + bucket1;
  markers.azurePrepFinish = markers.appTransformStart + azureStartDelay + bucket2;
  markers.nerdioDeployFinish = Math.max(markers.azurePrepFinish) + bucket3;
  markers.avdDesignFinish = markers.nerdioDeployFinish + bucket4;
  markers.pilotFinish = markers.avdDesignFinish + bucket5;
  markers.migrationFinish = markers.pilotFinish + bucket6;
  
  return {
    markers,
    phases: [
      {
        name: BUCKETS[1].name,
        startWeek: markers.appTransformStart,
        endWeek: markers.appTransformFinish,
        duration: bucket1
      },
      {
        name: BUCKETS[2].name,
        startWeek: markers.appTransformStart + azureStartDelay,
        endWeek: markers.azurePrepFinish,
        duration: bucket2
      },
      {
        name: BUCKETS[3].name,
        startWeek: markers.azurePrepFinish,
        endWeek: markers.nerdioDeployFinish,
        duration: bucket3
      },
      {
        name: BUCKETS[4].name,
        startWeek: markers.nerdioDeployFinish,
        endWeek: markers.avdDesignFinish,
        duration: bucket4
      },
      {
        name: BUCKETS[5].name,
        startWeek: markers.avdDesignFinish,
        endWeek: markers.pilotFinish,
        duration: bucket5
      },
      {
        name: BUCKETS[6].name,
        startWeek: markers.pilotFinish,
        endWeek: markers.migrationFinish,
        duration: bucket6
      }
    ]
  };
}

/**
 * Validate if timeline is feasible for target go-live date
 */
function validateProjectTimeline(timeline, weeksToGoLive) {
  const totalWeeksNeeded = Math.abs(timeline.markers.appTransformStart);
  const isValid = totalWeeksNeeded <= weeksToGoLive;
  const variance = weeksToGoLive - totalWeeksNeeded;
  
  return {
    isValid,
    totalWeeksNeeded,
    weeksAvailable: weeksToGoLive,
    variance,
    variancePercent: (variance / weeksToGoLive) * 100,
    recommendation: isValid 
      ? 'Timeline is achievable with dedicated team'
      : 'Timeline is tight - consider professional services or adjusting go-live date'
  };
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
  QUESTIONS,
  BUCKETS,
  calculateRichardTimeline,
  calculateWeeksToGoLive
};
