import React, { useMemo } from 'react';
import { 
  arredondamentoPersonalizado, 
  obterAliq2, 
  calcularPR,
  TABELA_ALIQ2
} from '../utils/taxCalculations';

interface PgdasTabProps {
  rbt12: number;
  aliq1DecimalOriginal: number;
}

export const PgdasTab: React.FC<PgdasTabProps> = ({ rbt12, aliq1DecimalOriginal }) => {
  
  const calculos = useMemo(() => {
    const aliq1Pct = aliq1DecimalOriginal * 100;
    const aliq1ArredondadaPct = arredondamentoPersonalizado(aliq1Pct);
    const aliq2Pct = obterAliq2(rbt12);
    let pr = calcularPR(aliq1ArredondadaPct, aliq2Pct);
    const prArredondado = arredondamentoPersonalizado(pr);

    return {
      aliq1ArredondadaPct,
      aliq2Pct,
      prCalculado: prArredondado
    };
  }, [aliq1DecimalOriginal, rbt12]);

  const { aliq1ArredondadaPct, aliq2Pct, prCalculado } = calculos;
  const faixaAliq2 = TABELA_ALIQ2.find(f => rbt12 <= f.limite);

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      
      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: Detalhes com Tooltips */}
        <div className="bg-white rounded-3xl border-2 border-pink-100 p-5 shadow-sm relative overflow-visible group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 hover:rotate-1 cursor-default z-20">
          <div className="absolute -right-4 -top-4 bg-pink-100 w-16 h-16 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 -z-10 overflow-hidden"></div>
          
          <h3 className="font-cute text-pink-400 mb-4 border-b border-pink-100 pb-2">Detalhes</h3>
          
          <div className="space-y-3">
            
            {/* ALIQ1 Row com Tooltip */}
            <div className="flex justify-between items-center group/aliq1 relative">
              <span className="text-gray-400 text-sm border-b border-dotted border-gray-300 cursor-help">ALIQ1 (Arred.)</span>
              <span className="font-cute text-lg text-pink-500 bg-pink-50 px-3 py-1 rounded-full">
                {aliq1ArredondadaPct.toFixed(2)}%
              </span>
              
              {/* Tooltip ALIQ1 */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white border-2 border-pink-200 text-pink-500 text-xs rounded-xl p-2 opacity-0 group-hover/aliq1:opacity-100 transition-all duration-300 pointer-events-none z-50 text-center shadow-lg font-cute invisible group-hover/aliq1:visible">
                Valor já arredondado (3ª e 4ª casa decimal) para uso no cálculo.
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-pink-200"></div>
              </div>
            </div>

            {/* ALIQ2 Row com Tooltip */}
            <div className="flex justify-between items-center group/aliq2 relative">
              <span className="text-gray-400 text-sm border-b border-dotted border-gray-300 cursor-help">ALIQ2 (Tabela)</span>
              <span className="font-cute text-lg text-blue-400 bg-blue-50 px-3 py-1 rounded-full">
                {aliq2Pct.toFixed(2)}%
              </span>

              {/* Tooltip ALIQ2 */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white border-2 border-blue-200 text-blue-500 text-xs rounded-xl p-2 opacity-0 group-hover/aliq2:opacity-100 transition-all duration-300 pointer-events-none z-50 text-center shadow-lg font-cute invisible group-hover/aliq2:visible">
                Percentual fixo definido na Tabela do Anexo I do Simples Nacional.
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-blue-200"></div>
              </div>
            </div>

            {/* Faixa Row com Tooltip */}
            <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-100 group/faixa relative">
              <span className="text-xs text-gray-400 border-b border-dotted border-gray-300 cursor-help">Faixa</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {faixaAliq2 ? `< R$ ${faixaAliq2.limite.toLocaleString('pt-BR')}` : 'Máxima'}
              </span>

              {/* Tooltip Faixa */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white border-2 border-gray-200 text-gray-500 text-xs rounded-xl p-2 opacity-0 group-hover/faixa:opacity-100 transition-all duration-300 pointer-events-none z-50 text-center shadow-lg font-cute invisible group-hover/faixa:visible">
                Limite superior da faixa de receita usada para achar o ALIQ2.
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-200"></div>
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
              "A regra diz: se os dígitos finais forem &gt; 55, a gente arredonda pra cima!"
            </p>
            
            {/* Formula box with Tooltip */}
            <div className="group/tooltip relative">
                <div className="bg-white text-green-600 p-3 rounded-xl text-xs font-mono border border-green-200 shadow-inner text-center cursor-help transition-colors hover:bg-green-50">
                  PR = [({aliq1ArredondadaPct.toFixed(2)} - {aliq2Pct.toFixed(2)}) * 100] ÷ {aliq1ArredondadaPct.toFixed(2)}
                </div>
                
                {/* Tooltip Popup */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white border-2 border-green-200 text-green-700 text-xs rounded-xl p-3 opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 pointer-events-none z-50 text-center shadow-lg font-cute invisible group-hover/tooltip:visible">
                    <span className="block mb-1 font-bold">✨ Curiosidade Fiscal:</span>
                    O cálculo utiliza o <span className="font-bold bg-green-100 px-1 rounded">ALIQ1 já arredondado</span> (e não o valor original exato), seguindo estritamente a norma do PGDAS.
                    
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-green-200"></div>
                </div>
            </div>
        </div>
      </div>

      {/* Resultado Final */}
      <div className="mt-8">
        <div className="bg-gradient-to-b from-green-100 to-green-200 rounded-[32px] p-8 text-center shadow-lg border-4 border-white outline outline-2 outline-green-300 relative transition-transform duration-300 hover:scale-[1.01]">
          
          <div className="absolute top-4 left-4 text-2xl animate-bounce" style={{ animationDuration: '3s' }}>🍃</div>
          <div className="absolute bottom-4 right-4 text-2xl animate-bounce" style={{ animationDuration: '4s' }}>🔔</div>

          <h2 className="font-cute text-green-800 text-lg mb-2 uppercase tracking-wide bg-white/50 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
            Percentual de Redução (PR)
          </h2>
          
          <div className="font-cute text-6xl sm:text-7xl font-bold text-white drop-shadow-md my-4">
            {isNaN(prCalculado) || !isFinite(prCalculado) ? '0.00' : prCalculado.toFixed(2)}%
          </div>
          
          <div className="bg-white/80 rounded-xl p-3 inline-block mt-2">
            <p className="font-bold text-green-600 text-sm">
              Prontinho! É só usar no PGDAS.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};