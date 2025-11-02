#!/usr/bin/env bash
set -euo pipefail

echo "=============================================="
echo " Complete Timeline Integration Setup"
echo "=============================================="

# Helper functions
ts() { date +%Y%m%d_%H%M%S; }
backup() { 
  local f="$1"
  if [ -f "$f" ]; then
    cp "$f" "${f}.bak_$(ts)"
    echo "  ✓ Backed up: $f"
  fi
}

echo ""
echo "Step 1: Creating required directories..."
mkdir -p src/hooks
mkdir -p src/lib/ve-engine
mkdir -p src/lib/timeline
mkdir -p src/components/timeline
mkdir -p scripts

echo ""
echo "Step 2: Installing optional UI plugins..."
npm pkg set devDependencies.@tailwindcss/forms="^0.5.7" 2>/dev/null || true
npm pkg set devDependencies.@tailwindcss/typography="^0.5.10" 2>/dev/null || true

echo ""
echo "Step 3: Creating useTimelineCalculator hook..."
cat > src/hooks/useTimelineCalculator.js <<'HOOK_EOF'
import { useMemo } from "react";

const r0 = (n) => Math.round(Number.isFinite(n) ? n : 0);
const nz = (n, d = 0) => (Number.isFinite(n) ? n : d);

function weeksBetween(startDate, endDate){
  const s = new Date(startDate), e = new Date(endDate);
  if (isNaN(s) || isNaN(e)) return 0;
  return Math.round((e - s) / (1000*60*60*24*7));
}

function band(v,t){ 
  if(t.simple(v)) return "simple"; 
  if(t.medium(v)) return "medium"; 
  return "complex"; 
}

function sw(level, W){ 
  const w=W[level]||W.medium; 
  return nz(w.score,0)*nz(w.weight,0); 
}

const DEFAULT_WEIGHTS = {
  D5:{simple:{score:1,weight:1},medium:{score:2,weight:2},complex:{score:3,weight:3}},
  D6:{simple:{score:1,weight:2},medium:{score:2,weight:2},complex:{score:3,weight:3}},
  D7:{simple:{score:1,weight:4},medium:{score:2,weight:4},complex:{score:3,weight:4}},
  D14:{simple:{score:2,weight:1},medium:{score:2,weight:2},complex:{score:3,weight:3}},
  D15:{simple:{score:2,weight:1},medium:{score:2,weight:2},complex:{score:3,weight:3}},
  D16:{simple:{score:1,weight:1},medium:{score:2,weight:2},complex:{score:3,weight:3}},
  D19:{simple:{score:1,weight:1},medium:{score:2,weight:2},complex:{score:3,weight:3}},
  D22:{simple:{score:1,weight:1},medium:{score:2,weight:2},complex:{score:3,weight:3}},
  D25:{simple:{score:1,weight:2},medium:{score:2,weight:2},complex:{score:3,weight:3}},
  D26:{simple:{score:1,weight:2},medium:{score:2,weight:2},complex:{score:3,weight:10}},
  D27:{simple:{score:1,weight:0},medium:{score:2,weight:1},complex:{score:3,weight:3}},
  D28:{simple:{score:1,weight:0},medium:{score:2,weight:2},complex:{score:3,weight:3}},
  D29:{simple:{score:1,weight:1},medium:{score:2,weight:2},complex:{score:3,weight:3}},
  D30:{simple:{score:1,weight:1},medium:{score:2,weight:2},complex:{score:3,weight:3}},
};

