/**
 * Value Engineering Engine - Orchestrator
 * 
 * Integrates all VE calculations:
 * - Timeline (Richard's engine)
 * - TCO (cost calculator)
 * - ROI (roi calculator)
 * 
 * This is the single source of truth for business case calculations
 */

import { calculateRichardTimeline } from '../utils/timeline/richard-timeline-engine';
import { 
  calculateCurrentStateCost, 
  calculateAVDInfrastructureCost,
  calculateTCO 
} from '../utils/business-case/cost-calculator';
import { 
  calculateComprehensiveROI,
  getImplementationCost 
} from '../utils/business-case/roi-calculator';

/**
 * Calculate complete business case with timeline integration
 * 
 * @param {Object} customerProfile - Customer info (name, users, industry, etc)
 * @param {Object} currentState - Current platform costs
 * @param {Object} futureState - AVD configuration
 * @param {Object} options - Timeline and other options
 * @returns {Object} Complete business case with timeline
 */
export function calculateBusinessCaseFull(
  customerProfile,
  currentState,
  futureState,
  options = {}
) {
  const {
    timeHorizonYears = 3,
    timelineSummary = null,
    includeTimeline = true
  } = options;

  // 1. Calculate Timeline (if enabled and data provided)
  let timeline = null;
  if (includeTimeline && timelineSummary) {
    timeline = timelineSummary;
  }

  // 2. Calculate Current State Costs
  console.log("VE Engine - currentState:", currentState);
  const currentStateCosts = calculateCurrentStateCost({
    platform: currentState.platform || "citrix",
    userCount: currentState.userCount || 0,
    serverCount: currentState.serverCount || 0,
    customCosts: currentState.customCosts || {}
  });

  // 3. Calculate Future State (AVD) Costs
  const futureStateCosts = calculateAVDInfrastructureCost({
    userCount: futureState.userCount,
    userProfile: futureState.userProfile,
    storageType: futureState.storageType,
    storagePerUserGB: futureState.storagePerUserGB,
    includeNerdio: futureState.includeNerdio
  });

  // 4. Calculate TCO
  const tco = calculateTCO(
    currentStateCosts,
    futureStateCosts,
    timeHorizonYears
  );

  // 5. Calculate Implementation Costs
  const implementationCost = getImplementationCost(
    futureState.userCount,
    customerProfile.complexity || 'medium'
  );

  // 6. Calculate ROI
  const roi = calculateComprehensiveROI({
    userCount: futureState.userCount,
    infrastructureSavings: tco.savings.annual,
    implementationCost: implementationCost.totalCost,
    currentState: currentStateCosts,
    timeHorizonYears
  });

  // 7. Combine everything
  return {
    customerProfile,
    timeline,
    currentState: {
      platform: currentState.platform || "citrix",
      ...currentStateCosts
    },
    futureState: {
      ...futureStateCosts,
      config: futureState
    },
    tco,
    roi,
    implementationCost,
    summary: {
      totalSavings: tco.totalSavings,
      monthlyGain: tco.monthlyGain,
      roiPercent: roi.roi,
      paybackMonths: roi.paybackPeriod,
      timelineWeeks: timeline?.totalWeeks || null,
      feasible: timeline?.isFeasible ?? true
    },
    calculatedAt: new Date().toISOString()
  };
}

/**
 * Calculate timeline only (for standalone use)
 */
export function calculateTimelineOnly(answers, goLiveDate, appCompletionPercent = 30) {
  return calculateRichardTimeline(answers, goLiveDate, appCompletionPercent);
}

/**
 * Get timeline summary for business case display
 */
export function getTimelineSummary(timelineResults) {
  if (!timelineResults) return null;

  return {
    totalWeeks: timelineResults.validation.totalWeeksNeeded,
    weeksAvailable: timelineResults.validation.weeksAvailable,
    isFeasible: timelineResults.validation.isValid,
    buckets: {
      appTransform: timelineResults.durations.bucket1,
      azurePrep: timelineResults.durations.bucket2,
      nerdioDeployment: timelineResults.durations.bucket3,
      avdDesign: timelineResults.durations.bucket4,
      pilot: timelineResults.durations.bucket5,
      migration: timelineResults.durations.bucket6
    },
    phases: timelineResults.timeline.phases,
    recommendation: timelineResults.validation.recommendation
  };
}

export default {
  calculateBusinessCaseFull,
  calculateTimelineOnly,
  getTimelineSummary
};
