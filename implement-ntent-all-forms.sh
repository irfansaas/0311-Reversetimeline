#!/bin/bash
# Master NTENT Badges Implementation - ALL FORMS
# Adds NTENT legend and badges to every form in the app

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  NTENT Badges - Complete App Implementation       ║${NC}"
echo -e "${BLUE}║  Adding to ALL forms with color-coded badges      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# Backup files first
echo -e "${YELLOW}Creating backups...${NC}"
cp src/components/TimelineCalculator.jsx src/components/TimelineCalculator.jsx.ntent_backup
cp src/components/business-case/CustomerProfile/CustomerProfileForm.jsx src/components/business-case/CustomerProfile/CustomerProfileForm.jsx.ntent_backup
cp src/components/business-case/CurrentStateConfig.jsx src/components/business-case/CurrentStateConfig.jsx.ntent_backup
cp src/components/business-case/FutureStateConfig.jsx src/components/business-case/FutureStateConfig.jsx.ntent_backup
echo -e "${GREEN}✓ Backups created${NC}\n"

# Copy NTENT components
echo -e "${BLUE}Copying NTENT components...${NC}"
cp /mnt/user-data/outputs/NTENTLegend.jsx src/components/ui/NTENTLegend.jsx
cp /mnt/user-data/outputs/NTENTBadge.jsx src/components/ui/NTENTBadge.jsx
echo -e "${GREEN}✓ NTENT components copied${NC}\n"

########################################
# TIMELINE CALCULATOR
########################################
echo -e "${BLUE}[1/4] Adding NTENT to TimelineCalculator.jsx${NC}"

# Add imports after line 5
sed -i '5a import NTENTLegend from '\''./ui/NTENTLegend'\'';\nimport NTENTBadge from '\''./ui/NTENTBadge'\'';' src/components/TimelineCalculator.jsx

echo -e "${GREEN}✓ TimelineCalculator imports added${NC}"
echo -e "${YELLOW}  Manual: Add <NTENTLegend compact={true} /> at top of form${NC}"
echo -e "${YELLOW}  Manual: Add badges to Go-Live Date and key complexity fields${NC}\n"

########################################
# CUSTOMER PROFILE FORM
########################################
echo -e "${BLUE}[2/4] Adding NTENT to CustomerProfileForm.jsx${NC}"

# Add imports
sed -i '4a import NTENTLegend from '\''../../ui/NTENTLegend'\'';\nimport NTENTBadge from '\''../../ui/NTENTBadge'\'';' src/components/business-case/CustomerProfile/CustomerProfileForm.jsx

echo -e "${GREEN}✓ CustomerProfileForm imports added${NC}"
echo -e "${YELLOW}  Manual: Add legend and badges to key fields${NC}\n"

########################################
# CURRENT STATE CONFIG
########################################
echo -e "${BLUE}[3/4] Adding NTENT to CurrentStateConfig.jsx${NC}"

# Add imports
sed -i '2a import NTENTLegend from '\''../ui/NTENTLegend'\'';\nimport NTENTBadge from '\''../ui/NTENTBadge'\'';' src/components/business-case/CurrentStateConfig.jsx

echo -e "${GREEN}✓ CurrentStateConfig imports added${NC}"
echo -e "${YELLOW}  Manual: Add legend and badges${NC}\n"

########################################
# FUTURE STATE CONFIG
########################################
echo -e "${BLUE}[4/4] Adding NTENT to FutureStateConfig.jsx${NC}"

# Add imports
sed -i '2a import NTENTLegend from '\''../ui/NTENTLegend'\'';\nimport NTENTBadge from '\''../ui/NTENTBadge'\'';' src/components/business-case/FutureStateConfig.jsx

echo -e "${GREEN}✓ FutureStateConfig imports added${NC}"
echo -e "${YELLOW}  Manual: Add legend and badges${NC}\n"

########################################
# CREATE COMPREHENSIVE GUIDE
########################################
cat > NTENT_BADGES_COMPLETE_GUIDE.txt << 'EOF'
╔════════════════════════════════════════════════════════════════╗
║  NTENT BADGES - Complete Implementation Guide                 ║
║  Add to ALL forms across the app                              ║
╚════════════════════════════════════════════════════════════════╝

WHAT YOU'LL SEE:
┌────────────────────────────────────────────────────────────┐
│ NTENT Discovery: [N] Next [T] Teams [E] Education [N] Need│
│                  [T] Timing [R] Risk                        │
│ (Color-coded legend at top of every form)                  │
└────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════
FORM 1: TIMELINE CALCULATOR
═══════════════════════════════════════════════════════════════

