// State license verification.
//
// Most state license boards don't offer a public REST API — they expose
// search forms instead. The reliable path is either:
//   (a) ScrapingBee/Bright Data to drive the search form, or
//   (b) a third-party API like LicenseLookup.org / VerifyTrades.
//
// For now this returns one of: 'verified', 'unverified', 'not_found', 'stub'.
// When LICENSE_VERIFY_API_KEY is configured against a real third-party
// service, we'll call it. Otherwise we return 'stub' so the funnel can
// still flow and the shop owner can decide manually.

const STATE_HOSTS = {
  texas: 'https://www.tdlr.texas.gov/LicenseSearch/',
  'new-jersey': 'https://newjersey.mylicense.com/verification/',
  utah: 'https://secure.utah.gov/llv/search/index.html',
  connecticut: 'https://www.elicense.ct.gov/Lookup/LicenseLookup.aspx',
  'new-york': 'https://appext20.dos.ny.gov/lcns_public/chk_load'
};

function isConfigured() {
  return Boolean(process.env.LICENSE_VERIFY_API_KEY);
}

async function verify({ stateSlug, trade, licenseNumber, name }) {
  if (!licenseNumber && !name) {
    return { status: 'unverified', reason: 'no_input' };
  }
  if (!isConfigured()) {
    return {
      status: 'stub',
      reason: 'no_api_key',
      searchUrl: STATE_HOSTS[stateSlug] || null,
      hint: `Verify manually at ${STATE_HOSTS[stateSlug] || 'the state license board'}.`
    };
  }
  // When you wire up a real provider, plug it in here.
  // Example shape:
  //   const r = await fetch(`${PROVIDER}/verify`, { method:'POST', headers:{...}, body: JSON.stringify({ state: stateSlug, trade, licenseNumber, name }) });
  //   return parseProviderResponse(await r.json());
  return { status: 'unverified', reason: 'provider_not_implemented' };
}

export { isConfigured, verify, STATE_HOSTS };
