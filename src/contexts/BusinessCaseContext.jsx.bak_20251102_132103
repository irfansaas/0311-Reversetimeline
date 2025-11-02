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

export function useBusinessCase() {
  const context = useContext(BusinessCaseContext);
  if (!context) {
    throw new Error('useBusinessCase must be used within BusinessCaseProvider');
  }
  return context;
}

export function BusinessCaseProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [currentStateConfig, setCurrentStateConfig] = useState(null);
  const [futureStateConfig, setFutureStateConfig] = useState(null);
  const [calculations, setCalculations] = useState(null);
  const [savedScenarios, setSavedScenarios] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('businessCaseScenarios');
    if (saved) {
      try {
        setSavedScenarios(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved scenarios:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (savedScenarios.length > 0) {
      localStorage.setItem('businessCaseScenarios', JSON.stringify(savedScenarios));
    }
  }, [savedScenarios]);

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
      const currentState = calculateCurrentStateCost({
        platform: currentConfig.platform || profile.currentPlatform,
        userCount: profile.totalUsers,
        serverCount: currentConfig.serverCount || profile.currentServerCount,
        customCosts: currentConfig.customCosts
      });

      const futureState = calculateAVDInfrastructureCost({
        userCount: profile.totalUsers,
        userProfile: futureConfig.userProfile || profile.userProfile,
        storageType: futureConfig.storageType || 'premiumSSD',
        storagePerUserGB: futureConfig.storagePerUserGB || 100,
        includeNerdio: futureConfig.includeNerdio !== false
      });

      const timeHorizon = futureConfig.timeHorizonYears || 3;
      const tcoAnalysis = calculateTCO(currentState, futureState, timeHorizon);

      const implCost = getImplementationCost(profile.totalUsers);
      const infrastructureSavings = tcoAnalysis.savings.annual;

      const roiAnalysis = calculateComprehensiveROI({
        userCount: profile.totalUsers,
        infrastructureSavings,
        implementationCost: implCost.totalCost,
        timeHorizonYears: timeHorizon
      });

      const results = {
        customerProfile: profile,
        currentState,
        futureState,
        tcoAnalysis,
        roiAnalysis,
        implementationCost: implCost,
        calculatedAt: new Date().toISOString()
      };
      console.log("Results object created:", JSON.stringify(results, null, 2));

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

  const reset = () => {
    setCurrentStep(1);
    setCustomerProfile(null);
    setCurrentStateConfig(null);
    setFutureStateConfig(null);
    setCalculations(null);
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  };

  const value = {
    currentStep,
    customerProfile,
    currentStateConfig,
    futureStateConfig,
    calculations,
    savedScenarios,
    setProfile,
    setCurrentState,
    setFutureState,
    calculateBusinessCase,
    saveScenario,
    loadScenario,
    deleteScenario,
    reset,
    goToStep,
    hasProfile: !!customerProfile,
    hasCurrentState: !!currentStateConfig,
    hasFutureState: !!futureStateConfig,
    hasCalculations: !!calculations,
    canProceed: (step) => {
      switch (step) {
        case 2: return !!customerProfile;
        case 3: return !!customerProfile && !!currentStateConfig;
        case 4: return !!calculations;
        default: return true;
      }
    }
  };

  return (
    <BusinessCaseContext.Provider value={value}>
      {children}
    </BusinessCaseContext.Provider>
  );
}

export default BusinessCaseContext;
