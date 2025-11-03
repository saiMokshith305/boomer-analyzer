import React, { useState } from 'react';
import { FileText, Download, BarChart3 } from 'lucide-react';
import { useStore } from './store/useStore';

import { Sidebar } from './components/SideBar';
import { EntityList } from './components/EntityList';
import { EntityDetails } from './components/EntityDetails';
import { StatisticsDashboard } from './components/StatisticsDashboard';
import { HighImpactModal } from './components/HighImpactModal';
import { FileUploader } from './components/fileUploader';


function App() {
  const { parsedData, setParsedData, setSelectedEntity, setFilterType } = useStore();
  const [showHighImpactModal, setShowHighImpactModal] = useState(false);

  const handleExport = () => {
    if (!parsedData) return;
    
    const dataStr = JSON.stringify(parsedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${parsedData.subProduct?.dictionaryKey || 'subproduct'}-analysis.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleHighImpactClick = () => {
    setShowHighImpactModal(true);
  };

  const handleSelectHighImpactAttribute = (attrId) => {
    const attr = parsedData.attributes.find(a => a.id === attrId);
    if (attr) {
      setFilterType('attributes');
      setSelectedEntity(attr);
    }
  };

  if (!parsedData) {
    return <FileUploader />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              SubProduct Configuration Explorer
            </h1>
            <p className="text-sm text-gray-600">
              {parsedData.subProduct?.name || 'Unknown SubProduct'} • {parsedData.attributes?.length || 0} attributes • {parsedData.rules?.length || 0} rules
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleHighImpactClick}
            className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors font-medium"
          >
            <BarChart3 className="w-4 h-4" />
            High Impact
          </button>
          <button 
            onClick={handleExport} 
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
          <button 
            onClick={() => setParsedData(null)} 
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Load New File
          </button>
        </div>
      </header>

      <StatisticsDashboard 
        statistics={parsedData.statistics} 
        onHighImpactClick={handleHighImpactClick}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <EntityList />
        <EntityDetails />
      </div>

      <HighImpactModal
        isOpen={showHighImpactModal}
        onClose={() => setShowHighImpactModal(false)}
        highImpactAttributes={parsedData.statistics?.highImpactAttributes || []}
        onSelectAttribute={handleSelectHighImpactAttribute}
      />
    </div>
  );
}

export default App;