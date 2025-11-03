import React, { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { useStore } from '../store/useStore';
import { parseExportFile } from '../utils/parser';

export const FileUploader = () => {
  const { setParsedData } = useStore();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  

  const handleFile = (file) => {
    setError(null);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const parsed = parseExportFile(content);
        console.log('Parsed data:', parsed); // 👈 optional: inspect structure in dev tools
        
        if (parsed) {
          setParsedData(parsed);
        } else {
          setError('Failed to parse file. Please check the format.');
        }
      } catch (err) {
        console.error('Parsing error:', err);
        setError(`Error: ${err.message}`);
      }
    };
    
    
    reader.onerror = () => {
      setError('Failed to read file');
    };
    
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Boomer Export Analyzer</h1>
          <p className="text-gray-600">Upload your .export file to explore dependencies and relationships</p>
        </div>

        <div
          className={`card border-2 border-dashed transition-all ${
            dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
          } ${error ? 'border-red-300' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <div className="text-center py-12">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drag and drop your .export file here
            </p>
            <p className="text-sm text-gray-500 mb-6">or click to browse</p>
            <label className="btn-primary cursor-pointer inline-block">
              Choose File
              <input
                type="file"
                className="hidden"
                accept=".export,.xml,.json"
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Supported formats: .export, .xml, .json</p>
          <p className="mt-2 text-xs">Demo mode: Any file will load sample data for testing</p>
        </div>
      </div>
    </div>
  );
};
