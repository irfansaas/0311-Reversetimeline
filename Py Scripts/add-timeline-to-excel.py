#!/usr/bin/env python3
import re

with open('src/utils/export/excel-generator.js', 'r') as f:
    content = f.read()

# Find the generateBusinessCaseExcel function and add Timeline sheet
# Look for where sheets are being added

# First, add the createTimelineSheet function before the last function
timeline_function = '''
function createTimelineSheet(calculations) {
  const { timeline } = calculations;
  
  if (!timeline || !timeline.phases) {
    return XLSX.utils.aoa_to_sheet([["Timeline data not available"]]);
  }

  const data = [
    ['IMPLEMENTATION TIMELINE'],
    [''],
    ['TIMELINE SUMMARY'],
    ['Sequential Duration:', timeline.totals.sequentialWeeks + ' weeks'],
    ['Parallelized Duration:', timeline.totals.parallelizedWeeks + ' weeks'],
    ['Time Saved:', timeline.totals.creditWeeks + ' weeks'],
    ['Go-Live Buffer:', Math.abs(timeline.validity) + ' weeks ' + (timeline.validity >= 0 ? 'buffer' : 'short')],
    [''],
    ['IMPLEMENTATION PHASES'],
    ['Phase', 'Description', 'Duration (Weeks)', 'Percentage'],
    ...timeline.phases.items.map(phase => [
      phase.key,
      phase.label,
      phase.weeks,
      ((phase.weeks / timeline.phases.sequentialTotal) * 100).toFixed(1) + '%'
    ]),
    [''],
    ['TOTAL', '', timeline.phases.sequentialTotal, '100%'],
    [''],
    ['COMPLEXITY ASSESSMENT'],
    ['Driver', 'Complexity'],
    ['Timeline Pressure (D5)', timeline.audit.bands.D5.toUpperCase()],
    ['User Scale (D6)', timeline.audit.bands.D6.toUpperCase()],
    ['Use Cases (D7)', timeline.audit.bands.D7.toUpperCase()],
    ['Cloud Platform (D14)', timeline.audit.bands.D14.toUpperCase()],
    ['Landing Zone (D15)', timeline.audit.bands.D15.toUpperCase()],
    ['OS Version (D16)', timeline.audit.bands.D16.toUpperCase()],
    ['Change Control (D19)', timeline.audit.bands.D19.toUpperCase()],
    ['Security Review (D22)', timeline.audit.bands.D22.toUpperCase()],
    ['App Count (D25)', timeline.audit.bands.D25.toUpperCase()],
    ['App Deployment (D26)', timeline.audit.bands.D26.toUpperCase()],
    ['Backend Sensitivity (D27)', timeline.audit.bands.D27.toUpperCase()],
    ['Peripherals (D28)', timeline.audit.bands.D28.toUpperCase()],
    ['LOB Testing (D29)', timeline.audit.bands.D29.toUpperCase()],
    ['Modernization Age (D30)', timeline.audit.bands.D30.toUpperCase()],
    [''],
    ['Parallelization Factor:', (timeline.audit.parallelizationPct * 100).toFixed(0) + '%']
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 30 }, { wch: 40 }, { wch: 20 }, { wch: 15 }];
  
  return ws;
}

'''

# Insert the timeline function before the export statement
content = content.replace(
    'export function generateBusinessCaseExcel',
    timeline_function + '\nexport function generateBusinessCaseExcel'
)

# Now add the Timeline sheet to the workbook
# Find where sheets are being appended
old_append = "  XLSX.utils.book_append_sheet(workbook, roiSheet, 'ROI Metrics');"
new_append = '''  XLSX.utils.book_append_sheet(workbook, roiSheet, 'ROI Metrics');
  
  // Add Timeline sheet
  const timelineSheet = createTimelineSheet(calculations);
  XLSX.utils.book_append_sheet(workbook, timelineSheet, 'Implementation Timeline');'''

content = content.replace(old_append, new_append)

with open('src/utils/export/excel-generator.js', 'w') as f:
    f.write(content)

print("✓ Added Timeline sheet to Excel export")
print("  - Timeline Summary (sequential, parallelized, time saved)")
print("  - Phase Breakdown (6 implementation phases)")
print("  - Complexity Assessment (14 drivers)")
