/**
 * TABELAS E CONSTANTES FISCAIS
 */

// Tabela 3.1: Dados para cálculo da ALIQ1
interface FaixaAliq1 {
  limite: number;
  aliqNominal: number;
  ped: number; // Parcela a Deduzir
  reparticao: number;
}

export const TABELA_ALIQ1: FaixaAliq1[] = [
  { limite: 180000.00, aliqNominal: 0.040, ped: 0.00, reparticao: 0.34 },
  { limite: 360000.00, aliqNominal: 0.073, ped: 5940.00, reparticao: 0.34 },
  { limite: 720000.00, aliqNominal: 0.095, ped: 13860.00, reparticao: 0.335 },
  { limite: 1800000.00, aliqNominal: 0.107, ped: 22500.00, reparticao: 0.335 },
  { limite: 3600000.00, aliqNominal: 0.143, ped: 87300.00, reparticao: 0.335 },
];

// Tabela 3.2: Dados para cálculo do PR (ALIQ2)
interface FaixaAliq2 {
  limite: number;
  aliq2Pct: number; // Em porcentagem (ex: 0.70)
}

export const TABELA_ALIQ2: FaixaAliq2[] = [
  { limite: 180000.00, aliq2Pct: 0.70 },
  { limite: 360000.00, aliq2Pct: 0.78 },
  { limite: 540000.00, aliq2Pct: 0.99 },
  { limite: 720000.00, aliq2Pct: 1.50 },
  { limite: 900000.00, aliq2Pct: 2.50 },
  { limite: 1080000.00, aliq2Pct: 2.65 },
  { limite: 1260000.00, aliq2Pct: 2.75 },
  { limite: 1440000.00, aliq2Pct: 2.80 },
  { limite: 1620000.00, aliq2Pct: 2.95 },
  { limite: 1800000.00, aliq2Pct: 3.05 },
  { limite: 1980000.00, aliq2Pct: 3.21 },
  { limite: 2160000.00, aliq2Pct: 3.30 },
  { limite: 2340000.00, aliq2Pct: 3.40 },
  { limite: 2520000.00, aliq2Pct: 3.48 },
  { limite: 2700000.00, aliq2Pct: 3.51 },
  { limite: 2880000.00, aliq2Pct: 3.63 },
  { limite: 3060000.00, aliq2Pct: 3.75 },
  { limite: 3240000.00, aliq2Pct: 3.83 },
  { limite: 3420000.00, aliq2Pct: 3.91 },
  { limite: 3600000.00, aliq2Pct: 3.95 },
];

/**
 * FUNÇÕES DE CÁLCULO
 */

// 3.1 Calcular ALIQ1
export const calcularAliq1 = (rbt12: number): number => {
  if (rbt12 <= 0) return 0;

  // Encontrar a faixa correspondente
  const faixa = TABELA_ALIQ1.find(f => rbt12 <= f.limite) || TABELA_ALIQ1[TABELA_ALIQ1.length - 1];
  
  // Fórmula: ((RBT12 * AliqNominal) - PED) / RBT12 * Reparticao
  const termo1 = rbt12 * faixa.aliqNominal;
  const termo2 = termo1 - faixa.ped;
  const termo3 = termo2 / rbt12;
  const aliq1Decimal = termo3 * faixa.reparticao;

  return aliq1Decimal; // Retorna com precisão total (ratio 0.xxxx)
};

// 4.5 Regra de Arredondamento Personalizado
// Se o número formado pelo 3º e 4º dígito após a vírgula for estritamente superior a 55,
// o 2º dígito após a vírgula deve ser acrescido em um.
export const arredondamentoPersonalizado = (valor: number): number => {
  // Estratégia: Usar string para evitar erros de ponto flutuante na detecção dos dígitos
  // Ex: 3.4556 -> "3.4556"
  
  // Converte para string com casas suficientes fixas para análise
  const valStr = valor.toFixed(10); 
  const parts = valStr.split('.');
  
  if (parts.length < 2) return valor; // Inteiro
  
  const decimalPart = parts[1];
  
  // Pegar os dígitos relevantes
  // Dígito 1 e 2 formam a base.
  // Dígito 3 e 4 formam o verificador.
  
  const digitosBase = parseInt(decimalPart.substring(0, 2), 10); // Ex: 45
  const digitosVerificadores = parseInt(decimalPart.substring(2, 4), 10); // Ex: 56
  
  let novoDecimalBase = digitosBase;
  
  // Regra: se verificador > 55, soma 1 na base
  if (digitosVerificadores > 55) {
    novoDecimalBase += 1;
  }
  
  // Reconstruir o número (divide por 100 pois estamos trabalhando com 2 casas)
  const inteiro = parseInt(parts[0], 10);
  
  return inteiro + (novoDecimalBase / 100);
};

// Obter ALIQ2 com base no RBT12
export const obterAliq2 = (rbt12: number): number => {
  const faixa = TABELA_ALIQ2.find(f => rbt12 <= f.limite) || TABELA_ALIQ2[TABELA_ALIQ2.length - 1];
  return faixa.aliq2Pct;
};

// 3.2 Calcular Percentual de Redução (PR) - FLUXO DE PRECISÃO MISTA
// Regra Inegociável:
// Numerador: Usa ALIQ1 com precisão total.
// Denominador: Usa ALIQ1 arredondada (2 casas).
export const calcularPR = (
  aliq1PrecisaoTotalPct: number, 
  aliq1ArredondadaPct: number, 
  aliq2Pct: number
): number => {
  
  if (aliq1ArredondadaPct === 0) return 0;
  
  // Fórmula: ((ALIQ1_total - ALIQ2) * 100) / ALIQ1_arredondada
  const numerador = (aliq1PrecisaoTotalPct - aliq2Pct) * 100;
  const pr = numerador / aliq1ArredondadaPct;
  
  return pr;
};