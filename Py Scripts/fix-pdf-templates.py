#!/usr/bin/env python3
import re

with open('src/utils/export/pdf-generator.js', 'r') as f:
    content = f.read()

# Find all doc.text calls with template literals in single quotes and convert to backticks
# Pattern: doc.text('...${...}...', ...)

def fix_template_literal(match):
    full_match = match.group(0)
    # Replace single quotes with backticks for strings containing ${
    if '${' in full_match:
        # Find the string part and replace quotes
        fixed = re.sub(r"'([^']*\$\{[^}]+\}[^']*)'", r'`\1`', full_match)
        return fixed
    return full_match

# Fix all doc.text calls
content = re.sub(
    r'doc\.text\([^;]+\);',
    fix_template_literal,
    content
)

# Also fix standalone template strings that aren't in doc.text
content = re.sub(
    r"'([^']*\$\{[^']+\}[^']*)'",
    r'`\1`',
    content
)

with open('src/utils/export/pdf-generator.js', 'w') as f:
    f.write(content)

print("✓ Fixed template literals to use backticks")
print("  - Converted single quotes to backticks for ${...} expressions")
print("  - Variables will now interpolate correctly")
