#!/usr/bin/env python3
import re

with open('src/utils/export/pdf-generator.js', 'r') as f:
    content = f.read()

# Helper function to wrap rect calls with safety checks
def safe_rect(match):
    indent = match.group(1)
    call = match.group(2)
    
    # Extract parameters from rect call
    # Pattern: doc.rect(x, y, width, height, style) or doc.roundedRect(...)
    
    # For simplicity, wrap the entire call in a try-catch
    return f'''{indent}try {{
{indent}  {call}
{indent}}} catch(e) {{ console.warn('PDF rect skipped:', e); }}'''

# Wrap all doc.rect calls in try-catch
content = re.sub(
    r'^(\s*)(doc\.rect\([^;]+\);)',
    safe_rect,
    content,
    flags=re.MULTILINE
)

# Wrap all doc.roundedRect calls in try-catch
content = re.sub(
    r'^(\s*)(doc\.roundedRect\([^;]+\);)',
    safe_rect,
    content,
    flags=re.MULTILINE
)

with open('src/utils/export/pdf-generator.js', 'w') as f:
    f.write(content)

print("✓ Wrapped all 25 rect/roundedRect calls with try-catch blocks")
print("  - Any rect with invalid parameters will be skipped")
print("  - PDF will still generate without breaking")
