// Twilio SMS fallback wrapper.
// Used to send a "we couldn't reach you by phone" follow-up to applicants
// who don't answer the Vapi call. Falls back to no-op when not configured.
//
// Required env vars when LIVE:
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_FROM_NUMBER       e.g. +15125550100

function isConfigured() {
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER);
}

async function sendSms({ to, body }) {
  if (!isConfigured()) {
    console.log('[twilio stub]', to, '-', body);
    return { ok: false, mode: 'stub' };
  }
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const tok = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const params = new URLSearchParams({ From: from, To: to, Body: body });
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${sid}:${tok}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });
  if (!r.ok) {
    const text = await r.text();
    return { ok: false, mode: 'live', error: text };
  }
  return { ok: true, mode: 'live', data: await r.json() };
}

async function smsApplicantMissedCall({ applicant, shop }) {
  const body = applicant.language === 'es'
    ? `Hola ${applicant.name.split(' ')[0]}, ${shop.shopName} intentó llamarte. Aplica de nuevo o agenda directamente: ${shop.calLink || `https://flexforce.ai/apply/${shop.slug}`}`
    : `Hi ${applicant.name.split(' ')[0]}, ${shop.shopName} tried to reach you. Apply again or book directly: ${shop.calLink || `https://flexforce.ai/apply/${shop.slug}`}`;
  return await sendSms({ to: applicant.phone, body });
}

export { isConfigured, sendSms, smsApplicantMissedCall };
