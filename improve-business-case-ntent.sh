#!/bin/bash
# Add NTENT badges with compelling discovery questions to Business Case Builder

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  NTENT Badges - Business Case Builder             ║${NC}"
echo -e "${BLUE}║  Adding compelling discovery questions            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}\n"



# Backup files
echo -e "${YELLOW}Creating backups...${NC}"
cp src/components/business-case/CustomerProfile/CustomerProfileForm.jsx \
   src/components/business-case/CustomerProfile/CustomerProfileForm.jsx.ntent_backup

# Add import to CustomerProfileForm
echo -e "${YELLOW}Adding imports to CustomerProfileForm...${NC}"
sed -i '1a import NTENTLegendCollapsible from '\''../../ui/NTENTLegendCollapsible'\'';\nimport { BUSINESS_CASE_NTENT_QUESTIONS } from '\''../../../constants/ntentQuestions'\'';' \
  src/components/business-case/CustomerProfile/CustomerProfileForm.jsx

# Replace the regular legend with collapsible one
sed -i 's/<NTENTLegend compact={true} \/>/<NTENTLegendCollapsible \/>/' \
  src/components/business-case/CustomerProfile/CustomerProfileForm.jsx

# Add NTENT badges to key fields with compelling questions
echo -e "${YELLOW}Adding NTENT badges with discovery questions...${NC}"

# Company Name
sed -i '/Company Name \*/s/<\/label>/<NTENTBadge dimension="next" tooltip="Use full legal entity name - this appears on MSA\/PO. Who signs contracts?" \/><\/label>/' \
  src/components/business-case/CustomerProfile/CustomerProfileForm.jsx

# Industry
sed -i '/Industry \*/s/<\/label>/<NTENTBadge dimension="need" tooltip="What industry-specific compliance drives urgency? (HIPAA, PCI, SOX)" \/><\/label>/' \
  src/components/business-case/CustomerProfile/CustomerProfileForm.jsx

# Total Users
sed -i '/Total Number of Users \*/s/<\/label>/<NTENTBadge dimension="need" tooltip="How many users need access TODAY vs. next 12 months? What drives growth?" \/><\/label>/' \
  src/components/business-case/CustomerProfile/CustomerProfileForm.jsx

# User Profile Type
sed -i '/User Profile Type/s/<\/label>/<NTENTBadge dimension="risk" tooltip="What % are power users? GPU needs? What breaks their current setup?" \/><\/label>/' \
  src/components/business-case/CustomerProfile/CustomerProfileForm.jsx

# Number of Use Cases
sed -i '/Number of Use Cases/s/<\/label>/<NTENTBadge dimension="need" tooltip="What are the TOP 3 use cases? Which one fails most often today?" \/><\/label>/' \
  src/components/business-case/CustomerProfile/CustomerProfileForm.jsx

# Number of Applications
sed -i '/Number of Applications/s/<\/label>/<NTENTBadge dimension="risk" tooltip="How many are CRITICAL? How many tested in cloud? Which have no vendor support?" \/><\/label>/' \
  src/components/business-case/CustomerProfile/CustomerProfileForm.jsx

# Current Platform
sed -i '/Current Platform/s/<\/label>/<NTENTBadge dimension="risk" tooltip="What platform TODAY? What do they HATE about it? When does contract end?" \/><\/label>/' \
  src/components/business-case/CustomerProfile/CustomerProfileForm.jsx

# Planned Start Date
sed -i '/Planned Start Date/s/<\/label>/<NTENTBadge dimension="next" tooltip="What HAS to happen before you can start? Who needs to approve start?" \/><\/label>/' \
  src/components/business-case/CustomerProfile/CustomerProfileForm.jsx

# Target Go-Live Date - THE COMPELLING EVENT
sed -i '/Target Go-Live Date/s/<\/label>/<NTENTBadge dimension="time" tooltip="What happens if you miss this date? Who set this deadline and why?" \/><\/label>/' \
  src/components/business-case/CustomerProfile/CustomerProfileForm.jsx

# Compelling Event
sed -i '/Compelling Event/s/<\/label>/<NTENTBadge dimension="time" tooltip="Contract expiring? Data center closing? Compliance deadline? M&A activity?" \/><\/label>/' \
  src/components/business-case/CustomerProfile/CustomerProfileForm.jsx

# Primary Contact
sed -i '/Primary Contact$/s/<\/label>/<NTENTBadge dimension="teams" tooltip="Are they the champion? Do they control budget? Who is their boss?" \/><\/label>/' \
  src/components/business-case/CustomerProfile/CustomerProfileForm.jsx

# Technical Contact  
sed -i '/Technical Contact$/s/<\/label>/<NTENTBadge dimension="teams" tooltip="Do they recommend or approve? What tech do they love\/hate?" \/><\/label>/' \
  src/components/business-case/CustomerProfile/CustomerProfileForm.jsx

# Financial Contact
sed -i '/Financial Contact$/s/<\/label>/<NTENTBadge dimension="next" tooltip="Do they approve POs? What is their approval limit? When do they review?" \/><\/label>/' \
  src/components/business-case/CustomerProfile/CustomerProfileForm.jsx

echo -e "\n${GREEN}✓ Business Case Builder NTENT implementation complete!${NC}\n"
echo -e "Added badges to:"
echo -e "  • Company Name [N] - Next Step"
echo -e "  • Industry [N] - Need"  
echo -e "  • Total Users [N] - Need"
echo -e "  • User Profile [R] - Risk"
echo -e "  • Use Cases [N] - Need"
echo -e "  • Applications [R] - Risk"
echo -e "  • Current Platform [R] - Risk"
echo -e "  • Start Date [N] - Next Step"
echo -e "  • Go-Live Date [T] - Timing ⚡"
echo -e "  • Compelling Event [T] - Timing ⚡"
echo -e "  • Contacts [T] [N] - Teams & Next Step"

echo -e "\n${BLUE}Test with: npm run dev${NC}"
echo -e "Navigate to Business Case Builder → Customer Profile"
echo -e "\nYou should see:"
echo -e "  ✓ Collapsible NTENT legend (click to expand)"
echo -e "  ✓ Colored badges on each field"
echo -e "  ✓ Hover over badges for compelling discovery questions"
