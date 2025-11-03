#!/bin/bash
# Master NTENT Coaching Implementation Script
# Adds color-coded NTENT discovery questions to all key fields

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  NTENT Coaching - Master Implementation           ║${NC}"
echo -e "${BLUE}║  Adding coaching to ALL key fields                 ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo ""

# Backup files first
echo -e "${YELLOW}Creating backups...${NC}"
cp src/components/TimelineCalculator.jsx src/components/TimelineCalculator.jsx.coaching_backup
cp src/components/business-case/CustomerProfile/CustomerProfileForm.jsx src/components/business-case/CustomerProfile/CustomerProfileForm.jsx.coaching_backup
cp src/components/business-case/CurrentStateConfig.jsx src/components/business-case/CurrentStateConfig.jsx.coaching_backup
cp src/components/business-case/FutureStateConfig.jsx src/components/business-case/FutureStateConfig.jsx.coaching_backup
echo -e "${GREEN}✓ Backups created${NC}\n"

#######################################
# STEP 1: TimelineCalculator.jsx
#######################################
echo -e "${BLUE}[1/4] Adding coaching to TimelineCalculator.jsx${NC}"

# Add imports
sed -i '5a import useCoachTriggers from '\''../hooks/useCoachTriggers'\'';\nimport TooltipCoach from '\''./ui/TooltipCoach'\'';' src/components/TimelineCalculator.jsx

# Add coach hook after useState declarations (around line 32)
sed -i '/const \[savedScenarios, setSavedScenarios\] = useState/a\  const coach = useCoachTriggers({ idleMs: 3500 });' src/components/TimelineCalculator.jsx

# Find and update the goLiveDate input (around line 545-556)
# This requires finding the exact section - let's mark it for manual completion
echo -e "${YELLOW}  ⚠ Timeline go-live date field requires manual coaching addition${NC}"
echo -e "${YELLOW}    See TIMELINE_COACHING_INSTRUCTIONS.txt${NC}"

cat > TIMELINE_COACHING_INSTRUCTIONS.txt << 'EOF'
TIMELINE CALCULATOR - Go-Live Date Coaching

Find the section around line 545-556 that looks like:

<input
  type="date"
  value={formData.goLiveDate}
  onChange={(e) => setFormData({...formData, goLiveDate: e.target.value})}
  className="..."
/>

Replace with:

<input
  type="date"
  value={formData.goLiveDate}
  onChange={(e) => {
    setFormData({...formData, goLiveDate: e.target.value});
    coach.onEdit('goLiveDate');
  }}
  onFocus={() => coach.onFocus('goLiveDate')}
  onBlur={coach.onBlur}
  className="..."
/>
{coach.hint?.id === 'goLiveDate' && (
  <TooltipCoach tone="time" ntentDimension="T">
    <strong>Timing:</strong> What date is immovable (renewal, audit, end-of-support)? What happens if you miss it?
  </TooltipCoach>
)}
{coach.shouldNudge('goLiveDate') && (
  <TooltipCoach tone="time">
    💡 Most AVD projects need 12-16 weeks. Consider blackout periods (holidays, fiscal close)
  </TooltipCoach>
)}
EOF

echo -e "${GREEN}✓ TimelineCalculator imports added${NC}"
echo -e "${GREEN}✓ Instructions created: TIMELINE_COACHING_INSTRUCTIONS.txt${NC}\n"

#######################################
# STEP 2: CustomerProfileForm.jsx
#######################################
echo -e "${BLUE}[2/4] Adding coaching to CustomerProfileForm.jsx${NC}"

# Company Name already has coaching - update to better NTENT questions
# Total Users
# Timeline Constraints  
# Executive Sponsor / Decision Maker

# Find Total Users field (around line 238)
echo -e "  Adding coaching to: Total Users"
# This is complex - creating instructions file

cat > CUSTOMER_PROFILE_COACHING_INSTRUCTIONS.txt << 'EOF'
CUSTOMER PROFILE FORM - Additional NTENT Coaching

The coach hook is already initialized. Add these coaching blocks:

=== 1. TOTAL USERS (around line 238) ===

Find:
<input
  type="number"
  value={formData.totalUsers}
  onChange={(e) => setFormData({...formData, totalUsers: parseInt(e.target.value)})}
  placeholder="1000"
/>

