#!/usr/bin/env python3
import re

with open('src/utils/export/excel-generator.js', 'r') as f:
    content = f.read()

# Find and replace the Future State function
old_pattern = r'function createFutureStateSheet\(calculations\) \{.*?return ws;\s*\}'

new_function = '''function createFutureStateSheet(calculations) {
  const { futureState, customerProfile } = calculations;
  
  if (!futureState || !futureState.infrastructure) {
    return XLSX.utils.aoa_to_sheet([["Future State data not available"]]);
  }

  const data = [
    ['FUTURE STATE COST ANALYSIS'],
    [''],
    ['Azure Virtual Desktop + Nerdio Manager for Enterprise'],
    ['Users:', customerProfile.totalUsers],
    [''],
    ['MONTHLY COSTS'],
    ['Category', 'Monthly Cost', 'Annual Cost', 'Per User/Month'],
    ['Azure VMs (' + futureState.infrastructure.vms.sku + ')', 
      futureState.infrastructure.vms.monthlyCost, 
      futureState.infrastructure.vms.annualCost, 
      futureState.infrastructure.vms.monthlyCost / customerProfile.totalUsers
    ],
    ['Azure Storage (' + futureState.infrastructure.storage.type + ')', 
      futureState.infrastructure.storage.monthlyCost, 
      futureState.infrastructure.storage.annualCost, 
      futureState.infrastructure.storage.monthlyCost / customerProfile.totalUsers
    ],
    ['Nerdio Manager', 
      futureState.software.nerdioManager.monthlyCost, 
      futureState.software.nerdioManager.annualCost, 
      futureState.software.nerdioManager.pricePerUser
    ],
    [''],
    ['SUBTOTAL', 
      futureState.totals.monthlyGross, 
      futureState.totals.annualGross, 
      futureState.totals.perUserMonthly
    ],
    [''],
    ['NERDIO OPTIMIZATIONS'],
    ['Auto-Scaling (' + futureState.infrastructure.autoScaling.savingsPercent + '% savings)', 
      -futureState.infrastructure.autoScaling.monthlySavings, 
      -futureState.infrastructure.autoScaling.annualSavings, 
      -futureState.infrastructure.autoScaling.monthlySavings / customerProfile.totalUsers
    ],
    [''],
    ['TOTAL (Net)', 
      futureState.totals.monthlyNet, 
      futureState.totals.annualNet, 
      futureState.totals.perUserMonthly
    ],
    [''],
    ['INFRASTRUCTURE DETAILS'],
    ['VM Count:', futureState.infrastructure.vms.count],
    ['VM SKU:', futureState.infrastructure.vms.sku],
    ['Storage Total:', futureState.infrastructure.storage.totalGB + ' GB'],
    ['Storage Type:', futureState.infrastructure.storage.type]
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 40 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
  
  return ws;
}'''

content = re.sub(old_pattern, new_function, content, flags=re.DOTALL)

with open('src/utils/export/excel-generator.js', 'w') as f:
    f.write(content)

print("✓ Fixed Excel Future State sheet to match actual data structure")