FILE: src/components/TimelineCalculator.jsx

STEP 1: Add legend after the header (around line 540)
Find: <div className="bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-3xl font-bold...">Nerdio Go-Live Timeline Calculator</h1>

Add after h1:
      <NTENTLegend compact={true} />

STEP 2: Add badges to key fields

Go-Live Date (around line 550):
<label className="block text-sm font-semibold text-gray-700 mb-2">
  Target Go-Live Date
  <NTENTBadge dimension="time" tooltip="What date is immovable? What happens if you miss it?" />
</label>

Start Date:
<label className="block text-sm font-semibold text-gray-700 mb-2">
  Project Start Date
  <NTENTBadge dimension="next" tooltip="When can you realistically start?" />
</label>

App Modernization (HIGH IMPACT):
<label className="block text-sm font-semibold text-gray-700 mb-2">
  Application Modernization Required
  <NTENTBadge dimension="risk" tooltip="10x weight! What could kill this project?" />
</label>

Change Control:
<label className="block text-sm font-semibold text-gray-700 mb-2">
  Change Control Process
  <NTENTBadge dimension="risk" tooltip="How fast can you get approvals?" />
</label>

═══════════════════════════════════════════════════════════════
FORM 2: CUSTOMER PROFILE FORM
═══════════════════════════════════════════════════════════════

FILE: src/components/business-case/CustomerProfile/CustomerProfileForm.jsx

STEP 1: Add legend at top of form (around line 140)
Find: <form onSubmit={handleSubmit} className="space-y-6">

Add right after:
      <NTENTLegend compact={true} />

STEP 2: Add badges to key fields

Company Name (around line 155):
<label className="block text-sm font-semibold text-gray-700 mb-2">
  Company Name *
  <NTENTBadge dimension="next" tooltip="Use full legal entity - appears on MSA/PO" />
</label>

Total Users (around line 238):
<label className="block text-sm font-semibold text-gray-700 mb-2">
  Total Number of Users *
  <NTENTBadge dimension="need" tooltip="How many need AVD? Which types most urgent?" />
</label>

Critical Apps (around line 272):
<label className="block text-sm font-semibold text-gray-700 mb-2">
  Number of Critical Applications
  <NTENTBadge dimension="risk" tooltip="Which 3-5 apps are business-critical?" />
</label>

Timeline Constraints (around line 434):
<label className="block text-sm font-semibold text-gray-700 mb-2">
  Timeline Constraints or Deadlines
  <NTENTBadge dimension="time" tooltip="What's immovable? Include date + consequence" />
</label>

Executive Sponsor (around line 457):
<label className="block text-sm font-semibold text-gray-700 mb-2">
  Executive Sponsor / Decision Maker
  <NTENTBadge dimension="teams" tooltip="Who must say yes for pilot → rollout?" />
</label>

IT Sponsor (around line 470):
<label className="block text-sm font-semibold text-gray-700 mb-2">
  IT Sponsor / Technical Lead
  <NTENTBadge dimension="teams" tooltip="Who owns technical implementation?" />
</label>

Finance Contact (around line 483):
<label className="block text-sm font-semibold text-gray-700 mb-2">
  Finance / Procurement Contact
  <NTENTBadge dimension="teams" tooltip="Who approves budget?" />
</label>

═══════════════════════════════════════════════════════════════
FORM 3: CURRENT STATE CONFIG
═══════════════════════════════════════════════════════════════

FILE: src/components/business-case/CurrentStateConfig.jsx

STEP 1: Add legend at top of form
Find: <form onSubmit={handleSubmit} className="space-y-6">

Add right after:
      <NTENTLegend compact={true} />

STEP 2: Add badges to key fields

Current Annual Cost (around line 130):
<label className="block text-sm font-semibold text-gray-700 mb-2">
  Current Annual Cost (Optional)
  <NTENTBadge dimension="need" tooltip="Rough OK. Which metric matters to CFO: savings, risk, or speed?" />
</label>

Infrastructure Cost (around line 145):
<label className="block text-sm font-semibold text-gray-700 mb-2">
  Annual Infrastructure Cost
  <NTENTBadge dimension="need" tooltip="Include hardware, datacenter, maintenance" />
</label>

Current Platform:
<label className="block text-sm font-semibold text-gray-700 mb-2">
  Current VDI/DaaS Platform
  <NTENTBadge dimension="risk" tooltip="What's burned you on similar migrations?" />
</label>

═══════════════════════════════════════════════════════════════
FORM 4: FUTURE STATE CONFIG
═══════════════════════════════════════════════════════════════

