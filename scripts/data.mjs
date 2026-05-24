// FlexForce — canonical SEO content data.
// All bespoke per-state and per-trade copy lives here.
// build-config.mjs consumes this and emits pages-config.json.

export const PUB_DATE = '2026-05-23';

// ─── Per-state canonical data ────────────────────────────────────────────────
export const STATES = {
  texas: {
    name: 'Texas', slug: 'texas', abbr: 'TX', lower: 'texas',
    board: 'TDLR (Texas Dept of Licensing & Regulation)',
    boardShort: 'TDLR',
    boardUrl: 'https://www.tdlr.texas.gov',
    boardLookupUrl: 'https://www.tdlr.texas.gov/LicenseSearch/',
    boardLookupLabel: 'TDLR License Search',
    cities: [
      { name: 'Houston', ctx: 'Largest trades market in Texas. High summer demand plus petrochemical facility work creates year-round need. Competitive with large commercial contractors for senior techs.' },
      { name: 'Dallas–Fort Worth', ctx: 'Fastest-growing demand in 2025–2026 driven by the data-center construction wave. Microsoft, Google, and Meta facilities are pulling licensed techs into commercial roles at wages small shops can\'t always match.' },
      { name: 'Austin', ctx: 'New residential construction boom plus tech-office retrofits creating dual demand. Techs here often hold competing offers within 48 hours of applying — speed of contact matters most.' }
    ],
    bilingual: 'full',
    bilingualNote: 'particularly in Houston\'s Energy Corridor and DFW\'s south and west suburbs',
    bilingualCities: 'Houston and Dallas',
    statePain: 'Texas has two structural pressures driving the hiring crunch in 2026. First, the data-center construction wave across the DFW Metroplex and Austin\'s Silicon Hills corridor is pulling licensed trades onto commercial projects at wages most residential and light-commercial shops can\'t match. Second, summer demand spikes mean contractors in Houston and San Antonio are competing for the same labor pool simultaneously, driving ghosting rates above 40% for traditional job postings.'
  },
  'new-jersey': {
    name: 'New Jersey', slug: 'new-jersey', abbr: 'NJ', lower: 'new jersey',
    board: 'NJ Division of Consumer Affairs',
    boardShort: 'NJ DCA',
    boardUrl: 'https://www.njconsumeraffairs.gov',
    boardLookupUrl: 'https://newjersey.mylicense.com/verification/',
    boardLookupLabel: 'NJ License Verification',
    cities: [
      { name: 'Newark', ctx: 'Largest trades market in NJ. Dense residential retrofit work plus growing data-center cluster in the surrounding Essex County corridor. Highest concentration of bilingual (EN/ES) techs in the state.' },
      { name: 'Jersey City', ctx: 'Direct competition with NYC union shops a PATH ride away. Senior techs in Hudson County frequently hold dual offers — speed of contact is the single biggest hiring lever here.' },
      { name: 'Paterson', ctx: 'Older housing stock driving steady retrofit demand. Strong Latino workforce; Spanish-language screening typically lifts qualified applicant volume by 25–35%.' }
    ],
    bilingual: 'full',
    bilingualNote: 'particularly in Newark, Paterson, Union City, and Elizabeth, where the Latino population exceeds 40%',
    bilingualCities: 'Newark and Paterson',
    statePain: 'New Jersey has two structural pressures driving the trades hiring crunch in 2026. First, aging housing stock across Newark, Jersey City, and the older inner-ring suburbs is fueling a multi-year retrofit cycle — boiler-to-heat-pump conversions, ductwork replacements, and the state\'s lead-pipe replacement mandate (2031 deadline) are pulling licensed techs onto long-running utility projects. Second, NYC commuter wage pressure: a Manhattan union shop pays $20–$30/hr more than a small Paterson contractor for the same Journeyman, so techs across the Hudson are drifting across the river.'
  },
  utah: {
    name: 'Utah', slug: 'utah', abbr: 'UT', lower: 'utah',
    board: 'Utah DOPL (Div. of Occupational & Professional Licensing)',
    boardShort: 'Utah DOPL',
    boardUrl: 'https://dopl.utah.gov',
    boardLookupUrl: 'https://secure.utah.gov/llv/search/index.html',
    boardLookupLabel: 'Utah DOPL License Verification',
    cities: [
      { name: 'Salt Lake City', ctx: 'Largest trades market in Utah. Silicon Slopes commercial build-out plus dense residential demand. Senior journeymen typically hold 2+ offers at any given time.' },
      { name: 'Provo', ctx: 'Driven by the BYU-corridor tech-office expansion and surrounding new-residential construction. Apprentice supply lags new-home permit growth by 18+ months.' },
      { name: 'Ogden', ctx: 'Industrial and Hill Air Force Base–adjacent work creating steady commercial demand. Lower wage pressure than SLC but tighter labor pool — referral networks matter more than ads.' }
    ],
    bilingual: 'omit',
    statePain: 'Utah has the nation\'s fastest population growth (23% since 2010) and the construction industry can\'t keep up. Two pressures dominate trades hiring in 2026. First, Silicon Slopes commercial build-out across Lehi, Draper, and Bluffdale is pulling licensed techs onto enterprise data-center and office projects. Second, new-residential development from Provo to Ogden is overwhelming local labor supply — apprentice intake hasn\'t kept pace with permits, and the state issues among the fewest journeyman-level licenses per capita in the Mountain West.'
  },
  connecticut: {
    name: 'Connecticut', slug: 'connecticut', abbr: 'CT', lower: 'connecticut',
    board: 'CT Dept of Consumer Protection',
    boardShort: 'CT DCP',
    boardUrl: 'https://portal.ct.gov/DCP',
    boardLookupUrl: 'https://www.elicense.ct.gov/Lookup/LicenseLookup.aspx',
    boardLookupLabel: 'CT eLicense Lookup',
    cities: [
      { name: 'Bridgeport', ctx: 'Largest city in CT. Steady residential retrofit demand plus oil-to-heat-pump conversion work driven by state Energize CT rebates. Bridgeport also has a meaningful Spanish-speaking trades community — bilingual screening helps.' },
      { name: 'Hartford', ctx: 'Insurance-corridor commercial work plus aging housing stock retrofit demand. Senior journeymen frequently entertain offers from NYC-bordering counties; CT shops compete on commute time more than wage.' },
      { name: 'New Haven', ctx: 'Yale-adjacent commercial work plus historic-home retrofit complexity (plaster, knob-and-tube, slate roofs). Techs comfortable with old-housing-stock specialties are scarce and command 10–15% premiums.' }
    ],
    bilingual: 'brief',
    bilingualNote: 'particularly in the Bridgeport area where the Spanish-speaking community is meaningful',
    bilingualCities: 'Bridgeport',
    statePain: 'Connecticut\'s trades hiring crunch is driven by three pressures in 2026. First, the oil-to-heat-pump conversion surge: Energize CT rebates of up to $15,000 per installation have pushed conversion volume to a multi-year high, and HVAC, plumbing, and electrical work is needed for each. Second, the workforce is aging — apprentices are entering at half the rate journeymen are retiring. Third, NYC wage pressure leaks across the border: Fairfield County contractors lose techs to Westchester shops paying $8–$15/hr more for the same work.'
  },
  'new-york': {
    name: 'New York', slug: 'new-york', abbr: 'NY', lower: 'new york',
    board: 'NYS Dept of State (upstate) + NYC Dept of Buildings (NYC)',
    boardShort: 'NYS / NYC DOB',
    boardUrl: 'https://dos.ny.gov/licensing',
    boardLookupUrl: 'https://appext20.dos.ny.gov/lcns_public/chk_load',
    boardLookupLabel: 'NYS License Lookup',
    cities: [
      { name: 'New York City', ctx: 'The largest trades market in the state, with a union/non-union split that shapes wage expectations. NYC Local Law 97 building emissions retrofits are driving sustained demand through 2030. Speed-of-contact is the single biggest hiring lever — qualified techs hold 3+ offers within a week.' },
      { name: 'Buffalo', ctx: 'Upstate\'s largest trades market. Lower wage pressure than NYC but tight licensed-tech supply driven by manufacturing reshoring (semiconductor fabs, EV battery plants in the broader Western NY corridor).' },
      { name: 'Rochester', ctx: 'Steady residential plus light-commercial demand. Workforce is older — apprenticeship pipelines through local IBEW, UA, and SMART locals are critical for sustained hiring.' }
    ],
    bilingual: 'full',
    bilingualNote: 'particularly in NYC outer boroughs (Queens, Bronx, Brooklyn) where Spanish is widely spoken on jobsites',
    bilingualCities: 'NYC outer boroughs',
    statePain: 'New York\'s trades hiring environment in 2026 is shaped by three forces. First, NYC Local Law 97 building emissions retrofit wave: hundreds of thousands of NYC buildings must complete HVAC, electrical, and plumbing upgrades by 2030, driving unprecedented sustained demand. Second, the union vs non-union split creates credential complexity — NYC requires separate DOB licenses for plumbing and electrical work, while upstate operates under NYS Dept of State. Third, urban labor pools are tight: a qualified NYC tech holds 3+ offers within a week of applying anywhere.',
    note: 'NYC requires separate DOB licenses for plumbing and electrical; upstate follows NYS Dept of State licensing.'
  }
};