function profileToDrivers(profile={}){
  const {
    targetGoLiveDate, plannedStartDate, totalUsers, useCaseCount, appCount,
    appDeployment, backendSensitivity, peripherals, lobTested, lastModernizedYears,
    cloudPlatform, landingZone, osVersion, changeControl, securityReview, parallelizationPct
  } = profile;

  const weeksToGoLive = weeksBetween(plannedStartDate, targetGoLiveDate);

  const D6_band = band(nz(totalUsers,2000), {simple:v=>v<1000, medium:v=>v<=5000, complex:v=>v>5000});
  const D7_band = band(nz(useCaseCount,5),  {simple:v=>v>=3&&v<=5, medium:v=>v>=5&&v<=10, complex:v=>v>10});
  const D25_band= band(nz(appCount,150),    {simple:v=>v<100, medium:v=>v<=300, complex:v=>v>300});

  const D26_band = ({modern:"simple", mixed:"medium", modernization:"complex"}[appDeployment||"mixed"])||"medium";
  const D27_band = ({none:"simple","few-low":"medium","core-latency":"complex"}[backendSensitivity||"few-low"])||"medium";
  const D28_band = ({none:"simple",remotefx:"medium","third-party":"complex"}[peripherals||"none"])||"simple";
  const D29_band = ({yes:"simple","some-issues":"medium","not-tested":"complex"}[lobTested||"some-issues"])||"medium";
  const D30_band = (lastModernizedYears??1)<=0?"simple":(lastModernizedYears??1)<=2?"medium":"complex";
  const D14_band = ({azure:"simple", none:"medium","gcp-aws":"complex"}[cloudPlatform||"azure"])||"simple";
  const D15_band = ({yes:"simple","existing-new":"medium","new-to-azure":"complex"}[landingZone||"existing-new"])||"medium";
  const D16_band = ({modern:"simple","2016":"medium",legacy:"complex"}[osVersion||"modern"])||"simple";
  const D19_band = {"<1wk":"simple","1-2wk":"medium",monthly:"complex"}[changeControl||"1-2wk"]||"medium";
  const D22_band = {defaults:"simple",short:"medium",challenging:"complex"}[securityReview||"short"]||"medium";

  const D5_band = band(nz(weeksToGoLive,16), { simple:w=>w>52, medium:w=>w>=12&&w<=39, complex:w=>w<12 });

  const D = {
    D5:sw(D5_band,DEFAULT_WEIGHTS.D5),   D6:sw(D6_band,DEFAULT_WEIGHTS.D6),
    D7:sw(D7_band,DEFAULT_WEIGHTS.D7),   D14:sw(D14_band,DEFAULT_WEIGHTS.D14),
    D15:sw(D15_band,DEFAULT_WEIGHTS.D15),D16:sw(D16_band,DEFAULT_WEIGHTS.D16),
    D19:sw(D19_band,DEFAULT_WEIGHTS.D19),D22:sw(D22_band,DEFAULT_WEIGHTS.D22),
    D25:sw(D25_band,DEFAULT_WEIGHTS.D25),D26:sw(D26_band,DEFAULT_WEIGHTS.D26),
    D27:sw(D27_band,DEFAULT_WEIGHTS.D27),D28:sw(D28_band,DEFAULT_WEIGHTS.D28),
    D29:sw(D29_band,DEFAULT_WEIGHTS.D29),D30:sw(D30_band,DEFAULT_WEIGHTS.D30),
  };

  return {
    weeksToGoLive,
    parallelizationPct: Math.min(Math.max(nz(parallelizationPct,0.5),0),1),
    bands: {D5:D5_band,D6:D6_band,D7:D7_band,D14:D14_band,D15:D15_band,D16:D16_band,D19:D19_band,D22:D22_band,D25:D25_band,D26:D26_band,D27:D27_band,D28:D28_band,D29:D29_band,D30:D30_band},
    D
  };
}

function computePhases(D){
  const phase1 = r0((D.D30 + D.D27 + D.D26 + D.D25 + D.D7 + D.D29)/5);
  const phase2 = r0((D.D19 + D.D15 + D.D14)/5);
  const phase3 = Math.max(1, r0((D.D19 + D.D22)/5));
  const phase4 = r0((D.D28 + D.D27 + D.D26 + D.D25 + D.D7 + D.D16)/5);
  const phase5 = r0((D.D29 + D.D28 + D.D27 + D.D25 + D.D19 + D.D7)/5);
  const phase6 = r0((D.D19 + D.D6 + D.D7 + D.D25)/5);
  const sequentialTotal = r0(phase1+phase2+phase3+phase4+phase5+phase6);
  return {
    sequentialTotal,
    items: [
      { key:"prepareTransform", label:"Prepare & Transform Applications", weeks:phase1 },
      { key:"prepareAzure",     label:"Prepare Azure Environment",       weeks:phase2 },
      { key:"deployNerdio",     label:"Deploy Nerdio",                   weeks:phase3 },
      { key:"designBuildAVD",   label:"Design, Build & Configure AVD",   weeks:phase4 },
      { key:"pilot",            label:"Pilot User Group Testing",        weeks:phase5 },
      { key:"migration",        label:"User & Use Case Migration",       weeks:phase6 },
    ]
  };
}

