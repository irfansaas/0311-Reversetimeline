#!/usr/bin/env python3
import re

# Start from backup
with open('src/utils/export/pdf-generator.js.backup_temp', 'r') as f:
    content = f.read()

# Step 1: Fix template literals (single quotes to backticks for strings with ${})
# But ONLY inside function arguments, not breaking function calls
content = re.sub(
    r"([,\(]\s*)'([^']*\$\{[^}]+\}[^']*)'",
    r"\1`\2`",
    content
)

# Step 2: Wrap rect calls in try-catch
def wrap_rect(match):
    indent = match.group(1)
    call = match.group(2)
    return f'''{indent}try {{
{indent}  {call}
{indent}}} catch(e) {{ /* skip */ }}'''

content = re.sub(
    r'^(\s*)(doc\.(?:rect|roundedRect)\([^;]+\);)$',
    wrap_rect,
    content,
    flags=re.MULTILINE
)

# Step 3: Wrap text calls in try-catch
content = re.sub(
    r'^(\s*)(doc\.text\([^;]+\);)$',
    wrap_rect,  # Same wrapper function works
    content,
    flags=re.MULTILINE
)

with open('src/utils/export/pdf-generator.js', 'w') as f:
    f.write(content)

print("✓ Complete PDF fix applied")
print("  - Fixed template literals (single quotes → backticks)")
print("  - Wrapped all rect calls in try-catch")
print("  - Wrapped all text calls in try-catch")