// ─── Per-trade canonical data ────────────────────────────────────────────────
export const TRADES = {
  hvac: {
    slug: 'hvac', hubSlug: 'hvac', hubLabel: 'hvac hiring',
    display: 'HVAC technicians', displaySingular: 'HVAC technician',
    pageTrade: 'hvac',
    licenseNote: 'For heat-pump and refrigerant work, federal EPA Section 608 certification is also required on top of the state license.',
    tradePainSnippet: 'HVAC techs are the most-fought-over trade in 2026: heat-pump installs, refrigerant-regulation changes (R-454B transition), and summer-emergency callouts mean every contractor wants the same people.',
    associations: {
      texas: [
        { name: 'ACCA of Texas', desc: 'Air Conditioning Contractors of America – Texas Chapter. Hosts job boards, contractor meetups, and apprenticeship placement.', url: 'https://www.acca.org', label: 'acca.org' },
        { name: 'PHCC of Texas', desc: 'Plumbing, Heating & Cooling Contractors of Texas — cross-trade networking for combined HVAC + plumbing shops.', url: 'https://www.phcc.org', label: 'phcc.org' },
        { name: 'IEC Texas', desc: 'Independent Electrical Contractors of Texas — useful for full-service shops that do electrical alongside HVAC.', url: 'https://www.ieci.org', label: 'ieci.org' }
      ],
      'new-jersey': [
        { name: 'ACCA NJ', desc: 'Air Conditioning Contractors of America – New Jersey Chapter. Contractor meetups, code-update training, and apprenticeship placements.', url: 'https://www.acca.org', label: 'acca.org' },
        { name: 'PHCC of New Jersey', desc: 'The dominant network for shops doing combined HVAC + plumbing — especially relevant given the state\'s lead-pipe replacement mandate.', url: 'https://www.phccnj.org', label: 'phccnj.org' },
        { name: 'NJ Electrical Contractors Association', desc: 'Useful if your shop handles electrical alongside HVAC — increasingly common with heat-pump installs that need panel upgrades.', url: 'https://www.njeca.com', label: 'njeca.com' }
      ],
      utah: [
        { name: 'Utah HVAC Contractors Association', desc: 'State chapter focused on residential + light-commercial HVAC shops. Apprenticeship pipeline, code updates, contractor meetups.', url: 'https://www.utahhvac.org', label: 'utahhvac.org' },
        { name: 'UPHCA', desc: 'Utah Plumbing & Heating Cooling Contractors Association — cross-trade network for combined-trade shops.', url: 'https://www.uphca.com', label: 'uphca.com' },
        { name: 'IEC Utah', desc: 'Independent Electrical Contractors – Utah chapter. Useful for full-service shops doing electrical alongside HVAC.', url: 'https://www.iecutah.org', label: 'iecutah.org' }
      ],
      connecticut: [
        { name: 'CT Heating & Cooling Contractors Association', desc: 'State HVAC trade association focused on code, training, and apprenticeship coordination.', url: 'https://www.cthcca.org', label: 'cthcca.org' },
        { name: 'CT PHCC', desc: 'CT Plumbing, Heating & Cooling Contractors — relevant for shops doing combined HVAC + plumbing or hydronic work.', url: 'https://www.ctphcc.com', label: 'ctphcc.com' },
        { name: 'CT IEC', desc: 'Independent Electrical Contractors of CT — useful when heat-pump installs require panel upgrades.', url: 'https://www.iecct.org', label: 'iecct.org' }
      ],
      'new-york': [
        { name: 'ACCA NY', desc: 'Air Conditioning Contractors of America – NY Chapter. Code training, Local Law 97 guidance, contractor meetups.', url: 'https://www.acca.org', label: 'acca.org' },
        { name: 'PHCC NY', desc: 'NY Plumbing, Heating & Cooling Contractors — relevant for combined HVAC + plumbing shops, especially with retrofit work.', url: 'https://www.phccny.org', label: 'phccny.org' },
        { name: 'NECA NY', desc: 'National Electrical Contractors Association – NY Chapter. Useful for HVAC shops doing electrical work for heat-pump installs.', url: 'https://www.necanet.org', label: 'necanet.org' }
      ]
    },
    wageBands: {
      texas: { range: '$32–$45/hr', anchor: 'with the high end concentrated in the DFW Metroplex where data-center HVAC demand pushes commercial rates above $48/hr' },
      'new-jersey': { range: '$38–$52/hr', anchor: 'with the high end concentrated in Bergen, Hudson, and Essex counties where NYC commuter wage pressure pushes journeyman rates above $54/hr' },
      utah: { range: '$30–$42/hr', anchor: 'with the high end concentrated in Salt Lake City and Provo where Silicon Slopes commercial work pushes rates above $44/hr' },
      connecticut: { range: '$36–$50/hr', anchor: 'with Fairfield County rates running 10–15% above the state median due to NYC wage spillover' },
      'new-york': { range: '$40–$58/hr', anchor: 'with NYC union scales running significantly higher than non-union — show both bands when posting' }
    }
  },
  plumbers: {
    slug: 'plumbers', hubSlug: 'plumbing', hubLabel: 'plumbing hiring',
    display: 'plumbers', displaySingular: 'plumber',
    pageTrade: 'plumbing',
    licenseNote: 'For backflow prevention and medical-gas work, additional state-specific endorsements are required on top of the journeyman or master plumber license.',
    tradePainSnippet: 'Plumbers are aging out faster than any other trade — BLS projects a 23,000-worker shortfall through 2030 just from retirements.',
    associations: {
      texas: [
        { name: 'PHCC of Texas', desc: 'Plumbing, Heating & Cooling Contractors of Texas. The dominant plumber association in the state — apprenticeship placement, code training, contractor referrals.', url: 'https://www.phcc.org', label: 'phcc.org' },
        { name: 'Texas Plumbing-Heating-Cooling Contractors', desc: 'State-affiliated network for licensed plumbing contractors with active Houston and DFW chapters.', url: 'https://www.tphcc.org', label: 'tphcc.org' },
        { name: 'IAPMO Texas', desc: 'International Association of Plumbing & Mechanical Officials Texas chapter — code-focused training and certification.', url: 'https://www.iapmo.org', label: 'iapmo.org' }
      ],
      'new-jersey': [
        { name: 'PHCC of New Jersey', desc: 'The dominant plumber association in NJ — especially active given the state\'s 2031 lead-pipe replacement mandate.', url: 'https://www.phccnj.org', label: 'phccnj.org' },
        { name: 'NJ Master Plumbers Association', desc: 'Network for licensed master plumbers — apprenticeship pipeline, lead-pipe replacement training, code updates.', url: 'https://www.njmpa.org', label: 'njmpa.org' },
        { name: 'UA Local 24', desc: 'United Association plumbers-pipefitters local serving northern NJ. Useful for shops needing union-trained crews on commercial projects.', url: 'https://www.ualocal24.org', label: 'ualocal24.org' }
      ],
      utah: [
        { name: 'UPHCA', desc: 'Utah Plumbing & Heating Cooling Contractors Association — the dominant plumber network in Utah.', url: 'https://www.uphca.com', label: 'uphca.com' },
        { name: 'PHCC Utah', desc: 'Utah chapter of the national PHCC — apprenticeship and contractor referral network.', url: 'https://www.phcc.org', label: 'phcc.org' },
        { name: 'UA Local 140', desc: 'United Association plumbers local serving Salt Lake City — useful for shops needing union crews on commercial projects.', url: 'https://www.ualocal140.org', label: 'ualocal140.org' }
      ],
      connecticut: [
        { name: 'CT PHCC', desc: 'CT Plumbing, Heating & Cooling Contractors Association — apprenticeship pipeline, code training, contractor meetups.', url: 'https://www.ctphcc.com', label: 'ctphcc.com' },
        { name: 'CT Plumbing Mechanical Association', desc: 'State plumber network with active Hartford and New Haven chapters.', url: 'https://www.ctpma.org', label: 'ctpma.org' },
        { name: 'UA Local 777', desc: 'United Association plumbers local for Connecticut — important for commercial and institutional projects.', url: 'https://www.ualocal777.org', label: 'ualocal777.org' }
      ],
      'new-york': [
        { name: 'PHCC NY', desc: 'NY Plumbing, Heating & Cooling Contractors — relevant for combined-trade and retrofit-heavy shops.', url: 'https://www.phccny.org', label: 'phccny.org' },
        { name: 'Master Plumbers Council of NYC', desc: 'The dominant NYC plumber association — Local Law 97 retrofit coordination, DOB compliance, apprenticeship pipeline.', url: 'https://www.mpcnyc.org', label: 'mpcnyc.org' },
        { name: 'UA Local 1', desc: 'United Association plumbers Local 1, serving NYC — critical for commercial and institutional work in the five boroughs.', url: 'https://www.ualocal1.com', label: 'ualocal1.com' }
      ]
    },
    wageBands: {
      texas: { range: '$30–$44/hr', anchor: 'with senior journeyman and master plumbers in Houston commanding $46+/hr on commercial work' },
      'new-jersey': { range: '$38–$54/hr', anchor: 'with master plumbers in Bergen and Hudson counties commanding $56+/hr driven by lead-pipe replacement demand' },
      utah: { range: '$30–$44/hr', anchor: 'with senior journeymen in Salt Lake City pushing $46/hr on new commercial construction' },
      connecticut: { range: '$38–$54/hr', anchor: 'with Fairfield County master plumbers commanding $56+/hr due to NYC wage spillover' },
      'new-york': { range: '$42–$62/hr', anchor: 'with NYC union plumbers running significantly higher than non-union and upstate — list both bands explicitly' }
    }
  },
  electricians: {
    slug: 'electricians', hubSlug: 'electrical', hubLabel: 'electrical hiring',
    display: 'electricians', displaySingular: 'electrician',
    pageTrade: 'electrical',
    licenseNote: 'Most states issue separate Apprentice, Journeyman, and Master Electrician credentials. Solar PV interconnection and EV charger installs may require additional manufacturer or NABCEP certifications.',
    tradePainSnippet: 'Electricians are the bottleneck for EV charger installs, solar interconnections, and panel upgrades — every electrification project competes for the same licensed people.',
    associations: {
      texas: [
        { name: 'IEC Texas', desc: 'Independent Electrical Contractors of Texas — apprenticeship placement, code-update training, contractor referrals.', url: 'https://www.ieci.org', label: 'ieci.org' },
        { name: 'NECA Texas', desc: 'National Electrical Contractors Association – Texas chapters. Important for shops bidding commercial and industrial.', url: 'https://www.necanet.org', label: 'necanet.org' },
        { name: 'Texas Electrical Council', desc: 'State trade body for licensed electrical contractors. Code, safety, and apprenticeship coordination.', url: 'https://www.txelectricalcouncil.org', label: 'txelectricalcouncil.org' }
      ],
      'new-jersey': [
        { name: 'NJ Electrical Contractors Association', desc: 'The dominant NJ electrical contractor network — code training, contractor referrals, EV-charger and solar interconnect coordination.', url: 'https://www.njeca.com', label: 'njeca.com' },
        { name: 'IEC NJ', desc: 'Independent Electrical Contractors of NJ — apprenticeship pipeline, particularly active in the Newark and Jersey City markets.', url: 'https://www.iecnj.org', label: 'iecnj.org' },
        { name: 'IBEW Local 102', desc: 'International Brotherhood of Electrical Workers, NJ local — important for shops doing union commercial or institutional work.', url: 'https://www.ibew102.org', label: 'ibew102.org' }
      ],
      utah: [
        { name: 'IEC Utah', desc: 'Independent Electrical Contractors – Utah chapter. Apprenticeship pipeline, code training, Silicon Slopes contractor referrals.', url: 'https://www.iecutah.org', label: 'iecutah.org' },
        { name: 'NECA Intermountain', desc: 'NECA chapter serving Utah for commercial and industrial work, including Silicon Slopes data-center electrical buildout.', url: 'https://www.necanet.org', label: 'necanet.org' },
        { name: 'IBEW Local 354', desc: 'IBEW local serving Salt Lake City. Critical for shops bidding union work on commercial and institutional projects.', url: 'https://www.ibew354.org', label: 'ibew354.org' }
      ],
      connecticut: [
        { name: 'CT IEC', desc: 'Independent Electrical Contractors of CT — apprenticeship pipeline, code training, EV-charger install coordination.', url: 'https://www.iecct.org', label: 'iecct.org' },
        { name: 'NECA Connecticut', desc: 'NECA CT chapter for commercial and industrial electrical contractors.', url: 'https://www.necanet.org', label: 'necanet.org' },
        { name: 'IBEW Local 35', desc: 'IBEW local serving the Hartford area — important for shops doing union commercial or municipal work.', url: 'https://www.ibew35.org', label: 'ibew35.org' }
      ],
      'new-york': [
        { name: 'NECA NY', desc: 'National Electrical Contractors Association – NY Chapter. Critical for shops doing Local Law 97 retrofit electrical or NYC commercial work.', url: 'https://www.necanet.org', label: 'necanet.org' },
        { name: 'IEC of Greater New York', desc: 'Independent Electrical Contractors – Greater NY chapter. Apprenticeship pipeline and contractor referrals across the five boroughs and Long Island.', url: 'https://www.iecgnyc.org', label: 'iecgnyc.org' },
        { name: 'IBEW Local 3', desc: 'NYC\'s dominant electrician union — important for any shop bidding commercial, institutional, or Local Law 97 retrofit work.', url: 'https://www.ibewlocal3.org', label: 'ibewlocal3.org' }
      ]
    },
    wageBands: {
      texas: { range: '$28–$43/hr', anchor: 'with master electricians in Houston and DFW commanding $45+/hr on data-center and industrial work' },
      'new-jersey': { range: '$40–$56/hr', anchor: 'with master electricians in Bergen and Hudson counties commanding $58+/hr driven by NYC commuter wage pressure' },
      utah: { range: '$29–$43/hr', anchor: 'with master electricians in Salt Lake City pushing $46/hr on Silicon Slopes commercial work' },
      connecticut: { range: '$40–$56/hr', anchor: 'with Fairfield County master electricians commanding $58+/hr due to NYC wage spillover' },
      'new-york': { range: '$44–$65/hr', anchor: 'with NYC union electricians significantly higher than non-union — Local 3 scales push above $80/hr on commercial' }
    }
  },
  roofers: {
    slug: 'roofers', hubSlug: 'roofing', hubLabel: 'roofing hiring',
    display: 'roofers', displaySingular: 'roofer',
    pageTrade: 'roofing',
    licenseNote: 'Roofing licensure varies sharply by state — some states require statewide HIC or contractor licenses, others enforce at the city level only.',
    tradePainSnippet: 'Roofing crews are the most weather-and-storm-dependent of the trades — hailstorm seasons in TX and CT can create demand spikes that local labor pools cannot absorb.',
    associations: {
      texas: [
        { name: 'Roofing Contractors Association of Texas (RCAT)', desc: 'State roofing trade association. Hailstorm-response coordination, contractor referrals, code training.', url: 'https://www.rcatonline.org', label: 'rcatonline.org' },
        { name: 'NRCA Texas', desc: 'National Roofing Contractors Association – Texas affiliate. Apprenticeship and contractor education.', url: 'https://www.nrca.net', label: 'nrca.net' },
        { name: 'Texas Roofing Contractors Association', desc: 'Houston-headquartered network of roofing contractors with active hailstorm-season mutual-aid coordination.', url: 'https://www.txroof.com', label: 'txroof.com' }
      ],
      'new-jersey': [
        { name: 'NJ Roofing Contractors Association', desc: 'State roofing trade association — HIC licensing coordination, contractor referrals, storm-response mutual aid.', url: 'https://www.njrca.com', label: 'njrca.com' },
        { name: 'NRCA NJ', desc: 'National Roofing Contractors Association – NJ affiliate. Apprenticeship and contractor education.', url: 'https://www.nrca.net', label: 'nrca.net' },
        { name: 'United Union of Roofers Local 4', desc: 'NJ-area roofers union local — important for shops bidding union commercial or institutional roofing work.', url: 'https://www.unionroofers.com', label: 'unionroofers.com' }
      ],
      utah: [
        { name: 'Utah Roofing Contractors Association', desc: 'State roofing trade body — contractor referrals, code training, new-construction roofing coordination.', url: 'https://www.utahroofing.com', label: 'utahroofing.com' },
        { name: 'NRCA Utah', desc: 'National Roofing Contractors Association – Utah affiliate. Apprenticeship and educational resources.', url: 'https://www.nrca.net', label: 'nrca.net' },
        { name: 'AGC Utah', desc: 'Associated General Contractors of Utah — cross-trade network relevant for commercial roofing subs.', url: 'https://www.agcutah.org', label: 'agcutah.org' }
      ],
      connecticut: [
        { name: 'Roofing Contractors Association of CT', desc: 'State roofing trade body — HIC licensing coordination, storm-response mutual aid, contractor referrals.', url: 'https://www.rcact.org', label: 'rcact.org' },
        { name: 'NRCA Connecticut', desc: 'National Roofing Contractors Association – CT affiliate. Apprenticeship pipeline.', url: 'https://www.nrca.net', label: 'nrca.net' },
        { name: 'CT Construction Industries Association', desc: 'Cross-trade network in Hartford useful for commercial roofing subs.', url: 'https://www.ctconstruction.org', label: 'ctconstruction.org' }
      ],
      'new-york': [
        { name: 'NY State Roofing Contractors Association', desc: 'State roofing trade body — Local Law 97 reroof coordination, contractor referrals.', url: 'https://www.nysrca.com', label: 'nysrca.com' },
        { name: 'NRCA NY', desc: 'National Roofing Contractors Association – NY affiliate. Apprenticeship and contractor education.', url: 'https://www.nrca.net', label: 'nrca.net' },
        { name: 'United Union of Roofers Local 8', desc: 'NYC roofers union — important for any shop bidding commercial, institutional, or Local Law 97 reroof work.', url: 'https://www.unionroofers.com', label: 'unionroofers.com' }
      ]
    },
    wageBands: {
      texas: { range: '$22–$35/hr', anchor: 'with hailstorm-season crews commanding 25–40% premiums during peak demand windows' },
      'new-jersey': { range: '$28–$42/hr', anchor: 'with senior crew leads in Bergen and Hudson counties commanding $45+/hr driven by NYC overflow work' },
      utah: { range: '$22–$34/hr', anchor: 'with new-construction crew leads in Salt Lake City pushing $36/hr during the spring–summer build season' },
      connecticut: { range: '$26–$40/hr', anchor: 'with senior crew leads in Fairfield County commanding $42+/hr during storm-response windows' },
      'new-york': { range: '$30–$48/hr', anchor: 'with NYC union roofers running well above non-union; Local 8 scales push past $55/hr on commercial' }
    }
  }
};

