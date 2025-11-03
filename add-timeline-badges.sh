#!/bin/bash
# Add NTENT badges to ALL Timeline Calculator fields

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Adding NTENT badges to Timeline Calculator...${NC}\n"

# Backup first
cp src/components/TimelineCalculator.jsx src/components/TimelineCalculator.jsx.badges_backup

# Add NTENT Legend at the top of the form (after the main h1)
sed -i '/Nerdio Go-Live Timeline Calculator<\/h1>/a\      <NTENTLegend compact={true} />' src/components/TimelineCalculator.jsx

# Timeline Constraints Section
echo "Adding badges to Timeline Constraints..."
sed -i 's/Go-Live Target Date (Compelling Event)/Go-Live Target Date (Compelling Event)\n                    <NTENTBadge dimension="time" tooltip="What date is immovable? What happens if you miss it?" \/>/' src/components/TimelineCalculator.jsx

sed -i 's/Project Start Date$/Project Start Date\n                    <NTENTBadge dimension="next" tooltip="When can you realistically start?" \/>/' src/components/TimelineCalculator.jsx

# Project Scope Section
echo "Adding badges to Project Scope..."
sed -i 's/Number of Users$/Number of Users\n                    <NTENTBadge dimension="need" tooltip="How many users need AVD? Scale impacts timeline" \/>/' src/components/TimelineCalculator.jsx

sed -i 's/Use Cases$/Use Cases\n                    <NTENTBadge dimension="need" tooltip="Each use case adds complexity (Weight: 4 - HIGHEST)" \/>/' src/components/TimelineCalculator.jsx

# Current Technology Stack
echo "Adding badges to Current Tech Stack..."
sed -i 's/On-Prem to Cloud Migration$/On-Prem to Cloud Migration\n                    <NTENTBadge dimension="risk" tooltip="Full migration adds infrastructure complexity" \/>/' src/components/TimelineCalculator.jsx

sed -i 's/Citrix\/VMware Cloud$/Citrix\/VMware Cloud\n                    <NTENTBadge dimension="risk" tooltip="Migration from existing VDI platform" \/>/' src/components/TimelineCalculator.jsx

sed -i 's/Citrix\/VMware Hybrid$/Citrix\/VMware Hybrid\n                    <NTENTBadge dimension="risk" tooltip="Hybrid complexity adds testing time" \/>/' src/components/TimelineCalculator.jsx

sed -i 's/Citrix\/VMware On-Prem$/Citrix\/VMware On-Prem\n                    <NTENTBadge dimension="risk" tooltip="On-prem requires parallel testing" \/>/' src/components/TimelineCalculator.jsx

sed -i 's/Cloud Platform$/Cloud Platform\n                    <NTENTBadge dimension="edu" tooltip="Azure is native for AVD. GCP\/AWS adds complexity" \/>/' src/components/TimelineCalculator.jsx

sed -i 's/Azure Landing Zone$/Azure Landing Zone\n                    <NTENTBadge dimension="next" tooltip="Existing landing zone saves 2-3 weeks" \/>/' src/components/TimelineCalculator.jsx

sed -i 's/Operating Systems$/Operating Systems\n                    <NTENTBadge dimension="risk" tooltip="Legacy OS requires upgrade\/compatibility testing" \/>/' src/components/TimelineCalculator.jsx

# Governance & Security
echo "Adding badges to Governance & Security..."
sed -i 's/Change Control Process$/Change Control Process\n                    <NTENTBadge dimension="risk" tooltip="How fast can you get approvals? Directly impacts velocity" \/>/' src/components/TimelineCalculator.jsx

sed -i 's/Security Review Process$/Security Review Process\n                    <NTENTBadge dimension="risk" tooltip="Security reviews gate deployments and add approval cycles" \/>/' src/components/TimelineCalculator.jsx

# Application Discovery - THE BIG ONE
echo "Adding badges to Application Discovery..."
sed -i 's/Number of Applications$/Number of Applications\n                    <NTENTBadge dimension="risk" tooltip="More apps = more testing, packaging, validation" \/>/' src/components/TimelineCalculator.jsx

sed -i 's/App Modernization Required?$/App Modernization Required?\n                    <NTENTBadge dimension="risk" tooltip="10x WEIGHT! Single biggest timeline factor - what could kill this?" \/>/' src/components/TimelineCalculator.jsx

sed -i 's/Backend System Connections$/Backend System Connections\n                    <NTENTBadge dimension="risk" tooltip="Backend connections affect network design and latency" \/>/' src/components/TimelineCalculator.jsx

sed -i 's/Peripheral Device Requirements$/Peripheral Device Requirements\n                    <NTENTBadge dimension="risk" tooltip="Peripherals need special drivers and testing" \/>/' src/components/TimelineCalculator.jsx

sed -i 's/Cloud Testing Status$/Cloud Testing Status\n                    <NTENTBadge dimension="edu" tooltip="Prior cloud testing reduces unknowns" \/>/' src/components/TimelineCalculator.jsx

sed -i 's/Last Application Modernization$/Last Application Modernization\n                    <NTENTBadge dimension="risk" tooltip="Recent modernization = less technical debt" \/>/' src/components/TimelineCalculator.jsx

echo -e "\n${GREEN}✓ All NTENT badges added to Timeline Calculator!${NC}"
echo -e "${GREEN}✓ Total badges added: 18${NC}\n"

echo "Test with: npm run dev"
echo "You should see:"
echo "  - NTENT legend at top of form"
echo "  - Colored badges next to every field label"
echo "  - Hover over badges to see discovery questions"
