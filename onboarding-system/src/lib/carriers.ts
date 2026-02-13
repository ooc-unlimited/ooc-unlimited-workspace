export interface Product {
  provider: string;
  name: string;
  type: string;
  payout: number;
  issueAges: string;
  minFace?: string;
  highlight?: string;
  catalogFile?: string;
}

export interface Carrier {
  name: string;
  shortName: string;
  types: string[];
  products: Product[];
}

export const PRODUCT_TYPES = [
  { id: 'iul', label: 'IUL', color: '#6366f1' },
  { id: 'term', label: 'Term', color: '#22c55e' },
  { id: 'wl', label: 'Whole Life', color: '#a855f7' },
  { id: 'fe', label: 'Final Expense', color: '#f59e0b' },
  { id: 'gul', label: 'GUL', color: '#3b82f6' },
  { id: 'ltc', label: 'LTC', color: '#ec4899' },
  { id: 'survivor', label: 'Survivorship', color: '#14b8a6' },
] as const;

export const TOP_PRODUCTS: Product[] = [
  // 100% Payout — IUL
  { provider: 'F&G', name: 'Pathsetter IUL', type: 'iul', payout: 100, issueAges: '0-80', minFace: '$50,000', highlight: 'Gary\'s primary IUL. Exam-free UW 0-60 up to $1M. 4 index options.', catalogFile: 'fg-product-catalog.md' },
  { provider: 'Ameritas', name: 'Growth IUL', type: 'iul', payout: 100, issueAges: '0-85', minFace: '$50,000', highlight: '10% index credit enhancement starting year 6. 0% net fixed loan yr 6+.', catalogFile: 'ameritas-product-catalog.md' },
  { provider: 'Corebridge', name: 'QoL Max Accumulator+ 3', type: 'iul', payout: 91.67, issueAges: '0-80', highlight: 'Accumulation-focused. Built-in chronic/critical/terminal illness ABRs.', catalogFile: 'corebridge-product-catalog.md' },
  { provider: 'Corebridge', name: 'QoL Value+ Protector 3', type: 'iul', payout: 91.67, issueAges: '0-80', highlight: 'Protection-focused with cash value. Guaranteed Return of Premium rider.', catalogFile: 'corebridge-product-catalog.md' },
  { provider: 'Mutual of Omaha', name: 'Income Advantage IUL', type: 'iul', payout: 100, issueAges: '18-65', highlight: 'IUL with LTC benefits built in. Not available in CA.', catalogFile: '' },
  
  // 100% Payout — Term
  { provider: 'Ethos', name: 'Prime Term 10/15/20/30', type: 'term', payout: 100, issueAges: '18-65', highlight: 'Simple digital term. Fast issue. Good for income protection.', catalogFile: '' },
  { provider: 'SBLI', name: 'Quility Term 10/15/20/30', type: 'term', payout: 100, issueAges: '18-65', highlight: 'Paired with Ethos for simple term needs.', catalogFile: '' },
  { provider: 'Ameritas', name: 'Value Plus Term', type: 'term', payout: 100, issueAges: '18-80', highlight: '1yr to 30yr options. Convertible first 5 yrs to permanent. Conversion credits.', catalogFile: 'ameritas-product-catalog.md' },
  { provider: 'Corebridge', name: 'QoL Flex Term', type: 'term', payout: 75, issueAges: '18-70', highlight: '18 term durations (10-35yr). Built-in chronic/critical/terminal ABRs. Full conversion.', catalogFile: 'corebridge-product-catalog.md' },
  { provider: 'Lincoln', name: 'TermAccel 20 & 30', type: 'term', payout: 92.5, issueAges: '18-65', highlight: 'Competitive term from Lincoln.', catalogFile: '' },
  
  // 100% Payout — Whole Life
  { provider: 'Ameritas', name: 'Growth Whole Life', type: 'wl', payout: 100, issueAges: '0-80', highlight: 'Guaranteed cash value growth. Chris\'s go-to.', catalogFile: 'ameritas-product-catalog.md' },
  { provider: 'Ameritas', name: 'Value Plus Whole Life', type: 'wl', payout: 100, issueAges: '0-80', highlight: 'Balanced premium/cash value. 100% payout.', catalogFile: 'ameritas-product-catalog.md' },
  { provider: 'Ameritas', name: 'Access Whole Life', type: 'wl', payout: 100, issueAges: '0-80', highlight: 'Entry-level whole life. Accessible premiums.', catalogFile: 'ameritas-product-catalog.md' },
  
  // 100% Payout — Final Expense
  { provider: 'Corebridge', name: 'SimpliNow Legacy Max', type: 'fe', payout: 100, issueAges: '50-80', highlight: 'Top final expense product. 100% payout.', catalogFile: 'corebridge-product-catalog.md' },
  { provider: 'American Amicable', name: 'WL to 110', type: 'fe', payout: 100, issueAges: '50-80', highlight: 'Whole life to age 110. Full payout under 80.', catalogFile: '' },
  { provider: 'Ethos', name: 'TruStage Final Expense', type: 'fe', payout: 100, issueAges: '60-80', highlight: 'Digital final expense. Simple process.', catalogFile: '' },
  
  // GUL
  { provider: 'Corebridge', name: 'QoL Guarantee Plus GUL 2', type: 'gul', payout: 83.33, issueAges: '18-85', highlight: 'Guaranteed death benefit for life. Estate planning/business protection.', catalogFile: 'corebridge-product-catalog.md' },
  
  // LTC
  { provider: 'OneAmerica', name: 'Recurring Premium Pay to 95', type: 'ltc', payout: 87.5, issueAges: '18-79', highlight: 'Top LTC option. Recurring premium.', catalogFile: '' },
  { provider: 'Mutual of Omaha', name: 'Lump Sum Heart/Stroke', type: 'ltc', payout: 70.83, issueAges: '18-75', highlight: 'Critical illness coverage.', catalogFile: '' },
  
  // Survivorship
  { provider: 'Ameritas', name: 'Value Plus Survivor IUL', type: 'survivor', payout: 100, issueAges: '18-85', highlight: 'Second-to-die IUL. Estate planning. 100% payout.', catalogFile: 'ameritas-product-catalog.md' },
];
