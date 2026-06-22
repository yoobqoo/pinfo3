/* ========================================================
   babyti EN — shared code for /babyti/en/index.html and /result.html
   ======================================================== */

const SHARE_BASE = 'https://momplan.site/babyti/en/';
let resultType = null;

// PERSONALITIES — TODO: populate with English content (user-provided).
// Schema must mirror babyti/shared.js (LL/LM/LH/ML/MM/MH/HL/HM/HH).
// Required keys per type: title, subTitle, subTitleEn, intro, emoji, color,
//   catch, rarity, tags[], desc, traits[], famous[{name,role}], tip,
//   tipSections[{icon,title,body}], compat[], citation.
// While empty, the result page bootstrap (PERSONALITIES[t] missing → redirect ./)
// gracefully sends users back to the EN intro instead of showing Korean content.
const PERSONALITIES = {};


/* ========================================================
   Shared helpers — page toggle, card image, result render,
   tip page, share, toast.
   ======================================================== */

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
  // Back button lives outside .page — visible only on quiz.
  const back = document.getElementById('qBackBtn');
  if (back) back.hidden = (id !== 'page-quiz');
  window.scrollTo(0, 0);
}

function cardImg(type, className = '') {
  const p = PERSONALITIES[type];
  return `<img class="${className}" src="../baby-cards/${type}.webp" alt="${p.subTitleEn} — ${p.title}" loading="lazy">`;
}

function renderMatrix(type) {
  // top→bottom: H, M, L sensitivity ; left→right: L, M, H surgency
  const order = ['LH','MH','HH','LM','MM','HM','LL','ML','HL'];
  const grid = document.getElementById('rMatrix');
  if (!grid) return;
  grid.innerHTML = order.map(t => {
    const active = t === type;
    return `<div class="matrix-cell${active ? ' active' : ''}" title="${PERSONALITIES[t].subTitleEn}">
      <span class="matrix-cell-dot"></span>
    </div>`;
  }).join('');
  const p = PERSONALITIES[type];
  document.getElementById('rMatrixLegend').innerHTML =
    `📍 ${p.subTitleEn} (${type})<span class="matrix-legend-sub">${p.title}</span>`;
}

function renderResult(type) {
  resultType = type;
  const p = PERSONALITIES[type];

  document.getElementById('rFace').innerHTML = cardImg(type, 'result-card-img');
  document.getElementById('rTypeLabel').textContent = `${type} · ${p.title} ${p.emoji}`;
  document.getElementById('rRarity').textContent = p.rarity;
  document.getElementById('rDesc').textContent = p.desc;
  document.getElementById('rCitation').textContent = p.citation;
  renderMatrix(type);

  document.getElementById('rHashtags').innerHTML = p.tags
    .map(t => `<span class="hashtag">${t}</span>`).join('');
  document.getElementById('rFamous').innerHTML = p.famous.map(f => `
    <div class="famous-item">
      <div class="famous-name">${f.name}</div>
      <div class="famous-role">${f.role}</div>
    </div>`).join('');

  showPage('page-result');
  celebrateResult();
}

/* Pop-in entrance + confetti burst (called once when result first renders) */
function celebrateResult() {
  const face = document.getElementById('rFace');
  if (face) {
    face.classList.remove('pop-in');
    void face.offsetWidth; // restart animation
    face.classList.add('pop-in');
  }
  if (typeof confetti !== 'function') return;
  const colors = ['#5ECFBE', '#FEE500', '#FF8FA3', '#A78BFA', '#FFD166'];
  // Center burst
  confetti({ particleCount: 90, spread: 75, startVelocity: 45, origin: { y: 0.35 }, colors });
  // Side cannons (staggered)
  setTimeout(() => confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors }), 180);
  setTimeout(() => confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors }), 320);
}

function showTipPage() {
  if (!resultType) return;
  const p = PERSONALITIES[resultType];
  document.getElementById('tipFace').innerHTML = cardImg(resultType, 'result-card-img');
  document.getElementById('tipHeroSub').textContent = `${p.subTitleEn} · ${p.title}`;
  const body = document.getElementById('tipBody');
  if (p.tipSections && p.tipSections.length) {
    body.innerHTML = p.tipSections.map(s => `
      <div class="tip-section">
        <div class="tip-section-head">
          <span class="tip-section-icon">${s.icon}</span>
          <span class="tip-section-title">${s.title}</span>
        </div>
        <div class="tip-section-body">${s.body}</div>
      </div>
    `).join('');
  } else {
    body.textContent = p.tip;
  }
  showPage('page-tip');
}

function backToResult() {
  showPage('page-result');
}

/* Share URL points to result page so recipients see same result */
function _shareUrl() {
  return resultType ? `${SHARE_BASE}result?type=${resultType}` : SHARE_BASE;
}

/* Web Share API (mobile share sheet); falls back to copy-link on unsupported browsers */
async function nativeShare() {
  if (!resultType) return;
  const p = PERSONALITIES[resultType];
  const url = _shareUrl();
  const text = `My baby is ${p.subTitleEn}! ${p.emoji}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Babyti Result', text, url });
      return;
    } catch (_) { /* user cancelled or share failed — fall through */ }
  }
  copyShareLink();
}

function copyShareLink() {
  if (!resultType) return;
  const p = PERSONALITIES[resultType];
  const url = _shareUrl();
  const text = `My baby is ${p.subTitleEn}! ${p.emoji}\n${url}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(()=>showToast('Link copied!'))
      .catch(()=>prompt('Copy this link:', text));
  } else {
    prompt('Copy this link:', text);
  }
}

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = 'position:fixed;left:50%;bottom:80px;transform:translateX(-50%);background:rgba(0,0,0,0.82);color:#fff;padding:12px 22px;border-radius:24px;font-size:14px;font-weight:500;z-index:9999;opacity:0;transition:opacity .2s;pointer-events:none;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { t.style.opacity = '0'; }, 1800);
}

/* "Retake the test" — full nav back to quiz */
function restartQuiz() {
  location.href = './';
}

/* Dev helper */
window._showType = function(type) {
  if (!PERSONALITIES[type]) return console.warn('Unknown type:', type);
  renderResult(type);
};