Add after the input (before closing </div>):

{coach.hint?.id === 'totalUsers' && (
  <TooltipCoach tone="need" ntentDimension="N">
    <strong>Need:</strong> How many users need AVD (not total employees)? Which user types need it most urgently?
  </TooltipCoach>
)}
{coach.shouldNudge('totalUsers') && (
  <TooltipCoach tone="need">
    💡 Include: knowledge workers + power users + CAD/engineering. Typical: 70% light, 25% medium, 5% heavy
  </TooltipCoach>
)}

And update onChange:
  onChange={(e) => {
    setFormData({...formData, totalUsers: parseInt(e.target.value)});
    coach.onEdit('totalUsers');
  }}
  onFocus={() => coach.onFocus('totalUsers')}
  onBlur={coach.onBlur}

=== 2. CRITICAL APPS (around line 272) ===

Find the criticalApps input and add:

{coach.hint?.id === 'criticalApps' && (
  <TooltipCoach tone="risk" ntentDimension="R">
    <strong>Risk:</strong> Which 3-5 apps are business-critical and need compatibility testing?
  </TooltipCoach>
)}
{coach.shouldNudge('criticalApps') && (
  <TooltipCoach tone="risk">
    💡 Office 365 doesn't count - it's always compatible. Focus on LOB apps
  </TooltipCoach>
)}

And update the input handlers:
  onChange={(e) => {
    handleInputChange('criticalApps', parseInt(e.target.value));
    coach.onEdit('criticalApps');
  }}
  onFocus={() => coach.onFocus('criticalApps')}
  onBlur={coach.onBlur}

=== 3. TIMELINE CONSTRAINTS (around line 434) ===

Find timelineConstraints input and add:

{coach.hint?.id === 'timelineConstraints' && (
  <TooltipCoach tone="time" ntentDimension="T">
    <strong>Timing:</strong> What's your immovable deadline? Include date AND consequence
  </TooltipCoach>
)}
{coach.shouldNudge('timelineConstraints') && (
  <TooltipCoach tone="time">
    💡 Format: "Citrix renewal Sept 30 - $500K penalty if missed"
  </TooltipCoach>
)}

And update handlers:
  onChange={(e) => {
    handleInputChange('timelineConstraints', e.target.value);
    coach.onEdit('timelineConstraints');
  }}
  onFocus={() => coach.onFocus('timelineConstraints')}
  onBlur={coach.onBlur}

=== 4. EXECUTIVE SPONSOR (around line 457) ===

Find executiveSponsor input and add:

{coach.hint?.id === 'executiveSponsor' && (
  <TooltipCoach tone="teams" ntentDimension="T">
    <strong>Teams:</strong> Who must say 'yes' to move from pilot → rollout?
  </TooltipCoach>
)}
{coach.shouldNudge('executiveSponsor') && (
  <TooltipCoach tone="teams">
    💡 Include title and approval order: "Jane Smith, VP IT (after CFO sign-off)"
  </TooltipCoach>
)}

And update handlers:
  onChange={(e) => {
    handleInputChange('executiveSponsor', e.target.value);
    coach.onEdit('executiveSponsor');
  }}
  onFocus={() => coach.onFocus('executiveSponsor')}
  onBlur={coach.onBlur}
EOF

echo -e "${GREEN}✓ Instructions created: CUSTOMER_PROFILE_COACHING_INSTRUCTIONS.txt${NC}\n"

#######################################
# STEP 3: CurrentStateConfig.jsx  
#######################################
echo -e "${BLUE}[3/4] Adding coaching to CurrentStateConfig.jsx${NC}"

# Add imports
sed -i '2a import useCoachTriggers from '\''../../hooks/useCoachTriggers'\'';\nimport TooltipCoach from '\''../ui/TooltipCoach'\'';' src/components/business-case/CurrentStateConfig.jsx

# Add coach hook
sed -i '/^export default function CurrentStateConfig/a\  const coach = useCoachTriggers({ idleMs: 3500 });' src/components/business-case/CurrentStateConfig.jsx

cat > CURRENT_STATE_COACHING_INSTRUCTIONS.txt << 'EOF'
CURRENT STATE CONFIG - NTENT Coaching

=== 1. CURRENT ANNUAL COST (around line 135) ===

Find the currentAnnualCost input and add:

