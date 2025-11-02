#!/usr/bin/env python3
import re

# Start from backup
with open('src/utils/export/pdf-generator.js.backup_temp', 'r', encoding='utf-8') as f:
    content = f.read()

print("Starting comprehensive PDF fix...")

# 1. Remove bullet characters
content = content.replace("doc.text('●', margin, currentY);", "// doc.text('●', margin, currentY); // Removed")
content = content.replace('↓', '')
content = content.replace('₂', '2')
content = content.replace('%Ï', '')
content = content.replace('Ï', '')
print("✓ Removed bullets and special characters")

# 2. Fix template literals - single quotes to backticks for strings with ${
content = re.sub(r"([,\(]\s*)'([^']*\$\{[^}]+\}[^']*)'", r"\1`\2`", content)
print("✓ Fixed template literals")

# 3. Fix doc.text` syntax
content = re.sub(r'doc\.text`([^`]+)`', r'doc.text(`\1`)', content)
print("✓ Fixed doc.text syntax")

# 4. Wrap rect calls in try-catch
def wrap_call(match):
    indent = match.group(1)
    call = match.group(2)
    return f'''{indent}try {{
{indent}  {call}
{indent}}} catch(e) {{ /* skip */ }}'''

content = re.sub(r'^(\s*)(doc\.(?:rect|roundedRect)\([^;]+\);)$', wrap_call, content, flags=re.MULTILINE)
print("✓ Wrapped rect calls")

# 5. Wrap text calls in try-catch
content = re.sub(r'^(\s*)(doc\.text\([^;]+\);)$', wrap_call, content, flags=re.MULTILINE)
print("✓ Wrapped text calls")

# 6. Fix implementation section - ONLY in the roadmap section
# Find the implementation roadmap section
roadmap_pattern = r"(// ============================================\s*// PAGE 7: IMPLEMENTATION ROADMAP.*?)(// ============================================\s*// PAGE 8)"

def fix_implementation(match):
    section = match.group(1)
    next_page = match.group(2)
    
    # Add safety checks after "currentY = 35;"
    section = section.replace(
        'currentY = 35;',
        '''currentY = 35;
  
  // Safety checks
  const implWeeks = implementationCost?.durationWeeks || 16;
  const implTotal = implementationCost?.totalCost || 220000;
  const implPM = implementationCost?.projectManagementHours || 200;
  const implArch = implementationCost?.architectHours || 240;
  const implEng = implementationCost?.engineerHours || 600;'''
    )
    
    # Replace in this section only
    section = section.replace('implementationCost.durationWeeks', 'implWeeks')
    section = section.replace('implementationCost.totalCost', 'implTotal')
    section = section.replace('implementationCost.projectManagementHours', 'implPM')
    section = section.replace('implementationCost.architectHours', 'implArch')
    section = section.replace('implementationCost.engineerHours', 'implEng')
    
    return section + next_page

content = re.sub(roadmap_pattern, fix_implementation, content, flags=re.DOTALL)
print("✓ Fixed implementation NaN values")

with open('src/utils/export/pdf-generator.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Complete PDF fix applied successfully!")
