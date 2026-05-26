// GET /apply/{slug}  → server-rendered branded apply page.
// Rewritten from apply.html into a parameterized template that pulls
// the shop config out of Vercel Blob storage at request time.

import { jsonGet } from './_lib/blob.js';

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function notFoundPage() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Not found — FlexForce</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>body{font-family:-apple-system,Helvetica,Arial,sans-serif;background:#f6f3ee;color:#0f2922;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px;text-align:center}
  .card{background:#fff;border:1px solid #e0d9c8;border-radius:16px;padding:36px;max-width:420px}
  h1{margin:0 0 12px;font-weight:500;font-size:22px;letter-spacing:-.01em}
  p{margin:0 0 18px;color:#5a6e64;line-height:1.55}
  a{background:#1d4d3d;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:500;display:inline-block}
  </style></head><body><div class="card">
  <h1>That apply page doesn't exist.</h1>
  <p>This shop may have moved or never existed. If you're a contractor looking to set up your own branded apply page, you can do that for free.</p>
  <a href="/app/onboard">create your apply page →</a>
  </div></body></html>`;
}

function renderApply(shop) {
  const trackerPageId = `apply-${shop.slug}`;
  const brand = shop.brand || { primary: '#1d4d3d', dark: '#0f2922', soft: '#f6f3ee' };
  const langs = (shop.languages || ['en']);
  const hasEs = langs.includes('es');
  const cityState = [shop.city, (shop.state || '').toUpperCase().replace('-', ' ')].filter(Boolean).join(', ');
  const perksHtml = (shop.job?.perks || []).map(p => `<li>${esc(p)}</li>`).join('');
  const questionsJson = JSON.stringify(shop.questions || []);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Apply at ${esc(shop.shopName)} — Powered by FlexForce</title>
<meta name="description" content="Apply to ${esc(shop.shopName)} — quick AI-assisted screening. Powered by FlexForce.">
<link rel="canonical" href="https://flexforce.ai/apply/${esc(shop.slug)}">
<meta name="robots" content="index, follow">
<meta property="og:title" content="Apply at ${esc(shop.shopName)}">
<meta property="og:description" content="Quick AI-assisted screening — Powered by FlexForce">
<meta property="og:url" content="https://flexforce.ai/apply/${esc(shop.slug)}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='18' fill='${encodeURIComponent(brand.primary)}'/%3E%3Ctext x='50' y='68' font-family='system-ui' font-size='52' font-weight='700' fill='white' text-anchor='middle'%3E${esc(shop.logoText || 'F')}%3C/text%3E%3C/svg%3E">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #f6f3ee; --bg-card: #fbf9f4; --bg-soft: #ece8de;
    --text: #0f2922; --text-soft: #2f4a3f; --text-mute: #5a6e64;
    --border: #e0d9c8;
    --ff-primary: #1d4d3d; --ff-accent: #bef264; --ff-dark: #0f2922;
    --shop-primary: ${brand.primary};
    --shop-dark: ${brand.dark};
    --shop-soft: ${brand.soft};
    --success: #16a34a;
  }
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:var(--bg);color:var(--text);font-family:'Inter',system-ui,sans-serif;font-size:16px;line-height:1.6;letter-spacing:-.005em;-webkit-font-smoothing:antialiased;min-height:100vh}
  .ff-banner{background:var(--ff-dark);color:#cfd8d3;padding:11px 16px;font-size:12px;text-align:center}
  .ff-banner a{color:var(--ff-accent);font-weight:500;text-decoration:none}
  .wrap{max-width:720px;margin:0 auto;padding:0 20px}
  .shop-header{background:var(--bg-card);border-bottom:1px solid var(--border);padding:28px 0}
  .shop-head-row{display:flex;align-items:center;gap:16px;flex-wrap:wrap}
  .shop-logo{width:56px;height:56px;background:var(--shop-primary);color:#fff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:26px;letter-spacing:-.02em;overflow:hidden}
  .shop-logo img{width:100%;height:100%;object-fit:cover}
  .shop-info{flex:1;min-width:0}
  .shop-info h1{font-weight:500;font-size:22px;letter-spacing:-.02em;color:var(--text);margin-bottom:2px}
  .shop-info p{font-size:14px;color:var(--text-mute)}
  .lang-toggle{background:var(--bg-soft);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:6px 12px;font-size:13px;font-weight:500;cursor:pointer;font-family:inherit}
  .lang-toggle:hover{background:var(--shop-soft);border-color:var(--shop-primary)}
  main{padding:32px 0 60px}
  .job-card{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:28px;margin-bottom:24px}
  .job-pill{display:inline-block;background:var(--shop-soft);color:var(--shop-dark);padding:5px 11px;border-radius:999px;font-size:12px;font-weight:500;margin-bottom:14px}
  .job-title{font-weight:500;font-size:24px;letter-spacing:-.02em;margin-bottom:8px;color:var(--text)}
  .job-meta{font-size:14px;color:var(--text-mute);margin-bottom:18px;display:flex;flex-wrap:wrap;gap:8px}
  .job-meta span:nth-child(even){color:var(--border);user-select:none}
  .job-summary{color:var(--text-soft);margin-bottom:16px;line-height:1.55}
  .job-perks{padding-left:0;list-style:none;margin-bottom:20px;display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .job-perks li{font-size:14px;color:var(--text-soft);padding-left:22px;position:relative;line-height:1.4}
  .job-perks li::before{content:"✓";position:absolute;left:0;top:0;color:var(--shop-primary);font-weight:600}
  .apply-row{display:flex;gap:12px;flex-wrap:wrap}
  .apply-btn{flex:1;min-width:200px;background:var(--shop-primary);color:#fff;border:none;border-radius:10px;padding:18px 20px;font-weight:500;font-size:15px;font-family:inherit;cursor:pointer;text-align:left;display:flex;align-items:center;gap:12px;transition:background .15s}
  .apply-btn:hover{background:var(--shop-dark)}
  .apply-btn.secondary{background:var(--bg-soft);color:var(--text)}
  .apply-btn.secondary:hover{background:var(--border)}
  .apply-btn .icon{flex-shrink:0}
  .apply-btn .label{font-size:11px;text-transform:uppercase;letter-spacing:.06em;opacity:.8;font-weight:500}
  .apply-btn .main{font-size:15px;font-weight:500}
  .note{font-size:12px;color:var(--text-mute);text-align:center;margin-top:14px;line-height:1.5}

  /* Modal — chat-style screening */
  .modal-bg{position:fixed;inset:0;background:rgba(15,41,34,.6);display:none;align-items:flex-end;justify-content:center;z-index:1000;padding:0}
  .modal-bg.open{display:flex}
  .modal{background:#fff;border-radius:18px 18px 0 0;width:100%;max-width:540px;max-height:90vh;display:flex;flex-direction:column}
  @media(min-width:640px){.modal-bg{align-items:center;padding:24px}.modal{border-radius:18px;max-height:80vh}}
  .modal-head{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px;justify-content:space-between}
  .who{display:flex;align-items:center;gap:10px}
  .av{width:36px;height:36px;background:var(--ff-primary);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:13px}
  .meta{font-size:13px;color:var(--text-mute)}
  .meta strong{display:block;color:var(--text);font-weight:500}
  .close-btn{background:transparent;border:0;color:var(--text-mute);font-size:24px;cursor:pointer;line-height:1;padding:4px 8px}
  .chat{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:14px;background:var(--bg)}
  .bubble{max-width:78%;padding:11px 15px;border-radius:18px;font-size:14.5px;line-height:1.45}
  .bubble.bot{background:var(--bg-card);border:1px solid var(--border);color:var(--text);align-self:flex-start;border-bottom-left-radius:6px}
  .bubble.user{background:var(--ff-primary);color:#fff;align-self:flex-end;border-bottom-right-radius:6px}
  .options{display:flex;flex-direction:column;gap:8px;align-self:flex-start;max-width:100%}
  .opt{background:#fff;border:1px solid var(--border);border-radius:10px;padding:11px 16px;font-size:14px;cursor:pointer;text-align:left;color:var(--text);font-family:inherit;transition:all .12s}
  .opt:hover{background:var(--shop-soft);border-color:var(--shop-primary);color:var(--shop-dark)}
  .input-row{display:flex;gap:8px;padding:14px 16px;border-top:1px solid var(--border);background:#fff}
  .input-row input{flex:1;border:1px solid var(--border);border-radius:10px;padding:10px 14px;font-size:15px;font-family:inherit;outline:none}
  .input-row input:focus{border-color:var(--shop-primary)}
  .input-row button{background:var(--ff-primary);color:#fff;border:0;border-radius:10px;padding:10px 18px;font-weight:500;cursor:pointer;font-family:inherit}
  .progress{height:3px;background:var(--bg-soft)}
  .progress-bar{height:100%;background:var(--ff-accent);transition:width .3s;width:0}

  .promo{text-align:center;padding:18px 0 4px;font-size:13px;color:var(--text-mute)}
  .promo a{color:var(--ff-primary);font-weight:500;text-decoration:none}
  .ff-foot{padding:24px 16px 36px;text-align:center;border-top:1px solid var(--border);background:var(--bg-card);margin-top:24px}
  .ff-foot-logo{display:inline-flex;align-items:center;gap:8px;text-decoration:none;color:var(--text)}
  .ff-foot-word{font-weight:500;font-size:15px;letter-spacing:-.01em}
  .ff-foot-word .dot{color:var(--ff-primary)}
  .ff-foot-tag{margin-top:6px;font-size:12px;color:var(--text-mute)}
  @media(max-width:560px){.job-perks{grid-template-columns:1fr}}
</style>
</head>
<body>

<div class="ff-banner">Powered by <strong>flexforce.</strong> &nbsp;·&nbsp; <a href="/">free apply page for your shop →</a></div>

<header class="shop-header">
  <div class="wrap shop-head-row">
    <div class="shop-logo">${shop.logoImageUrl ? `<img src="${esc(shop.logoImageUrl)}" alt="${esc(shop.shopName)}">` : esc(shop.logoText || shop.shopName.charAt(0).toUpperCase())}</div>
    <div class="shop-info">
      <h1>${esc(shop.shopName)}</h1>
      <p>${esc(cityState || shop.licenseBoard || '')}${shop.job?.schedule ? ' · ' + esc(shop.job.schedule) : ''}</p>
    </div>
    ${hasEs ? `<button class="lang-toggle" onclick="toggleLang()"><span id="langText">EN / Español</span></button>` : ''}
  </div>
</header>

<main class="wrap">

  <div class="job-card">
    <div class="job-pill">Now hiring</div>
    <h2 class="job-title" id="jobTitle">${esc(shop.job?.title || 'Field Technician')}</h2>
    <div class="job-meta">
      <span>${esc(cityState || 'United States')}</span>
      <span>·</span>
      <span>$${shop.job?.payLow || 25}–$${shop.job?.payHigh || 45}/hour</span>
      <span>·</span>
      <span>${esc(shop.job?.schedule || 'Full-time')}</span>
    </div>
    <p class="job-summary" id="jobSummary">${esc(shop.job?.summary || '')}</p>
    ${perksHtml ? `<ul class="job-perks">${perksHtml}</ul>` : ''}

    <div class="apply-row">
      <button class="apply-btn" onclick="startChat('call')">
        <span class="icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
        <span><span class="label">Fastest · 4 min</span><br><span class="main" data-en="Apply by phone call" data-es="Aplicar por llamada">Apply by phone call</span></span>
      </button>
      <button class="apply-btn secondary" onclick="startChat('text')">
        <span class="icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>
        <span><span class="label" data-en="Or chat · no call" data-es="O por chat · sin llamada">Or chat · no call</span><br><span class="main" data-en="Apply by text" data-es="Aplicar por texto">Apply by text</span></span>
      </button>
    </div>
    <p class="note" data-en="You'll talk with FlexForce, ${esc(shop.shopName)}'s AI screening assistant. Average call: 4 minutes." data-es="Hablarás con FlexForce, el asistente de IA de ${esc(shop.shopName)}. Llamada promedio: 4 minutos.">You'll talk with FlexForce, ${esc(shop.shopName)}'s AI screening assistant. Average call: 4 minutes.</p>
  </div>

  <div class="promo">
    <p>Curious how this works behind the scenes?</p>
    <a href="/">See FlexForce for business owners →</a>
  </div>
</main>

<div class="ff-foot">
  <a href="/" class="ff-foot-logo">
    <svg width="22" height="22" viewBox="0 0 62 62" aria-hidden="true">
      <rect x="6" y="6" width="50" height="50" rx="14" fill="#1d4d3d"></rect>
      <path d="M 18 18 L 30 18 L 30 22.5 L 23 22.5 L 23 27.5 L 28.5 27.5 L 28.5 32 L 23 32 L 23 44 L 18 44 Z" fill="#f6f3ee"></path>
      <path d="M 32 18 L 44 18 L 44 22.5 L 37 22.5 L 37 27.5 L 42 27.5 L 42 32 L 37 32 L 37 44 L 32 44 Z" fill="#bef264"></path>
      <circle cx="46" cy="46" r="3" fill="#bef264"></circle>
    </svg>
    <span class="ff-foot-word">flexforce<span class="dot">.</span></span>
  </a>
  <div class="ff-foot-tag">The AI hiring manager for the trades.</div>
</div>

<div class="modal-bg" id="modal">
  <div class="modal">
    <div class="progress"><div class="progress-bar" id="progBar"></div></div>
    <div class="modal-head">
      <div class="who"><div class="av">FF</div><div class="meta"><strong>FlexForce</strong><span id="screeningFor">Screening for ${esc(shop.shopName)}</span></div></div>
      <button class="close-btn" onclick="closeModal()">×</button>
    </div>
    <div class="chat" id="chat"></div>
    <div class="input-row" id="inputRow" style="display:none">
      <input type="text" id="userInput" placeholder="Type your answer…">
      <button onclick="submitInput()">Send</button>
    </div>
  </div>
</div>

<script>
  window.SHOP = ${JSON.stringify({
    slug: shop.slug,
    shopName: shop.shopName,
    languages: langs,
    questions: shop.questions || [],
    calLink: shop.calLink || ''
  })};
  window.QUESTIONS = ${questionsJson};

  let lang = 'en';
  function toggleLang() {
    lang = lang === 'en' ? 'es' : 'en';
    document.querySelectorAll('[data-en]').forEach(el => {
      el.textContent = el.getAttribute('data-' + lang) || el.textContent;
    });
    const t = document.getElementById('langText');
    if (t) t.textContent = lang === 'en' ? 'EN / Español' : 'Español / EN';
  }

  let chatState = { step: 0, mode: null, answers: {}, profile: {} };
  function $(id) { return document.getElementById(id); }
  function addBubble(text, who='bot') {
    const b = document.createElement('div');
    b.className = 'bubble ' + who;
    b.textContent = text;
    $('chat').appendChild(b);
    $('chat').scrollTop = $('chat').scrollHeight;
    return b;
  }
  function addOptions(opts, onPick) {
    const wrap = document.createElement('div');
    wrap.className = 'options';
    opts.forEach(o => {
      const btn = document.createElement('button');
      btn.className = 'opt';
      btn.textContent = o.label || o;
      btn.onclick = () => {
        wrap.remove();
        addBubble(o.label || o, 'user');
        onPick(o.value !== undefined ? o.value : o);
      };
      wrap.appendChild(btn);
    });
    $('chat').appendChild(wrap);
    $('chat').scrollTop = $('chat').scrollHeight;
  }
  function awaitText(placeholder, onSubmit) {
    $('inputRow').style.display = 'flex';
    const input = $('userInput');
    input.value = '';
    input.placeholder = placeholder;
    input.focus();
    input.onkeypress = (e) => { if (e.key === 'Enter') submitInput(); };
    window._onTextSubmit = (val) => {
      $('inputRow').style.display = 'none';
      addBubble(val, 'user');
      onSubmit(val);
    };
  }
  function submitInput() {
    const v = $('userInput').value.trim();
    if (!v) return;
    // Capture handler, null it BEFORE invoking — the handler chain often
    // installs a fresh _onTextSubmit (next question), and nulling after
    // the call would wipe that new one out.
    var handler = window._onTextSubmit;
    if (!handler) return;
    window._onTextSubmit = null;
    handler(v);
  }

  function setProgress(p) { $('progBar').style.width = p + '%'; }

  function startChat(mode) {
    chatState = { step: 0, mode, answers: {}, profile: {} };
    $('chat').innerHTML = '';
    $('inputRow').style.display = 'none';
    $('modal').classList.add('open');
    setProgress(5);
    setTimeout(() => kickoff(), 400);
  }
  function closeModal() { $('modal').classList.remove('open'); }

  function L(en, es) { return lang === 'es' && es ? es : en; }

  async function kickoff() {
    const opener = L(
      "Hey — I'm FlexForce, the AI screening assistant for " + window.SHOP.shopName + ". I'll ask a few quick questions and book your interview. Sound good?",
      "Hola — soy FlexForce, el asistente de IA de " + window.SHOP.shopName + ". Te haré algunas preguntas rápidas y agendaré tu entrevista. ¿Vamos?"
    );
    addBubble(opener);
    setTimeout(() => {
      addOptions([{ label: L("Yes, let's do it", 'Sí, vamos'), value: 'go' }, { label: L('Switch to Spanish', 'Cambiar a inglés'), value: 'switch' }], (val) => {
        if (val === 'switch') { toggleLang(); return kickoff(); }
        askName();
      });
    }, 600);
  }
  function askName() {
    setProgress(15);
    addBubble(L('Great — first, what\\'s your full name?', 'Perfecto — primero, ¿cuál es tu nombre completo?'));
    awaitText(L('Your full name', 'Tu nombre completo'), (v) => { chatState.profile.name = v; askEmail(); });
  }
  function askEmail() {
    setProgress(25);
    addBubble(L('Thanks ' + (chatState.profile.name.split(' ')[0]) + '. Best email to reach you?', 'Gracias ' + (chatState.profile.name.split(' ')[0]) + '. ¿Cuál es tu mejor email?'));
    awaitText(L('your@email.com', 'tu@email.com'), (v) => {
      if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v)) { addBubble(L('That doesn\\'t look quite right — try again?', 'Eso no se ve bien — ¿intenta de nuevo?')); return askEmail(); }
      chatState.profile.email = v.trim().toLowerCase();
      askPhone();
    });
  }
  function askPhone() {
    setProgress(35);
    addBubble(L('And your mobile phone?', '¿Y tu teléfono móvil?'));
    awaitText(L('(555) 555-5555', '(555) 555-5555'), (v) => {
      if (!/^\\+?[0-9\\s\\-\\(\\)\\.]{10,20}$/.test(v)) { addBubble(L('Hmm — need 10+ digits.', 'Hmm — necesito 10+ dígitos.')); return askPhone(); }
      chatState.profile.phone = v.trim();
      askQuestions();
    });
  }
  function askQuestions() {
    const idx = chatState.step;
    const total = window.QUESTIONS.length;
    setProgress(40 + Math.round((idx / total) * 45));
    if (idx >= total) return finish();
    const q = window.QUESTIONS[idx];
    const prompt = lang === 'es' && q.es ? q.es : q.en;
    addBubble(prompt);
    awaitText(L('Type your answer', 'Escribe tu respuesta'), (v) => {
      chatState.answers[q.key] = v;
      chatState.step++;
      askQuestions();
    });
  }
  async function finish() {
    setProgress(95);
    addBubble(L('Got it. One sec while I file this with ' + window.SHOP.shopName + '…', 'Listo. Un momento mientras envío esto a ' + window.SHOP.shopName + '…'));
    const answers = Object.entries(chatState.answers).map(([key, value]) => {
      const q = window.QUESTIONS.find(x => x.key === key);
      return { key, value, label: q ? (lang === 'es' && q.es ? q.es : q.en) : key };
    });
    try {
      const r = await fetch('/api/applicants/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: window.SHOP.slug,
          name: chatState.profile.name,
          email: chatState.profile.email,
          phone: chatState.profile.phone,
          method: chatState.mode,
          language: lang,
          answers,
          utm: Object.fromEntries(new URLSearchParams(location.search))
        })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'submit_failed');
      setProgress(100);
      if (window.SHOP.calLink) {
        addBubble(L(
          'Perfect — applied. Want to book your interview right now? Pick a time:',
          'Listo — aplicación enviada. ¿Quieres reservar tu entrevista ahora? Elige un horario:'
        ));
        const linkBtn = document.createElement('a');
        linkBtn.href = window.SHOP.calLink;
        linkBtn.target = '_blank';
        linkBtn.rel = 'noopener';
        linkBtn.className = 'opt';
        linkBtn.style.background = 'var(--shop-primary)';
        linkBtn.style.color = '#fff';
        linkBtn.style.borderColor = 'var(--shop-primary)';
        linkBtn.style.textAlign = 'center';
        linkBtn.style.padding = '14px 18px';
        linkBtn.textContent = L('Open booking calendar →', 'Abrir calendario →');
        $('chat').appendChild(linkBtn);
        $('chat').scrollTop = $('chat').scrollHeight;
      } else {
        addBubble(L(
          'You\\'re in. ' + window.SHOP.shopName + ' will reach out within 24 hours. Check your email for confirmation.',
          'Estás dentro. ' + window.SHOP.shopName + ' te contactará dentro de 24 horas. Revisa tu email.'
        ));
      }
    } catch (e) {
      addBubble(L('Something went wrong. Your info is saved — please email ' + window.SHOP.shopName + ' directly.', 'Algo salió mal. Tu información se guardó — por favor escribe a ' + window.SHOP.shopName + ' directamente.'));
    }
  }

  // Tracking
  window.FLEXFORCE_GTM_ID = 'GTM-589NB6LK';
  window.FLEXFORCE_POSTHOG_KEY = 'phc_ueQrvu38JbSTHgfAFJQ4XV4mRTj5A4fVgvUwVyktpDo9';
  window.FLEXFORCE_POSTHOG_HOST = 'https://us.i.posthog.com';
</script>

<!-- Google Tag Manager -->
<script>
(function() {
  if (!window.FLEXFORCE_GTM_ID) return;
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',window.FLEXFORCE_GTM_ID);
})();
</script>
<!-- PostHog -->
<script>
(function() {
  if (!window.FLEXFORCE_POSTHOG_KEY) return;
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  posthog.init(window.FLEXFORCE_POSTHOG_KEY, { api_host: window.FLEXFORCE_POSTHOG_HOST, person_profiles: 'identified_only', capture_pageview: true, capture_pageleave: true });
})();
</script>
<!-- Identity + click tracking -->
<script>
(function() {
  window.flexforcePage = { id: '${trackerPageId}', type: 'apply', state: '${esc(shop.state || '')}', trade: '${esc(shop.trade || '')}', wave: '0', shopSlug: '${esc(shop.slug)}' };
  var P = window.flexforcePage;
  document.addEventListener('click', function(e) {
    var el = e.target.closest && e.target.closest('a, button');
    if (!el) return;
    var payload = { event: el.tagName === 'A' ? 'link_click' : 'button_click', page_id: P.id, page_type: P.type, shop_slug: P.shopSlug, text: (el.innerText || '').trim().slice(0, 80), classes: el.className || '' };
    (window.dataLayer = window.dataLayer || []).push(payload);
    if (window.posthog && window.posthog.capture) window.posthog.capture(payload.event, payload);
    if (typeof window.gtag === 'function') window.gtag('event', payload.event, payload);
  }, true);
})();
</script>
</body>
</html>`;
}

export default async function handler(req, res) {
  const slug = String(req.query.slug || '').toLowerCase().trim();
  if (!slug) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end(notFoundPage());
  }
  try {
    const shop = await jsonGet(`shops/${slug}.json`);
    if (!shop || shop.status === 'archived') {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.end(notFoundPage());
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
    return res.end(renderApply(shop));
  } catch (e) {
    console.error('[apply render]', e);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end(`<h1>Error loading apply page.</h1><p>${esc(String(e.message || e))}</p>`);
  }
}
