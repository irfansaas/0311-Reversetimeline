#!/bin/bash
# Fix duplicate NTENT imports in CustomerProfileForm.jsx

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Fixing duplicate imports in CustomerProfileForm.jsx...${NC}\n"

FORM_FILE="src/components/business-case/CustomerProfile/CustomerProfileForm.jsx"

if [ ! -f "$FORM_FILE" ]; then
    echo -e "${RED}❌ Error: CustomerProfileForm.jsx not found${NC}"
    exit 1
fi

# Create a backup
cp "$FORM_FILE" "${FORM_FILE}.before_fix"

# Remove duplicate import lines using awk to keep only the first occurrence
awk '
!seen[$0]++ || !/^import.*NTENT/ && !/^import.*BUSINESS_CASE_NTENT_QUESTIONS/
' "$FORM_FILE" > "${FORM_FILE}.tmp"

mv "${FORM_FILE}.tmp" "$FORM_FILE"

echo -e "${GREEN}✓ Duplicate imports removed${NC}"
echo -e "${GREEN}✓ Backup saved to: ${FORM_FILE}.before_fix${NC}\n"

echo -e "${YELLOW}Checking the file...${NC}"
echo "Import statements found:"
grep "^import.*NTENT" "$FORM_FILE" || echo "  (none)"
echo ""

echo -e "${GREEN}Done! Try running: npm run dev${NC}"