// ─── Wage table data: 4 cities per state, 3 tiers per trade ─────────────────
// Rates are illustrative bands reflecting BLS OEWS 2025 + Indeed Hiring Lab Q1 2026.
export const WAGE_TABLES = {
  texas: {
    hvac: [
      ['Houston', '$28–$34/hr', '$34–$42/hr', '$42–$50/hr'],
      ['Dallas–Fort Worth', '$30–$36/hr', '$36–$45/hr', '$45–$55/hr'],
      ['Austin', '$29–$35/hr', '$35–$44/hr', '$44–$52/hr'],
      ['San Antonio', '$26–$32/hr', '$32–$40/hr', '$40–$47/hr']
    ],
    plumbers: [
      ['Houston', '$26–$32/hr', '$32–$42/hr', '$42–$50/hr'],
      ['Dallas–Fort Worth', '$28–$34/hr', '$34–$44/hr', '$44–$52/hr'],
      ['Austin', '$27–$33/hr', '$33–$42/hr', '$42–$50/hr'],
      ['San Antonio', '$24–$30/hr', '$30–$38/hr', '$38–$46/hr']
    ],
    electricians: [
      ['Houston', '$25–$31/hr', '$31–$41/hr', '$41–$49/hr'],
      ['Dallas–Fort Worth', '$27–$33/hr', '$33–$43/hr', '$43–$52/hr'],
      ['Austin', '$26–$32/hr', '$32–$42/hr', '$42–$50/hr'],
      ['San Antonio', '$23–$29/hr', '$29–$38/hr', '$38–$45/hr']
    ],
    roofers: [
      ['Houston', '$20–$26/hr', '$26–$32/hr', '$32–$38/hr'],
      ['Dallas–Fort Worth', '$21–$27/hr', '$27–$33/hr', '$33–$40/hr'],
      ['Austin', '$20–$26/hr', '$26–$32/hr', '$32–$38/hr'],
      ['San Antonio', '$18–$24/hr', '$24–$30/hr', '$30–$36/hr']
    ]
  },
  'new-jersey': {
    hvac: [
      ['Newark', '$32–$40/hr', '$40–$50/hr', '$50–$60/hr'],
      ['Jersey City', '$34–$42/hr', '$42–$52/hr', '$52–$62/hr'],
      ['Paterson', '$30–$38/hr', '$38–$48/hr', '$48–$56/hr'],
      ['Trenton', '$28–$36/hr', '$36–$45/hr', '$45–$53/hr']
    ],
    plumbers: [
      ['Newark', '$32–$40/hr', '$40–$52/hr', '$52–$62/hr'],
      ['Jersey City', '$34–$42/hr', '$42–$54/hr', '$54–$64/hr'],
      ['Paterson', '$30–$38/hr', '$38–$50/hr', '$50–$58/hr'],
      ['Trenton', '$28–$36/hr', '$36–$46/hr', '$46–$54/hr']
    ],
    electricians: [
      ['Newark', '$34–$42/hr', '$42–$54/hr', '$54–$64/hr'],
      ['Jersey City', '$36–$44/hr', '$44–$56/hr', '$56–$66/hr'],
      ['Paterson', '$32–$40/hr', '$40–$52/hr', '$52–$60/hr'],
      ['Trenton', '$30–$38/hr', '$38–$48/hr', '$48–$56/hr']
    ],
    roofers: [
      ['Newark', '$26–$32/hr', '$32–$40/hr', '$40–$48/hr'],
      ['Jersey City', '$28–$34/hr', '$34–$42/hr', '$42–$50/hr'],
      ['Paterson', '$24–$30/hr', '$30–$38/hr', '$38–$46/hr'],
      ['Trenton', '$22–$28/hr', '$28–$36/hr', '$36–$44/hr']
    ]
  },
  utah: {
    hvac: [
      ['Salt Lake City', '$26–$32/hr', '$32–$40/hr', '$40–$46/hr'],
      ['Provo', '$25–$31/hr', '$31–$38/hr', '$38–$44/hr'],
      ['Ogden', '$24–$30/hr', '$30–$37/hr', '$37–$43/hr'],
      ['St. George', '$22–$28/hr', '$28–$35/hr', '$35–$41/hr']
    ],
    plumbers: [
      ['Salt Lake City', '$26–$32/hr', '$32–$42/hr', '$42–$48/hr'],
      ['Provo', '$25–$31/hr', '$31–$40/hr', '$40–$46/hr'],
      ['Ogden', '$24–$30/hr', '$30–$38/hr', '$38–$44/hr'],
      ['St. George', '$22–$28/hr', '$28–$36/hr', '$36–$42/hr']
    ],
    electricians: [
      ['Salt Lake City', '$25–$31/hr', '$31–$41/hr', '$41–$48/hr'],
      ['Provo', '$24–$30/hr', '$30–$39/hr', '$39–$45/hr'],
      ['Ogden', '$23–$29/hr', '$29–$37/hr', '$37–$43/hr'],
      ['St. George', '$21–$27/hr', '$27–$35/hr', '$35–$41/hr']
    ],
    roofers: [
      ['Salt Lake City', '$20–$26/hr', '$26–$32/hr', '$32–$38/hr'],
      ['Provo', '$19–$25/hr', '$25–$31/hr', '$31–$37/hr'],
      ['Ogden', '$18–$24/hr', '$24–$30/hr', '$30–$36/hr'],
      ['St. George', '$17–$23/hr', '$23–$29/hr', '$29–$34/hr']
    ]
  },
  connecticut: {
    hvac: [
      ['Bridgeport', '$30–$38/hr', '$38–$48/hr', '$48–$56/hr'],
      ['Hartford', '$28–$36/hr', '$36–$46/hr', '$46–$54/hr'],
      ['New Haven', '$28–$36/hr', '$36–$46/hr', '$46–$54/hr'],
      ['Stamford', '$32–$40/hr', '$40–$50/hr', '$50–$58/hr']
    ],
    plumbers: [
      ['Bridgeport', '$30–$38/hr', '$38–$50/hr', '$50–$58/hr'],
      ['Hartford', '$28–$36/hr', '$36–$48/hr', '$48–$56/hr'],
      ['New Haven', '$28–$36/hr', '$36–$48/hr', '$48–$56/hr'],
      ['Stamford', '$32–$40/hr', '$40–$52/hr', '$52–$60/hr']
    ],
    electricians: [
      ['Bridgeport', '$32–$40/hr', '$40–$52/hr', '$52–$60/hr'],
      ['Hartford', '$30–$38/hr', '$38–$50/hr', '$50–$58/hr'],
      ['New Haven', '$30–$38/hr', '$38–$50/hr', '$50–$58/hr'],
      ['Stamford', '$34–$42/hr', '$42–$54/hr', '$54–$62/hr']
    ],
    roofers: [
      ['Bridgeport', '$22–$28/hr', '$28–$36/hr', '$36–$42/hr'],
      ['Hartford', '$22–$28/hr', '$28–$36/hr', '$36–$42/hr'],
      ['New Haven', '$22–$28/hr', '$28–$36/hr', '$36–$42/hr'],
      ['Stamford', '$24–$30/hr', '$30–$38/hr', '$38–$44/hr']
    ]
  },
  'new-york': {
    hvac: [
      ['NYC (non-union)', '$34–$42/hr', '$42–$54/hr', '$54–$65/hr'],
      ['NYC (union)', '$48–$58/hr', '$58–$72/hr', '$72–$90/hr'],
      ['Buffalo', '$26–$32/hr', '$32–$42/hr', '$42–$50/hr'],
      ['Rochester', '$26–$32/hr', '$32–$42/hr', '$42–$50/hr']
    ],
    plumbers: [
      ['NYC (non-union)', '$36–$44/hr', '$44–$56/hr', '$56–$68/hr'],
      ['NYC (union, Local 1)', '$52–$62/hr', '$62–$78/hr', '$78–$95/hr'],
      ['Buffalo', '$28–$34/hr', '$34–$44/hr', '$44–$52/hr'],
      ['Rochester', '$28–$34/hr', '$34–$44/hr', '$44–$52/hr']
    ],
    electricians: [
      ['NYC (non-union)', '$38–$46/hr', '$46–$58/hr', '$58–$70/hr'],
      ['NYC (union, Local 3)', '$54–$66/hr', '$66–$82/hr', '$82–$100/hr'],
      ['Buffalo', '$30–$36/hr', '$36–$46/hr', '$46–$54/hr'],
      ['Rochester', '$30–$36/hr', '$36–$46/hr', '$46–$54/hr']
    ],
    roofers: [
      ['NYC (non-union)', '$26–$32/hr', '$32–$42/hr', '$42–$50/hr'],
      ['NYC (union, Local 8)', '$42–$50/hr', '$50–$62/hr', '$62–$72/hr'],
      ['Buffalo', '$22–$28/hr', '$28–$36/hr', '$36–$42/hr'],
      ['Rochester', '$22–$28/hr', '$28–$36/hr', '$36–$42/hr']
    ]
  }
};

