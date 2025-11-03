import React from 'react';
import { Calculator, FileText, BarChart3, Target } from 'lucide-react';

export default function MainNavigation({ activeTab, onTabChange }) {
  const tabs = [
    {
      id: 'timeline',
      label: 'Timeline Calculator',
      icon: Calculator,
      description: 'Calculate go-live timeline'
    },
    {
      id: 'business-case',
      label: 'Business Case Builder',
      icon: FileText,
      description: 'Create TCO & ROI analysis'
    },
	{ 
    id: 'qualifier', 
    label: 'Quick Qualifier (NTENT)', 
    icon: Target, 
    description: 'NTENT scoring & stakeholders' 
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
              <BarChart3 className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Nerdio Value Engineering Suite
              </h1>
              <p className="text-sm text-gray-600">
                Timeline & Business Case Tools
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all ${
                  isActive
                    ? 'border-purple-600 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <div className="text-left">
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-xs">{tab.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
