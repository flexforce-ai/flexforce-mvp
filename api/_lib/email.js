// Resend-backed email helpers shared by all auth + notification flows.
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_JACK = process.env.MAIL_FROM_JACK || 'FlexForce <onboarding@resend.dev>';
const FROM_SIGNUPS = process.env.MAIL_FROM_SIGNUPS || 'FlexForce <onboarding@resend.dev>';
const JACK_EMAIL = process.env.JACK_EMAIL || 'jack@flexforce.ai';

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

async function send({ from, to, subject, html, replyTo }) {
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — skipping send');
    return { id: 'noop' };
  }
  const payload = { from, to, subject, html };
  if (replyTo) payload.replyTo = replyTo;
  return await resend.emails.send(payload);
}

async function sendMagicLink({ to, link, redirect }) {
  const html = `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;background:#f6f3ee;color:#0f2922">
    <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #e0d9c8">
      <p style="margin:0 0 14px;font-size:14px;letter-spacing:.06em;text-transform:uppercase;color:#1d4d3d;font-weight:500">flexforce.</p>
      <h1 style="margin:0 0 16px;font-size:22px;font-weight:500;letter-spacing:-.01em">your sign-in link</h1>
      <p style="margin:0 0 24px;line-height:1.55;color:#2f4a3f">Click the button below to sign in. The link works once and expires in 30 minutes.</p>
      <a href="${esc(link)}" style="display:inline-block;background:#1d4d3d;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:500">sign in →</a>
      <p style="margin:24px 0 0;font-size:13px;color:#5a6e64;line-height:1.55">If you didn't request this, ignore this email — nothing will happen.</p>
    </div>
    <p style="text-align:center;margin:22px 0 0;font-size:12px;color:#5a6e64">flexforce.ai — the AI hiring manager for the trades</p>
  </body></html>`;
  return send({ from: FROM_JACK, to, subject: 'Sign in to FlexForce', html });
}

async function sendShopCreated({ to, shop }) {
  const url = `https://flexforce.ai/apply/${shop.slug}`;
  const html = `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;background:#f6f3ee;color:#0f2922">
    <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #e0d9c8">
      <p style="margin:0 0 14px;font-size:14px;letter-spacing:.06em;text-transform:uppercase;color:#1d4d3d;font-weight:500">flexforce.</p>
      <h1 style="margin:0 0 16px;font-size:22px;font-weight:500;letter-spacing:-.01em">your apply page is live</h1>
      <p style="margin:0 0 12px;color:#2f4a3f;line-height:1.55">${esc(shop.shopName)} is set up. Share this link wherever you currently take applicants — Indeed, Craigslist, Facebook, your truck:</p>
      <div style="background:#f6f3ee;border:1px solid #e0d9c8;border-radius:10px;padding:16px;margin:14px 0;font-family:'JetBrains Mono',monospace;font-size:14px"><a style="color:#1d4d3d;text-decoration:none" href="${esc(url)}">${esc(url)}</a></div>
      <a href="https://flexforce.ai/app/?view=dashboard" style="display:inline-block;background:#1d4d3d;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:500">open dashboard →</a>
      <p style="margin:24px 0 0;font-size:13px;color:#5a6e64;line-height:1.55">Next steps in your dashboard: copy the link, generate the QR code, import an existing Indeed post.</p>
    </div>
  </body></html>`;
  return send({ from: FROM_JACK, to, subject: `your apply page is live at /apply/${shop.slug}`, html });
}

