#!/bin/bash
set -e

echo "Fixing PDF generator rect calls..."

# Backup
cp src/utils/export/pdf-generator.js src/utils/export/pdf-generator.js.sed_backup

# Insert safe variables before line 362
sed -i '362i\  const currentCostVal = currentState?.costs?.annual || 0;\n  const futureCostVal = futureState?.totals?.annualNet || 0;' src/utils/export/pdf-generator.js

# Fix maxCost (now line 366 after insert)
sed -i '366s/.*/  const maxCost = Math.max(currentCostVal, futureCostVal);/' src/utils/export/pdf-generator.js

# Fix scale (now line 367)
sed -i '367s/.*/  const scale = maxCost > 0 ? (pageWidth - 2 * margin - 40) \/ maxCost : 1;/' src/utils/export/pdf-generator.js

# Fix first rect (now around line 370)
sed -i '370s/.*/  const w1 = Math.max(0, currentCostVal * scale); if (w1 > 0 \&\& !isNaN(w1)) { doc.rect(margin + 40, currentY, w1, 15, "F"); }/' src/utils/export/pdf-generator.js

# Fix text references (line 374)
sed -i 's/currentState\.costs\.annual/currentCostVal/g' src/utils/export/pdf-generator.js

# Fix second rect (around line 382)  
sed -i '382s/.*/  const w2 = Math.max(0, futureCostVal * scale); if (w2 > 0 \&\& !isNaN(w2)) { doc.rect(margin + 40, currentY, w2, 15, "F"); }/' src/utils/export/pdf-generator.js

# Fix text references
sed -i 's/futureState\.totals\.annualNet/futureCostVal/g' src/utils/export/pdf-generator.js

echo "✓ Fixed PDF rect calls"
echo ""
echo "Verify:"
sed -n '360,390p' src/utils/export/pdf-generator.js
