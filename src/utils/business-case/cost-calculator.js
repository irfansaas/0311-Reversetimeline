/**
 * Nerdio Business Case - Cost Calculator Engine
 * 
 * This module provides comprehensive cost calculation functions for:
 * - Azure infrastructure costs (VMs, storage, networking)
 * - Software licensing (Microsoft 365, Nerdio Manager)
 * - Current state costs (Citrix, VMware, on-premise)
 * - Total Cost of Ownership (TCO) analysis
 * - Return on Investment (ROI) calculations
 */

import pricingData from '../../data/azure-pricing.json';

/**
 * Calculate Azure Virtual Desktop infrastructure costs
 * @param {Object} params - Calculation parameters
 * @param {number} params.userCount - Total number of users
 * @param {string} params.userProfile - User profile: 'light', 'medium', 'heavy', 'power'
 * @param {string} params.storageType - Storage type: 'standardSSD', 'premiumSSD'
 * @param {number} params.storagePerUserGB - Storage per user in GB
 * @param {boolean} params.includeNerdio - Include Nerdio Manager costs
 * @returns {Object} Cost breakdown object
 */
export function calculateAVDInfrastructureCost(params) {
  const {
    userCount,
    userProfile = 'medium',
    storageType = 'premiumSSD',
    storagePerUserGB = 100,
    includeNerdio = true
  } = params;

  // Get VM pricing based on user profile
  const vmProfile = pricingData.vmPricing[`${userProfile}Users`];
  if (!vmProfile) {
    throw new Error(`Invalid user profile: ${userProfile}`);
  }

  // Calculate number of VMs needed
  const peakConcurrency = pricingData.calculationAssumptions.peakConcurrency;
  const concurrentUsers = Math.ceil(userCount * peakConcurrency);
  const vmsNeeded = Math.ceil(concurrentUsers / vmProfile.usersPerVM);

  // Calculate VM costs
  const vmMonthlyCost = vmsNeeded * vmProfile.monthlyCostPerVM;
  const vmAnnualCost = vmMonthlyCost * 12;

  // Calculate storage costs
  const storageProfile = pricingData.storage[storageType];
  if (!storageProfile) {
    throw new Error(`Invalid storage type: ${storageType}`);
  }

  const totalStorageGB = userCount * storagePerUserGB;
  const storageMonthlyCost = totalStorageGB * storageProfile.costPerGBMonth;
  const storageAnnualCost = storageMonthlyCost * 12;

  // Calculate Nerdio Manager costs
  let nerdioMonthlyCost = 0;
  let nerdioAnnualCost = 0;
  
  if (includeNerdio) {
    const nerdioTier = getNerdioTier(userCount);
    nerdioMonthlyCost = userCount * nerdioTier.pricePerUser;
    nerdioAnnualCost = nerdioMonthlyCost * 12;
  }

  // Calculate auto-scaling savings
  const autoScalingSavingsPercent = includeNerdio 
    ? pricingData.calculationAssumptions.autoScalingSavings.withNerdio
    : pricingData.calculationAssumptions.autoScalingSavings.withoutNerdio;
  
  const autoScalingSavings = vmMonthlyCost * autoScalingSavingsPercent;

  // Net monthly and annual costs
  const netVMCost = vmMonthlyCost - autoScalingSavings;
  const totalMonthlyCost = netVMCost + storageMonthlyCost + nerdioMonthlyCost;
  const totalAnnualCost = totalMonthlyCost * 12;

  return {
    infrastructure: {
      vms: {
        count: vmsNeeded,
        sku: vmProfile.sku,
        monthlyCost: vmMonthlyCost,
        annualCost: vmAnnualCost
      },
      storage: {
        totalGB: totalStorageGB,
        type: storageType,
        monthlyCost: storageMonthlyCost,
        annualCost: storageAnnualCost
      },
      autoScaling: {
        savingsPercent: autoScalingSavingsPercent * 100,
        monthlySavings: autoScalingSavings,
        annualSavings: autoScalingSavings * 12
      }
    },
    software: {
      nerdioManager: includeNerdio ? {
        enabled: true,
        monthlyCost: nerdioMonthlyCost,
        annualCost: nerdioAnnualCost,
        pricePerUser: nerdioMonthlyCost / userCount
      } : {
        enabled: false,
        monthlyCost: 0,
        annualCost: 0
      }
    },
    totals: {
      monthlyGross: vmMonthlyCost + storageMonthlyCost + nerdioMonthlyCost,
      monthlyNet: totalMonthlyCost,
      annualGross: (vmMonthlyCost + storageMonthlyCost + nerdioMonthlyCost) * 12,
      annualNet: totalAnnualCost,
      perUserMonthly: totalMonthlyCost / userCount,
      perUserAnnual: totalAnnualCost / userCount
    }
  };
}

