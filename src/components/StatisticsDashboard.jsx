import React from 'react';
import { FileText, AlertCircle, Calculator, Eye, Layers, TrendingUp } from 'lucide-react';

export const StatisticsDashboard = ({ statistics, onHighImpactClick }) => {
  const stats = [
    {
      label: 'Risk Entities',
      value: statistics?.totalEntities || 0,
      icon: Layers,
      color: 'bg-blue-500'
    },
    {
      label: 'Attributes',
      value: statistics?.totalAttributes || 0,
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      label: 'Rules',
      value: statistics?.totalRules || 0,
      icon: AlertCircle,
      color: 'bg-red-500'
    },
    {
      label: 'Calculations',
      value: statistics?.totalCalculations || 0,
      icon: Calculator,
      color: 'bg-purple-500'
    },
    {
      label: 'Availabilities',
      value: statistics?.totalAvailabilities || 0,
      icon: Eye,
      color: 'bg-yellow-500'
    },
    {
      label: 'High Impact Attrs',
      value: statistics?.highImpactAttributes?.length || 0,
      icon: TrendingUp,
      color: 'bg-orange-500',
      clickable: true
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              onClick={stat.clickable ? onHighImpactClick : undefined}
              className={`bg-white rounded-lg border border-gray-200 p-4 ${
                stat.clickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};