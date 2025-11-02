#!/usr/bin/env python3
import re

with open('src/utils/export/pdf-generator.js', 'r') as f:
    content = f.read()

# Wrap all doc.text calls in try-catch
def safe_text(match):
    indent = match.group(1)
    call = match.group(2)
    
    return f'''{indent}try {{
{indent}  {call}
{indent}}} catch(e) {{ console.warn('PDF text skipped:', e); }}'''

# Wrap all doc.text calls
content = re.sub(
    r'^(\s*)(doc\.text\([^;]+\);)',
    safe_text,
    content,
    flags=re.MULTILINE
)

with open('src/utils/export/pdf-generator.js', 'w') as f:
    f.write(content)

print("✓ Wrapped all doc.text calls with try-catch blocks")
print("  - Any text with invalid parameters will be skipped")
print("  - PDF generation will continue")
