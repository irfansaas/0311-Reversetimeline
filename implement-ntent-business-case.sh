#!/bin/bash
# Single script to implement NTENT badges in Business Case Builder
# Run from your project root directory

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║       NTENT Badges - Business Case Builder Implementation       ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Check if we're in the right directory
if [ ! -d "src/components" ]; then
    echo -e "${RED}❌ Error: Must be run from project root directory${NC}"
    echo "Current directory: $(pwd)"
    echo ""
    echo "Please run:"
    echo "  cd /path/to/your/project"
    echo "  ./implement-ntent-business-case.sh"
    exit 1
fi

echo -e "${YELLOW}Step 1: Creating directories...${NC}"
mkdir -p src/components/ui
mkdir -p src/constants
echo -e "${GREEN}✓ Directories ready${NC}\n"

# ==============================================================================
# STEP 2: Create NTENTLegendCollapsible.jsx
# ==============================================================================
echo -e "${YELLOW}Step 2: Creating NTENTLegendCollapsible.jsx...${NC}"

cat > src/components/ui/NTENTLegendCollapsible.jsx << 'EOF'
import React, { useState } from 'react';
import { NTENT_COLORS } from '../../constants/ntentColors';
import { Target, ChevronDown, ChevronRight } from 'lucide-react';

export default function NTENTLegendCollapsible() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const dimensions = [
    { key: 'next', letter: 'N', label: 'Next Step', description: 'Commitments & meetings', example: 'When can we schedule the next call?' },
    { key: 'teams', letter: 'T', label: 'Teams', description: 'Stakeholders & approvers', example: 'Who needs to approve this?' },
    { key: 'edu', letter: 'E', label: 'Education', description: 'Proof & enablement', example: 'What proof points do they need?' },
    { key: 'need', letter: 'N', label: 'Need', description: 'Priority metrics', example: 'Why is this urgent for them?' },
    { key: 'time', letter: 'T', label: 'Timing', description: 'Deadlines & urgency', example: 'What date is immovable?' },
    { key: 'risk', letter: 'R', label: 'Risk', description: 'Blockers & concerns', example: 'What could kill this deal?' }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg mb-6 overflow-hidden">
      {/* Compact Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-blue-100 transition-colors"
        type="button"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <Target size={16} className="text-blue-600 flex-shrink-0" />
          <span className="text-xs font-semibold text-gray-700">NTENT Discovery:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {dimensions.map(dim => (
              <span
                key={dim.key}
                className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold text-white"
                style={{ backgroundColor: NTENT_COLORS[dim.key]?.hex }}
                title={dim.description}
              >
                {dim.letter}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 flex-shrink-0">
          <span>{isExpanded ? 'Hide' : 'Show'} guide</span>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-blue-200 p-4 bg-white">
          <p className="text-sm text-gray-600 mb-4">
            Use these badges to guide your discovery. Each field marked with a badge helps you qualify the opportunity better.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dimensions.map(dim => (
              <div key={dim.key} className="flex items-start gap-2">
                <span
                  className="inline-block px-2 py-1 rounded text-xs font-bold text-white flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: NTENT_COLORS[dim.key]?.hex }}
                >
                  {dim.letter}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900">{dim.label}</div>
                  <div className="text-xs text-gray-600 mb-1">{dim.description}</div>
                  <div className="text-xs italic text-blue-600">"{dim.example}"</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
EOF

echo -e "${GREEN}✓ NTENTLegendCollapsible.jsx created${NC}\n"

# ==============================================================================
# STEP 3: Create ntentQuestions.js (optional but helpful)
# ==============================================================================
echo -e "${YELLOW}Step 3: Creating ntentQuestions.js...${NC}"

cat > src/constants/ntentQuestions.js << 'EOF'
// NTENT Discovery Questions for Business Case Builder
export const BUSINESS_CASE_NTENT_QUESTIONS = {
  companyName: {
    dimension: 'next',
    question: 'Use full legal entity name - this appears on MSA/PO. Who signs contracts?',
    why: 'Legal entity clarity prevents contract delays'
  },
  
  industry: {
    dimension: 'need',
    question: 'What industry-specific compliance drives urgency? (HIPAA, PCI, SOX)',
    why: 'Industry drives security requirements and timeline'
  },
  
  totalUsers: {
    dimension: 'need',
    question: 'How many users need access TODAY vs. next 12 months? What drives growth?',
    why: 'User count impacts licensing, infrastructure, and project scope'
  },
  
  userProfile: {
    dimension: 'risk',
    question: 'What % are power users? GPU needs? What breaks their current setup?',
    why: 'User profile drives compute requirements and testing complexity'
  },
  
  numberOfUseCases: {
    dimension: 'need',
    question: 'What are the TOP 3 use cases? Which one fails most often today?',
    why: 'Each use case adds complexity - prioritize the pain points'
  },
  
  numberOfApplications: {
    dimension: 'risk',
    question: 'How many are CRITICAL? How many tested in cloud? Which have no vendor support?',
    why: 'App count predicts testing effort and modernization needs'
  },
  
  currentPlatform: {
    dimension: 'risk',
    question: 'What platform TODAY? What do they HATE about it? When does contract end?',
    why: 'Current platform reveals migration complexity and renewal timing'
  },
  
  plannedStartDate: {
    dimension: 'next',
    question: 'What HAS to happen before you can start? Who needs to approve start?',
    why: 'Start date dependencies reveal hidden blockers'
  },
  
  targetGoLiveDate: {
    dimension: 'time',
    question: 'What happens if you miss this date? Who set this deadline and why?',
    why: 'Compelling events create urgency and reveal true priority'
  },
  
  compellingEvent: {
    dimension: 'time',
    question: 'Contract expiring? Data center closing? Compliance deadline? M&A activity?',
    why: 'Compelling events are immovable - they drive deal velocity'
  },
  
  primaryContact: {
    dimension: 'teams',
    question: 'Are they the champion? Do they control budget? Who is their boss?',
    why: 'Primary contact must have influence and internal political capital'
  },
  
  technicalContact: {
    dimension: 'teams',
    question: 'Do they recommend or approve? What tech do they love/hate? Who do they report to?',
    why: 'Technical contact can block or accelerate - understand their power'
  },
  
  financialContact: {
    dimension: 'next',
    question: 'Do they approve POs? What is their approval limit? When do they review?',
    why: 'Financial approval process and limits determine close timeline'
  }
};
EOF

echo -e "${GREEN}✓ ntentQuestions.js created${NC}\n"

# ==============================================================================
# STEP 4: Backup CustomerProfileForm.jsx
# ==============================================================================
echo -e "${YELLOW}Step 4: Creating backup of CustomerProfileForm.jsx...${NC}"

FORM_FILE="src/components/business-case/CustomerProfile/CustomerProfileForm.jsx"

if [ ! -f "$FORM_FILE" ]; then
    echo -e "${RED}❌ Error: CustomerProfileForm.jsx not found at $FORM_FILE${NC}"
    echo ""
    echo "Please check if the file exists at a different location."
    echo "Your project structure might be different."
    exit 1
fi

cp "$FORM_FILE" "${FORM_FILE}.backup_$(date +%Y%m%d_%H%M%S)"
echo -e "${GREEN}✓ Backup created${NC}\n"

# ==============================================================================
# STEP 5: Add imports to CustomerProfileForm.jsx
# ==============================================================================
echo -e "${YELLOW}Step 5: Adding imports to CustomerProfileForm.jsx...${NC}"

# Check if imports already exist
if grep -q "NTENTLegendCollapsible" "$FORM_FILE"; then
    echo -e "${YELLOW}⚠ Imports already exist, skipping...${NC}\n"
else
    # Add imports after the first import statement
    sed -i "1a import NTENTLegendCollapsible from '../../ui/NTENTLegendCollapsible';\nimport NTENTBadge from '../../ui/NTENTBadge';" "$FORM_FILE"
    echo -e "${GREEN}✓ Imports added${NC}\n"
fi

# ==============================================================================
# STEP 6: Add legend to form
# ==============================================================================
echo -e "${YELLOW}Step 6: Adding collapsible legend to form...${NC}"

if grep -q "<NTENTLegendCollapsible" "$FORM_FILE"; then
    echo -e "${YELLOW}⚠ Legend already exists, skipping...${NC}\n"
else
    # Find <form and add legend after it
    sed -i '/<form /a\      <NTENTLegendCollapsible />' "$FORM_FILE"
    echo -e "${GREEN}✓ Legend added${NC}\n"
fi

# ==============================================================================
# STEP 7: Add NTENT badges to field labels
# ==============================================================================
echo -e "${YELLOW}Step 7: Adding NTENT badges to field labels...${NC}"

# Company Name
if ! grep -A1 "Company Name \*" "$FORM_FILE" | grep -q "NTENTBadge"; then
    sed -i '/Company Name \*/a\          <NTENTBadge dimension="next" tooltip="Use full legal entity name - appears on MSA\/PO. Who signs contracts?" />' "$FORM_FILE"
    echo "  ✓ Company Name [N]"
fi

# Industry
if ! grep -A1 "Industry \*" "$FORM_FILE" | grep -q "NTENTBadge"; then
    sed -i '/Industry \*/a\          <NTENTBadge dimension="need" tooltip="What industry-specific compliance drives urgency? (HIPAA, PCI, SOX)" />' "$FORM_FILE"
    echo "  ✓ Industry [N]"
fi

# Total Users
if ! grep -A1 "Total Number of Users" "$FORM_FILE" | grep -q "NTENTBadge"; then
    sed -i '/Total Number of Users/a\          <NTENTBadge dimension="need" tooltip="How many users need access TODAY vs. next 12 months? What drives growth?" />' "$FORM_FILE"
    echo "  ✓ Total Users [N]"
fi

# User Profile
if ! grep -A1 "User Profile Type" "$FORM_FILE" | grep -q "NTENTBadge"; then
    sed -i '/User Profile Type/a\          <NTENTBadge dimension="risk" tooltip="What % are power users? GPU needs? What breaks their current setup?" />' "$FORM_FILE"
    echo "  ✓ User Profile [R]"
fi

# Use Cases
if ! grep -A1 "Number of Use Cases" "$FORM_FILE" | grep -q "NTENTBadge"; then
    sed -i '/Number of Use Cases/a\          <NTENTBadge dimension="need" tooltip="What are the TOP 3 use cases? Which one fails most often today?" />' "$FORM_FILE"
    echo "  ✓ Use Cases [N]"
fi

# Applications
if ! grep -A1 "Number of Applications" "$FORM_FILE" | grep -q "NTENTBadge"; then
    sed -i '/Number of Applications/a\          <NTENTBadge dimension="risk" tooltip="How many are CRITICAL? How many tested in cloud? Which have no vendor support?" />' "$FORM_FILE"
    echo "  ✓ Applications [R]"
fi

# Current Platform
if ! grep -A1 "Current Platform" "$FORM_FILE" | grep -q "NTENTBadge"; then
    sed -i '/Current Platform/a\          <NTENTBadge dimension="risk" tooltip="What platform TODAY? What do they HATE about it? When does contract end?" />' "$FORM_FILE"
    echo "  ✓ Current Platform [R]"
fi

# Planned Start Date
if ! grep -A1 "Planned Start Date" "$FORM_FILE" | grep -q "NTENTBadge"; then
    sed -i '/Planned Start Date/a\          <NTENTBadge dimension="next" tooltip="What HAS to happen before you can start? Who needs to approve start?" />' "$FORM_FILE"
    echo "  ✓ Start Date [N]"
fi

# Target Go-Live Date
if ! grep -A1 "Target Go-Live Date" "$FORM_FILE" | grep -q "NTENTBadge"; then
    sed -i '/Target Go-Live Date/a\          <NTENTBadge dimension="time" tooltip="What happens if you miss this date? Who set this deadline and why?" />' "$FORM_FILE"
    echo "  ✓ Go-Live Date [T]"
fi

# Compelling Event
if ! grep -A1 "Compelling Event" "$FORM_FILE" | grep -q "NTENTBadge"; then
    sed -i '/Compelling Event/a\          <NTENTBadge dimension="time" tooltip="Contract expiring? Data center closing? Compliance deadline? M&A activity?" />' "$FORM_FILE"
    echo "  ✓ Compelling Event [T]"
fi

# Primary Contact
if ! grep -A1 "Primary Contact" "$FORM_FILE" | grep -q "NTENTBadge"; then
    sed -i '/Primary Contact$/a\          <NTENTBadge dimension="teams" tooltip="Are they the champion? Do they control budget? Who is their boss?" />' "$FORM_FILE"
    echo "  ✓ Primary Contact [T]"
fi

# Technical Contact
if ! grep -A1 "Technical Contact" "$FORM_FILE" | grep -q "NTENTBadge"; then
    sed -i '/Technical Contact$/a\          <NTENTBadge dimension="teams" tooltip="Do they recommend or approve? What tech do they love\/hate?" />' "$FORM_FILE"
    echo "  ✓ Technical Contact [T]"
fi

# Financial Contact
if ! grep -A1 "Financial Contact" "$FORM_FILE" | grep -q "NTENTBadge"; then
    sed -i '/Financial Contact$/a\          <NTENTBadge dimension="next" tooltip="Do they approve POs? What is their approval limit? When do they review?" />' "$FORM_FILE"
    echo "  ✓ Financial Contact [N]"
fi

echo ""

# ==============================================================================
# STEP 8: Summary
# ==============================================================================
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                                  ║${NC}"
echo -e "${GREEN}║  ✓ NTENT Badges Implementation Complete!                        ║${NC}"
echo -e "${GREEN}║                                                                  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════════╝${NC}\n"

echo -e "${BLUE}Files Created:${NC}"
echo "  ✓ src/components/ui/NTENTLegendCollapsible.jsx"
echo "  ✓ src/constants/ntentQuestions.js"
echo ""

echo -e "${BLUE}Files Modified:${NC}"
echo "  ✓ src/components/business-case/CustomerProfile/CustomerProfileForm.jsx"
echo "    - Added imports"
echo "    - Added collapsible legend"
echo "    - Added 13 NTENT badges"
echo ""

echo -e "${BLUE}Backup Created:${NC}"
echo "  ✓ ${FORM_FILE}.backup_*"
echo ""

echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Test the changes:"
echo "     npm run dev"
echo ""
echo "  2. Navigate to: Business Case Builder → Customer Profile"
echo ""
echo "  3. You should see:"
echo "     • Collapsible NTENT legend at top (click to expand/collapse)"
echo "     • Colored badges next to 13 field labels"
echo "     • Hover over badges to see discovery questions"
echo ""

echo -e "${BLUE}Badge Colors:${NC}"
echo "  🔵 [N] Blue  - Next Step (Company Name, Start Date, Financial Contact)"
echo "  🟠 [N] Amber - Need (Industry, Users, Use Cases, Applications)"
echo "  🔴 [T] Red   - Timing (Go-Live Date, Compelling Event)"
echo "  🔴 [T] Red   - Teams (Primary Contact, Technical Contact)"
echo "  ⚫ [R] Gray  - Risk (User Profile, Current Platform)"
echo ""

echo -e "${YELLOW}To Revert Changes:${NC}"
echo "  If something breaks, restore from backup:"
echo "  cp ${FORM_FILE}.backup_* ${FORM_FILE}"
echo ""

echo -e "${GREEN}Ready to test! Run: npm run dev 🚀${NC}"