/**
 * Calculate current state costs (Citrix, VMware, or On-Premise)
 */
export function calculateCurrentStateCost(params) {
  const {
    platform,
    userCount,
    serverCount = 10,
    customCosts = {}
  } = params;

  let monthlyCost = 0;
  let annualCost = 0;
  let breakdown = {};

  switch ((platform || "citrix").toLowerCase()) {
    case 'citrix': {
      const citrixLicense = pricingData.citrixComparison.citrixCloudLicense.perUserPerMonth;
      const citrixLicenseCost = userCount * citrixLicense;
      const netscalerCost = 2 * pricingData.citrixComparison.citrixNetScaler.perApplianceMonth;
      const infraCost = serverCount * 500;
      
      monthlyCost = citrixLicenseCost + netscalerCost + infraCost;
      
      breakdown = {
        licensing: citrixLicenseCost,
        netscaler: netscalerCost,
        infrastructure: infraCost,
        oneTimeSetup: pricingData.citrixComparison.citrixStoreFront.oneTimeSetup
      };
      break;
    }

    case 'vmware': {
      const horizonLicense = pricingData.vmwareComparison.horizonLicense.perUserPerMonth;
      const horizonLicenseCost = userCount * horizonLicense;
      const vmwareInfraCost = serverCount * 550;
      
      monthlyCost = horizonLicenseCost + vmwareInfraCost;
      
      breakdown = {
        licensing: horizonLicenseCost,
        infrastructure: vmwareInfraCost,
        oneTimeSetup: pricingData.vmwareComparison.horizonInfrastructure.baseInfrastructureCost
      };
      break;
    }

    case 'onpremise': {
      const serverCapitalCost = serverCount * 8000 / 36;
      const dataCenterCost = serverCount * 200;
      const maintenanceCost = serverCount * 150;
      
      monthlyCost = serverCapitalCost + dataCenterCost + maintenanceCost;
      
      breakdown = {
        serverCapital: serverCapitalCost,
        dataCenter: dataCenterCost,
        maintenance: maintenanceCost
      };
      break;
    }

    default:
      throw new Error(`Invalid platform: ${platform}`);
  }

  if (customCosts && customCosts.monthlyCost) {
    monthlyCost = customCosts.monthlyCost;
  }

  annualCost = monthlyCost * 12;

  return {
    platform,
    costs: {
      monthly: monthlyCost,
      annual: annualCost,
      perUserMonthly: monthlyCost / userCount,
      perUserAnnual: annualCost / userCount
    },
    breakdown,
    metadata: {
      userCount,
      serverCount,
      calculationDate: new Date().toISOString()
    }
  };
}

/**
 * Calculate Total Cost of Ownership comparison
 */
