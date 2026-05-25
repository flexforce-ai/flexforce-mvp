// Vapi (voice AI) integration wrapper.
//
// Two modes:
//  1. STUB (no VAPI_API_KEY) — marks the applicant as "screening" but
//     doesn't actually place a call. Useful for local dev + as a pre-launch
//     state where the rest of the funnel can be tested.
//  2. LIVE (VAPI_API_KEY set) — uses Vapi's REST API to dynamically
//     create a per-shop screening assistant and initiate an outbound call
//     to the applicant's phone.
//
// Required env vars when LIVE:
//   VAPI_API_KEY              your Vapi private API key
//   VAPI_PHONE_NUMBER_ID      the Vapi phone number to dial from
//   VAPI_WEBHOOK_SECRET       shared secret echoed by Vapi on webhooks

const API_BASE = 'https://api.vapi.ai';

function isConfigured() {
  return Boolean(process.env.VAPI_API_KEY && process.env.VAPI_PHONE_NUMBER_ID);
}

function buildAssistantSystemPrompt(shop, applicant) {
  const lang = applicant.language === 'es' ? 'Spanish' : 'English';
  const questions = (shop.questions || []).map((q, i) => `${i + 1}. ${applicant.language === 'es' && q.es ? q.es : q.en}`).join('\n');
  return `You are FlexForce, the AI hiring screener for ${shop.shopName}. You are calling ${applicant.name} who just applied for the ${shop.job?.title || 'open role'} position.

Speak in ${lang}. Be warm, brief, and direct. Use casual contractions and short sentences. This is a 4-minute screening call, not an interview.

Open with a greeting + introducing yourself + that you're calling about the application. Confirm you've reached ${applicant.name}.

Then ask these screening questions one at a time, and listen for the answer before moving to the next:
${questions}

After all questions, summarize their answers back briefly and confirm. Then offer to book an interview using this link: ${shop.calLink || '(no booking link yet)'}.

If they ask about pay: ${shop.job?.payLow || 25}–${shop.job?.payHigh || 45}/hour.
If they ask about benefits: ${(shop.job?.perks || []).join(', ')}.
If they need to switch languages, do so seamlessly.

End the call by thanking them. Keep total call under 5 minutes.`;
}

// Create an outbound call to the applicant.
async function startCall({ shop, applicant }) {
  if (!isConfigured()) {
    return { ok: false, mode: 'stub', reason: 'VAPI not configured' };
  }
  const assistant = {
    name: `FlexForce - ${shop.shopName} - ${applicant.id}`,
    firstMessage: applicant.language === 'es'
      ? `Hola ${applicant.name.split(' ')[0]}, soy FlexForce de ${shop.shopName}. ¿Tienes un minuto para una entrevista rápida?`
      : `Hi ${applicant.name.split(' ')[0]}, this is FlexForce calling on behalf of ${shop.shopName}. Got a quick minute for a 4-minute screening?`,
    model: { provider: 'openai', model: 'gpt-4o-mini', temperature: 0.5, messages: [{ role: 'system', content: buildAssistantSystemPrompt(shop, applicant) }] },
    voice: { provider: '11labs', voiceId: applicant.language === 'es' ? 'OYTbf65OHHFELVut7v2H' : 'pNInz6obpgDQGcFmaJgB' },
    transcriber: { provider: 'deepgram', model: 'nova-2', language: applicant.language === 'es' ? 'es' : 'en' },
    endCallMessage: applicant.language === 'es' ? 'Gracias. ¡Que tengas un buen día!' : 'Thanks for your time. Have a great day!',
    maxDurationSeconds: 360,
    serverUrl: `https://flexforce.ai/api/applicants/webhook?secret=${encodeURIComponent(process.env.VAPI_WEBHOOK_SECRET || '')}`,
    serverUrlSecret: process.env.VAPI_WEBHOOK_SECRET || ''
  };

  const payload = {
    assistant,
    phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
    customer: { number: applicant.phone, name: applicant.name }
  };

  const r = await fetch(`${API_BASE}/call/phone`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!r.ok) {
    const text = await r.text();
    return { ok: false, mode: 'live', error: text };
  }
  const data = await r.json();
  return { ok: true, mode: 'live', callId: data.id, raw: data };
}

export { isConfigured, startCall, buildAssistantSystemPrompt };
