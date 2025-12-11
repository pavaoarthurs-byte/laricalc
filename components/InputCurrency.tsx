import React from 'react';

interface InputCurrencyProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
}

export const InputCurrency: React.FC<InputCurrencyProps> = ({ 
  value, 
  onChange, 
  label = "Valor (R$)",
  placeholder = "0,00",
  error = false
}) => {
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numericValue = Number(rawValue) / 100;
    onChange(numericValue);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className={`font-cute text-base ml-2 ${error ? 'text-red-400' : 'text-gray-500'}`}>
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className={`font-cute text-xl ${error ? 'text-red-400' : 'text-pink-300'}`}>R$</span>
        </div>
        <input
          type="text"
          value={value === 0 ? '' : formatCurrency(value)}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full pl-12 pr-6 py-4 rounded-2xl font-cute text-2xl outline-none transition-all shadow-sm border-2
            ${error 
              ? 'bg-red-50 border-red-200 text-red-500 placeholder-red-200 focus:ring-4 focus:ring-red-100' 
              : 'bg-white border-pink-100 text-gray-600 placeholder-pink-100 focus:border-pink-300 focus:ring-4 focus:ring-pink-50'
            }`}
        />
        {/* Cute decoration icon inside input */}
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          {error ? (
             <span className="text-xl">⚠️</span>
          ) : (
             <span className="text-xl opacity-50">✨</span>
          )}
        </div>
      </div>
      {!error && <p className="text-xs font-bold text-pink-300 ml-4 mt-1">Digite apenas números, tá?</p>}
    </div>
  );
};