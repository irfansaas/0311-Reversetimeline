#!/usr/bin/env python3

with open('src/utils/export/pdf-generator.js', 'r') as f:
    content = f.read()

# Fix the bar chart section with safety checks
old_code = '''  // Bar chart visualization
  const maxCost = Math.max(currentState.costs.annual, futureState.totals.annualNet);
  const scale = (pageWidth - 2 * margin - 50) / maxCost;
  
  // Current state bar (RED)
  doc.setFillColor(...colors.danger);
  doc.rect(margin + 50, currentY, currentState.costs.annual * scale, 18, 'F');'''

new_code = '''  // Bar chart visualization with safety checks
  const currentCost = currentState?.costs?.annual || 0;
  const futureCost = futureState?.totals?.annualNet || 0;
  const maxCost = Math.max(currentCost, futureCost);
  const scale = maxCost > 0 ? (pageWidth - 2 * margin - 50) / maxCost : 1;
  
  // Current state bar (RED)
  doc.setFillColor(...colors.danger);
  const currentWidth = Math.max(0, currentCost * scale);
  if (currentWidth > 0) {
    doc.rect(margin + 50, currentY, currentWidth, 18, 'F');
  }'''

content = content.replace(old_code, new_code)

# Fix the future state bar
old_future = '''  // Future state bar (GREEN)
  doc.setFillColor(...colors.success);
  doc.rect(margin + 50, currentY, futureState.totals.annualNet * scale, 18, 'F');'''

new_future = '''  // Future state bar (GREEN)
  doc.setFillColor(...colors.success);
  const futureWidth = Math.max(0, futureCost * scale);
  if (futureWidth > 0) {
    doc.rect(margin + 50, currentY, futureWidth, 18, 'F');
  }'''

content = content.replace(old_future, new_future)

# Also update the text references
content = content.replace(
    'currentState.costs.annual',
    'currentCost'
)
content = content.replace(
    'futureState.totals.annualNet',
    'futureCost'
)

with open('src/utils/export/pdf-generator.js', 'w') as f:
    f.write(content)

print("✓ Fixed PDF generator rect calls with safety checks")
print("  - Added null/undefined checks")
print("  - Prevented negative/NaN widths")
print("  - Added zero-width guards")
