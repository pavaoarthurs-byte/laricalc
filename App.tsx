import React, { useState, useEffect } from 'react';
import { Tabs } from './components/Tabs';
import { Aliq1Tab } from './components/Aliq1Tab';
import { PgdasTab } from './components/PgdasTab';
import { MusicPlayer } from './components/MusicPlayer';
import { calcularAliq1 } from './utils/taxCalculations';

// Ícone Folha (Animal Crossing vibe)
const LeafIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C7.5 2 4 5.5 4 10C4 13.5 6.5 16.5 10 17.5V22H14V17.5C17.5 16.5 20 13.5 20 10C20 5.5 16.5 2 12 2ZM12 4C15.5 4 18 6.5 18 10C18 12.5 16.5 14.5 14 15.5V10H10V15.5C7.5 14.5 6 12.5 6 10C6 6.5 8.5 4 12 4Z" />
    <circle cx="12" cy="10" r="2" fill="white" fillOpacity="0.5"/>
  </svg>
);

// Ícone Laço (Sanrio vibe)
const BowIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" />
    <path d="M19.5 8.5C18.5 7.5 16.5 8 15.5 8.5C16.5 6 16 4 14.5 3.5C12.5 3 11.5 5 11.5 5C11.5 5 10.5 3 8.5 3.5C7 4 6.5 6 7.5 8.5C6.5 8 4.5 7.5 3.5 8.5C2 10 3.5 13 6 13C5 15 6 17 8 17.5C9 18.5 11 18 12 17.5C13 18 15 18.5 16 17.5C18 17 19 15 18 13C20.5 13 22 10 19.5 8.5Z" opacity="0.8"/>
  </svg>
);

function App() {
  const [activeTab, setActiveTab] = useState<'tab1' | 'tab2'>('tab1');
  const [rbt12, setRbt12] = useState<number>(0);
  const [aliq1Decimal, setAliq1Decimal] = useState<number>(0);

  useEffect(() => {
    const novoAliq1 = calcularAliq1(rbt12);
    setAliq1Decimal(novoAliq1);
  }, [rbt12]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <MusicPlayer />
      
      {/* Main Card */}
      <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-xl border-8 border-white outline outline-4 outline-pink-200 relative overflow-visible">
        
        {/* Decorative Floating Icons */}
        <div className="absolute -top-10 -left-6 animate-float hidden sm:block text-green-400">
          <LeafIcon className="w-20 h-20 drop-shadow-md transform -rotate-12" />
        </div>
        <div className="absolute -bottom-8 -right-8 animate-float hidden sm:block text-pink-300" style={{ animationDelay: '1s' }}>
          <BowIcon className="w-24 h-24 drop-shadow-md transform rotate-12" />
        </div>

        {/* Header Style */}
        <div className="bg-pink-100 rounded-t-[32px] p-6 text-center relative border-b-4 border-dashed border-pink-300">
          <div className="bg-white/80 inline-flex items-center gap-3 px-6 py-2 rounded-full shadow-sm mb-2">
             <LeafIcon className="w-6 h-6 text-green-400" />
             <h1 className="font-cute text-3xl text-pink-500 tracking-wide">
               LariCalc
             </h1>
             <BowIcon className="w-6 h-6 text-pink-400" />
          </div>
          <p className="text-pink-400 font-bold text-sm tracking-widest uppercase mt-1 font-cute">
            ★ Edição Fofura Fiscal ★
          </p>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 bg-[#fffcf0]"> {/* Cream background like paper */}
          <Tabs activeTab={activeTab} onChange={setActiveTab} />

          <div className="min-h-[400px] mt-2 relative">
             {/* Background pattern inside content */}
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZWYzYzciIGZpbGwtb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] opacity-50 rounded-3xl pointer-events-none"></div>

            {activeTab === 'tab1' && (
              <Aliq1Tab 
                rbt12={rbt12} 
                setRbt12={setRbt12} 
                aliq1Decimal={aliq1Decimal}
              />
            )}

            {activeTab === 'tab2' && (
              <PgdasTab 
                rbt12={rbt12}
                aliq1DecimalOriginal={aliq1Decimal}
              />
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-green-100 rounded-b-[32px] py-4 text-center border-t-4 border-dashed border-green-300">
          <p className="text-green-600 font-cute text-sm flex justify-center items-center gap-2">
            <span>❤️</span> Feito com carinho pra minha gatinha <span>🐱</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;