#!/usr/bin/env python3

with open('src/utils/export/pdf-generator.js', 'r') as f:
    content = f.read()

# Fix doc.text` pattern - should be doc.text(` with parentheses
# Pattern: doc.text`...`, args
# Replace: doc.text(`...`, args)

import re

# Find all instances of doc.text` followed by template literal
# Replace with doc.text(` ... `)
content = re.sub(
    r'doc\.text`([^`]+)`',
    r'doc.text(`\1`)',
    content
)

with open('src/utils/export/pdf-generator.js', 'w') as f:
    f.write(content)

print("✓ Fixed all doc.text` syntax errors")
print("  - Changed doc.text`...` to doc.text(`...`)")
