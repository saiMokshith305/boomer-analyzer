import React from 'react';
import { Search, Filter, FileText, AlertCircle, Eye, Calculator, Layers, Layout, ExternalLink } from 'lucide-react';
import { useStore } from '../store/useStore';

export const EntityList = () => {
  const { parsedData, filterType, searchQuery, setSearchQuery, setSelectedEntity } = useStore();

  const getFilteredEntities = () => {
    if (!parsedData) return [];

    let entities = [];
    
    if (filterType === 'all' || filterType === 'entities') {
      entities.push(...(parsedData.entities || []).map(e => ({ ...e, type: 'entity' })));
    }
    if (filterType === 'all' || filterType === 'attributes') {
      entities.push(...(parsedData.attributes || []).map(e => ({ ...e, type: 'attribute' })));
    }
    if (filterType === 'all' || filterType === 'rules') {
      entities.push(...(parsedData.rules || []).map(e => ({ ...e, type: 'rule' })));
    }
    if (filterType === 'all' || filterType === 'availabilities') {
      entities.push(...(parsedData.availabilities || []).map(e => ({ ...e, type: 'availability' })));
    }
    if (filterType === 'all' || filterType === 'calculations') {
      entities.push(...(parsedData.calculations || []).map(e => ({ ...e, type: 'calculation' })));
    }
    if (filterType === 'all' || filterType === 'layouts') {
      entities.push(...(parsedData.layouts || []).map(e => ({ ...e, type: 'layout' })));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      entities = entities.filter(e =>
        e.name?.toLowerCase().includes(query) ||
        e.reference?.toLowerCase().includes(query) ||
        e.dictionaryKey?.toLowerCase().includes(query) ||
        e.id?.toLowerCase().includes(query)
      );
    }

    return entities;
  };

  const getEntityIcon = (type) => {
    switch (type) {
      case 'entity': return Layers;
      case 'attribute': return FileText;
      case 'rule': return AlertCircle;
      case 'availability': return Eye;
      case 'calculation': return Calculator;
      case 'layout': return Layout;
      default: return FileText;
    }
  };

  const getEntityColor = (type) => {
    switch (type) {
      case 'entity': return 'text-indigo-600 bg-indigo-50';
      case 'attribute': return 'text-blue-600 bg-blue-50';
      case 'rule': return 'text-red-600 bg-red-50';
      case 'availability': return 'text-green-600 bg-green-50';
      case 'calculation': return 'text-purple-600 bg-purple-50';
      case 'layout': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getUsageBadges = (entity) => {
    if (entity.type !== 'attribute') return null;
    
    const totalUsage = (entity.usedIn?.rules?.length || 0) + 
                      (entity.usedIn?.calculations?.length || 0) + 
                      (entity.usedIn?.availabilities?.length || 0);
    
    if (totalUsage === 0) return null;

    return (
      <div className="flex items-center gap-1 mt-2">
        {entity.usedIn.rules.length > 0 && (
          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
            {entity.usedIn.rules.length} {entity.usedIn.rules.length === 1 ? 'Rule' : 'Rules'}
          </span>
        )}
        {entity.usedIn.calculations.length > 0 && (
          <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
            {entity.usedIn.calculations.length} {entity.usedIn.calculations.length === 1 ? 'Calc' : 'Calcs'}
          </span>
        )}
        {entity.usedIn.availabilities.length > 0 && (
          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
            {entity.usedIn.availabilities.length} {entity.usedIn.availabilities.length === 1 ? 'Avail' : 'Avails'}
          </span>
        )}
      </div>
    );
  };

  const entities = getFilteredEntities();

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, reference, or dictionary key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {entities.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Filter className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No entities found</p>
          </div>
        ) : (
          entities.map((entity) => {
            const Icon = getEntityIcon(entity.type);
            return (
              <div
                key={entity.id}
                onClick={() => setSelectedEntity(entity)}
                className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getEntityColor(entity.type)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900">{entity.name}</h3>
                      <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                    
                    {entity.reference && (
                      <p className="text-xs text-gray-500 font-mono mt-1">{entity.reference}</p>
                    )}
                    
                    {entity.dictionaryKey && (
                      <p className="text-xs text-gray-500 mt-1">Key: {entity.dictionaryKey}</p>
                    )}
                    
                    {entity.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{entity.description}</p>
                    )}
                    
                    {entity.entityName && (
                      <p className="text-xs text-gray-600 mt-1">
                        Entity: <span className="font-medium">{entity.entityName}</span>
                      </p>
                    )}

                    <div className="flex items-center flex-wrap gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full capitalize">
                        {entity.type}
                      </span>
                      
                      {entity.dataType && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          {entity.dataType}
                        </span>
                      )}
                      
                      {entity.impactLevel && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          entity.impactLevel === 'high' ? 'bg-red-100 text-red-700' :
                          entity.impactLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {entity.impactLevel} impact
                        </span>
                      )}
                      
                      {entity.executionLevel && (
                        <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                          {entity.executionLevel}
                        </span>
                      )}
                    </div>

                    {getUsageBadges(entity)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};