
export interface TaxBracket {
  rate: number;
  min: number;
  max?: number;
  label: string;
}

export const taxBrackets: Record<string, TaxBracket[]> = {
  FR: [
    { rate: 0, min: 0, max: 10777, label: '0% (jusqu\'à 10 777€)' },
    { rate: 11, min: 10778, max: 27478, label: '11% (de 10 778€ à 27 478€)' },
    { rate: 30, min: 27479, max: 78570, label: '30% (de 27 479€ à 78 570€)' },
    { rate: 41, min: 78571, max: 168994, label: '41% (de 78 571€ à 168 994€)' },
    { rate: 45, min: 168995, label: '45% (plus de 168 994€)' }
  ],
  US: [
    { rate: 10, min: 0, max: 11000, label: '10% (jusqu\'à $11,000)' },
    { rate: 12, min: 11001, max: 44725, label: '12% (de $11,001 à $44,725)' },
    { rate: 22, min: 44726, max: 95375, label: '22% (de $44,726 à $95,375)' },
    { rate: 24, min: 95376, max: 182050, label: '24% (de $95,376 à $182,050)' },
    { rate: 32, min: 182051, max: 231250, label: '32% (de $182,051 à $231,250)' },
    { rate: 35, min: 231251, max: 578125, label: '35% (de $231,251 à $578,125)' },
    { rate: 37, min: 578126, label: '37% (plus de $578,125)' }
  ],
  CA: [
    { rate: 15, min: 0, max: 53359, label: '15% (jusqu\'à CAD $53,359)' },
    { rate: 20.5, min: 53360, max: 106717, label: '20.5% (de CAD $53,360 à $106,717)' },
    { rate: 26, min: 106718, max: 165430, label: '26% (de CAD $106,718 à $165,430)' },
    { rate: 29, min: 165431, max: 235675, label: '29% (de CAD $165,431 à $235,675)' },
    { rate: 33, min: 235676, label: '33% (plus de CAD $235,675)' }
  ],
  DE: [
    { rate: 0, min: 0, max: 10908, label: '0% (jusqu\'à €10,908)' },
    { rate: 14, min: 10909, max: 62810, label: '14-42% (de €10,909 à €62,810)' },
    { rate: 42, min: 62811, max: 277826, label: '42% (de €62,811 à €277,826)' },
    { rate: 45, min: 277827, label: '45% (plus de €277,826)' }
  ],
  GB: [
    { rate: 0, min: 0, max: 12570, label: '0% (jusqu\'à £12,570)' },
    { rate: 20, min: 12571, max: 50270, label: '20% (de £12,571 à £50,270)' },
    { rate: 40, min: 50271, max: 125140, label: '40% (de £50,271 à £125,140)' },
    { rate: 45, min: 125141, label: '45% (plus de £125,140)' }
  ],
  ES: [
    { rate: 19, min: 0, max: 12450, label: '19% (jusqu\'à €12,450)' },
    { rate: 24, min: 12451, max: 20200, label: '24% (de €12,451 à €20,200)' },
    { rate: 30, min: 20201, max: 35200, label: '30% (de €20,201 à €35,200)' },
    { rate: 37, min: 35201, max: 60000, label: '37% (de €35,201 à €60,000)' },
    { rate: 45, min: 60001, max: 300000, label: '45% (de €60,001 à €300,000)' },
    { rate: 47, min: 300001, label: '47% (plus de €300,000)' }
  ],
  IT: [
    { rate: 23, min: 0, max: 28000, label: '23% (jusqu\'à €28,000)' },
    { rate: 35, min: 28001, max: 50000, label: '35% (de €28,001 à €50,000)' },
    { rate: 43, min: 50001, label: '43% (plus de €50,000)' }
  ],
  BE: [
    { rate: 25, min: 0, max: 15200, label: '25% (jusqu\'à €15,200)' },
    { rate: 40, min: 15201, max: 26830, label: '40% (de €15,201 à €26,830)' },
    { rate: 45, min: 26831, max: 46440, label: '45% (de €26,831 à €46,440)' },
    { rate: 50, min: 46441, label: '50% (plus de €46,440)' }
  ],
  CH: [
    { rate: 8, min: 0, max: 20000, label: '8% (jusqu\'à CHF 20,000)' },
    { rate: 15, min: 20001, max: 50000, label: '15% (de CHF 20,001 à 50,000)' },
    { rate: 25, min: 50001, max: 100000, label: '25% (de CHF 50,001 à 100,000)' },
    { rate: 35, min: 100001, label: '35% (plus de CHF 100,000)' }
  ],
  NL: [
    { rate: 36.93, min: 0, max: 73031, label: '36.93% (jusqu\'à €73,031)' },
    { rate: 49.5, min: 73032, label: '49.5% (plus de €73,031)' }
  ],
  AU: [
    { rate: 0, min: 0, max: 18200, label: '0% (jusqu\'à AUD $18,200)' },
    { rate: 19, min: 18201, max: 45000, label: '19% (de AUD $18,201 à $45,000)' },
    { rate: 32.5, min: 45001, max: 120000, label: '32.5% (de AUD $45,001 à $120,000)' },
    { rate: 37, min: 120001, max: 180000, label: '37% (de AUD $120,001 à $180,000)' },
    { rate: 45, min: 180001, label: '45% (plus de AUD $180,000)' }
  ],
  JP: [
    { rate: 5, min: 0, max: 1950000, label: '5% (jusqu\'à ¥1,950,000)' },
    { rate: 10, min: 1950001, max: 3300000, label: '10% (de ¥1,950,001 à ¥3,300,000)' },
    { rate: 20, min: 3300001, max: 6950000, label: '20% (de ¥3,300,001 à ¥6,950,000)' },
    { rate: 23, min: 6950001, max: 9000000, label: '23% (de ¥6,950,001 à ¥9,000,000)' },
    { rate: 33, min: 9000001, max: 18000000, label: '33% (de ¥9,000,001 à ¥18,000,000)' },
    { rate: 40, min: 18000001, max: 40000000, label: '40% (de ¥18,000,001 à ¥40,000,000)' },
    { rate: 45, min: 40000001, label: '45% (plus de ¥40,000,000)' }
  ],
  SG: [
    { rate: 0, min: 0, max: 20000, label: '0% (jusqu\'à SGD $20,000)' },
    { rate: 2, min: 20001, max: 30000, label: '2% (de SGD $20,001 à $30,000)' },
    { rate: 3.5, min: 30001, max: 40000, label: '3.5% (de SGD $30,001 à $40,000)' },
    { rate: 7, min: 40001, max: 80000, label: '7% (de SGD $40,001 à $80,000)' },
    { rate: 11.5, min: 80001, max: 120000, label: '11.5% (de SGD $80,001 à $120,000)' },
    { rate: 15, min: 120001, max: 160000, label: '15% (de SGD $120,001 à $160,000)' },
    { rate: 18, min: 160001, max: 200000, label: '18% (de SGD $160,001 à $200,000)' },
    { rate: 19, min: 200001, max: 240000, label: '19% (de SGD $200,001 à $240,000)' },
    { rate: 19.5, min: 240001, max: 280000, label: '19.5% (de SGD $240,001 à $280,000)' },
    { rate: 20, min: 280001, max: 320000, label: '20% (de SGD $280,001 à $320,000)' },
    { rate: 22, min: 320001, max: 500000, label: '22% (de SGD $320,001 à $500,000)' },
    { rate: 23, min: 500001, max: 1000000, label: '23% (de SGD $500,001 à $1,000,000)' },
    { rate: 24, min: 1000001, label: '24% (plus de SGD $1,000,000)' }
  ],
  AE: [
    { rate: 0, min: 0, label: '0% (Aucun impôt sur le revenu)' }
  ],
  LU: [
    { rate: 8, min: 0, max: 13500, label: '8% (jusqu\'à €13,500)' },
    { rate: 10, min: 13501, max: 23500, label: '10% (de €13,501 à €23,500)' },
    { rate: 12, min: 23501, max: 35000, label: '12% (de €23,501 à €35,000)' },
    { rate: 14, min: 35001, max: 48000, label: '14% (de €35,001 à €48,000)' },
    { rate: 16, min: 48001, max: 70000, label: '16% (de €48,001 à €70,000)' },
    { rate: 18, min: 70001, max: 95000, label: '18% (de €70,001 à €95,000)' },
    { rate: 39, min: 95001, max: 175000, label: '39% (de €95,001 à €175,000)' },
    { rate: 40, min: 175001, max: 200000, label: '40% (de €175,001 à €200,000)' },
    { rate: 41, min: 200001, max: 225000, label: '41% (de €200,001 à €225,000)' },
    { rate: 42, min: 225001, label: '42% (plus de €225,000)' }
  ]
};

export const getCurrencySymbol = (countryCode: string): string => {
  const symbols: Record<string, string> = {
    FR: '€', US: '$', CA: 'CAD $', DE: '€', GB: '£', ES: '€', IT: '€',
    BE: '€', CH: 'CHF', NL: '€', AU: 'AUD $', JP: '¥', SG: 'SGD $',
    AE: 'AED', LU: '€'
  };
  return symbols[countryCode] || '€';
};

export const calculateTaxForCountry = (income: number, countryCode: string): number => {
  const brackets = taxBrackets[countryCode] || taxBrackets.FR;
  
  // Pour les pays sans impôt (UAE)
  if (brackets.length === 1 && brackets[0].rate === 0) {
    return 0;
  }
  
  let totalTax = 0;
  let remainingIncome = income;
  
  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    
    const taxableAtThisBracket = Math.min(
      remainingIncome,
      bracket.max ? bracket.max - bracket.min + 1 : remainingIncome
    );
    
    if (income > bracket.min) {
      totalTax += taxableAtThisBracket * (bracket.rate / 100);
      remainingIncome -= taxableAtThisBracket;
    }
  }
  
  return totalTax;
};
