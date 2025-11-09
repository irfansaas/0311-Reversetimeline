/**
 * Data Migration Helper
 * 
 * Helps migrate from old phaseOverlap.js structure to new richard-timeline-engine.js structure
 * 
 * Use this if you have:
 * - Saved scenarios in localStorage
 * - Test data in old format
 * - Customer data that needs conversion
 */

import { calculateRichardTimeline } from './richard-timeline-engine';

// ============================================================================
// OLD FORMAT DETECTION & CONVERSION
// ============================================================================

/**
 * Detect if data is in old format (phaseOverlap.js style)
 */
export function isOldFormat(data) {
  // Old format has hardcoded phases with fixed durations
  const indicators = [
    data.phases && Array.isArray(data.phases),
    data.phases && data.phases[0]?.weeks === 16, // Hardcoded app transform
    data.totalWeeksWithOverlap,
    data.overlapRules,
    !data.answers // No question answers in old format
  ];
  
  return indicators.filter(Boolean).length >= 3;
}

/**
 * Convert old format scenario to new format
 * 
 * NOTE: This creates DEFAULT answers since old format didn't capture discovery data.
 * You'll need to re-run discovery with actual customer to get accurate timeline.
 */
export function convertOldToNewFormat(oldScenario) {
  console.warn('⚠️  Converting from old format - using DEFAULT answers');
  console.warn('⚠️  Re-run discovery with customer for accurate timeline');
  
  // Create default "medium complexity" answers
  const defaultAnswers = {
    D6: '3 to 9 months',
    D8: '1,000 to 5,000 users',
    D9: '5 to 10 use cases',
    D10: 'No',
    D11: 'No',
    D12: 'No',
    D13: 'No',
    D15: 'Azure',
    D16: 'Existing Azure deployment, but new landing zone needed',
    D17: 'Windows 10 multisession or Windows Server 2016',
    D19: 'Standard corporate processes, 1 to 2 weeks per change request',
    D21: 'We have a short review process',
    D23: '100 to 300 applications',
    D24: 'Complex formats (MSI, EXE), no modernization required',
    D25: 'On-prem physical desktops to cloud VDI (Net/New DAAS)',
    D26: 'Yes, but there are few and/or they are low priority/latency insensitive',
    D27: 'Yes, can use RemoteFX',
    D28: 'Yes, with some challenges',
    D29: '1 to 2 years ago'
  };
  
  // Extract what we can from old format
  const goLiveDate = oldScenario.goLiveDate 
    ? new Date(oldScenario.goLiveDate)
    : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000); // 6 months from now
  
  const customerName = oldScenario.customerName || oldScenario.name || 'Converted Scenario';
  
  // Calculate with new engine
  const newResults = calculateRichardTimeline(
    defaultAnswers,
    goLiveDate,
    30 // Default 30% app completion
  );
  
  return {
    id: oldScenario.id || Date.now().toString(),
    name: `${customerName} (CONVERTED - VERIFY)`,
    customerProfile: {
      name: customerName,
      totalUsers: 2500, // Middle of "1,000 to 5,000" range
      industry: oldScenario.industry || 'Unknown',
      currentPlatform: 'Unknown - Converted from old format'
    },
    answers: defaultAnswers,
    goLiveDate,
    appCompletionPercent: 30,
    calculations: newResults,
    metadata: {
      convertedFrom: 'old-phaseOverlap-format',
      convertedAt: new Date().toISOString(),
      needsReDiscovery: true,
      originalData: oldScenario
    }
  };
}

// ============================================================================
// LOCALSTORAGE MIGRATION
// ============================================================================

/**
 * Migrate all scenarios in localStorage from old to new format
 */
