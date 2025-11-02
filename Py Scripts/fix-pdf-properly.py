#!/usr/bin/env python3

# Read the backup
try:
    with open('src/utils/export/pdf-generator.js.backup_temp', 'r') as f:
        content = f.read()
except:
    print("No backup found - using current file")
    with open('src/utils/export/pdf-generator.js', 'r') as f:
        content = f.read()

# Only fix the specific bar chart section (around line 360-390)
# Find the bar chart section and add safety checks ONLY there

import re

# Find the bar chart section specifically
pattern = r'(// Bar chart visualization\s+const maxCost = Math\.max\(currentState\.costs\.annual, futureState\.totals\.annualNet\);[^}]+doc\.text\(formatCurrency\(futureState\.totals\.annualNet\)[^;]+;)'

replacement = '''// Bar chart visualization with safety checks
  const currentAnnualCost = currentState?.costs?.annual || 0;
  const futureAnnualCost = futureState?.totals?.annualNet || 0;
  const maxCost = Math.max(currentAnnualCost, futureAnnualCost);
  const scale = maxCost > 0 ? (pageWidth - 2 * margin - 50) / maxCost : 1;
  
  // Current state bar (RED)
  doc.setFillColor(...colors.danger);
  const currentBarWidth = Math.max(0, currentAnnualCost * scale);
  if (currentBarWidth > 0) {
    doc.rect(margin + 50, currentY, currentBarWidth, 18, 'F');
  }
  doc.setTextColor(...colors.dark);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Current:', margin, currentY + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(currentAnnualCost), margin + 55 + currentAnnualCost * scale, currentY + 12);
  currentY += 25;
  
  // Future state bar (GREEN)
  doc.setFillColor(...colors.success);
  const futureBarWidth = Math.max(0, futureAnnualCost * scale);
  if (futureBarWidth > 0) {
    doc.rect(margin + 50, currentY, futureBarWidth, 18, 'F');
  }
  doc.setFont('helvetica', 'bold');
  doc.text('Future:', margin, currentY + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(futureAnnualCost), margin + 55 + futureAnnualCost * scale, currentY + 12);'''

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/utils/export/pdf-generator.js', 'w') as f:
    f.write(content)

print("✓ Fixed PDF bar chart section with unique variable names")
print("  - Used currentAnnualCost/futureAnnualCost to avoid conflicts")
print("  - Added safety checks only in bar chart section")