FILE: src/components/business-case/FutureStateConfig.jsx

STEP 1: Add legend at top of form
Find: <form onSubmit={handleSubmit} className="space-y-6">

Add right after:
      <NTENTLegend compact={true} />

STEP 2: Add badges to key fields

User Distribution Section (around line 120):
<label className="block text-sm font-semibold text-gray-700 mb-3">
  User Distribution by Workload Type
  <NTENTBadge dimension="need" tooltip="Which user types deliver fastest ROI?" />
</label>

Light Users:
<label className="text-sm text-gray-600">
  Light Users (Office, Email, Web)
  <NTENTBadge dimension="need" tooltip="Start here for quick wins" />
</label>

Storage Configuration:
<label className="block text-sm font-semibold text-gray-700 mb-3">
  Storage Type
  <NTENTBadge dimension="edu" tooltip="What proof do you need? Performance test?" />
</label>

Nerdio Manager:
<label className="flex items-start gap-3 cursor-pointer">
  Include Nerdio Manager for Enterprise
  <NTENTBadge dimension="edu" tooltip="What proof removes doubt about automation value?" />
</label>

═══════════════════════════════════════════════════════════════
QUICK REFERENCE: NTENT Dimension Usage
═══════════════════════════════════════════════════════════════

Use these dimensions for different field types:

[N] Next Step (Blue #239CBB)
- Company/legal names
- Start dates
- Initial commitments

[T] Teams (Cyan #77CADC)
- Decision makers
- Stakeholders  
- Approvers
- Organizational structure

[E] Education (Green #10B981)
- Proof requirements
- Training needs
- Enablement plans
- Demo/pilot preferences

[N] Need (Amber #F59E0B)
- User counts
- Priority metrics
- Budget/cost info
- What matters most to leadership

[T] Timing (Red #EF4444)
- Deadlines
- Go-live dates
- Timeline constraints
- Urgency drivers

[R] Risk (Gray #6B7280)
- Complexity factors
- Past failures
- Blockers
- Technical risks

═══════════════════════════════════════════════════════════════
VISUAL RESULT EXAMPLE
═══════════════════════════════════════════════════════════════

Customer Profile Form will look like:

┌──────────────────────────────────────────────────────────┐
│ Customer Profile                                          │
│                                                           │
│ NTENT Discovery: [N] Next [T] Teams [E] Education       │
│                  [N] Need [T] Timing [R] Risk            │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ Company Name * [N] ← Blue badge                          │
│ [Contoso Corporation_________________]                   │
│                                                           │
│ Total Users * [N] ← Amber badge                          │
│ [1000_____]                                              │
│                                                           │
│ Timeline Constraints [T] ← Red badge                     │
│ [Citrix renewal Sept 30 - $500K penalty____________]    │
│                                                           │
│ Executive Sponsor [T] ← Cyan badge                       │
│ [Jane Smith, VP IT______________________________]       │
└──────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════
TESTING CHECKLIST
═══════════════════════════════════════════════════════════════

After implementation:

□ Timeline Calculator shows NTENT legend at top
□ Timeline Calculator has badges on 3-5 key fields
□ Customer Profile shows NTENT legend
□ Customer Profile has badges on 7+ fields
□ Current State shows NTENT legend
□ Current State has badges on 3+ fields
□ Future State shows NTENT legend
□ Future State has badges on 3+ fields
□ All badges show correct colors
□ Hovering badges shows tooltip with discovery question
□ Forms still submit correctly
□ No console errors
□ Mobile responsive (badges stack properly)

═══════════════════════════════════════════════════════════════
ESTIMATED TIME
═══════════════════════════════════════════════════════════════

Timeline Calculator: 10 minutes
Customer Profile: 15 minutes
Current State: 10 minutes
Future State: 10 minutes

Total: ~45 minutes to add NTENT badges to all forms

═══════════════════════════════════════════════════════════════
EOF

echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}\n"

echo -e "${BLUE}What was done:${NC}"
echo "  ✓ Backups created (.ntent_backup files)"
echo "  ✓ NTENT components copied (NTENTLegend + NTENTBadge)"
echo "  ✓ Imports added to all 4 main forms"
echo "  ✓ Comprehensive guide created"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Read: NTENT_BADGES_COMPLETE_GUIDE.txt"
echo "  2. Add <NTENTLegend compact={true} /> to top of each form"
echo "  3. Add <NTENTBadge dimension='...' /> to ~20-25 key fields"
echo "  4. Test: npm run dev"
echo ""
echo -e "${GREEN}This will add NTENT discovery to your ENTIRE app!${NC}"
echo ""
