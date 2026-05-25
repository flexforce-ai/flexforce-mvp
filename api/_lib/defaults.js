// Trade-specific defaults for screening questions + brand presets.

export const TRADE_DEFAULTS = {
  hvac: {
    title: 'HVAC Service Technician',
    payLow: 28, payHigh: 45,
    summary: 'Looking for a licensed HVAC tech. Service, diagnostics, install work. Bring real experience; we\'ll bring real opportunity.',
    perks: ['Health + dental', 'Take-home truck', 'Paid continuing-ed', '401(k) match'],
    licenseLabel: 'TDLR / state HVAC license',
    questions: [
      { key: 'license', en: 'What\'s your state HVAC license number?', es: '¿Cuál es tu número de licencia HVAC estatal?' },
      { key: 'experience', en: 'How many years of residential HVAC experience do you have?', es: '¿Cuántos años de experiencia en HVAC residencial tienes?' },
      { key: 'epa608', en: 'Do you have an active EPA 608 certification?', es: '¿Tienes una certificación EPA 608 activa?' },
      { key: 'available', en: 'When can you start?', es: '¿Cuándo puedes empezar?' }
    ]
  },
  plumbing: {
    title: 'Service Plumber',
    payLow: 30, payHigh: 50,
    summary: 'Looking for a licensed plumber for residential service + light commercial work. Steady book, modern dispatch software, fair pay.',
    perks: ['Health + dental', 'Take-home van', 'Paid CE hours', 'Apprentice mentorship program'],
    licenseLabel: 'State plumbing license',
    questions: [
      { key: 'license', en: 'What\'s your plumbing license number and tier (apprentice / journeyman / master)?', es: '¿Cuál es tu número y nivel de licencia de plomería (aprendiz / oficial / maestro)?' },
      { key: 'experience', en: 'How many years of plumbing work?', es: '¿Cuántos años de experiencia en plomería?' },
      { key: 'specialties', en: 'Any specialties — backflow, gas, repipe?', es: '¿Alguna especialidad — contra-flujo, gas, reparación de tubería?' },
      { key: 'available', en: 'When can you start?', es: '¿Cuándo puedes empezar?' }
    ]
  },
  electrical: {
    title: 'Service Electrician',
    payLow: 30, payHigh: 55,
    summary: 'Looking for a licensed electrician — service, troubleshooting, panel upgrades, EV charger installs. Modern tools, real pay.',
    perks: ['Health + dental', 'Take-home van', 'Paid licensing renewal', 'Performance bonuses'],
    licenseLabel: 'State electrician license',
    questions: [
      { key: 'license', en: 'What\'s your electrical license number and tier?', es: '¿Cuál es tu número y nivel de licencia eléctrica?' },
      { key: 'experience', en: 'Years of electrical experience?', es: '¿Años de experiencia eléctrica?' },
      { key: 'ev_solar', en: 'Any EV charger or solar interconnect experience?', es: '¿Experiencia con cargadores EV o interconexión solar?' },
      { key: 'available', en: 'When can you start?', es: '¿Cuándo puedes empezar?' }
    ]
  },
  roofing: {
    title: 'Roofing Crew Lead',
    payLow: 22, payHigh: 40,
    summary: 'Looking for a roofing crew lead. Asphalt + metal experience preferred. Storm-response opportunities available. Weekly pay.',
    perks: ['Weekly pay', 'Storm-season bonuses', 'Crew lead training', 'Tools provided'],
    licenseLabel: 'Roofing / HIC credential',
    questions: [
      { key: 'experience', en: 'How many years on roofing crews?', es: '¿Cuántos años en cuadrillas de techado?' },
      { key: 'materials', en: 'What materials have you installed (asphalt, metal, tile, slate)?', es: '¿Qué materiales has instalado (asfalto, metal, teja, pizarra)?' },
      { key: 'crew_lead', en: 'Have you led a crew before? How many people?', es: '¿Has liderado una cuadrilla antes? ¿De cuántas personas?' },
      { key: 'available', en: 'When can you start?', es: '¿Cuándo puedes empezar?' }
    ]
  },
  other: {
    title: 'Field Technician',
    payLow: 20, payHigh: 40,
    summary: 'Looking for a reliable field technician to join our growing team. Real pay, real schedule, real respect.',
    perks: ['Health benefits', 'Steady hours', 'Growth opportunities', 'Paid time off'],
    licenseLabel: 'Trade credential',
    questions: [
      { key: 'experience', en: 'How many years in your trade?', es: '¿Cuántos años en tu oficio?' },
      { key: 'specialty', en: 'What specifically are you best at?', es: '¿En qué eres mejor específicamente?' },
      { key: 'available', en: 'When can you start?', es: '¿Cuándo puedes empezar?' }
    ]
  }
};

export const STATE_LICENSE_BOARDS = {
  texas: { board: 'TDLR', url: 'https://www.tdlr.texas.gov' },
  'new-jersey': { board: 'NJ DCA', url: 'https://www.njconsumeraffairs.gov' },
  utah: { board: 'Utah DOPL', url: 'https://dopl.utah.gov' },
  connecticut: { board: 'CT DCP', url: 'https://portal.ct.gov/DCP' },
  'new-york': { board: 'NYS Dept of State', url: 'https://dos.ny.gov/licensing' },
  california: { board: 'CSLB', url: 'https://www.cslb.ca.gov' },
  florida: { board: 'FL DBPR', url: 'https://www.myfloridalicense.com' },
  default: { board: 'State trade board', url: '' }
};

// Brand color presets so shops without a designer can still feel branded.
export const BRAND_PRESETS = [
  { name: 'Burnt Orange', primary: '#c2410c', dark: '#9a330a', soft: '#fff7ed' },
  { name: 'Steel Blue', primary: '#1d4ed8', dark: '#1e3a8a', soft: '#eff6ff' },
  { name: 'Crimson', primary: '#b91c1c', dark: '#7f1d1d', soft: '#fef2f2' },
  { name: 'Forest', primary: '#15803d', dark: '#14532d', soft: '#f0fdf4' },
  { name: 'Slate', primary: '#334155', dark: '#1e293b', soft: '#f1f5f9' },
  { name: 'Plum', primary: '#7e22ce', dark: '#581c87', soft: '#faf5ff' },
  { name: 'Amber', primary: '#b45309', dark: '#78350f', soft: '#fffbeb' },
  { name: 'Teal', primary: '#0f766e', dark: '#134e4a', soft: '#f0fdfa' }
];

export function defaultsForTrade(trade) {
  return TRADE_DEFAULTS[trade] || TRADE_DEFAULTS.other;
}

export function licenseBoardForState(stateSlug) {
  return STATE_LICENSE_BOARDS[stateSlug] || STATE_LICENSE_BOARDS.default;
}

const RESERVED_SLUGS = [
  'flexforce', 'admin', 'app', 'api', 'login', 'logout', 'signup', 'onboard',
  'dashboard', 'settings', 'help', 'support', 'docs', 'blog', 'pricing',
  'hire', 'trades', 'states', 'guides', 'compare', 'reports', 'apply',
  'mike', 'mikes-hvac', 'test', 'demo', 'staging', 'production', 'www',
  'mail', 'email', 'ftp', 'localhost'
];

export function isReservedSlug(slug) {
  return RESERVED_SLUGS.includes(slug);
}

export function normalizeSlug(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

export function isValidSlug(slug) {
  if (!slug) return false;
  if (slug.length < 3 || slug.length > 40) return false;
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug)) return false;
  if (isReservedSlug(slug)) return false;
  return true;
}
