#!/usr/bin/env python3
import re

# Read the file
with open('src/utils/business-case/roi-calculator.js', 'r') as f:
    content = f.read()

# Find and replace the problematic section
old_code = '''  // Calculate payback and ROI
  const paybackMonths = implementationCost / (totalAnnualValue / 12);
  const netPresentValue = calculateNPV(totalAnnualValue, implementationCost, timeHorizonYears);
  
  const roi = {
    year1: ((totalAnnualValue - implementationCost) / implementationCost) * 100, 
    year3: ((totalAnnualValue * 3 - implementationCost) / implementationCost) * 100,
    year5: ((totalAnnualValue * 5 - implementationCost) / implementationCost) * 100
  };'''

new_code = '''  // Calculate payback and ROI with safety checks
  const paybackMonths = totalAnnualValue > 0 && implementationCost > 0
    ? implementationCost / (totalAnnualValue / 12)
    : null;
  
  const netPresentValue = calculateNPV(totalAnnualValue, implementationCost, timeHorizonYears);
  
  const roi = {
    year1: implementationCost > 0 ? ((totalAnnualValue - implementationCost) / implementationCost) * 100 : null,
    year3: implementationCost > 0 ? ((totalAnnualValue * 3 - implementationCost) / implementationCost) * 100 : null,
    year5: implementationCost > 0 ? ((totalAnnualValue * 5 - implementationCost) / implementationCost) * 100 : null
  };'''

content = content.replace(old_code, new_code)

# Write back
with open('src/utils/business-case/roi-calculator.js', 'w') as f:
    f.write(content)

print("✓ Fixed ROI calculator with safety checks")
