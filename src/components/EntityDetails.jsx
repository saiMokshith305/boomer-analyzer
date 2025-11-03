import React, { useState } from 'react';
import { X, GitBranch, Code } from 'lucide-react';
import { useStore } from '../store/useStore';

export const EntityDetails = () => {
  const { selectedEntity, setSelectedEntity, parsedData } = useStore();
  const [activeTab, setActiveTab] = useState('overview');

  if (!selectedEntity) {
    return (
      <div className="w-96 bg-white border-l border-gray-200 p-8 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <GitBranch className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Select an entity to view details</p>
        </div>
      </div>
    );
  }

  const getRelatedEntities = () => {
    const related = {
      references: [],
      usedBy: [],
      dependencies: []
    };

    if (selectedEntity.references) {
      related.references = selectedEntity.references.map(ref => {
        const attr = parsedData?.attributes?.find(a => a.id === ref);
        return attr ? { ...attr, type: 'attribute' } : null;
      }).filter(Boolean);
    }

    if (selectedEntity.type === 'attribute' && selectedEntity.usedIn) {
      Object.entries(selectedEntity.usedIn).forEach(([type, ids]) => {
        ids.forEach(id => {
          const entity = parsedData?.[type]?.find(e => e.id === id);
          if (entity) {
            related.usedBy.push({ ...entity, type: type.slice(0, -1) });
          }
        });
      });
    }

    if (selectedEntity.dependencies) {
      related.dependencies = selectedEntity.dependencies.map(dep => {
        const calc = parsedData?.calculations?.find(c => c.id === dep);
        return calc ? { ...calc, type: 'calculation' } : null;
      }).filter(Boolean);
    }

    return related;
  };

  const related = getRelatedEntities();

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Details</h2>
        <button
          onClick={() => setSelectedEntity(null)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex border-b border-gray-200">
        {['overview', 'code', 'dependencies'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 text-sm font-medium capitalize ${
              activeTab === tab
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Name</h3>
              <p className="text-gray-900">{selectedEntity.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">ID</h3>
              <p className="text-sm text-gray-600 font-mono">{selectedEntity.id}</p>
            </div>
            {selectedEntity.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Description</h3>
                <p className="text-gray-900">{selectedEntity.description}</p>
              </div>
            )}
            {selectedEntity.condition && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Condition</h3>
                <code className="block text-sm bg-gray-100 p-2 rounded">{selectedEntity.condition}</code>
              </div>
            )}
            {selectedEntity.formula && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Formula</h3>
                <code className="block text-sm bg-gray-100 p-2 rounded">{selectedEntity.formula}</code>
              </div>
            )}
          </div>
        )}

        {activeTab === 'code' && (
          <div>
            {selectedEntity.groovyScript ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-700">Groovy Script</h3>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap">
                  {selectedEntity.groovyScript}
                </pre>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No script available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dependencies' && (
          <div className="space-y-6">
            {related.references.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">References</h3>
                <div className="space-y-2">
                  {related.references.map(entity => (
                    <div key={entity.id} className="text-sm p-2 bg-blue-50 rounded border border-blue-200">
                      <div className="font-medium text-blue-900">{entity.name}</div>
                      <div className="text-blue-600 text-xs">{entity.id}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {related.usedBy.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Used By</h3>
                <div className="space-y-2">
                  {related.usedBy.map(entity => (
                    <div key={entity.id} className="text-sm p-2 bg-green-50 rounded border border-green-200">
                      <div className="font-medium text-green-900">{entity.name}</div>
                      <div className="text-green-600 text-xs capitalize">{entity.type} - {entity.id}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {related.dependencies.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Dependencies</h3>
                <div className="space-y-2">
                  {related.dependencies.map(entity => (
                    <div key={entity.id} className="text-sm p-2 bg-purple-50 rounded border border-purple-200">
                      <div className="font-medium text-purple-900">{entity.name}</div>
                      <div className="text-purple-600 text-xs">{entity.id}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {related.references.length === 0 && related.usedBy.length === 0 && related.dependencies.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No dependencies found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};