import React from 'react';

interface TabsProps {
  activeTab: 'tab1' | 'tab2';
  onChange: (tab: 'tab1' | 'tab2') => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onChange }) => {
  return (
    <div className="flex bg-pink-50 p-2 rounded-full gap-2 mb-6 shadow-inner border-2 border-pink-100">
      <button
        onClick={() => onChange('tab1')}
        className={`flex-1 py-3 px-4 rounded-full font-cute text-lg transition-all duration-300
          ${
            activeTab === 'tab1'
              ? 'bg-white text-pink-500 shadow-md transform scale-105 border-2 border-pink-200'
              : 'text-gray-400 hover:bg-pink-100/50 hover:text-pink-400'
          }`}
      >
        1. Cálculo ALIQ1
      </button>
      <button
        onClick={() => onChange('tab2')}
        className={`flex-1 py-3 px-4 rounded-full font-cute text-lg transition-all duration-300
          ${
            activeTab === 'tab2'
              ? 'bg-white text-green-500 shadow-md transform scale-105 border-2 border-green-200'
              : 'text-gray-400 hover:bg-green-100/50 hover:text-green-400'
          }`}
      >
        2. Regras PGDAS
      </button>
    </div>
  );
};