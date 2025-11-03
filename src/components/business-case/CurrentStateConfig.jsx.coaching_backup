import React, { useState } from 'react';
import { Server, DollarSign, AlertCircle } from 'lucide-react';

export default function CurrentStateConfig({ customerProfile, onComplete, onBack }) {
  const [config, setConfig] = useState({
    platform: customerProfile.currentPlatform || 'citrix',
    serverCount: customerProfile.currentServerCount || 10,
    useCustomCosts: false,
    customMonthlyCost: '',
    customAnnualCost: '',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState({});

  const platforms = [
    { value: 'citrix', label: 'Citrix' },
    { value: 'vmware', label: 'VMware Horizon' },
    { value: 'onpremise', label: 'On-Premise VDI' },
    { value: 'physical', label: 'Physical Desktops' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (config.useCustomCosts) {
      if (!config.customMonthlyCost && !config.customAnnualCost) {
        newErrors.customCosts = 'Please provide either monthly or annual cost';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalConfig = {
      platform: config.platform,
      serverCount: config.serverCount,
      customCosts: config.useCustomCosts ? {
        monthlyCost: config.customMonthlyCost ? parseFloat(config.customMonthlyCost) : null,
        annualCost: config.customAnnualCost ? parseFloat(config.customAnnualCost) : null
      } : null,
      additionalNotes: config.additionalNotes
    };

    onComplete(finalConfig);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Platform Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Server className="text-purple-600" size={24} />
          Current Platform
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {platforms.map(platform => (
            <button
              key={platform.value}
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, platform: platform.value }))}
              className={`p-4 rounded-lg border-2 transition-all ${
                config.platform === platform.value
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-300 hover:border-purple-300'
              }`}
            >
              <div className="font-semibold text-sm">{platform.label}</div>
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Number of Servers
          </label>
          <input
            type="number"
            value={config.serverCount}
            onChange={(e) => setConfig(prev => ({ ...prev, serverCount: parseInt(e.target.value) }))}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            min="1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Approximate number of physical or virtual servers supporting current environment
          </p>
        </div>
      </div>

      {/* Custom Costs (Optional) */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign className="text-purple-600" size={24} />
          Cost Information
        </h3>

        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.useCustomCosts}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                useCustomCosts: e.target.checked,
                customMonthlyCost: '',
                customAnnualCost: ''
              }))}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-semibold text-gray-700">
              I have exact cost figures
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1 ml-7">
            Leave unchecked to use industry estimates based on your platform and user count
          </p>
        </div>

        {config.useCustomCosts && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Monthly Cost (USD)
              </label>
              <input
                type="number"
                value={config.customMonthlyCost}
                onChange={(e) => setConfig(prev => ({ ...prev, customMonthlyCost: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                placeholder="e.g., 50000"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Annual Cost (USD)
              </label>
              <input
                type="number"
                value={config.customAnnualCost}
                onChange={(e) => setConfig(prev => ({ ...prev, customAnnualCost: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                placeholder="e.g., 600000"
                min="0"
              />
            </div>

            {errors.customCosts && (
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  {errors.customCosts}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            value={config.additionalNotes}
            onChange={(e) => setConfig(prev => ({ ...prev, additionalNotes: e.target.value }))}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            rows="3"
            placeholder="Any additional context about current costs or environment..."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold text-lg"
        >
          Continue to Future State →
        </button>
      </div>
    </form>
  );
}