async function sendApplicantToShop({ to, shop, applicant }) {
  const lines = (applicant.answers || []).map(a => `<tr><td style="padding:6px 12px 6px 0;color:#5a6e64;vertical-align:top;width:35%">${esc(a.label || a.key)}</td><td style="padding:6px 0;color:#0f2922">${esc(a.value)}</td></tr>`).join('');
  const html = `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#f6f3ee;color:#0f2922">
    <div style="background:#fff;border-radius:16px;padding:28px;border:1px solid #e0d9c8">
      <p style="margin:0 0 8px;font-size:13px;color:#5a6e64">${esc(shop.shopName)}</p>
      <h1 style="margin:0 0 6px;font-size:20px;font-weight:500">new applicant: ${esc(applicant.name)}</h1>
      <p style="margin:0 0 16px;font-size:13px;color:#5a6e64">${esc(applicant.email)} · ${esc(applicant.phone)} · ${esc(applicant.method || 'web')}</p>
      <table style="width:100%;font-size:14px;border-collapse:collapse">${lines}</table>
      <div style="margin-top:24px;padding-top:18px;border-top:1px solid #e0d9c8">
        <a href="https://flexforce.ai/app/?view=applicants" style="display:inline-block;background:#1d4d3d;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:500;font-size:14px">view in dashboard →</a>
      </div>
    </div>
  </body></html>`;
  return send({ from: FROM_SIGNUPS, to, subject: `New applicant: ${applicant.name} for ${shop.shopName}`, html, replyTo: applicant.email });
}

async function sendApplicantConfirmation({ to, applicant, shop }) {
  const html = `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;background:#f6f3ee;color:#0f2922">
    <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #e0d9c8">
      <p style="margin:0 0 6px;font-size:14px;color:#5a6e64">${esc(shop.shopName)}</p>
      <h1 style="margin:0 0 16px;font-size:22px;font-weight:500">we got your application 👋</h1>
      <p style="margin:0 0 14px;line-height:1.55;color:#2f4a3f">Hi ${esc(applicant.name.split(' ')[0])}, thanks for applying. We'll be in touch within 24 hours to schedule a quick screening call.</p>
      <p style="margin:0;line-height:1.55;color:#2f4a3f">Reply to this email if you have any questions in the meantime.</p>
    </div>
    <p style="text-align:center;margin:22px 0 0;font-size:12px;color:#5a6e64">Powered by flexforce. — the AI hiring manager for the trades</p>
  </body></html>`;
  return send({ from: FROM_SIGNUPS, to, subject: `Got it — ${shop.shopName} received your application`, html });
}

async function sendDailyDigest({ to, shop, applicants }) {
  if (!applicants.length) return;
  const rows = applicants.map(a => `<tr><td style="padding:8px 12px 8px 0">${esc(a.name)}</td><td style="padding:8px 12px 8px 0;color:#5a6e64;font-size:13px">${esc(a.email)}</td><td style="padding:8px 12px 8px 0;font-size:13px">${esc(a.status || 'new')}</td><td style="padding:8px 0;font-size:13px;color:#5a6e64">${esc(new Date(a.createdAt).toLocaleTimeString())}</td></tr>`).join('');
  const html = `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#f6f3ee;color:#0f2922">
    <div style="background:#fff;border-radius:16px;padding:28px;border:1px solid #e0d9c8">
      <p style="margin:0 0 8px;font-size:13px;color:#5a6e64">${esc(shop.shopName)} · daily digest</p>
      <h1 style="margin:0 0 14px;font-size:20px;font-weight:500">${applicants.length} new applicant${applicants.length === 1 ? '' : 's'} yesterday</h1>
      <table style="width:100%;font-size:14px;border-collapse:collapse">${rows}</table>
      <div style="margin-top:22px;padding-top:18px;border-top:1px solid #e0d9c8">
        <a href="https://flexforce.ai/app/?view=applicants" style="display:inline-block;background:#1d4d3d;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:500;font-size:14px">review applicants →</a>
      </div>
    </div>
  </body></html>`;
  return send({ from: FROM_SIGNUPS, to, subject: `${applicants.length} new applicant${applicants.length === 1 ? '' : 's'} — ${shop.shopName}`, html });
}

export {
  send, sendMagicLink, sendShopCreated, sendApplicantToShop, sendApplicantConfirmation, sendDailyDigest,
  FROM_JACK, FROM_SIGNUPS, JACK_EMAIL, esc
};