// ─── Per-page bespoke pain section (state × trade combo) ────────────────────
// 20 unique blocks. Combines state-pain + trade-specific tilt.
export const PAIN_INTROS = {
  'texas/hvac': [
    'Texas has more open HVAC positions than any other state, and two structural pressures are making 2026 worse. First, the data-center construction wave across the DFW Metroplex and Austin\'s Silicon Hills corridor is pulling licensed HVAC technicians onto commercial projects at wages most residential and light-commercial shops can\'t match. Second, summer demand spikes mean contractors in Houston and San Antonio are competing for the same pool of techs simultaneously, driving ghosting rates above 40% for traditional job postings.',
    'The result: the average Texas HVAC contractor spends 3–6 weeks to fill a single role, losing $1,200–$2,800 in unbilled work for every week that position stays empty. FlexForce cuts that time-to-interview from weeks to hours by contacting every applicant within 60 seconds — before they\'ve had a chance to accept another offer.'
  ],
  'texas/plumbers': [
    'Texas plumber hiring in 2026 is squeezed from three directions. First, the population boom across DFW, Austin, and Houston is creating sustained new-residential plumbing demand. Second, BLS projects plumbing to lose more workers to retirement than any other building trade through 2030 — and Texas\'s aging workforce mirrors that nationally. Third, commercial plumbing wages on data-center and chip-fab projects are pulling experienced journeymen out of residential shops.',
    'The average Texas plumbing contractor spends 4–7 weeks to fill a journeyman role through job boards, with ghosting rates hitting 45% once a candidate has more than one offer. FlexForce screens every applicant within 60 seconds of their submission, verifies TDLR license status on the call, and books the interview while the candidate is still engaged.'
  ],
  'texas/electricians': [
    'Texas electrician hiring is the tightest it\'s been in a decade. Three forces converge in 2026: data-center electrical buildout across DFW and Austin requiring thousands of journeyman electricians, EV charger install demand growing 4× year-over-year, and solar interconnect work expanding with every utility-scale project. Every electrification trend competes for the same TDLR-licensed people.',
    'Small Texas electrical contractors report 5–8 week time-to-fill for journeyman roles, with experienced commercial techs commanding $10–$15/hr premiums to leave. FlexForce contacts every applicant within 60 seconds, verifies TDLR status during the screening call, and books the interview before the candidate fields a higher offer.'
  ],
  'texas/roofers': [
    'Texas roofing crews work in a uniquely volatile labor market. Hailstorm seasons across North Texas and the Hill Country drive sudden 3–4× demand spikes that the local labor pool can\'t absorb. In 2026, between insurance claim backlogs from 2024–2025 hailstorms and ongoing new-residential growth in Austin and DFW, qualified crew leads are commanding 25–40% storm-season premiums.',
    'The average Texas roofing contractor loses 30%+ of inbound crew applicants to ghosting because response times stretch to 48+ hours during peak. FlexForce calls every applicant within 60 seconds in English or Spanish, verifies experience and certifications, and books the working interview — so your trucks roll with full crews even at the peak of storm season.'
  ],
  'new-jersey/hvac': [
    'New Jersey has two structural pressures driving the HVAC hiring crunch in 2026. First, aging housing stock across Newark, Jersey City, and the older inner-ring suburbs is fueling a multi-year retrofit cycle — boiler-to-heat-pump conversions, ductwork replacements, and the state\'s lead-pipe replacement mandate (2031 deadline) are pulling licensed HVAC and plumbing techs onto long-running utility projects. Second, NYC commuter wage pressure: a Manhattan union HVAC shop pays $20–$30/hr more than a small Paterson contractor for the same Journeyman.',
    'The average New Jersey HVAC contractor spends 4–7 weeks to fill a single role through Indeed, with applicant ghost rates above 45% once a candidate has 2+ competing offers. FlexForce cuts that time-to-interview from weeks to hours by contacting every applicant within 60 seconds — before the NYC union shops have a chance to make a counter-offer.'
  ],
  'new-jersey/plumbers': [
    'New Jersey plumber hiring in 2026 is dominated by one fact: the state\'s lead-pipe replacement mandate (2031 deadline) has pulled licensed plumbers onto multi-year utility-coordinated projects, draining the residential service pool. Add to that NYC commuter wage pressure pulling experienced master plumbers across the Hudson, and small shops in Paterson, Newark, and Trenton are competing for the same journeyman pool as Manhattan-bordering contractors paying $15–$25/hr more.',
    'The average NJ plumbing contractor spends 5–8 weeks to fill a journeyman role with strong candidates ghosting at 50%+ once they hold a second offer. FlexForce contacts every applicant within 60 seconds, verifies NJ DCA plumbing license status on the call, and books the interview before the candidate has time to reconsider.'
  ],
  'new-jersey/electricians': [
    'New Jersey electrician hiring in 2026 is shaped by three convergent demands: heat-pump conversions (each requiring panel upgrades), EV charger install volume growing with NJ\'s aggressive electrification policy, and solar interconnect work driven by community-solar expansion. Every push pulls from the same licensed-electrician pool. Meanwhile, NYC wage competition is steady — IBEW Local 3 scales pull journeymen across the Hudson.',
    'Small NJ electrical contractors report 4–6 week time-to-fill for licensed electricians, with senior people commanding $8–$12/hr premiums to leave. FlexForce calls every applicant within 60 seconds, runs the NJ DCA electrician license check during the call, and books the interview while the candidate is still engaged.'
  ],
  'new-jersey/roofers': [
    'New Jersey roofing crews work two seasons: aggressive spring–fall replacement demand driven by aging housing stock, then storm-response work whenever nor\'easters hit. Add in NJ HIC license requirements for residential roofing and rising NYC overflow work into Bergen and Hudson counties, and the crew labor pool is permanently tight. Bilingual hiring is essential — much of the state\'s roofing crew workforce is Spanish-dominant.',
    'The average NJ roofing contractor loses 40%+ of inbound crew applicants to slow response times. FlexForce calls every applicant within 60 seconds in English or Spanish, verifies experience and HIC license status, and books the working interview — so your trucks roll with full crews through both seasons.'
  ],
  'utah/hvac': [
    'Utah HVAC hiring in 2026 is shaped by the state\'s 23% population growth since 2010 — the fastest in the nation. Two forces dominate: Silicon Slopes commercial build-out across Lehi, Draper, and Bluffdale pulling licensed HVAC technicians onto enterprise data-center and office projects, and new-residential development from Provo to Ogden creating sustained installation demand that local apprenticeship intake can\'t match.',
    'The average Utah HVAC contractor spends 4–6 weeks to fill a journeyman role, with experienced techs commanding 15–20% premiums during the spring–summer install season. FlexForce contacts every applicant within 60 seconds, verifies Utah DOPL HVAC license status on the call, and books the interview before the candidate fields a competing offer from a commercial shop.'
  ],
  'utah/plumbers': [
    'Utah plumber hiring is bottlenecked by two facts. First, the state\'s population boom (Provo and SLC are among the fastest-growing metros in the U.S.) has driven new-residential plumbing demand above what local apprenticeship pipelines produce. Second, Silicon Slopes commercial construction is pulling journeyman plumbers onto data-center and tech-office projects at wages residential shops can\'t match.',
    'Small Utah plumbing contractors report 5–7 week time-to-fill for licensed journeymen, with senior people commanding $6–$10/hr premiums to leave. FlexForce calls every applicant within 60 seconds, runs the Utah DOPL plumber license check during the call, and books the interview while the candidate is still engaged.'
  ],
  'utah/electricians': [
    'Utah electrician hiring in 2026 is dominated by the Silicon Slopes commercial electrical buildout. Hyperscale data centers across Lehi and Bluffdale, semiconductor and EV-battery facility expansions, and the residential growth wave from Provo to Ogden are all competing for the same Utah DOPL–licensed people. Apprenticeship intake hasn\'t kept pace with permits, and the state issues among the fewest journeyman electrician credentials per capita in the Mountain West.',
    'The result: small Utah electrical contractors spend 5–8 weeks filling journeyman roles, and senior techs routinely entertain offers from commercial shops paying $10–$15/hr more. FlexForce contacts every applicant within 60 seconds, runs the Utah DOPL license verification, and books the interview before the candidate accepts elsewhere.'
  ],
  'utah/roofers': [
    'Utah roofing crews work the spring–summer build season hard. New-residential development from Salt Lake City through Provo to St. George is driving sustained reroofing and new-build roofing demand at a pace that local crews can\'t absorb. Wind and hailstorm seasons further amplify demand in waves.',
    'The average Utah roofing contractor loses 30%+ of inbound crew applicants to slow response. FlexForce calls every applicant within 60 seconds, verifies crew experience and certifications, and books the working interview — so your trucks roll with full crews through the entire build season.'
  ],
  'connecticut/hvac': [
    'Connecticut\'s HVAC hiring crunch in 2026 is driven by three pressures. First, the oil-to-heat-pump conversion surge: Energize CT rebates of up to $15,000 per installation have pushed conversion volume to a multi-year high, with HVAC techs required for each. Second, the workforce is aging — apprentices are entering at half the rate journeymen are retiring. Third, NYC wage pressure leaks across the border: Fairfield County contractors lose techs to Westchester shops paying $8–$15/hr more.',
    'The average CT HVAC contractor spends 5–7 weeks to fill a journeyman role, with the heat-pump-installer subset especially scarce. FlexForce contacts every applicant within 60 seconds, verifies CT DCP HVAC license status, and books the interview before the candidate fields a counter-offer.'
  ],
  'connecticut/plumbers': [
    'Connecticut plumber hiring in 2026 is shaped by an aging workforce, dense suburb retrofit demand, and NYC wage spillover into Fairfield County. The Energize CT heat-pump conversion surge also generates incidental plumbing demand (refrigerant-line condensate routing, mechanical-room rework), pulling licensed journeymen onto crossover projects.',
    'Small CT plumbing contractors report 5–7 week time-to-fill, with master plumbers commanding 15%+ premiums for Fairfield-County roles. FlexForce contacts every applicant within 60 seconds, runs the CT DCP plumber license check during the call, and books the interview while the candidate is still engaged.'
  ],
  'connecticut/electricians': [
    'Connecticut electrician hiring in 2026 has a single defining feature: the Energize CT heat-pump conversion wave is driving sustained electrical-upgrade demand. Every heat-pump install requires panel work; thousands of conversions a year mean thousands of electrician hours. Add EV charger installs, solar interconnect work, and NYC wage spillover into Fairfield County, and the licensed-electrician pool is permanently tight.',
    'Small CT electrical contractors report 5–8 week time-to-fill for journeymen, with senior techs commanding $8–$12/hr premiums to leave. FlexForce contacts every applicant within 60 seconds, runs the CT DCP license check, and books the interview while the candidate is still engaged.'
  ],
  'connecticut/roofers': [
    'Connecticut roofing crews see a hybrid demand profile: steady spring–fall replacement work driven by aging housing stock, plus episodic storm-response demand from nor\'easters and severe thunderstorms. Slate and historic-roof specialization in New Haven and Hartford suburbs requires experienced crew leads who command 10–15% premiums above the state median.',
    'The average CT roofing contractor loses 35%+ of inbound crew applicants to slow follow-up. FlexForce calls every applicant within 60 seconds, verifies experience and certifications, and books the working interview — so your trucks roll with full crews through both demand profiles.'
  ],
  'new-york/hvac': [
    'New York HVAC hiring in 2026 is dominated by NYC Local Law 97 — the building emissions cap requiring hundreds of thousands of NYC buildings to complete HVAC, electrical, and plumbing upgrades by 2030. That sustained retrofit demand has pulled every available HVAC technician onto commercial projects, leaving residential service contractors competing with union shops paying $20–$30/hr more.',
    'Outside NYC, Buffalo and Rochester face their own pressure: manufacturing reshoring (semiconductor fabs, EV battery plants) is creating commercial HVAC demand that the local labor pool can\'t fully absorb. Small NY contractors report 5–9 week time-to-fill for journeyman roles. FlexForce contacts every applicant within 60 seconds, verifies NYS or NYC DOB license status, and books the interview before competing offers arrive.'
  ],
  'new-york/plumbers': [
    'New York plumber hiring in 2026 is shaped by NYC Local Law 97 retrofit demand and the union/non-union split. NYC requires separate DOB licenses for plumbing work, and Local 1 union scales create a permanent wage floor that non-union shops compete against. Outside the city, the workforce is aging and apprenticeship intake hasn\'t kept pace with retirements.',
    'Small NY plumbing contractors report 5–8 week time-to-fill for licensed journeymen, with master plumbers in NYC commanding $20+/hr premiums to leave. FlexForce calls every applicant within 60 seconds, runs license status checks (NYS or NYC DOB depending on geography), and books the interview while the candidate is engaged.'
  ],
  'new-york/electricians': [
    'New York electrician hiring in 2026 is dominated by NYC Local Law 97 retrofit demand and the union/non-union split. IBEW Local 3 scales create a wage floor for NYC commercial work that non-union and residential shops can\'t match — but Local Law 97 buildings need electricians at every tier, so demand cascades. Upstate, manufacturing reshoring is creating commercial electrical demand.',
    'Small NY electrical contractors report 5–9 week time-to-fill, with senior techs commanding $15–$25/hr premiums for NYC commercial roles. FlexForce contacts every applicant within 60 seconds, verifies the right license (NYS Dept of State or NYC DOB), and books the interview before the candidate accepts elsewhere.'
  ],
  'new-york/roofers': [
    'New York roofing crews face two distinct markets. In NYC, Local Law 97 reroofs and Local 8 union work create a high-wage commercial market; non-union residential shops compete in a smaller pool. Upstate, the labor pool is tighter but wages are more modest — Buffalo and Rochester contractors lose crew to manufacturing-adjacent commercial roofing as much as to other residential shops.',
    'Small NY roofing contractors lose 35%+ of inbound crew applicants to slow follow-up. FlexForce calls every applicant within 60 seconds in English or Spanish, verifies experience and credentials, and books the working interview — so your trucks roll with full crews across all weather and demand cycles.'
  ]
};

