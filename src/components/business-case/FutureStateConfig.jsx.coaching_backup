import React, { useState } from 'react';
import { Cloud, HardDrive, Settings, Calendar } from 'lucide-react';

export default function FutureStateConfig({ customerProfile, onComplete, onBack }) {
  const [config, setConfig] = useState({
    userProfile: customerProfile.userProfile || 'medium',
    storageType: 'premiumSSD',
    storagePerUserGB: 100,
    includeNerdio: true,
    timeHorizonYears: 3,
    additionalNotes: ''
  });

  const userProfiles = [
    { value: 'light', label: 'Light', sku: 'D2s_v5', description: 'Office productivity' },
    { value: 'medium', label: 'Medium', sku: 'D4s_v5', description: 'Multiple apps' },
    { value: 'heavy', label: 'Heavy', sku: 'D8s_v5', description: 'CAD, video editing' },
    { value: 'power', label: 'Power', sku: 'D16s_v5', description: 'GPU workloads' }
  ];

  const storageTypes = [
    { 
      value: 'standardSSD', 
      label: 'Standard SSD', 
      price: '$0.15/GB/mo',
      iops: '500 IOPS',
      description: 'Cost-effective for general workloads'
    },
    { 
      value: 'premiumSSD', 
      label: 'Premium SSD', 
      price: '$0.21/GB/mo',
      iops: '2,300 IOPS',
      description: 'Best performance for production'
    }
  ];

  const timeHorizons = [
    { value: 1, label: '1 Year' },
    { value: 3, label: '3 Years' },
    { value: 5, label: '5 Years' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(config);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Profile Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Cloud className="text-purple-600" size={24} />
          Azure VM Configuration
        </h3>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            User Workload Profile
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {userProfiles.map(profile => (
              <button
                key={profile.value}
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, userProfile: profile.value }))}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  config.userProfile === profile.value
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-300'
                }`}
              >
                <div className="font-bold text-purple-600 mb-1">{profile.label}</div>
                <div className="text-xs text-gray-600 mb-2">{profile.sku}</div>
                <div className="text-xs text-gray-500">{profile.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Storage Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <HardDrive className="text-purple-600" size={24} />
          Storage Configuration
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Storage Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {storageTypes.map(storage => (
                <button
                  key={storage.value}
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, storageType: storage.value }))}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    config.storageType === storage.value
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-gray-800">{storage.label}</div>
                    <div className="text-sm font-semibold text-purple-600">{storage.price}</div>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">{storage.iops}</div>
                  <div className="text-xs text-gray-500">{storage.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Storage Per User (GB)
            </label>
            <input
              type="number"
              value={config.storagePerUserGB}
              onChange={(e) => setConfig(prev => ({ ...prev, storagePerUserGB: parseInt(e.target.value) }))}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              min="50"
              max="500"
              step="10"
            />
            <p className="text-xs text-gray-500 mt-1">
              Typical: 100GB for general users, 200GB+ for heavy users
            </p>
          </div>
        </div>
      </div>

      {/* Nerdio Manager */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Settings className="text-purple-600" size={24} />
          Nerdio Manager for Enterprise
        </h3>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.includeNerdio}
              onChange={(e) => setConfig(prev => ({ ...prev, includeNerdio: e.target.checked }))}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 mt-1"
            />
            <div className="flex-1">
              <div className="font-semibold text-purple-900 mb-1">
                Include Nerdio Manager for Enterprise
              </div>
              <div className="text-sm text-purple-700">
                Automated scaling, image management, monitoring, and cost optimization.
                Reduces admin time by 35+ hours/week and infrastructure costs by 35%.
              </div>
            </div>
          </label>
        </div>

        {!config.includeNerdio && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <div className="text-yellow-600 mt-1">⚠️</div>
              <div className="flex-1">
                <div className="font-semibold text-yellow-900 mb-1">
                  Native Azure Management
                </div>
                <div className="text-sm text-yellow-700">
                  Without Nerdio Manager, you'll need to manage VMs, scaling, images, and monitoring manually.
                  This typically requires 2-3x more administrative effort.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Time Horizon */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="text-purple-600" size={24} />
          Analysis Period
        </h3>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            TCO/ROI Time Horizon
          </label>
          <div className="grid grid-cols-3 gap-3">
            {timeHorizons.map(horizon => (
              <button
                key={horizon.value}
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, timeHorizonYears: horizon.value }))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  config.timeHorizonYears === horizon.value
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-purple-300'
                }`}
              >
                <div className="font-bold">{horizon.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            value={config.additionalNotes}
            onChange={(e) => setConfig(prev => ({ ...prev, additionalNotes: e.target.value }))}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            rows="3"
            placeholder="Any special requirements or considerations..."
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
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold text-lg"
        >
          Calculate Business Case 🚀
        </button>
      </div>
    </form>
  );
}
