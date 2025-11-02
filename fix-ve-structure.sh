#!/usr/bin/env bash

echo "Fixing VE engine data structure..."

cat > src/lib/ve-engine/index.js <<'EOF'
import {
  calculateAVDInfrastructureCost,
  calculateCurrentStateCost,
  calculateTCO,
} from "../../utils/business-case/cost-calculator";
import {
  calculateComprehensiveROI,
  getImplementationCost,
} from "../../utils/business-case/roi-calculator";

export function calculateBusinessCaseFull(profile, currentStateConfig, futureStateConfig, options = {}) {
  const currentStateCost = calculateCurrentStateCost(currentStateConfig, options);
  const futureStateCost  = calculateAVDInfrastructureCost(futureStateConfig, options);
  const tco = calculateTCO(currentStateCost, futureStateCost, options.timeHorizonYears || 3);

  const implementationCost = getImplementationCost({
    userCount: profile?.totalUsers || futureStateConfig?.userCount || 1000,
    complexityHint: futureStateConfig?.complexity || "medium",
  });

  const timelineSummary = options.timelineSummary || null;
  const timelineWeeks = timelineSummary?.totals?.parallelizedWeeks || 0;

  const roi = calculateComprehensiveROI({
    userCount: profile?.totalUsers || 1000,
    infrastructureSavings: tco?.savings?.annual || 0,
    implementationCost,
    timeHorizonYears: options.timeHorizonYears || 3,
    timelineSummary,
    implementationWeeks: timelineWeeks,
  });

  // Return in the format ResultsDashboard expects
  return {
    customerProfile: profile,          // ← Changed from "profile"
    currentState: currentStateCost,    // ← Changed from "currentStateCost"
    futureState: futureStateCost,      // ← Changed from "futureStateCost"
    tcoAnalysis: tco,                  // ← Changed from "tco"
    roiAnalysis: roi,                  // ← Changed from "roi"
    implementationCost,
    timeline: timelineSummary,         // ← Timeline data included
    calculatedAt: new Date().toISOString(),
  };
}
EOF

echo "✓ Fixed data structure to match ResultsDashboard expectations"
echo ""
echo "Rebuild: npm run build && npm run preview"
