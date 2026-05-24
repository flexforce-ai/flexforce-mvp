import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    const {
      name,
      business,
      trade,
      techs,
      state,
      email,
      phone,
      pain,
      'cf-turnstile-response': turnstileToken
    } = body;

    // ── Basic field validation ─────────────────────────────────────────────
    const missing = ['name', 'business', 'trade', 'techs', 'state', 'email', 'phone']
      .filter((k) => !body[k] || String(body[k]).trim() === '');
    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    // ── CAPTCHA: verify Cloudflare Turnstile token ─────────────────────────
    if (!turnstileToken) {
      return res.status(400).json({ success: false, message: 'Please complete the captcha and try again.' });
    }

    if (process.env.TURNSTILE_SECRET_KEY) {
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
          remoteip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || ''
        })
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return res.status(400).json({
          success: false,
          message: 'Captcha verification failed. Please refresh and try again.'
        });
      }
    } else {
      console.warn('TURNSTILE_SECRET_KEY missing — skipping captcha verification (dev mode).');
    }

    // ── Resend setup ───────────────────────────────────────────────────────
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY missing.');
      return res.status(500).json({
        success: false,
        message: 'Email service not configured. Please email jack@flexforce.ai directly.'
      });
    }
    const resend = new Resend(process.env.RESEND_API_KEY);

    const jackEmail = process.env.JACK_EMAIL || 'jack@flexforce.ai';
    const calLink = process.env.CAL_LINK || 'https://cal.com/jack-flexforce/pilot-onboarding';
    const mailFromJack = process.env.MAIL_FROM_JACK || 'Jack at FlexForce <jack@flexforce.ai>';
    const mailFromSignups = process.env.MAIL_FROM_SIGNUPS || 'FlexForce Signups <signups@flexforce.ai>';

    const firstName = String(name).trim().split(/\s+/)[0];
    const shopSlug = String(business)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 40);

    // ── Email 1: notification to Jack ──────────────────────────────────────
    await resend.emails.send({
      from: mailFromSignups,
      to: jackEmail,
      reply_to: email,
      subject: `New pilot signup — ${business} (${trade}, ${techs}, ${state})`,
      html: jackNotificationEmail({ name, business, trade, techs, state, email, phone, pain })
    });

    // ── Email 2: confirmation to submitter, with Cal link ──────────────────
    await resend.emails.send({
      from: mailFromJack,
      to: email,
      reply_to: jackEmail,
      subject: `Your FlexForce 30-day pilot — pick an onboarding slot`,
      html: confirmationEmail({ firstName, business, trade, shopSlug, calLink, jackEmail })
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Signup handler error:', err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong on our end. Please email jack@flexforce.ai directly and I will personally onboard you.'
    });
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