export function calculateTCO(currentState, futureState, timeHorizonYears = 3) {
  const currentAnnual = currentState.costs.annual;
  const futureAnnual = futureState.totals.annualNet;
  
  const currentTotal = currentAnnual * timeHorizonYears;
  const futureTotal = futureAnnual * timeHorizonYears;
  
  const savings = currentTotal - futureTotal;
  const savingsPercent = (savings / currentTotal) * 100;

  return {
    timeHorizon: {
      years: timeHorizonYears,
      months: timeHorizonYears * 12
    },
    currentState: {
      annualCost: currentAnnual,
      totalCost: currentTotal,
      monthlyAverage: currentAnnual / 12
    },
    futureState: {
      annualCost: futureAnnual,
      totalCost: futureTotal,
      monthlyAverage: futureAnnual / 12
    },
    savings: {
      annual: currentAnnual - futureAnnual,
      total: savings,
      percentage: savingsPercent,
      monthlyAverage: (currentAnnual - futureAnnual) / 12
    },
    recommendation: savingsPercent > 20 
      ? 'Strong cost savings - highly recommended' 
      : savingsPercent > 0 
        ? 'Moderate savings - consider strategic benefits' 
        : 'Evaluate non-financial benefits carefully'
  };
}

/**
 * Calculate Return on Investment
 */
export function calculateROI(params) {
  const {
    implementationCost,
    annualSavings,
    additionalBenefits = []
  } = params;

  const totalAdditionalBenefits = additionalBenefits.reduce((sum, benefit) => sum + benefit, 0);
  const totalAnnualValue = annualSavings + totalAdditionalBenefits;
  
  const paybackMonths = implementationCost / (totalAnnualValue / 12);
  const roi1Year = ((totalAnnualValue - implementationCost) / implementationCost) * 100;
  const roi3Year = ((totalAnnualValue * 3 - implementationCost) / implementationCost) * 100;

  return {
    investment: {
      implementation: implementationCost,
      paybackPeriod: {
        months: paybackMonths,
        years: paybackMonths / 12
      }
    },
    returns: {
      annualSavings,
      additionalBenefits: totalAdditionalBenefits,
      totalAnnualValue
    },
    roi: {
      year1: roi1Year,
      year3: roi3Year,
      year5: ((totalAnnualValue * 5 - implementationCost) / implementationCost) * 100
    },
    breakEven: {
      months: paybackMonths,
      quarterlySavings: [
        totalAnnualValue / 4,
        (totalAnnualValue / 4) * 2,
        (totalAnnualValue / 4) * 3,
        totalAnnualValue
      ]
    }
  };
}

/**
 * Calculate per-user economics
 */
export function calculatePerUserEconomics(costs, userCount) {
  return {
    monthly: {
      infrastructure: costs.infrastructure.vms.monthlyCost / userCount,
      storage: costs.infrastructure.storage.monthlyCost / userCount,
      nerdio: costs.software.nerdioManager.enabled 
        ? costs.software.nerdioManager.monthlyCost / userCount 
        : 0,
      total: costs.totals.perUserMonthly
    },
    annual: {
      infrastructure: costs.infrastructure.vms.annualCost / userCount,
      storage: costs.infrastructure.storage.annualCost / userCount,
      nerdio: costs.software.nerdioManager.enabled 
        ? costs.software.nerdioManager.annualCost / userCount 
        : 0,
      total: costs.totals.perUserAnnual
    },
    savings: {
      autoScaling: costs.infrastructure.autoScaling.monthlySavings / userCount
    }
  };
}

/**
 * Helper: Get Nerdio Manager pricing tier
 */
function getNerdioTier(userCount) {
  const tiers = pricingData.nerdioManager.perUserPerMonth;
  
  if (userCount < 1000) {
    return { tier: 1, range: '0-999', pricePerUser: tiers.tier1_0to999 };
  } else if (userCount < 2500) {
    return { tier: 2, range: '1000-2499', pricePerUser: tiers.tier2_1000to2499 };
  } else if (userCount < 5000) {
    return { tier: 3, range: '2500-4999', pricePerUser: tiers.tier3_2500to4999 };
  } else {
    return { tier: 4, range: '5000+', pricePerUser: tiers.tier4_5000plus };
  }
}

/**
 * Helper: Format currency
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Helper: Format percentage
 */
export function formatPercentage(value, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}

export default {
  calculateAVDInfrastructureCost,
  calculateCurrentStateCost,
  calculateTCO,
  calculateROI,
  calculatePerUserEconomics,
  formatCurrency,
  formatPercentage
};
