#!/usr/bin/env bash

echo "Fixing VE engine import paths..."

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

  return {
    profile,
    currentStateConfig,
    futureStateConfig,
    currentStateCost,
    futureStateCost,
    tco,
    roi,
    timeline: timelineSummary,
    calculatedAt: new Date().toISOString(),
  };
}
EOF

echo "✓ Fixed import paths to: ../../utils/business-case/"
echo ""
echo "Now try: npm run build"