// ─── FAQ blocks per state-trade combo ───────────────────────────────────────
// 5 Q&As each. Stored as parallel arrays so both HTML FAQ + JSON-LD FAQPage
// can be generated from the same source.
export function faqsFor(stateSlug, tradeSlug) {
  const s = STATES[stateSlug];
  const t = TRADES[tradeSlug];
  const wageRange = t.wageBands[stateSlug].range;
  const board = s.boardShort;
  const bilingualCities = s.bilingualCities || '';
  const bilingualSentence = s.bilingual === 'omit'
    ? `Yes. FlexForce can screen in both English and Spanish if needed. ${s.name}\'s ${t.display} workforce is largely English-dominant, but the bilingual capability is included in every plan at no extra cost.`
    : s.bilingual === 'brief'
    ? `Yes. FlexForce screens in both English and Spanish. While ${s.name}\'s ${t.display} workforce is largely English-dominant, bilingual capability matters in ${bilingualCities} and is included at no extra cost.`
    : `Yes. FlexForce screens in both English and Spanish. The applicant selects their language when they call in, or the AI detects it automatically. This matters most in ${bilingualCities}, where a large share of the licensed ${t.display} workforce is Spanish-dominant.`;

  return [
    {
      q: `How long does it take to hire ${t.display.startsWith('e') || t.display.startsWith('a') ? 'an' : 'a'} ${t.displaySingular} in ${s.name}?`,
      a: `The average ${s.name} contractor takes 4–7 weeks to fill ${t.displaySingular === 'electrician' ? 'an electrician' : 'a ' + t.displaySingular} role through traditional job boards. With FlexForce, qualified candidates who pass the automated screen are booked for an interview the same day they apply — cutting time-to-interview from weeks to hours.`
    },
    {
      q: `Does FlexForce verify ${s.name} ${t.display} licenses?`,
      a: `Yes. FlexForce checks every applicant's license status against the ${s.board} database during the screening call. You only see candidates with a verified active license.`
    },
    {
      q: `Can FlexForce screen Spanish-speaking ${t.display} applicants in ${s.abbr}?`,
      a: bilingualSentence
    },
    {
      q: `What does it cost to hire ${t.displaySingular === 'electrician' ? 'an electrician' : 'a ' + t.displaySingular} in ${s.name}?`,
      a: `${t.display.charAt(0).toUpperCase() + t.display.slice(1)} in ${s.name} earn ${wageRange} (BLS 2025). Total cost-to-hire including job board fees, recruiter time, and onboarding typically runs $3,500–$9,000 per hire. FlexForce reduces that by automating the first 80% of the screening process for $299–$999/month.`
    },
    {
      q: `What ${s.name} cities does FlexForce work in?`,
      a: `FlexForce works for any ${s.name}-based contractor. Current customers concentrate in ${s.cities[0].name}, ${s.cities[1].name}, and ${s.cities[2].name} — but the platform covers the entire state.`
    }
  ];
}