{coach.hint?.id === 'currentAnnualCost' && (
  <TooltipCoach tone="need" ntentDimension="N">
    <strong>Need:</strong> Rough order of magnitude OK. Which metric matters most to CFO: $ savings, risk, or speed?
  </TooltipCoach>
)}
{coach.shouldNudge('currentAnnualCost') && (
  <TooltipCoach tone="need">
    💡 $50K vs $500K matters more than exact amount. Check last year's budget or ask finance
  </TooltipCoach>
)}

And update handlers:
  onChange={(e) => {
    handleChange('currentAnnualCost', parseFloat(e.target.value) || 0);
    coach.onEdit('currentAnnualCost');
  }}
  onFocus={() => coach.onFocus('currentAnnualCost')}
  onBlur={coach.onBlur}

=== 2. INFRASTRUCTURE COST (around line 149) ===

Find infrastructureCost input and add:

{coach.hint?.id === 'infrastructureCost' && (
  <TooltipCoach tone="need" ntentDimension="N">
    <strong>Need:</strong> Include hardware depreciation, data center costs, and maintenance contracts
  </TooltipCoach>
)}

And update handlers:
  onChange={(e) => {
    handleChange('infrastructureCost', parseFloat(e.target.value) || 0);
    coach.onEdit('infrastructureCost');
  }}
  onFocus={() => coach.onFocus('infrastructureCost')}
  onBlur={coach.onBlur}
EOF

echo -e "${GREEN}✓ CurrentStateConfig imports added${NC}"
echo -e "${GREEN}✓ Instructions created: CURRENT_STATE_COACHING_INSTRUCTIONS.txt${NC}\n"

#######################################
# STEP 4: FutureStateConfig.jsx
#######################################
echo -e "${BLUE}[4/4] Adding coaching to FutureStateConfig.jsx${NC}"

# Add imports
sed -i '2a import useCoachTriggers from '\''../../hooks/useCoachTriggers'\'';\nimport TooltipCoach from '\''../ui/TooltipCoach'\'';' src/components/business-case/FutureStateConfig.jsx

# Add coach hook
sed -i '/^export default function FutureStateConfig/a\  const coach = useCoachTriggers({ idleMs: 3500 });' src/components/business-case/FutureStateConfig.jsx

cat > FUTURE_STATE_COACHING_INSTRUCTIONS.txt << 'EOF'
FUTURE STATE CONFIG - NTENT Coaching

=== USER DISTRIBUTION (around line 123) ===

For each user type input (lightUsers, mediumUsers, heavyUsers), add coaching.

Example for lightUsers:

{coach.hint?.id === 'lightUsers' && (
  <TooltipCoach tone="need" ntentDimension="N">
    <strong>Need:</strong> Light users = Office apps, email, web only. Which user types deliver fastest ROI?
  </TooltipCoach>
)}

And update onChange:
  onChange={(e) => {
    handleChange('lightUsers', parseInt(e.target.value) || 0);
    coach.onEdit('lightUsers');
  }}
  onFocus={() => coach.onFocus('lightUsers')}
  onBlur={coach.onBlur}
EOF

echo -e "${GREEN}✓ FutureStateConfig imports added${NC}"
echo -e "${GREEN}✓ Instructions created: FUTURE_STATE_COACHING_INSTRUCTIONS.txt${NC}\n"

#######################################
# Summary
#######################################
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ NTENT Coaching Setup Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}\n"

echo -e "${BLUE}What was done:${NC}"
echo "  ✓ Backups created (.coaching_backup files)"
echo "  ✓ Imports added to all 4 components"
echo "  ✓ Coach hooks initialized"
echo "  ✓ Instruction files created for manual additions"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Review instruction files:"
echo "     • TIMELINE_COACHING_INSTRUCTIONS.txt"
echo "     • CUSTOMER_PROFILE_COACHING_INSTRUCTIONS.txt"
echo "     • CURRENT_STATE_COACHING_INSTRUCTIONS.txt"
echo "     • FUTURE_STATE_COACHING_INSTRUCTIONS.txt"
echo ""
echo "  2. Apply manual coaching additions using VS Code"
echo ""
echo "  3. Test: npm run dev"
echo ""
echo -e "${GREEN}Total fields with NTENT coaching after completion: ~10-15${NC}"
echo ""
