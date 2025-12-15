import React, { useMemo, useState } from 'react';
import { 
  arredondamentoPersonalizado, 
  obterAliq2, 
  calcularPR,
  TABELA_ALIQ2,
  TABELA_ALIQ1
} from '../utils/taxCalculations';

interface PgdasTabProps {
  rbt12: number;
  aliq1DecimalOriginal: number;
}

export const PgdasTab: React.FC<PgdasTabProps> = ({ rbt12, aliq1DecimalOriginal }) => {
  const [copied, setCopied] = useState(false);
  
  const calculos = useMemo(() => {
    // ETAPA 1: Variável de Precisão Total (Para o Numerador)
    const aliq1PctTotal = aliq1DecimalOriginal * 100;
    
    // ETAPA 2: Variável Arredondada (Para o Denominador)
    const aliq1PctArredondada = arredondamentoPersonalizado(aliq1PctTotal);
    
    // ETAPA 3: Variável da Tabela
    const aliq2Pct = obterAliq2(rbt12);

    // CÁLCULO MISTO: Usa Total no topo, Arredondada embaixo
    const prRaw = calcularPR(aliq1PctTotal, aliq1PctArredondada, aliq2Pct);
    
    // Arredondamento final do PR
    const prFinal = arredondamentoPersonalizado(prRaw);
    
    // Identificação da Faixa
    const indexFaixa = TABELA_ALIQ1.findIndex(f => rbt12 <= f.limite);
    const faixaNumero = indexFaixa === -1 ? 5 : indexFaixa + 1;

    return {
      aliq1PctTotal,
      aliq1PctArredondada,
      aliq2Pct,
      prRaw,
      prCalculado: prFinal,
      faixaNumero
    };
  }, [aliq1DecimalOriginal, rbt12]);

  const { aliq1PctTotal, aliq1PctArredondada, aliq2Pct, prRaw, prCalculado, faixaNumero } = calculos;
  const faixaAliq2 = TABELA_ALIQ2.find(f => rbt12 <= f.limite);

  const finalValue = isNaN(prCalculado) || !isFinite(prCalculado) ? '0.00' : prCalculado.toFixed(2);

  const handleCopy = () => {
    navigator.clipboard.writeText(finalValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper para mostrar os dígitos verificadores no tooltip
  const getVerificadores = (val: number) => {
      if (isNaN(val) || !isFinite(val)) return "00";
      const valStr = val.toFixed(10); 
      const parts = valStr.split('.');
      if (parts.length < 2) return "00";
      return parts[1].substring(2, 4);
  };

  // Helper para o texto do intervalo da faixa
  const getFaixaLabel = (num: number) => {
    switch(num) {
      case 1: return "Até R$ 180.000,00";
      case 2: return "R$ 180k a R$ 360k";
      case 3: return "R$ 360k a R$ 720k";
      case 4: return "R$ 720k a R$ 1,8M";
      case 5: return "R$ 1,8M a R$ 3,6M";
      default: return "Acima de R$ 3,6M";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      
      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: Detalhes com Tooltips */}
        <div className="bg-white rounded-3xl border-2 border-pink-100 p-5 shadow-sm relative overflow-visible group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 hover:rotate-1 cursor-default z-20">
          <div className="absolute -right-4 -top-4 bg-pink-100 w-16 h-16 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 -z-10 overflow-hidden"></div>
          
          <h3 className="font-cute text-pink-400 mb-4 border-b border-pink-100 pb-2">Parâmetros do Cálculo</h3>
          
          <div className="space-y-3">
            
            {/* Faixa Row (Invertida: Label no badge, Número no tooltip) */}
            <div className="flex justify-between items-center group/faixa relative">
              <span className="text-gray-400 text-sm border-b border-dotted border-gray-300 cursor-help">Faixa (RBT12)</span>
              <span className="font-cute text-xs sm:text-sm text-orange-400 bg-orange-50 px-3 py-1 rounded-full whitespace-nowrap">
                {getFaixaLabel(faixaNumero)}
              </span>

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white border-2 border-orange-200 text-orange-500 text-xs rounded-xl p-2 opacity-0 group-hover/faixa:opacity-100 transition-all duration-300 pointer-events-none z-50 text-center shadow-lg font-cute invisible group-hover/faixa:visible">
                <span className="block font-bold text-orange-600 mb-1 text-sm">
                  {faixaNumero}ª Faixa do Anexo I
                </span>
                Faixa de enquadramento baseada na Receita Bruta acumulada.
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-orange-200"></div>
              </div>
            </div>

            {/* ALIQ1 TOTAL Row */}
            <div className="flex justify-between items-center group/aliq1t relative">
              <span className="text-gray-400 text-sm border-b border-dotted border-gray-300 cursor-help">ALIQ1 (Exata)</span>
              <span className="font-cute text-sm text-purple-400 bg-purple-50 px-2 py-1 rounded-full">
                {aliq1PctTotal.toFixed(4)}%...
              </span>
              
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white border-2 border-purple-200 text-purple-500 text-xs rounded-xl p-2 opacity-0 group-hover/aliq1t:opacity-100 transition-all duration-300 pointer-events-none z-50 text-center shadow-lg font-cute invisible group-hover/aliq1t:visible">
                Valor com precisão total usado no <b>Numerador</b> da fórmula.
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-purple-200"></div>
              </div>
            </div>

            {/* ALIQ1 ARREDONDADA Row */}
            <div className="flex justify-between items-center group/aliq1r relative">
              <span className="text-gray-400 text-sm border-b border-dotted border-gray-300 cursor-help">ALIQ1 (Arred.)</span>
              <span className="font-cute text-lg text-pink-500 bg-pink-50 px-3 py-1 rounded-full">
                {aliq1PctArredondada.toFixed(2)}%
              </span>
              
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white border-2 border-pink-200 text-pink-500 text-xs rounded-xl p-2 opacity-0 group-hover/aliq1r:opacity-100 transition-all duration-300 pointer-events-none z-50 text-center shadow-lg font-cute invisible group-hover/aliq1r:visible">
                Valor arredondado (Regra &gt;55) usado no <b>Denominador</b> da fórmula.
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-pink-200"></div>
              </div>
            </div>

            {/* ALIQ2 Row */}
            <div className="flex justify-between items-center group/aliq2 relative">
              <span className="text-gray-400 text-sm border-b border-dotted border-gray-300 cursor-help">ALIQ2 (Tabela)</span>
              <span className="font-cute text-lg text-blue-400 bg-blue-50 px-3 py-1 rounded-full">
                {aliq2Pct.toFixed(2)}%
              </span>

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white border-2 border-blue-200 text-blue-500 text-xs rounded-xl p-2 opacity-0 group-hover/aliq2:opacity-100 transition-all duration-300 pointer-events-none z-50 text-center shadow-lg font-cute invisible group-hover/aliq2:visible">
                Percentual fixo definido na Tabela do Anexo I.
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-blue-200"></div>
              </div>
            </div>

          </div>
        </div>

        {/* Card 2: Rules */}
        <div className="bg-green-50 rounded-3xl border-2 border-green-200 border-dashed p-5 flex flex-col justify-center relative transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 hover:-rotate-1 cursor-default group z-10">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-white border border-green-200 rounded-full w-8 h-8 flex items-center justify-center text-xs shadow-sm group-hover:rotate-12 transition-transform">
              ?
            </div>
            <p className="text-sm text-green-700 font-cute mb-3 text-center leading-relaxed">
              "Fluxo de Precisão Mista: Numerador exato, Denominador arredondado!"
            </p>
            
            {/* Formula box with Tooltip */}
            <div className="group/tooltip relative">
                <div className="bg-white text-green-600 p-3 rounded-xl text-xs font-mono border border-green-200 shadow-inner text-center cursor-help transition-colors hover:bg-green-50 break-all">
                  PR = [({aliq1PctTotal.toFixed(4)} - {aliq2Pct.toFixed(2)}) * 100] ÷ {aliq1PctArredondada.toFixed(2)}
                </div>
                
                {/* Tooltip Popup */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 bg-white border-2 border-green-200 text-green-700 text-xs rounded-xl p-3 opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 pointer-events-none z-50 text-center shadow-lg font-cute invisible group-hover/tooltip:visible">
                    <span className="block mb-1 font-bold">✨ Regra Fiscal Inegociável:</span>
                    O cálculo subtrai ALIQ2 do <span className="text-purple-500 font-bold">ALIQ1 Total</span>, multiplica por 100, e só depois divide pelo <span className="text-pink-500 font-bold">ALIQ1 Arredondado</span>.
                    
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-green-200"></div>
                </div>
            </div>
        </div>
      </div>

      {/* Resultado Final */}
      <div className="mt-8">
        <div className="bg-gradient-to-b from-green-100 to-green-200 rounded-[32px] p-8 text-center shadow-lg border-4 border-white outline outline-2 outline-green-300 relative transition-transform duration-300 hover:scale-[1.01] z-30 flex flex-col items-center justify-center">
          
          <div className="absolute top-4 left-4 text-2xl animate-bounce" style={{ animationDuration: '3s' }}>🍃</div>
          <div className="absolute bottom-4 right-4 text-2xl animate-bounce" style={{ animationDuration: '4s' }}>🔔</div>

          <h2 className="font-cute text-green-800 text-lg mb-2 uppercase tracking-wide bg-white/50 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
            Percentual de Redução (PR)
          </h2>
          
          {/* Tooltip Wrapper for Result */}
          <div className="group/result relative inline-block">
            <div className="font-cute text-5xl sm:text-6xl font-bold text-white drop-shadow-md my-4 cursor-help">
                {finalValue}%
            </div>

            {/* Detailed Result Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-72 bg-white/95 backdrop-blur-sm border-2 border-green-200 text-green-800 text-xs rounded-xl p-4 opacity-0 group-hover/result:opacity-100 transition-all duration-300 pointer-events-none z-[100] text-center shadow-xl font-cute invisible group-hover/result:visible">
                <p className="font-bold mb-2 border-b border-green-100 pb-1 flex items-center justify-center gap-1">
                    <span>🔬</span> Precisão Total & Regra
                </p>
                <div className="font-mono text-green-600 mb-2 bg-green-50 p-1 rounded border border-green-100">
                    {prRaw.toFixed(6)}...
                </div>
                <div className="text-[11px] leading-tight text-gray-500 space-y-1">
                    <p>
                        <strong>Regra (&gt;55):</strong> Verifica-se a 3ª e 4ª casa decimal.
                    </p>
                    <p className="flex justify-center items-center gap-2">
                        Dígitos verificadores: 
                        <span className={`font-bold px-1 rounded ${parseInt(getVerificadores(prRaw)) > 55 ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
                            {getVerificadores(prRaw)}
                        </span>
                    </p>
                    <p>
                        {parseInt(getVerificadores(prRaw)) > 55 
                            ? "Como é maior que 55, somamos 1 na 2ª casa." 
                            : "Como é menor ou igual a 55, mantemos a 2ª casa."}
                    </p>
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-green-200"></div>
            </div>
          </div>

          <div className="flex justify-center mt-2">
            <button
                onClick={handleCopy}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full font-cute text-sm transition-all duration-300 shadow-sm
                  ${copied 
                    ? 'bg-green-300 text-white shadow-inner scale-95' 
                    : 'bg-white text-green-600 hover:bg-green-50 hover:scale-105'
                  }
                `}
            >
                {copied ? (
                   <>
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                       <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                     </svg>
                     <span>Copiado!</span>
                   </>
                ) : (
                   <>
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 017.5 0h.375C18.66 1.5 19.5 2.34 19.5 3.375v17.25c0 1.035-.84 1.875-1.875 1.875H7.5A1.875 1.875 0 015.625 20.625V3.375zm1.5-.375c0-.621.504-1.125 1.125-1.125h.375a2.25 2.25 0 014.5 0h.375c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-6c-.621 0-1.125-.504-1.125-1.125v-1.5z" />
                     </svg>
                     <span>Copiar Valor</span>
                   </>
                )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};