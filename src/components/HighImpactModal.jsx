import React from 'react';
import { X, TrendingUp, AlertTriangle } from 'lucide-react';

export const HighImpactModal = ({ isOpen, onClose, highImpactAttributes, onSelectAttribute }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">High Impact Attributes</h2>
              <p className="text-sm text-gray-600">
                Attributes used in 2 or more rules, calculations, or availabilities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {highImpactAttributes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No high impact attributes found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {highImpactAttributes.map((attr, index) => (
                <div
                  key={attr.id}
                  onClick={() => {
                    onSelectAttribute(attr.id);
                    onClose();
                  }}
                  className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-orange-600 text-lg">#{index + 1}</span>
                        <h3 className="font-semibold text-gray-900">{attr.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">ID: {attr.id}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-3 py-1 bg-orange-500 text-white rounded-full font-bold">
                        {attr.usageCount} uses
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};