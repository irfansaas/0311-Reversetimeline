#!/usr/bin/env python3
import re

with open('src/utils/export/pdf-generator.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and fix ALL doc.text` patterns
# Pattern: doc.text`template literal`, args
# Should be: doc.text(`template literal`, args)

# Replace doc.text` with doc.text(`
content = re.sub(r'doc\.text`([^`]+)`', r'doc.text(`\1`)', content)

with open('src/utils/export/pdf-generator.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Fixed all remaining doc.text` syntax errors")

# Count how many were fixed
count = content.count('doc.text(`')
print(f"  Total doc.text calls: {count}")
