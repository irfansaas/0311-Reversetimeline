#!/usr/bin/env bash

echo "Updating BusinessCaseContext with Timeline Integration..."
echo ""

# Create backup
cp src/contexts/BusinessCaseContext.jsx src/contexts/BusinessCaseContext.jsx.manual_backup

cat > src/contexts/BusinessCaseContext.jsx <<'EOF'
import { useTimelineCalculator } from '../hooks/useTimelineCalculator';
import { calculateBusinessCaseFull } from '../lib/ve-engine';
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  calculateAVDInfrastructureCost,
  calculateCurrentStateCost,
  calculateTCO
} from '../utils/business-case/cost-calculator';
import {
  calculateComprehensiveROI,
  getImplementationCost
} from '../utils/business-case/roi-calculator';

const BusinessCaseContext = createContext();

export const useBusinessCase = () => {
  const context = useContext(BusinessCaseContext);
  if (!context) {
    throw new Error('useBusinessCase must be used within BusinessCaseProvider');
  }
  return context;
};

export const BusinessCaseProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [currentStateConfig, setCurrentStateConfig] = useState(null);
  const [futureStateConfig, setFutureStateConfig] = useState(null);
  const [calculations, setCalculations] = useState(null);
  const [savedScenarios, setSavedScenarios] = useState([]);

  // Calculate timeline at component level (hook must be called here)
  const timelineSummary = useTimelineCalculator(customerProfile || {});

  const setProfile = (profile) => {
    setCustomerProfile(profile);
    setCurrentStep(2);
  };

  const setCurrentState = (config) => {
    setCurrentStateConfig(config);
    setCurrentStep(3);
  };

  const setFutureState = (config) => {
    setFutureStateConfig(config);
    if (customerProfile && currentStateConfig) {
      calculateBusinessCase(customerProfile, currentStateConfig, config);
    }
  };

  const calculateBusinessCase = (profile, currentConfig, futureConfig) => {
    try {
      console.log("Timeline Summary:", timelineSummary);
      
      // Use the new VE engine orchestrator
      const results = calculateBusinessCaseFull(
        profile,
        {
          platform: currentConfig.platform || profile.currentPlatform,
          userCount: profile.totalUsers,
          serverCount: currentConfig.serverCount || profile.currentServerCount,
          customCosts: currentConfig.customCosts
        },
        {
          userCount: profile.totalUsers,
          userProfile: futureConfig.userProfile || profile.userProfile,
          storageType: futureConfig.storageType || 'premiumSSD',
          storagePerUserGB: futureConfig.storagePerUserGB || 100,
          includeNerdio: futureConfig.includeNerdio !== false
        },
        {
          timeHorizonYears: futureConfig.timeHorizonYears || 3,
          timelineSummary
        }
      );
      
      console.log("Results with timeline:", JSON.stringify(results, null, 2));
      
      setCalculations(results);
      setCurrentStep(4);
      return results;
    } catch (error) {
      console.error('Error calculating business case:', error);
      throw error;
    }
  };

  const saveScenario = (name) => {
    if (!calculations) {
      throw new Error('No calculations to save');
    }
    const scenario = {
      id: Date.now().toString(),
      name: name || `Scenario ${savedScenarios.length + 1}`,
      customerProfile,
      currentStateConfig,
      futureStateConfig,
      calculations,
      savedAt: new Date().toISOString()
    };
    setSavedScenarios(prev => [...prev, scenario]);
    return scenario;
  };

  const loadScenario = (scenarioId) => {
    const scenario = savedScenarios.find(s => s.id === scenarioId);
    if (!scenario) {
      throw new Error('Scenario not found');
    }
    setCustomerProfile(scenario.customerProfile);
    setCurrentStateConfig(scenario.currentStateConfig);
    setFutureStateConfig(scenario.futureStateConfig);
    setCalculations(scenario.calculations);
    setCurrentStep(4);
    return scenario;
  };

  const deleteScenario = (scenarioId) => {
    setSavedScenarios(prev => prev.filter(s => s.id !== scenarioId));
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setCustomerProfile(null);
    setCurrentStateConfig(null);
    setFutureStateConfig(null);
    setCalculations(null);
  };

  const value = {
    currentStep,
    customerProfile,
    currentStateConfig,
    futureStateConfig,
    calculations,
    savedScenarios,
    timelineSummary,  // Export timeline for components to use
    setProfile,
    setCurrentState,
    setFutureState,
    calculateBusinessCase,
    saveScenario,
    loadScenario,
    deleteScenario,
    resetWizard,
    setCurrentStep
  };

  return (
    <BusinessCaseContext.Provider value={value}>
      {children}
    </BusinessCaseContext.Provider>
  );
};
EOF

echo "✓ Updated BusinessCaseContext.jsx with timeline integration"
echo ""
echo "Changes made:"
echo "  1. Added useTimelineCalculator at component level"
echo "  2. Timeline calculated whenever customerProfile changes"
echo "  3. Timeline passed to calculateBusinessCaseFull"
echo "  4. timelineSummary exported in context value"
echo ""
echo "Now rebuild: npm run build && npm run preview"