function jackNotificationEmail({ name, business, trade, techs, state, email, phone, pain }) {
  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f2922;line-height:1.6;max-width:580px;">
  <h2 style="font-weight:500;letter-spacing:-0.02em;margin:0 0 16px;">New FlexForce pilot signup</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <tr><td style="padding:8px 12px 8px 0;color:#5a6e64;width:130px;">Name</td><td style="padding:8px 0;font-weight:500;">${esc(name)}</td></tr>
    <tr><td style="padding:8px 12px 8px 0;color:#5a6e64;">Business</td><td style="padding:8px 0;font-weight:500;">${esc(business)}</td></tr>
    <tr><td style="padding:8px 12px 8px 0;color:#5a6e64;">Trade</td><td style="padding:8px 0;">${esc(trade)}</td></tr>
    <tr><td style="padding:8px 12px 8px 0;color:#5a6e64;">Field techs</td><td style="padding:8px 0;">${esc(techs)}</td></tr>
    <tr><td style="padding:8px 12px 8px 0;color:#5a6e64;">State</td><td style="padding:8px 0;">${esc(state)}</td></tr>
    <tr><td style="padding:8px 12px 8px 0;color:#5a6e64;">Email</td><td style="padding:8px 0;"><a href="mailto:${esc(email)}" style="color:#1d4d3d;">${esc(email)}</a></td></tr>
    <tr><td style="padding:8px 12px 8px 0;color:#5a6e64;">Phone</td><td style="padding:8px 0;"><a href="tel:${esc(phone)}" style="color:#1d4d3d;">${esc(phone)}</a></td></tr>
    ${pain ? `<tr><td style="padding:8px 12px 8px 0;color:#5a6e64;vertical-align:top;">Pain</td><td style="padding:8px 0;color:#2f4a3f;font-style:italic;">"${esc(pain)}"</td></tr>` : ''}
  </table>
  <p style="margin-top:24px;font-size:13px;color:#5a6e64;">A confirmation email with your Cal.com link has been sent to the prospect. Reply directly to this email to reach them — reply-to is set.</p>
</div>`;
}

function confirmationEmail({ firstName, business, trade, shopSlug, calLink, jackEmail }) {
  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f2922;line-height:1.65;max-width:580px;background:#f6f3ee;padding:32px;border-radius:12px;">

  <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
    <svg width="32" height="32" viewBox="0 0 62 62" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="50" height="50" rx="14" fill="#1d4d3d"></rect>
      <path d="M 18 18 L 30 18 L 30 22.5 L 23 22.5 L 23 27.5 L 28.5 27.5 L 28.5 32 L 23 32 L 23 44 L 18 44 Z" fill="#f6f3ee"></path>
      <path d="M 32 18 L 44 18 L 44 22.5 L 37 22.5 L 37 27.5 L 42 27.5 L 42 32 L 37 32 L 37 44 L 32 44 Z" fill="#bef264"></path>
      <circle cx="46" cy="46" r="3" fill="#bef264"></circle>
    </svg>
    <span style="font-weight:500;font-size:18px;letter-spacing:-0.02em;">flexforce<span style="color:#1d4d3d;">.</span></span>
  </div>

  <p style="font-size:17px;margin:0 0 14px;">Hi ${esc(firstName)},</p>

  <p>Thanks for signing up to pilot FlexForce for <strong>${esc(business)}</strong>. I'll personally onboard you — that's the deal when you work with a one-person company.</p>

  <p><strong>Next step:</strong> pick a 15-minute onboarding slot. I'll walk through the owner dashboard, calibrate the screening to ${esc(String(trade).toLowerCase())}, and have your branded apply page live the same day.</p>

  <div style="margin:28px 0;">
    <a href="${esc(calLink)}" style="display:inline-block;background:#1d4d3d;color:#f6f3ee;padding:14px 26px;border-radius:10px;text-decoration:none;font-weight:500;font-size:15px;letter-spacing:-0.005em;">Book your onboarding call →</a>
  </div>

  <p style="margin:24px 0 8px;"><strong>What happens after the call:</strong></p>
  <ul style="padding-left:20px;margin:0 0 16px;">
    <li style="margin-bottom:6px;">Same day — your branded apply page goes live at <code style="background:#ece8de;padding:2px 6px;border-radius:4px;font-size:13px;">apply.flexforce.ai/${esc(shopSlug)}</code></li>
    <li style="margin-bottom:6px;">First 30 days are free — no card on file, cancel anytime</li>
    <li style="margin-bottom:6px;">Every applicant gets called or texted within 60 seconds, in English or Spanish</li>
    <li>You get one morning digest a day — "3 ready to interview, 1 ready to offer"</li>
  </ul>

  <p>If the times in Cal don't work, just reply to this email — I'll find something that fits.</p>

  <p style="margin-top:32px;margin-bottom:4px;">— Jack</p>
  <p style="margin:0;color:#5a6e64;font-size:13px;">Founder · flexforce.ai · <a href="mailto:${esc(jackEmail)}" style="color:#5a6e64;">${esc(jackEmail)}</a></p>

</div>`;
}
