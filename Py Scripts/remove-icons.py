#!/usr/bin/env python3
# -*- coding: utf-8 -*-

with open('src/utils/export/pdf-generator.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove all icon characters
content = content.replace('%Ï', '')
content = content.replace('Ï', '')
content = content.replace('↓', '')  # Remove arrow too
content = content.replace('₂', '2')  # Fix CO2 subscript

with open('src/utils/export/pdf-generator.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Removed all unicode icon characters")
