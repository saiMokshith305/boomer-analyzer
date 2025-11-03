import React from 'react';
import { Filter, FileText, AlertCircle, Eye, Calculator, Layers, Layout } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Sidebar = () => {
  const { filterType, setFilterType, parsedData } = useStore();

  const filters = [
    { id: 'all', label: 'All', icon: Filter, count: null },
    { 
      id: 'entities', 
      label: 'Risk Entities', 
      icon: Layers, 
      count: parsedData?.entities?.length || 0 
    },
    { 
      id: 'attributes', 
      label: 'Attributes', 
      icon: FileText, 
      count: parsedData?.attributes?.length || 0 
    },
    { 
      id: 'rules', 
      label: 'Rules', 
      icon: AlertCircle, 
      count: parsedData?.rules?.length || 0 
    },
    { 
      id: 'availabilities', 
      label: 'Availabilities', 
      icon: Eye, 
      count: parsedData?.availabilities?.length || 0 
    },
    { 
      id: 'calculations', 
      label: 'Calculations', 
      icon: Calculator, 
      count: parsedData?.calculations?.length || 0 
    },
    { 
      id: 'layouts', 
      label: 'Layouts', 
      icon: Layout, 
      count: parsedData?.layouts?.length || 0 
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Explorer</h2>
      <div className="space-y-1">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.id}
              onClick={() => setFilterType(filter.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                filterType === filter.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm">{filter.label}</span>
              </div>
              {filter.count !== null && (
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                  {filter.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {parsedData?.subProduct && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">SubProduct Info</h3>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-gray-600">Name:</span>
              <p className="font-medium text-gray-900">{parsedData.subProduct.name}</p>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <p className="font-medium text-gray-900">{parsedData.subProduct.statusCode}</p>
            </div>
            <div>
              <span className="text-gray-600">Type:</span>
              <p className="font-medium text-gray-900">{parsedData.subProduct.typeCode}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};