function applySimpleOverlap(phases, parallelizationPct){
  const p1 = phases.items.find(p=>p.key==="prepareTransform")?.weeks||0;
  const overlappable = r0(p1 * (1 - parallelizationPct));
  const overlappedTotal = r0(phases.sequentialTotal - overlappable);
  return { overlappedTotal, overlappedCredit: overlappable };
}

export function useTimelineCalculator(profile, options={}){
  return useMemo(()=>{
    const mapped = profileToDrivers(profile);
    const { D, weeksToGoLive, parallelizationPct } = mapped;
    const phases = computePhases(D);
    const overlap = applySimpleOverlap(phases, parallelizationPct);
    const validity = r0(weeksToGoLive - overlap.overlappedTotal);
    return {
      weeksToGoLive,
      phases,
      overlap,
      validity,
      totals:{ sequentialWeeks: phases.sequentialTotal, parallelizedWeeks: overlap.overlappedTotal, creditWeeks: overlap.overlappedCredit },
      audit:{ bands: mapped.bands, drivers: mapped.D, parallelizationPct }
    };
  }, [JSON.stringify(profile), JSON.stringify(options)]);
}
HOOK_EOF

echo "  ✓ Created useTimelineCalculator hook"

echo ""
echo "Step 4: Creating VE engine orchestrator..."

# First check if the utils exist in expected locations
if [ -f "src/utils/business-case/cost-calculator.js" ]; then
  COST_CALC_PATH="../utils/business-case/cost-calculator"
  ROI_CALC_PATH="../utils/business-case/roi-calculator"
  echo "  ✓ Found calculators in src/utils/business-case/"
elif [ -f "src/utils/cost-calculator.js" ]; then
  COST_CALC_PATH="../utils/cost-calculator"
  ROI_CALC_PATH="../utils/roi-calculator"
  echo "  ✓ Found calculators in src/utils/"
else
  COST_CALC_PATH="../../utils/business-case/cost-calculator"
  ROI_CALC_PATH="../../utils/business-case/roi-calculator"
  echo "  ⚠  Using default path - you may need to adjust imports"
fi

cat > src/lib/ve-engine/index.js <<ENGINE_EOF
import {
  calculateAVDInfrastructureCost,
  calculateCurrentStateCost,
  calculateTCO,
} from "${COST_CALC_PATH}";
import {
  calculateComprehensiveROI,
  getImplementationCost,
} from "${ROI_CALC_PATH}";

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
ENGINE_EOF

echo "  ✓ Created VE engine"

echo ""
echo "Step 5: Installing dependencies..."
npm install

echo ""
echo "Step 6: Patching BusinessCaseContext.jsx..."
CONTEXT_FILE="src/contexts/BusinessCaseContext.jsx"
if [ -f "$CONTEXT_FILE" ]; then
  backup "$CONTEXT_FILE"
  
  # Add imports if not present
  if ! grep -q "calculateBusinessCaseFull" "$CONTEXT_FILE"; then
    sed -i "1i import { calculateBusinessCaseFull } from '../lib/ve-engine';" "$CONTEXT_FILE"
    echo "  ✓ Added calculateBusinessCaseFull import"
  fi
  
  if ! grep -q "useTimelineCalculator" "$CONTEXT_FILE"; then
    sed -i "1i import { useTimelineCalculator } from '../hooks/useTimelineCalculator';" "$CONTEXT_FILE"
    echo "  ✓ Added useTimelineCalculator import"
  fi
  
  echo ""
  echo "  ⚠  Manual step needed: Update calculation logic in BusinessCaseContext.jsx"
  echo "    Look for where you compute TCO/ROI and replace with:"
  echo "    const timelineSummary = useTimelineCalculator(customerProfile);"
  echo "    const results = calculateBusinessCaseFull(customerProfile, currentStateConfig, futureStateConfig, { timeHorizonYears: 3, timelineSummary });"
else
  echo "  ⚠  BusinessCaseContext.jsx not found - you may need to create it"
fi

echo ""
echo "=============================================="
echo " ✅ Setup Complete!"
echo "=============================================="
echo ""
echo "Next steps:"
echo "  1. Review and manually update BusinessCaseContext.jsx if needed"
echo "  2. Verify import paths in src/lib/ve-engine/index.js"
echo "  3. Run: npm run build"
echo "  4. Run: npm run preview"
echo "  5. Test the timeline calculator in your app"
echo ""
echo "Files created:"
echo "  - src/hooks/useTimelineCalculator.js"
echo "  - src/lib/ve-engine/index.js"
echo ""
echo "Backups saved with .bak_TIMESTAMP extension"
echo ""