export function migrateLocalStorage() {
  console.log('🔄 Starting localStorage migration...');
  
  const oldKey = 'timelineScenarios'; // Your old key
  const newKey = 'businessCaseScenarios'; // New key
  
  try {
    // Get old scenarios
    const oldDataRaw = localStorage.getItem(oldKey);
    if (!oldDataRaw) {
      console.log('ℹ️  No old scenarios found');
      return { migrated: 0, skipped: 0, errors: [] };
    }
    
    const oldScenarios = JSON.parse(oldDataRaw);
    if (!Array.isArray(oldScenarios)) {
      console.warn('⚠️  Old data is not an array, skipping');
      return { migrated: 0, skipped: 1, errors: [] };
    }
    
    console.log(`Found ${oldScenarios.length} old scenarios`);
    
    // Get existing new scenarios
    const newDataRaw = localStorage.getItem(newKey);
    const newScenarios = newDataRaw ? JSON.parse(newDataRaw) : [];
    
    // Convert each old scenario
    let migrated = 0;
    let skipped = 0;
    const errors = [];
    
    oldScenarios.forEach((oldScenario, index) => {
      try {
        if (isOldFormat(oldScenario)) {
          const converted = convertOldToNewFormat(oldScenario);
          newScenarios.push(converted);
          migrated++;
          console.log(`✅ Converted: ${converted.name}`);
        } else {
          skipped++;
          console.log(`⏭️  Skipped: Already in new format`);
        }
      } catch (error) {
        errors.push({ index, error: error.message });
        console.error(`❌ Error converting scenario ${index}:`, error);
      }
    });
    
    // Save new scenarios
    localStorage.setItem(newKey, JSON.stringify(newScenarios));
    
    // Optionally backup old scenarios
    localStorage.setItem(`${oldKey}_backup`, oldDataRaw);
    
    console.log('\n📊 Migration Summary:');
    console.log(`   Migrated: ${migrated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Errors: ${errors.length}`);
    console.log(`   Backup saved: ${oldKey}_backup`);
    
    return { migrated, skipped, errors };
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// ============================================================================
// CSV EXPORT/IMPORT FOR BULK MIGRATION
// ============================================================================

/**
 * Export scenarios to CSV for review/editing
 */
export function exportToCSV(scenarios) {
  const headers = [
    'Name',
    'Go-Live Date',
    'Users',
    'Use Cases',
    'Current Platform',
    'Needs Re-Discovery',
    'Total Weeks',
    'Status'
  ];
  
  const rows = scenarios.map(s => [
    s.name,
    s.goLiveDate,
    s.customerProfile?.totalUsers || 'Unknown',
    s.answers?.D9 || 'Unknown',
    s.customerProfile?.currentPlatform || 'Unknown',
    s.metadata?.needsReDiscovery ? 'YES' : 'NO',
    s.calculations?.validation?.totalWeeksNeeded || 'N/A',
    s.calculations?.validation?.isValid ? 'Feasible' : 'Tight'
  ]);
  
  const csv = [
    headers.join(','),
    ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csv;
}

/**
 * Download CSV file
 */
export function downloadCSV(csv, filename = 'scenarios-export.csv') {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate all migrated scenarios
 */
export function validateMigratedScenarios() {
  const newKey = 'businessCaseScenarios';
  const scenariosRaw = localStorage.getItem(newKey);
  
  if (!scenariosRaw) {
    console.log('No scenarios to validate');
    return [];
  }
  
  const scenarios = JSON.parse(scenariosRaw);
  
  console.log('\n🔍 Validating migrated scenarios...\n');
  
  const validation = scenarios.map(scenario => {
    const issues = [];
    
    // Check for required fields
    if (!scenario.answers) issues.push('Missing answers');
    if (!scenario.goLiveDate) issues.push('Missing go-live date');
    if (!scenario.calculations) issues.push('Missing calculations');
    
    // Check if needs re-discovery
    const needsRediscovery = scenario.metadata?.needsReDiscovery || false;
    if (needsRediscovery) issues.push('⚠️  NEEDS RE-DISCOVERY');
    
    // Check timeline feasibility
    const isFeasible = scenario.calculations?.validation?.isValid;
    if (isFeasible === false) issues.push('⚠️  Timeline too tight');
    
    const status = issues.length === 0 ? '✅' : '⚠️';
    
    console.log(`${status} ${scenario.name}`);
    if (issues.length > 0) {
      issues.forEach(issue => console.log(`   - ${issue}`));
    }
    
    return {
      name: scenario.name,
      status,
      issues,
      needsRediscovery,
      isFeasible
    };
  });
  
  const needsAction = validation.filter(v => v.issues.length > 0);
  
  console.log('\n📊 Validation Summary:');
  console.log(`   Total scenarios: ${scenarios.length}`);
  console.log(`   Valid: ${scenarios.length - needsAction.length}`);
  console.log(`   Need action: ${needsAction.length}`);
  console.log(`   Need re-discovery: ${validation.filter(v => v.needsRediscovery).length}`);
  
  return validation;
}

// ============================================================================
// REACT COMPONENT HELPER
// ============================================================================

/**
 * Hook for migration in React component
 */
export function useMigration() {
  const [migrationStatus, setMigrationStatus] = React.useState(null);
  
  const runMigration = async () => {
    setMigrationStatus({ status: 'running' });
    
    try {
      const result = migrateLocalStorage();
      setMigrationStatus({ 
        status: 'success', 
        ...result 
      });
      return result;
    } catch (error) {
      setMigrationStatus({ 
        status: 'error', 
        error: error.message 
      });
      throw error;
    }
  };
  
  const exportScenarios = () => {
    const newKey = 'businessCaseScenarios';
    const scenariosRaw = localStorage.getItem(newKey);
    
    if (!scenariosRaw) {
      alert('No scenarios to export');
      return;
    }
    
    const scenarios = JSON.parse(scenariosRaw);
    const csv = exportToCSV(scenarios);
    downloadCSV(csv);
  };
  
  return {
    migrationStatus,
    runMigration,
    exportScenarios,
    validateScenarios: validateMigratedScenarios
  };
}

// ============================================================================
// CLI SCRIPT FOR NODE.JS
// ============================================================================

/**
 * Run migration from command line
 * Usage: node migration-helper.js
 */
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  console.log('🚀 Running migration from CLI...\n');
  
  // In Node.js, you'd need to load the localStorage data from a file
  console.log('⚠️  CLI migration requires manual file handling');
  console.log('   1. Export localStorage data to JSON file');
  console.log('   2. Run conversion on JSON file');
  console.log('   3. Import converted data back to localStorage');
  console.log('\nOr run this from browser console for automatic migration.');
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  isOldFormat,
  convertOldToNewFormat,
  migrateLocalStorage,
  exportToCSV,
  downloadCSV,
  validateMigratedScenarios,
  useMigration
};

// ============================================================================
// BROWSER CONSOLE QUICK START
// ============================================================================

/**
 * Quick migration from browser console:
 * 
 * 1. Open browser console on your app
 * 2. Paste this entire file
 * 3. Run: migrateLocalStorage()
 * 4. Run: validateMigratedScenarios()
 * 5. Review results and re-run discovery for converted scenarios
 */
