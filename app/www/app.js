/* ASC 2026 Navigator — single-page app. Data comes from data.js (window.ASC_DATA). */
'use strict';
const D = window.ASC_DATA;
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const AREA_NAME = D.meta.areas;
const AREA_ORDER = ['PL','J','E','L','M','LM'];
const DAY_NAMES = {'2026-09-06':'Sun','2026-09-07':'Mon','2026-09-08':'Tue','2026-09-09':'Wed','2026-09-10':'Thu','2026-09-11':'Fri'};
const DAY_LONG = {'2026-09-06':'Sunday, Sep 6','2026-09-07':'Monday, Sep 7','2026-09-08':'Tuesday, Sep 8','2026-09-09':'Wednesday, Sep 9','2026-09-10':'Thursday, Sep 10','2026-09-11':'Friday, Sep 11'};
const FLAG = {'United States':'🇺🇸','Japan':'🇯🇵','China':'🇨🇳','South Korea':'🇰🇷','Italy':'🇮🇹','Switzerland':'🇨🇭','United Kingdom':'🇬🇧','Germany':'🇩🇪','France':'🇫🇷','Spain':'🇪🇸','Netherlands':'🇳🇱','New Zealand':'🇳🇿','Belgium':'🇧🇪','Canada':'🇨🇦','Finland':'🇫🇮','India':'🇮🇳','Australia':'🇦🇺','Sweden':'🇸🇪','South Africa':'🇿🇦','Mexico':'🇲🇽','Taiwan':'🇹🇼','Austria':'🇦🇹','Slovakia':'🇸🇰','Brazil':'🇧🇷','Saudi Arabia':'🇸🇦','Ukraine':'🇺🇦','Hungary':'🇭🇺','Denmark':'🇩🇰','Tanzania':'🇹🇿','Turkey':'🇹🇷','Czech Republic':'🇨🇿','Poland':'🇵🇱','Romania':'🇷🇴','Russia':'🇷🇺','Nigeria':'🇳🇬','Malta':'🇲🇹','Latvia':'🇱🇻','Chile':'🇨🇱','Indonesia':'🇮🇩','Israel':'🇮🇱','Norway':'🇳🇴','Ireland':'🇮🇪','Portugal':'🇵🇹','Greece':'🇬🇷','Singapore':'🇸🇬','Iran':'🇮🇷','Egypt':'🇪🇬','Argentina':'🇦🇷','Vietnam':'🇻🇳','Thailand':'🇹🇭','Pakistan':'🇵🇰','Slovenia':'🇸🇮','Croatia':'🇭🇷','Estonia':'🇪🇪','Lithuania':'🇱🇹','Luxembourg':'🇱🇺','Kazakhstan':'🇰🇿'};
const flag = c => FLAG[c] || '🏳️';
const TYPE_ICON = {Oral:'🎤',Poster:'🖼️',Plenary:'⭐',Special:'✨',Memorial:'🕯️'};

/* ---------- Domain keywords (materials, devices, techniques) ---------- */
const KEYWORDS = [
 ['REBCO / YBCO', /\b(rebco|ybco|yba2cu3o|coated conductor|2g hts|gdbco|eubco)\b/i],
 ['Nb3Sn', /\bnb\s?3\s?sn\b|\bnb₃sn\b|niobium[- ]tin/i],
 ['NbTi', /\bnb[- ]?ti\b|niobium[- ]titanium/i],
 ['MgB2', /\bmgb\s?2\b|\bmgb₂\b|magnesium diboride/i],
 ['Bi-2212', /\bbi[- ]?2212\b|bscco[- ]?2212/i],
 ['Bi-2223', /\bbi[- ]?2223\b|bscco[- ]?2223/i],
 ['Iron-based (IBS)', /iron[- ]based superconduct|\bibs\b|\bba122\b|\bfese\b|\bfeSe\b/i],
 ['Nitride films (NbN, NbTiN)', /\bnbn\b|\bnbtin\b|\btin\b films|titanium nitride/i],
 ['Bulk superconductors', /\bbulk\b/i],
 ['Cuprates', /\bcuprate/i],
 ['Nickelates / hydrides', /nickelate|hydride|\bh3s\b|\blah10\b/i],
 ['Josephson junctions', /josephson junction|\bjj\b|\bjjs\b|\bsquid\b/i],
 ['SQUID', /\bsquid/i],
 ['TES (transition-edge sensor)', /transition[- ]edge sensor|\btes\b/i],
 ['SNSPD', /\bsnspd|nanowire single[- ]photon/i],
 ['MKID / KID', /\bmkid|kinetic inductance detector|\bkid\b/i],
 ['Qubits', /\bqubit/i],
 ['Quantum computing', /quantum comput|quantum processor|quantum error|transmon/i],
 ['SFQ / RSFQ logic', /\bsfq\b|\brsfq\b|\bersfq\b|single flux quantum|\baqfp\b|quantum[- ]flux[- ]parametron/i],
 ['Cryo-CMOS / hybrid', /cryo[- ]?cmos|cryogenic cmos/i],
 ['Parametric amplifiers', /parametric amplif|\bjpa\b|\btwpa\b|\bkitwpa\b/i],
 ['Microwave / RF', /microwave|\brf\b|resonator|gigahertz|\bghz\b/i],
 ['Terahertz / mm-wave', /terahertz|\bthz\b|millimeter[- ]wave/i],
 ['X-ray / gamma spectroscopy', /x[- ]ray|gamma[- ]ray/i],
 ['Astronomy / CMB', /\bcmb\b|cosmic microwave|telescope|astronom|astrophys/i],
 ['Dark matter / particle physics', /dark matter|axion|neutrino|particle physics/i],
 ['Multiplexing / readout', /multiplex|readout|\bmux\b/i],
 ['Fabrication / process', /fabricat|lithograph|deposition|etch|sputter|\bmocvd\b|\bpld\b|\bald\b/i],
 ['Thin films', /thin[- ]film/i],
 ['Flux trapping', /flux trap|trapped flux|flux pinning|pinning/i],
 ['Accelerator magnets', /accelerator|collider|\bfcc\b|\bhl-lhc\b|\blhc\b|\beic\b|\bmqxf|dipole|quadrupole|\bcern\b/i],
 ['Fusion magnets', /fusion|tokamak|stellarator|\biter\b|\bsparc\b|\bdemo\b|\bcfetr\b|\bbest\b tokamak|\btf coil|toroidal field|poloidal field|\bcs coil/i],
 ['Cables (CICC, CORC, Roebel)', /\bcicc\b|\bcorc\b|roebel|\btstc\b|\bvipers?\b|\bstar\b cable|rutherford|\bcable\b/i],
 ['Quench & protection', /quench/i],
 ['AC loss', /ac loss|\bac losses\b|hysteresis loss|magnetization loss/i],
 ['No-insulation (NI) coils', /no[- ]insulation|\bni coil|\bni hts|metal[- ]insulation|\bmi coil|partial[- ]insulation/i],
 ['High-field magnets (>20 T)', /\b(2[0-9]|3[0-9]|4[0-9]|5[0-9])\s?t\b|high[- ]field magnet|ultra[- ]high[- ]field/i],
 ['NMR / MRI magnets', /\bnmr\b|\bmri\b|magnetic resonance/i],
 ['Undulators / wigglers', /undulator|wiggler/i],
 ['Detector magnets', /detector magnet|solenoid/i],
 ['Rotating machines', /motor|generator|rotating machine|rotor|stator|electric aircraft|propulsion|wind turbine/i],
 ['Power cables', /power cable|transmission cable|\bhvdc\b|distribution cable/i],
 ['Fault current limiters', /fault current limit|\bsfcl\b|\bfcl\b/i],
 ['Transformers / SMES', /transformer|\bsmes\b|energy storage/i],
 ['Flux pumps', /flux pump/i],
 ['Current leads & joints', /current lead|\bjoint/i],
 ['Magnetic levitation', /levitation|maglev/i],
 ['Cryogenics & cooling', /cryocooler|cryogenic|cryostat|conduction[- ]cool|liquid hydrogen|\blh2\b|helium/i],
 ['Hydrogen economy', /hydrogen/i],
 ['Space applications', /satellite|spacecraft|\bspace\b/i],
 ['Medical (proton therapy, MRI)', /proton therapy|gantry|medical|cyclotron|hadron therapy/i],
 ['Mechanical / strain', /strain|stress|mechanical|lorentz force|delamination/i],
 ['Modeling & simulation', /finite[- ]element|\bfem\b|simulation|numerical model|comsol|\bh-formulation|t-a formulation/i],
 ['AI / machine learning', /machine learning|neural network|artificial intelligence|\bai\b|deep learning|data[- ]driven/i],
 ['Irradiation / radiation', /irradiat|radiation|neutron/i],
 ['Critical current (Ic, Jc)', /critical current|\bjc\b|\bic\b/i],
 ['Standards & testing', /standard|round[- ]robin|\biec\b|test method/i],
 ['Digital twins & control', /digital twin|control system|real[- ]time monitor/i],
 ['SRF cavities', /\bsrf\b|radio[- ]frequency cavit|superconducting cavit/i],
 ['Magnet design & optimization', /optimi[sz]ation|design study|conceptual design/i],
 ['Superconducting electronics (general)', /superconducting (electronic|circuit|digital)/i],
];

/* ---------- Indexes ---------- */
const S = {}, P = {}, PEOPLE = {}, INST = {}, SUBF = {};
D.sessions.forEach(s => { S[s.id] = s; s.presIds = s.items; s.dayName = DAY_NAMES[s.date]; });
D.presentations.forEach(p => { P[p.id] = p; p.sess = S[p.session]; p.area = p.sess.area; });
D.people.forEach(pp => { PEOPLE[pp.id] = pp; pp.presenting = pp.presenting || 0; });
D.institutions.forEach(i => INST[i.name] = i);
D.subfields.forEach(sf => SUBF[sf.area + '|' + sf.name] = sf);
const DAYS = D.meta.dates;
// searchable text + keywords
D.presentations.forEach(p => {
  const auth = p.authors.map(a => a.n).join(' ');
  const affs = p.affs.map(a => a.raw).join(' ');
  p.text = (p.id + ' ' + p.title + ' ' + auth + ' ' + affs + ' ' + p.sess.title + ' ' + p.sess.subfield + ' ' + p.abstract).toLowerCase();
  p.kws = [];
  const t = p.title + ' ' + p.abstract + ' ' + p.sess.title;
  KEYWORDS.forEach(([k, re], i) => { if (re.test(t)) p.kws.push(i); });
});
const KW_COUNT = KEYWORDS.map((k, i) => ({ i, name: k[0], n: D.presentations.filter(p => p.kws.includes(i)).length }));
D.sessions.forEach(s => {
  s.kwCount = {};
  s.items.forEach(id => P[id].kws.forEach(k => s.kwCount[k] = (s.kwCount[k] || 0) + 1));
  s.text = (s.id + ' ' + s.title + ' ' + s.subfield + ' ' + s.chairs.map(c => c.name).join(' ')).toLowerCase();
});
// people extra indexes
D.people.forEach(pp => {
  pp.presentingIds = pp.pres.filter(id => P[id].authors.some(a => a.pid === pp.id && a.p));
  pp.score = (pp.tasc ? pp.tasc.n : 0) * 2 + pp.pres.length + (pp.plenary ? 60 : 0) + (pp.chairs ? pp.chairs.length * 3 : 0) + pp.invited * 4;
  pp.text = (pp.name + ' ' + pp.insts.join(' ') + ' ' + pp.countries.join(' ')).toLowerCase();
});
const PEOPLE_RANKED = D.people.slice().sort((a, b) => b.score - a.score);
const ROOMS = {};
D.sessions.forEach(s => { (ROOMS[s.room] = ROOMS[s.room] || { name: s.room, level: s.level, sessions: [] }).sessions.push(s.id); });
D.events.forEach(e => { if (!ROOMS[e.room]) ROOMS[e.room] = { name: e.room, level: e.level, sessions: [] }; });
const INST_PEOPLE = {};
D.people.forEach(pp => pp.insts.forEach(i => (INST_PEOPLE[i] = INST_PEOPLE[i] || []).push(pp.id)));
const INST_PRES = {};
D.presentations.forEach(p => { const seen = new Set(); p.affs.forEach(a => { if (!seen.has(a.inst)) { seen.add(a.inst); (INST_PRES[a.inst] = INST_PRES[a.inst] || []).push(p.id); } }); });
const COUNTRY_PRES = {};
D.presentations.forEach(p => { const seen = new Set(); p.affs.forEach(a => { if (!seen.has(a.country)) { seen.add(a.country); (COUNTRY_PRES[a.country] = COUNTRY_PRES[a.country] || []).push(p.id); } }); });

/* ---------- Time (conference runs on US Eastern time) ---------- */
const TZ = 'America/New_York';
const state = { timeTravel: null, tab: 'now' };
function nowET() {
  if (state.timeTravel) return state.timeTravel;
  const d = new Date();
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(d);
  const g = t => parts.find(x => x.type === t).value;
  return { date: `${g('year')}-${g('month')}-${g('day')}`, min: (parseInt(g('hour')) % 24) * 60 + parseInt(g('minute')) };
}
const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const fmtT = t => { let [h, m] = t.split(':').map(Number); const ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12; return `${h}:${String(m).padStart(2, '0')}${ap}`; };
const fmtMin = mn => fmtT(`${Math.floor(mn / 60)}:${String(mn % 60).padStart(2, '0')}`);
function statusOf(date, start, end) {
  const n = nowET(); if (date !== n.date) return date < n.date ? 'past' : 'future';
  const s = toMin(start), e = toMin(end);
  if (n.min >= s && n.min < e) return 'now'; return n.min >= e ? 'past' : 'future';
}

/* ---------- Persistence ---------- */
const store = {
  get(k, def) { try { const v = localStorage.getItem('asc26_' + k); return v == null ? def : JSON.parse(v); } catch (e) { return def; } },
  set(k, v) { try { localStorage.setItem('asc26_' + k, JSON.stringify(v)); } catch (e) {} }
};
const stars = new Set(store.get('stars', []));
const prefs = Object.assign({ subfields: [], keywords: [], people: [], areas: [] }, store.get('prefs', {}));
function toggleStar(id, ev) { if (ev) ev.stopPropagation(); if (stars.has(id)) stars.delete(id); else stars.add(id); store.set('stars', [...stars]); toast(stars.has(id) ? 'Added to My Plan ★' : 'Removed from My Plan'); render(); }
let toastTimer;
function toast(msg) { let t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); } t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 1600); }

/* ---------- Router ---------- */
const routes = {};
function nav(hash) { location.hash = hash; }
function render() {
  const h = location.hash.replace(/^#\/?/, '') || 'now';
  const [path, qs] = h.split('?'); const seg = path.split('/').map(decodeURIComponent); const q = Object.fromEntries(new URLSearchParams(qs || ''));
  const view = routes[seg[0]] || routes.now;
  const out = view(seg.slice(1), q);
  $('#view').innerHTML = out.html;
  $('#title').textContent = out.title || 'ASC 2026';
  $('#subtitle').textContent = out.sub || '';
  $('#back').style.visibility = out.root ? 'hidden' : 'visible';
  document.querySelectorAll('nav#tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === (out.tab || seg[0])));
  if (out.after) out.after();
  if (!out.keepScroll) window.scrollTo(0, 0);
}
window.addEventListener('hashchange', render);
window.goBack = () => { if (history.length > 1) history.back(); else nav('/now'); };

/* ---------- Shared renderers ---------- */
function sessionCard(s, opts = {}) {
  const st = statusOf(s.date, s.start, s.end);
  const n = s.items.filter(i => !P[i].aux).length;
  return `<div class="sess stripe ${s.area}" onclick="nav('/session/${s.id}')">
    <div class="grow">
      <div class="code">${s.id} · ${TYPE_ICON[s.type] || ''} ${esc(s.type)}${s.special ? '<span class="badge sp">special</span>' : ''}${s.memorial ? '<span class="badge mem">memorial</span>' : ''}${st === 'now' ? '<span class="badge now">now</span>' : ''}</div>
      <div class="title">${esc(s.title)}</div>
      <div class="room">${opts.showDay ? DAY_NAMES[s.date] + ' ' : ''}${fmtT(s.start)}–${fmtT(s.end)} · 📍 ${esc(s.room)}${s.level ? ' (L' + s.level + ')' : ''} · ${n} ${s.type === 'Poster' ? 'posters' : 'talks'}</div>
      ${opts.extra || ''}
    </div>
    <button class="star ${stars.has(s.id) ? 'on' : ''}" onclick="toggleStar('${s.id}',event)" aria-label="star">${stars.has(s.id) ? '★' : '☆'}</button>
  </div>`;
}
function talkRow(p, opts = {}) {
  const pres = p.authors.find(a => a.p) || p.authors[0];
  const who = pres ? esc(pres.n) + (p.affs[pres.a[0]] ? ' · ' + esc(p.affs[pres.a[0]].inst) : '') : '';
  const st = statusOf(p.date, p.start, p.end);
  return `<div class="talk" onclick="nav('/pres/${p.id}')">
    <div class="time">${p.sess.type === 'Poster' ? (p.board ? '#' + esc(p.board) : String(p.id.split('-')[1])) : fmtT(p.start)}</div>
    <div class="grow">
      <div>${p.invited && p.sess.type !== 'Plenary' ? '<span class="badge inv">invited</span> ' : ''}${p.withdrawn ? '<span class="badge wd">withdrawn</span> ' : ''}${st === 'now' && p.sess.type !== 'Poster' ? '<span class="badge now">now</span> ' : ''}${esc(p.title)}</div>
      <div class="who">${who}${opts.showSession ? ` · <span class="tx-${p.area}">${p.session}</span> ${DAY_NAMES[p.date]} ${fmtT(p.start)} · ${esc(p.room)}` : ''}</div>
    </div>
    ${p.aux ? '' : `<button class="star ${stars.has(p.id) ? 'on' : ''}" onclick="toggleStar('${p.id}',event)" aria-label="star">${stars.has(p.id) ? '★' : '☆'}</button>`}
  </div>`;
}
function personCard(pp, extra) {
  const inst = pp.insts[0] || ''; const c = pp.countries[0] || '';
  return `<div class="card tap row" onclick="nav('/person/${pp.id}')">
    ${avatar(pp)}
    <div class="grow">
      <div class="title">${esc(pp.name)} ${pp.plenary ? '<span class="badge pl">plenary</span>' : ''}</div>
      <div class="small muted">${esc(inst)}${c ? ' · ' + flag(c) + ' ' + esc(c) : ''}</div>
      <div class="tiny muted">${pp.pres.length} presentation${pp.pres.length === 1 ? '' : 's'}${pp.presentingIds.length ? ' · presenting ' + pp.presentingIds.length : ''}${pp.chairs ? ' · chairs ' + pp.chairs.length : ''}${pp.tasc && pp.tasc.n ? ' · ≈' + pp.tasc.n + ' TASC papers' : ''}</div>
      ${extra || ''}
    </div></div>`;
}
function avatar(pp, cls = '') {
  const ini = pp.name.split(/\s+/).filter(Boolean).map(x => x[0]).slice(0, 2).join('').toUpperCase();
  return `<div class="avatar ${cls}">${pp.photo ? `<img src="${pp.photo}" alt="">` : esc(ini)}</div>`;
}
function areaChip(a) { return `<span class="chip"><span class="area ${a}"></span>${esc(AREA_NAME[a] || a)}</span>`; }
function hl(text, q) { if (!q) return esc(text); const words = q.split(/\s+/).filter(w => w.length > 1).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); if (!words.length) return esc(text); return esc(text).replace(new RegExp('(' + words.join('|') + ')', 'gi'), '<mark>$1</mark>'); }

/* ---------- NOW view ---------- */
routes.now = () => {
  const n = nowET();
  const inConf = DAYS.includes(n.date);
  const todaySessions = D.sessions.filter(s => s.date === n.date);
  const live = todaySessions.filter(s => statusOf(s.date, s.start, s.end) === 'now');
  const upcoming = todaySessions.filter(s => toMin(s.start) > n.min).sort((a, b) => toMin(a.start) - toMin(b.start));
  const nextStart = upcoming.length ? toMin(upcoming[0].start) : null;
  const next = nextStart != null ? upcoming.filter(s => toMin(s.start) === nextStart) : [];
  const liveEvents = D.events.filter(e => e.date === n.date && statusOf(e.date, e.start, e.end) === 'now');
  const myToday = [...stars].map(id => P[id] || S[id]).filter(x => x && x.date === n.date).sort((a, b) => toMin(a.start) - toMin(b.start));
  const plen = todaySessions.filter(s => s.area === 'PL');
  let html = `<div class="hero">
    <div class="row"><div class="grow"><div class="muted small">${inConf ? DAY_LONG[n.date] : 'Applied Superconductivity Conference'}</div>
    <div class="big">${inConf ? (live.length ? 'Happening now' : (next.length ? 'Coming up' : 'Day wrap-up')) : 'ASC 2026 · Pittsburgh'}</div></div>
    <div class="clock">${fmtMin(n.min)}</div></div>
    <div class="muted small" style="margin-top:6px">Sep 6–11, 2026 · David L. Lawrence Convention Center · Eastern time${state.timeTravel ? ' · <b style="color:#ffd166">simulated</b>' : ''}</div>
    <div class="row" style="margin-top:10px;gap:6px;flex-wrap:wrap">
      <button class="btn sm sec" onclick="timeTravel()">⏱ ${state.timeTravel ? 'Change simulated time' : 'Simulate a time'}</button>
      ${state.timeTravel ? '<button class="btn sm sec" onclick="state.timeTravel=null;render()">Back to real time</button>' : ''}
    </div></div>`;
  if (!inConf) {
    const nextDay = DAYS.find(d => d > n.date);
    html += `<div class="card"><div class="title">${nextDay ? 'The conference starts ' + DAY_LONG[nextDay] : 'The conference has ended'}</div><div class="muted small">Use the time simulator above to preview any moment of the program, or browse the Program tab.</div></div>`;
  }
  html += `<div class="grid3">
    <div class="stat" onclick="nav('/program')"><div class="n">${D.sessions.length}</div><div class="l">sessions</div></div>
    <div class="stat" onclick="nav('/search')"><div class="n">${D.presentations.filter(p => !p.aux).length}</div><div class="l">presentations</div></div>
    <div class="stat" onclick="nav('/people')"><div class="n">${D.people.length}</div><div class="l">authors</div></div></div>`;
  if (live.length) {
    const TP = { Plenary: 0, Special: 1, Oral: 2, Poster: 3 };
    html += `<h3>Happening now (${live.length})</h3>` + live.sort((a, b) => (TP[a.type] ?? 2) - (TP[b.type] ?? 2) || a.id.localeCompare(b.id)).map(s => sessionCard(s)).join('');
  }
  if (liveEvents.length) html += liveEvents.map(e => `<div class="sess stripe ev"><div class="grow"><div class="code">${esc(e.cat)}</div><div class="title">${esc(e.title)}</div><div class="room">${fmtT(e.start)}–${fmtT(e.end)} · 📍 ${esc(e.room)}</div></div></div>`).join('');
  if (next.length) {
    html += `<h3>Up next · ${fmtT(upcoming[0].start)} (in ${nextStart - n.min} min)</h3>` + next.slice(0, 12).map(s => sessionCard(s)).join('') + (next.length > 12 ? `<div class="muted small" style="text-align:center;margin:6px">+ ${next.length - 12} more parallel sessions · <a href="#/program/${n.date}">see full day</a></div>` : '');
  }
  if (myToday.length) {
    html += `<h3>My plan today</h3><div class="tl">` + myToday.map(x => { const st = statusOf(x.date, x.start, x.end); return `<div class="it ${st}"><a href="#/${x.session ? 'pres' : 'session'}/${x.id}"><b>${fmtT(x.start)}</b> ${esc(x.title)}</a><div class="muted small">📍 ${esc(x.room)}</div></div>`; }).join('') + `</div>`;
  } else if (inConf) html += `<div class="card"><div class="title">No plan yet for today</div><div class="muted small">Star talks as you browse, or let the <a href="#/plan">Schedule Builder</a> assemble a day from your interests.</div></div>`;
  if (plen.length && !live.some(s => s.area === 'PL')) html += `<h3>Today's plenary</h3>` + plen.map(s => sessionCard(s)).join('');
  html += `<h3>Explore</h3><div class="grid2">
    <div class="card tap" onclick="nav('/explore/topics')"><div class="title">🧭 Topic map</div><div class="muted small">Every subfield of the program at a glance</div></div>
    <div class="card tap" onclick="nav('/explore/people')"><div class="title">🤝 Who to meet</div><div class="muted small">Prolific IEEE TASC authors attending</div></div>
    <div class="card tap" onclick="nav('/explore/institutions')"><div class="title">🏛️ Institutions</div><div class="muted small">Labs and universities by presence</div></div>
    <div class="card tap" onclick="nav('/explore/countries')"><div class="title">🌍 Countries</div><div class="muted small">Where the community comes from</div></div>
    <div class="card tap" onclick="nav('/explore/rooms')"><div class="title">🗺️ Rooms</div><div class="muted small">Find sessions by room and level</div></div>
    <div class="card tap" onclick="nav('/explore/network')"><div class="title">🕸️ Collaboration web</div><div class="muted small">Co-authorship network of leading authors</div></div>
  </div>`;
  return { html, title: 'ASC 2026 Navigator', root: true, tab: 'now' };
};
window.timeTravel = () => {
  const n = nowET();
  const html = `<div class="card"><div class="title">Simulate a conference moment</div><div class="muted small">Handy for planning ahead, or for exploring the app outside conference hours.</div>
    <div class="chips" style="margin-top:8px">${DAYS.map(d => `<span class="chip tap ${d === n.date ? 'sel' : ''}" onclick="ttSet('${d}',null)">${DAY_NAMES[d]} ${d.slice(8)}</span>`).join('')}</div>
    <input class="range" type="range" min="420" max="1260" step="5" value="${n.min}" oninput="ttSet(null,+this.value)"><div id="ttlabel" class="b" style="text-align:center">${fmtMin(n.min)}</div></div>`;
  const wrap = document.createElement('div'); wrap.id = 'ttbox'; wrap.innerHTML = html; $('#view').prepend(wrap);
  state.timeTravel = { date: n.date, min: n.min };
};
window.ttSet = (d, m) => { const t = state.timeTravel || nowET(); state.timeTravel = { date: d || t.date, min: m == null ? t.min : m }; if (m != null) { $('#ttlabel').textContent = fmtMin(m); clearTimeout(window._tt); window._tt = setTimeout(render, 250); } else render(); };

/* ---------- PROGRAM view ---------- */
routes.program = (seg, q) => {
  const n = nowET();
  const day = seg[0] && DAYS.includes(seg[0]) ? seg[0] : (DAYS.includes(n.date) ? n.date : '2026-09-07');
  const fArea = q.area || '', fType = q.type || '';
  const qs = (a, t) => { const u = new URLSearchParams(); if (a) u.set('area', a); if (t) u.set('type', t); const s = u.toString(); return s ? '?' + s : ''; };
  let list = D.sessions.filter(s => s.date === day && (!fArea || s.area === fArea || (fArea === 'L' && s.area === 'LM')) && (!fType || s.type === fType));
  const events = D.events.filter(e => e.date === day && !/Exhibitor Setup|Registration/.test(e.title));
  // group into time blocks by start time
  const blocks = {};
  list.forEach(s => (blocks[s.start] = blocks[s.start] || []).push(s));
  events.forEach(e => (blocks[e.start] = blocks[e.start] || []).push(e));
  const keys = Object.keys(blocks).sort((a, b) => toMin(a) - toMin(b));
  let html = `<div class="daybar">${DAYS.map(d => `<button class="${d === day ? 'active' : ''}" onclick="nav('/program/${d}${qs(fArea, fType)}')"><span class="d">${DAY_NAMES[d]}</span>Sep ${+d.slice(8)}</button>`).join('')}</div>
  <div class="chips scroll">
    ${['', 'PL', 'J', 'E', 'L', 'M'].map(a => `<span class="chip tap ${fArea === a ? 'sel' : ''}" onclick="nav('/program/${day}${qs(a, fType)}')">${a ? '<span class="area ' + a + '"></span>' + AREA_NAME[a] : 'All areas'}</span>`).join('')}
    <span class="chip" style="opacity:.4">|</span>
    ${['', 'Oral', 'Poster', 'Special', 'Plenary'].map(t => `<span class="chip tap ${fType === t ? 'sel' : ''}" onclick="nav('/program/${day}${qs(fArea, t)}')">${t ? TYPE_ICON[t] + ' ' + t : 'All formats'}</span>`).join('')}
  </div>`;
  if (!keys.length) html += `<div class="empty">Nothing scheduled for this filter.</div>`;
  keys.forEach(k => {
    const items = blocks[k];
    const sess = items.filter(x => x.items); const evs = items.filter(x => !x.items);
    const st = statusOf(day, k, items[0].end);
    html += `<div class="block"><span class="t">${fmtT(k)}</span><span class="l">${sess.length ? sess.length + ' parallel session' + (sess.length > 1 ? 's' : '') : ''}${st === 'now' ? ' · <b style="color:#5df0a8">in progress</b>' : ''}</span></div>`;
    evs.forEach(e => html += `<div class="sess stripe ev"><div class="grow"><div class="code">${esc(e.cat)}</div><div class="title">${esc(e.title)}</div><div class="room">${fmtT(e.start)}–${fmtT(e.end)} · 📍 ${esc(e.room)}</div></div></div>`);
    // group by area for readability
    AREA_ORDER.forEach(a => sess.filter(s => s.area === a).sort((x, y) => x.id.localeCompare(y.id)).forEach(s => html += sessionCard(s)));
  });
  return { html, title: 'Program · ' + DAY_LONG[day], root: true, tab: 'program' };
};

/* ---------- SESSION detail ---------- */
routes.session = seg => {
  const s = S[seg[0]]; if (!s) return { html: '<div class="empty">Session not found</div>', title: 'Session' };
  const st = statusOf(s.date, s.start, s.end);
  const sameSlot = D.sessions.filter(x => x.date === s.date && x.start === s.start && x.id !== s.id);
  const sf = SUBF[s.area + '|' + s.subfield];
  let html = `<div class="card stripe ${s.area}">
    <div class="code muted small">${s.id} · ${TYPE_ICON[s.type] || ''} ${esc(s.type)} session ${st === 'now' ? '<span class="badge now">now</span>' : ''}</div>
    <div style="font-size:18px;font-weight:700;margin:4px 0">${esc(s.title)}</div>
    <div class="chips">${areaChip(s.area)}${sf ? `<span class="chip tap" onclick="nav('/topic/${s.area}/${encodeURIComponent(s.subfield)}')">🧭 ${esc(s.subfield)}</span>` : ''}</div>
    <div class="row" style="margin-top:6px"><div class="grow"><div><b>${DAY_LONG[s.date]}</b> · ${fmtT(s.start)}–${fmtT(s.end)}</div>
    <div><a href="#/room/${encodeURIComponent(s.room)}">📍 ${esc(s.room)}${s.level ? ' · Level ' + s.level : ''}</a></div></div>
    <button class="star ${stars.has(s.id) ? 'on' : ''}" style="font-size:28px" onclick="toggleStar('${s.id}',event)">${stars.has(s.id) ? '★' : '☆'}</button></div>
    ${s.chairs.length ? `<div class="small" style="margin-top:8px"><span class="muted">Moderators:</span> ${s.chairs.map(c => c.pid ? `<a href="#/person/${c.pid}">${esc(c.name)}</a>` : esc(c.name)).join(', ')}</div>` : ''}
    ${s.desc ? `<details><summary>About this session</summary><div class="abs small">${esc(s.desc)}</div></details>` : ''}
  </div>`;
  const kwTop = Object.entries(s.kwCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
  if (kwTop.length) html += `<div class="chips scroll">${kwTop.map(([k, n]) => `<span class="chip tap" onclick="nav('/keyword/${k}')">${esc(KEYWORDS[k][0])} <span class="muted">${n}</span></span>`).join('')}</div>`;
  const items = s.items.map(i => P[i]);
  html += `<div class="card"><div class="section-hd"><h3>${s.type === 'Poster' ? 'Posters (board number)' : 'Talks'} · ${items.filter(p => !p.aux).length}</h3><button class="btn sm sec" onclick="starAll('${s.id}')">★ all</button></div>` + items.map(p => talkRow(p)).join('') + `</div>`;
  if (sameSlot.length) html += `<h3>Also at ${fmtT(s.start)} (${sameSlot.length})</h3>` + sameSlot.map(x => sessionCard(x)).join('');
  return { html, title: s.id + ' · ' + s.title, sub: DAY_NAMES[s.date] + ' ' + fmtT(s.start) + ' · ' + s.room, tab: 'program' };
};
window.starAll = id => { S[id].items.forEach(i => { if (!P[i].aux) stars.add(i); }); store.set('stars', [...stars]); toast('All talks added to My Plan'); render(); };

/* ---------- PRESENTATION detail ---------- */
routes.pres = seg => {
  const p = P[seg[0]]; if (!p) return { html: '<div class="empty">Presentation not found</div>', title: 'Presentation' };
  const s = p.sess; const st = statusOf(p.date, p.start, p.end);
  const authors = p.authors.map(a => `<span class="${a.p ? 'p' : ''}">${a.pid ? `<a href="#/person/${a.pid}" style="color:inherit">${esc(a.n)}</a>` : esc(a.n)}${a.p ? '*' : ''}<sup>${a.a.map(x => x + 1).join(',')}</sup></span>`).join(', ');
  const affs = p.affs.map((a, i) => `<div><sup>${i + 1}</sup> <a href="#/inst/${encodeURIComponent(a.inst)}">${esc(a.inst)}</a>${a.dept ? ' — ' + esc(a.dept) : ''}${a.city ? ', ' + esc(a.city) : ''}${a.region ? ', ' + esc(a.region) : ''}${a.country ? ', ' + flag(a.country) + ' ' + esc(a.country) : ''}</div>`).join('');
  // related: shared keywords, other sessions
  const rel = D.presentations.filter(x => x.id !== p.id && !x.aux && x.kws.some(k => p.kws.includes(k))).map(x => ({ x, n: x.kws.filter(k => p.kws.includes(k)).length + (x.session === p.session ? 0 : 0.5) + (x.sess.subfield === s.subfield ? 1 : 0) })).sort((a, b) => b.n - a.n).slice(0, 6);
  let html = `<div class="card stripe ${p.area}">
    <div class="code muted small">${p.id} · <a href="#/session/${s.id}">${esc(s.id)} ${esc(s.title)}</a></div>
    <div style="font-size:17px;font-weight:700;margin:4px 0">${p.invited ? '<span class="badge inv">invited</span> ' : ''}${p.withdrawn ? '<span class="badge wd">withdrawn</span> ' : ''}${esc(p.title)}</div>
    <div class="row"><div class="grow"><div><b>${DAY_LONG[p.date]}</b> · ${fmtT(p.start)}–${fmtT(p.end)} ${st === 'now' ? '<span class="badge now">now</span>' : ''}</div>
      <div><a href="#/room/${encodeURIComponent(p.room)}">📍 ${esc(p.room)}${p.level ? ' · Level ' + p.level : ''}</a>${p.board ? ' · Board <b>' + esc(p.board) + '</b>' : ''}</div>
      <div class="chips">${areaChip(p.area)}<span class="chip">${TYPE_ICON[s.type] || ''} ${esc(s.type)}</span><span class="chip tap" onclick="nav('/topic/${s.area}/${encodeURIComponent(s.subfield)}')">🧭 ${esc(s.subfield)}</span></div></div>
      ${p.aux ? '' : `<button class="star ${stars.has(p.id) ? 'on' : ''}" style="font-size:28px" onclick="toggleStar('${p.id}',event)">${stars.has(p.id) ? '★' : '☆'}</button>`}</div>
  </div>`;
  if (p.authors.length) html += `<div class="card"><h3>Authors</h3><div class="authors">${authors}</div><div class="affs" style="margin-top:6px">${affs}</div><div class="tiny muted" style="margin-top:4px">* presenting author</div></div>`;
  if (p.kws.length) html += `<div class="chips scroll">${p.kws.map(k => `<span class="chip tap" onclick="nav('/keyword/${k}')">${esc(KEYWORDS[k][0])}</span>`).join('')}</div>`;
  if (p.abstract) html += `<div class="card"><h3>Abstract</h3><div class="abs">${esc(p.abstract)}</div>${p.abstractSrc ? `<div class="tiny muted" style="margin-top:6px">Source: <a href="${p.abstractSrc}" target="_blank" rel="noopener">${p.abstractSrc}</a></div>` : ''}${p.ack ? `<details><summary>Acknowledgments</summary><div class="abs small muted">${esc(p.ack)}</div></details>` : ''}</div>`;
  else if (!p.aux) html += `<div class="card muted small">No abstract was published for this item.</div>`;
  if (rel.length) html += `<div class="card"><h3>Related presentations</h3>${rel.map(r => talkRow(r.x, { showSession: true })).join('')}</div>`;
  return { html, title: p.id, sub: s.title, tab: 'program' };
};

/* ---------- SEARCH ---------- */
routes.search = (seg, q) => {
  const query = (q.q || '').trim(); const fDay = q.day || '', fType = q.type || '', fArea = q.area || '';
  const mk = (o) => { const u = new URLSearchParams(); const all = { q: query, day: fDay, type: fType, area: fArea, ...o }; Object.entries(all).forEach(([k, v]) => { if (v) u.set(k, v); }); return '/search?' + u.toString(); };
  let html = `<input id="q" type="search" placeholder="Search titles, abstracts, authors, institutions…" value="${esc(query)}" autocomplete="off">
  <div class="chips scroll" style="margin-top:8px">${['', ...DAYS.slice(1)].map(d => `<span class="chip tap ${fDay === d ? 'sel' : ''}" onclick="nav('${mk({ day: d })}')">${d ? DAY_NAMES[d] : 'Any day'}</span>`).join('')}<span class="chip" style="opacity:.4">|</span>${['', 'Oral', 'Poster', 'Special', 'Plenary'].map(t => `<span class="chip tap ${fType === t ? 'sel' : ''}" onclick="nav('${mk({ type: t })}')">${t || 'Any format'}</span>`).join('')}<span class="chip" style="opacity:.4">|</span>${['', 'E', 'L', 'M', 'J'].map(a => `<span class="chip tap ${fArea === a ? 'sel' : ''}" onclick="nav('${mk({ area: a })}')">${a ? AREA_NAME[a] : 'Any area'}</span>`).join('')}</div>`;
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const filt = x => (!fDay || x.date === fDay) && (!fType || x.sess.type === fType) && (!fArea || x.area === fArea || (fArea === 'L' && x.area === 'LM'));
  if (words.length) {
    const t0 = performance.now();
    const scored = [];
    D.presentations.forEach(p => {
      if (p.aux || !filt(p)) return;
      let sc = 0;
      for (const w of words) { if (!p.text.includes(w)) return; const tl = p.title.toLowerCase(); sc += tl.includes(w) ? 5 : 1; if (p.authors.some(a => a.n.toLowerCase().includes(w))) sc += 3; }
      if (p.invited) sc += 0.5;
      scored.push({ p, sc });
    });
    scored.sort((a, b) => b.sc - a.sc);
    const sess = D.sessions.filter(s => words.every(w => s.text.includes(w)) && (!fDay || s.date === fDay) && (!fType || s.type === fType) && (!fArea || s.area === fArea));
    const ppl = D.people.filter(pp => words.every(w => pp.text.includes(w))).slice(0, 8);
    const insts = D.institutions.filter(i => words.every(w => i.name.toLowerCase().includes(w))).slice(0, 5);
    html += `<div class="muted small" style="margin:6px 0">${scored.length} presentations · ${sess.length} sessions · ${ppl.length ? ppl.length + '+ people' : 'no people'} · ${Math.round(performance.now() - t0)} ms</div>`;
    if (ppl.length) html += `<h3>People</h3><div class="chips">${ppl.map(pp => `<span class="chip tap" onclick="nav('/person/${pp.id}')">👤 ${esc(pp.name)}</span>`).join('')}</div>`;
    if (insts.length) html += `<div class="chips">${insts.map(i => `<span class="chip tap" onclick="nav('/inst/${encodeURIComponent(i.name)}')">🏛️ ${esc(i.name)} <span class="muted">${i.count}</span></span>`).join('')}</div>`;
    if (sess.length) html += `<h3>Sessions</h3>` + sess.slice(0, 10).map(s => sessionCard(s, { showDay: true })).join('') + (sess.length > 10 ? `<div class="muted small">+${sess.length - 10} more sessions</div>` : '');
    if (scored.length) html += `<h3>Presentations</h3><div class="card">` + scored.slice(0, 60).map(({ p }) => talkRow(p, { showSession: true })).join('') + (scored.length > 60 ? `<div class="muted small" style="padding:8px 0">Showing 60 of ${scored.length}. Refine your search.</div>` : '') + `</div>`;
    if (!scored.length && !sess.length && !ppl.length) html += `<div class="empty">No matches. Try fewer words, or a material name like REBCO, Nb3Sn, TES…</div>`;
  } else {
    html += `<h3>Browse by keyword</h3><div>${KW_COUNT.slice().sort((a, b) => b.n - a.n).map(k => `<span class="kw" onclick="nav('/keyword/${k.i}')">${esc(k.name)}<span class="n">${k.n}</span></span>`).join('')}</div>
    <h3>Try</h3><div class="chips">${['no-insulation', 'quench detection', 'Nb3Sn cable', 'TES x-ray', 'SNSPD', 'fusion magnet HTS', 'qubit', 'flux pump', 'electric aircraft', 'AC loss', 'Bi-2212', 'MgB2', 'SQUID', 'levitation'].map(t => `<span class="chip tap" onclick="nav('${mk({ q: t })}')">${t}</span>`).join('')}</div>`;
  }
  return { html, title: 'Search', root: true, tab: 'search', keepScroll: !!words.length, after: () => { const inp = $('#q'); let tm; inp.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(() => { const u = new URLSearchParams(location.hash.split('?')[1] || ''); u.set('q', inp.value); history.replaceState(null, '', '#' + mk({ q: inp.value })); render(); const i2 = $('#q'); i2.focus(); i2.setSelectionRange(i2.value.length, i2.value.length); }, 220); }); if (!words.length) inp.focus(); } };
};
routes.keyword = seg => {
  const k = +seg[0]; const kw = KEYWORDS[k]; if (!kw) return { html: '', title: 'Keyword' };
  const list = D.presentations.filter(p => p.kws.includes(k) && !p.aux);
  const byDay = {}; list.forEach(p => (byDay[p.date] = byDay[p.date] || []).push(p));
  const sessCount = {}; list.forEach(p => sessCount[p.session] = (sessCount[p.session] || 0) + 1);
  const topSess = Object.entries(sessCount).sort((a, b) => b[1] - a[1]).slice(0, 8);
  let html = `<div class="card"><div class="title">${esc(kw[0])}</div><div class="muted small">${list.length} presentations mention this topic · ${Object.keys(sessCount).length} sessions</div></div>`;
  html += `<h3>Sessions with the most matches</h3>` + topSess.map(([sid, n]) => sessionCard(S[sid], { showDay: true, extra: `<div class="score">${n} matching ${n > 1 ? 'talks' : 'talk'}</div>` })).join('');
  DAYS.forEach(d => { if (!byDay[d]) return; html += `<h3>${DAY_LONG[d]} · ${byDay[d].length}</h3><div class="card">` + byDay[d].sort((a, b) => toMin(a.start) - toMin(b.start)).map(p => talkRow(p, { showSession: true })).join('') + `</div>`; });
  return { html, title: kw[0], sub: list.length + ' presentations', tab: 'search' };
};

/* ---------- PEOPLE ---------- */
routes.people = (seg, q) => {
  const query = (q.q || '').trim().toLowerCase(); const mode = q.mode || 'rank';
  let list = PEOPLE_RANKED;
  if (query) { const ws = query.split(/\s+/); list = D.people.filter(pp => ws.every(w => pp.text.includes(w))); }
  if (mode === 'az') list = list.slice().sort((a, b) => a.name.split(' ').pop().localeCompare(b.name.split(' ').pop()));
  if (mode === 'chairs') list = list.filter(pp => pp.chairs && pp.chairs.length);
  if (mode === 'invited') list = list.filter(pp => pp.invited);
  const html = `<input id="pq" type="search" placeholder="Search ${D.people.length} authors, chairs, institutions…" value="${esc(q.q || '')}" autocomplete="off">
  <div class="seg">${[['rank', 'Prominence'], ['az', 'A–Z'], ['invited', 'Invited'], ['chairs', 'Moderators']].map(([m, l]) => `<button class="${mode === m ? 'active' : ''}" onclick="nav('/people?mode=${m}&q=${encodeURIComponent(q.q || '')}')">${l}</button>`).join('')}</div>
  <div class="muted small">${list.length} people${mode === 'rank' ? ' · ranked by IEEE TASC output, presentations, roles' : ''}</div>
  ${list.slice(0, 80).map(pp => personCard(pp)).join('')}${list.length > 80 ? `<div class="muted small" style="text-align:center;margin:8px">Showing 80 of ${list.length}. Search to narrow.</div>` : ''}`;
  return { html, title: 'People', root: true, tab: 'people', keepScroll: !!query, after: () => { const inp = $('#pq'); let tm; inp.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(() => { history.replaceState(null, '', '#/people?mode=' + mode + '&q=' + encodeURIComponent(inp.value)); render(); const i2 = $('#pq'); i2.focus(); i2.setSelectionRange(i2.value.length, i2.value.length); }, 220); }); } };
};
routes.person = seg => {
  const pp = PEOPLE[seg[0]]; if (!pp) return { html: '<div class="empty">Person not found</div>', title: 'Person' };
  const pres = pp.pres.map(id => P[id]).sort((a, b) => a.date.localeCompare(b.date) || toMin(a.start) - toMin(b.start));
  const presenting = pres.filter(p => p.authors.some(a => a.pid === pp.id && a.p));
  const coauth = {}; pres.forEach(p => p.authors.forEach(a => { if (a.pid && a.pid !== pp.id) coauth[a.pid] = (coauth[a.pid] || 0) + 1; }));
  const co = Object.entries(coauth).sort((a, b) => b[1] - a[1]).slice(0, 12);
  const kws = {}; pres.forEach(p => p.kws.forEach(k => kws[k] = (kws[k] || 0) + 1));
  const kwTop = Object.entries(kws).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const c = pp.countries[0];
  let html = `<div class="card"><div class="row" style="align-items:flex-start">${avatar(pp, 'lg')}<div class="grow">
    <div style="font-size:19px;font-weight:700">${esc(pp.name)}</div>
    ${pp.plenary ? '<span class="badge pl">plenary speaker</span>' : ''}${pp.invited ? '<span class="badge inv">invited speaker</span>' : ''}
    <div class="small" style="margin-top:6px">${pp.insts.map(i => `<a href="#/inst/${encodeURIComponent(i)}">${esc(i)}</a>`).join(' · ')}</div>
    ${c ? `<div class="small muted">${flag(c)} ${pp.countries.map(esc).join(', ')}</div>` : ''}
    ${pp.titles && pp.titles.length ? `<div class="small muted" style="margin-top:4px">${pp.titles.map(esc).join('<br>')}</div>` : ''}
    <div class="chips" style="margin-top:6px"><span class="chip">${pres.length} presentation${pres.length === 1 ? '' : 's'}</span>${presenting.length ? `<span class="chip">🎤 presenting ${presenting.length}</span>` : ''}${pp.chairs && pp.chairs.length ? `<span class="chip">🪑 moderating ${pp.chairs.length}</span>` : ''}</div>
    <div style="margin-top:8px"><button class="btn sm ${prefs.people.includes(pp.id) ? '' : 'sec'}" onclick="followPerson('${pp.id}')">${prefs.people.includes(pp.id) ? '✓ Following' : '+ Follow for Schedule Builder'}</button></div>
    </div></div>
    ${pp.photoCredit ? `<div class="tiny muted" style="margin-top:6px">Photo: ${pp.photoUrl ? `<a href="${pp.photoUrl}" target="_blank" rel="noopener">${esc(pp.photoCredit)}</a>` : esc(pp.photoCredit)}</div>` : ''}
  </div>`;
  if (pp.bio) html += `<div class="card"><h3>Biography</h3><div class="abs small">${esc(pp.bio)}</div></div>`;
  if (pp.wiki && pp.wiki.extract) html += `<div class="card"><h3>From Wikipedia</h3><div class="small">${esc(pp.wiki.extract)}</div><div class="tiny"><a href="${pp.wiki.url}" target="_blank" rel="noopener">${esc(pp.wiki.title)} — Wikipedia</a></div></div>`;
  if (pp.tasc) {
    html += `<div class="card"><h3>IEEE Transactions on Applied Superconductivity</h3><div class="row"><div class="stat grow"><div class="n">≈${pp.tasc.n}</div><div class="l">papers matching this name (Crossref)</div></div></div>`;
    if (pp.tasc.recent && pp.tasc.recent.length) html += `<div class="small muted" style="margin-top:8px">Recent:</div>` + pp.tasc.recent.map(r => `<div class="small" style="padding:4px 0;border-top:1px solid var(--line)"><a href="https://doi.org/${esc(r.doi)}" target="_blank" rel="noopener">${esc(r.t)}</a> <span class="muted">(${r.y || ''})</span></div>`).join('');
    html += `<div class="tiny muted" style="margin-top:6px">Name-based match; common names may include other authors.</div></div>`;
  }
  if (presenting.length) html += `<div class="card"><h3>Where to find them · presenting</h3>` + presenting.map(p => talkRow(p, { showSession: true })).join('') + `</div>`;
  if (pp.chairs && pp.chairs.length) html += `<h3>Moderating</h3>` + pp.chairs.map(id => sessionCard(S[id], { showDay: true })).join('');
  const coAuthored = pres.filter(p => !presenting.includes(p));
  if (coAuthored.length) html += `<div class="card"><h3>Co-authored (${coAuthored.length})</h3>` + coAuthored.map(p => talkRow(p, { showSession: true })).join('') + `</div>`;
  if (kwTop.length) html += `<h3>Topics</h3><div class="chips">${kwTop.map(([k, n]) => `<span class="chip tap" onclick="nav('/keyword/${k}')">${esc(KEYWORDS[k][0])} <span class="muted">${n}</span></span>`).join('')}</div>`;
  if (co.length) html += `<h3>Frequent co-authors</h3><div class="chips">${co.map(([id, n]) => `<span class="chip tap" onclick="nav('/person/${id}')">${esc(PEOPLE[id].name)} <span class="muted">${n}</span></span>`).join('')}</div>`;
  html += `<div class="tiny muted" style="margin:14px 0"><a href="https://scholar.google.com/scholar?q=${encodeURIComponent('"' + pp.name + '" superconduct')}" target="_blank" rel="noopener">Search Google Scholar ↗</a></div>`;
  return { html, title: pp.name, sub: pp.insts[0] || '', tab: 'people' };
};
window.followPerson = id => { const i = prefs.people.indexOf(id); if (i >= 0) prefs.people.splice(i, 1); else prefs.people.push(id); store.set('prefs', prefs); toast(i >= 0 ? 'Unfollowed' : 'Following — used by the Schedule Builder'); render(); };

/* ---------- INSTITUTION / COUNTRY / ROOM / TOPIC pages ---------- */
routes.inst = seg => {
  const name = seg[0]; const i = INST[name]; const pres = (INST_PRES[name] || []).map(id => P[id]);
  const ppl = (INST_PEOPLE[name] || []).map(id => PEOPLE[id]).sort((a, b) => b.score - a.score);
  const byDay = {}; pres.forEach(p => (byDay[p.date] = byDay[p.date] || []).push(p));
  let html = `<div class="card"><div style="font-size:18px;font-weight:700">${esc(name)}</div><div class="muted small">${i ? flag(i.country) + ' ' + esc(i.country) + ' · ' : ''}${pres.length} presentations · ${ppl.length} people</div></div>`;
  if (ppl.length) html += `<h3>People</h3><div class="chips">${ppl.slice(0, 40).map(pp => `<span class="chip tap" onclick="nav('/person/${pp.id}')">${esc(pp.name)}</span>`).join('')}${ppl.length > 40 ? `<span class="chip muted">+${ppl.length - 40}</span>` : ''}</div>`;
  DAYS.forEach(d => { if (!byDay[d]) return; html += `<h3>${DAY_LONG[d]}</h3><div class="card">` + byDay[d].sort((a, b) => toMin(a.start) - toMin(b.start)).map(p => talkRow(p, { showSession: true })).join('') + `</div>`; });
  return { html, title: name, tab: 'explore' };
};
routes.country = seg => {
  const name = seg[0]; const pres = (COUNTRY_PRES[name] || []).map(id => P[id]);
  const instC = {}; pres.forEach(p => { const seen = new Set(); p.affs.forEach(a => { if (a.country === name && !seen.has(a.inst)) { seen.add(a.inst); instC[a.inst] = (instC[a.inst] || 0) + 1; } }); });
  const insts = Object.entries(instC).sort((a, b) => b[1] - a[1]);
  const areaC = {}; pres.forEach(p => areaC[p.area] = (areaC[p.area] || 0) + 1);
  const ppl = D.people.filter(pp => pp.countries[0] === name).sort((a, b) => b.score - a.score).slice(0, 30);
  let html = `<div class="card"><div style="font-size:22px;font-weight:700">${flag(name)} ${esc(name)}</div><div class="muted small">${pres.length} presentations · ${insts.length} institutions</div>
  <div class="chips" style="margin-top:6px">${AREA_ORDER.filter(a => areaC[a]).map(a => `<span class="chip"><span class="area ${a}"></span>${AREA_NAME[a]} ${areaC[a]}</span>`).join('')}</div></div>`;
  html += `<h3>Institutions</h3>` + bars(insts.slice(0, 25).map(([n, c]) => ({ label: n, n: c, href: '/inst/' + encodeURIComponent(n) })));
  if (ppl.length) html += `<h3>Prominent people</h3>` + ppl.slice(0, 12).map(pp => personCard(pp)).join('');
  return { html, title: name, tab: 'explore' };
};
routes.room = seg => {
  const name = seg[0]; const r = ROOMS[name]; if (!r) return { html: '<div class="empty">Room not found</div>', title: 'Room' };
  const n = nowET(); const byDay = {};
  r.sessions.forEach(id => (byDay[S[id].date] = byDay[S[id].date] || []).push(S[id]));
  D.events.filter(e => e.room === name).forEach(e => (byDay[e.date] = byDay[e.date] || []).push(e));
  let html = `<div class="card"><div style="font-size:18px;font-weight:700">📍 ${esc(name)}</div><div class="muted small">${r.level ? 'Level ' + r.level + ' · ' : ''}David L. Lawrence Convention Center · ${r.sessions.length} sessions</div>${levelHint(r.level)}</div>`;
  DAYS.forEach(d => { if (!byDay[d]) return; const items = byDay[d].sort((a, b) => toMin(a.start) - toMin(b.start)); html += `<h3>${DAY_LONG[d]}${d === n.date ? ' · today' : ''}</h3><div class="tl">` + items.map(x => { const st = statusOf(x.date, x.start, x.end); return x.items ? `<div class="it ${st}"><a href="#/session/${x.id}"><b>${fmtT(x.start)}–${fmtT(x.end)}</b> <span class="tx-${x.area}">${x.id}</span> ${esc(x.title)}</a></div>` : `<div class="it ${st}"><b>${fmtT(x.start)}–${fmtT(x.end)}</b> <span class="muted">${esc(x.title)}</span></div>`; }).join('') + `</div>`; });
  return { html, title: name, tab: 'explore' };
};
function levelHint(l) { return { 2: '<div class="small muted" style="margin-top:4px">Level 2 holds the Exhibit Hall (posters, exhibits, coffee) — escalators down from the Level 3 ballroom lobby.</div>', 3: '<div class="small muted" style="margin-top:4px">Level 3: Ballrooms A/B and rooms 301–319, around the Ballroom Gallery (coffee breaks).</div>', 4: '<div class="small muted" style="margin-top:4px">Level 4: rooms 401–415 and the Rooftop Terrace.</div>' }[l] || ''; }
routes.topic = seg => {
  const area = seg[0], name = seg[1]; const sf = SUBF[area + '|' + name]; if (!sf) return { html: '<div class="empty">Topic not found</div>', title: 'Topic' };
  const sess = sf.sessions.map(id => S[id]).sort((a, b) => a.date.localeCompare(b.date) || toMin(a.start) - toMin(b.start));
  const nTalks = sess.reduce((n, s) => n + s.items.filter(i => !P[i].aux).length, 0);
  const kws = {}; sess.forEach(s => Object.entries(s.kwCount).forEach(([k, n]) => kws[k] = (kws[k] || 0) + n));
  const kwTop = Object.entries(kws).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const on = prefs.subfields.includes(area + '|' + name);
  let html = `<div class="card stripe ${area}"><div style="font-size:18px;font-weight:700">${esc(name)}</div><div class="muted small">${AREA_NAME[area]} · ${sess.length} sessions · ${nTalks} presentations</div>
    <div style="margin-top:8px"><button class="btn sm ${on ? '' : 'sec'}" onclick="togglePrefSub('${area}|${esc(name).replace(/'/g, "\\'")}')">${on ? '✓ In my interests' : '+ Add to my interests'}</button></div></div>`;
  if (kwTop.length) html += `<div class="chips scroll">${kwTop.map(([k, n]) => `<span class="chip tap" onclick="nav('/keyword/${k}')">${esc(KEYWORDS[k][0])} <span class="muted">${n}</span></span>`).join('')}</div>`;
  let lastDay = '';
  sess.forEach(s => { if (s.date !== lastDay) { lastDay = s.date; html += `<h3>${DAY_LONG[s.date]}</h3>`; } html += sessionCard(s); });
  return { html, title: name, sub: AREA_NAME[area], tab: 'explore' };
};
window.togglePrefSub = key => { const i = prefs.subfields.indexOf(key); if (i >= 0) prefs.subfields.splice(i, 1); else prefs.subfields.push(key); store.set('prefs', prefs); render(); };
function bars(items, color) {
  const max = Math.max(...items.map(i => i.n), 1);
  return `<div class="card">` + items.map(i => `<div class="bar" onclick="nav('${i.href}')"><div class="lab">${i.flag ? i.flag + ' ' : ''}${esc(i.label)}</div><div class="trk"><div class="fil" style="width:${Math.round(100 * i.n / max)}%;${color ? 'background:' + color : ''}"></div></div><div class="n">${i.n}</div></div>`).join('') + `</div>`;
}

/* ---------- EXPLORE ---------- */
routes.explore = seg => {
  const sub = seg[0] || 'topics';
  const tabs = [['topics', '🧭 Topics'], ['people', '🤝 Who to meet'], ['institutions', '🏛️ Institutions'], ['countries', '🌍 Countries'], ['rooms', '🗺️ Rooms'], ['network', '🕸️ Network'], ['stats', '📊 Stats']];
  let html = `<div class="subtabs">${tabs.map(([k, l]) => `<button class="${sub === k ? 'active' : ''}" onclick="nav('/explore/${k}')">${l}</button>`).join('')}</div>`;
  let after = null;
  if (sub === 'topics') {
    const groups = {}; D.subfields.forEach(sf => { const n = sf.sessions.reduce((a, id) => a + S[id].items.filter(i => !P[i].aux).length, 0); (groups[sf.area] = groups[sf.area] || []).push({ sf, n }); });
    html += `<div class="card"><div class="title">Program topic map</div><div class="muted small">Area → subfield, sized by number of presentations. Tap a tile.</div>${treemap(groups)}<div class="legend">${AREA_ORDER.filter(a => groups[a]).map(a => `<span><span class="area ${a}"></span>${AREA_NAME[a]}</span>`).join('')}</div></div>`;
    AREA_ORDER.filter(a => groups[a]).forEach(a => {
      html += `<h3><span class="area ${a}"></span>${AREA_NAME[a]} · ${groups[a].length} subfields</h3><div class="card">` + groups[a].sort((x, y) => y.n - x.n).map(({ sf, n }) => `<div class="bar" onclick="nav('/topic/${a}/${encodeURIComponent(sf.name)}')"><div class="lab">${esc(sf.name)}</div><div class="trk"><div class="fil bg-${a}" style="width:${Math.round(100 * n / Math.max(...groups[a].map(g => g.n)))}%"></div></div><div class="n">${n}</div></div>`).join('') + `</div>`;
    });
  } else if (sub === 'people') {
    const withTasc = PEOPLE_RANKED.filter(pp => pp.tasc && pp.tasc.n >= 5).sort((a, b) => b.tasc.n - a.tasc.n);
    html += `<div class="card"><div class="title">Who to meet</div><div class="small muted">Authors attending ASC 2026 ranked by their approximate number of papers in <i>IEEE Transactions on Applied Superconductivity</i> (Crossref name match). Tap a person to see exactly when and where they present, so you can find them for a question or a conversation.</div></div>`;
    html += `<h3>Plenary speakers</h3><div class="chips scroll">${D.plenary.filter(p => p.pid).map(p => `<span class="chip tap" onclick="nav('/person/${p.pid}')">${PEOPLE[p.pid] && PEOPLE[p.pid].photo ? `<img src="${PEOPLE[p.pid].photo}" style="width:22px;height:22px;border-radius:50%;object-fit:cover">` : '⭐'} ${esc(p.name)}</span>`).join('')}</div>`;
    html += `<h3>Most published in TASC</h3>` + withTasc.slice(0, 60).map(pp => { const nxt = pp.presentingIds.map(id => P[id]).filter(p => statusOf(p.date, p.start, p.end) !== 'past').sort((a, b) => a.date.localeCompare(b.date) || toMin(a.start) - toMin(b.start))[0]; return personCard(pp, nxt ? `<div class="tiny" style="margin-top:3px;color:#9fc0ff">Next: ${DAY_NAMES[nxt.date]} ${fmtT(nxt.start)} · ${esc(nxt.room)}${nxt.board ? ' #' + esc(nxt.board) : ''}</div>` : ''); }).join('');
  } else if (sub === 'institutions') {
    const byC = {}; D.institutions.forEach(i => (byC[i.country] = byC[i.country] || []).push(i));
    html += `<div class="card"><div class="title">${D.institutions.length} institutions</div><div class="muted small">Ranked by number of presentations with at least one author from the institution.</div></div>` + bars(D.institutions.slice(0, 50).map(i => ({ label: i.name, n: i.count, href: '/inst/' + encodeURIComponent(i.name), flag: flag(i.country) })));
    html += `<h3>Companies & industry</h3>` + bars(D.institutions.filter(i => /\b(Inc|Ltd|LLC|GmbH|Co\.|Corp|Company|Technologies|Industries|Fujikura|Bruker|SuperPower|Faraday|Furukawa|SuNAM|Shanghai Superconductor|Northrop|Commonwealth Fusion|Tokamak Energy|Proxima|Sumitomo|Toshiba|Hitachi|Mitsubishi|Siemens|Nexans|Kiswire|THEVA|Fusion|Energy|Systems|Solutions)\b/i.test(i.name) && !/University|Institute|Laboratory|National|Academy|College/i.test(i.name)).slice(0, 40).map(i => ({ label: i.name, n: i.count, href: '/inst/' + encodeURIComponent(i.name), flag: flag(i.country) })), 'var(--LM)');
  } else if (sub === 'countries') {
    const total = D.countries.reduce((a, c) => a + c.count, 0);
    html += `<div class="card"><div class="title">${D.countries.length} countries</div><div class="muted small">Presentations with at least one author affiliation in the country (a talk with authors from two countries counts for both).</div>${donut(D.countries.slice(0, 8).map((c, i) => ({ label: c.name, n: c.count, color: ['#4da3ff', '#ff9f43', '#3ddc97', '#c084fc', '#f5c542', '#ff5c7a', '#7dd3fc', '#a3e635'][i] })), total)}</div>`;
    html += bars(D.countries.map(c => ({ label: c.name, n: c.count, href: '/country/' + encodeURIComponent(c.name), flag: flag(c.name) })));
  } else if (sub === 'rooms') {
    const n = nowET();
    html += `<div class="card"><div class="title">David L. Lawrence Convention Center</div><div class="muted small">Schematic — rooms grouped by level, not to scale. Tap a room for its full schedule. Rooms in green are in session right now.</div>${roomMap(n)}</div>`;
    [4, 3, 2].forEach(l => {
      const rooms = Object.values(ROOMS).filter(r => r.level === l).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
      if (!rooms.length) return;
      html += `<h3>Level ${l}</h3><div class="card">` + rooms.map(r => { const live = r.sessions.map(id => S[id]).find(s => statusOf(s.date, s.start, s.end) === 'now'); const nxt = r.sessions.map(id => S[id]).filter(s => s.date === n.date && toMin(s.start) > n.min).sort((a, b) => toMin(a.start) - toMin(b.start))[0]; return `<div class="bar" onclick="nav('/room/${encodeURIComponent(r.name)}')"><div class="lab" style="flex-basis:40%">📍 ${esc(r.name)}</div><div class="grow small muted" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${live ? '<span class="badge now">now</span> ' + esc(live.id + ' ' + live.title) : (nxt ? 'Next ' + fmtT(nxt.start) + ': ' + esc(nxt.id + ' ' + nxt.title) : r.sessions.length + ' sessions')}</div></div>`; }).join('') + `</div>`;
    });
  } else if (sub === 'network') {
    html += `<div class="card"><div class="title">Collaboration web</div><div class="muted small">Co-authorship among the 90 most connected authors at ASC 2026. Node size = presentations, edge weight = shared papers, colour = home area. Drag to pan, pinch/scroll to zoom, tap a node.</div></div><canvas class="net" id="net"></canvas><div id="netinfo" class="card muted small">Tap a node to see who it is.</div>`;
    after = () => initNetwork();
  } else if (sub === 'stats') {
    const pr = D.presentations.filter(p => !p.aux);
    const byDay = {}, byType = {}, byArea = {}; pr.forEach(p => { byDay[p.date] = (byDay[p.date] || 0) + 1; byType[p.sess.type] = (byType[p.sess.type] || 0) + 1; byArea[p.area] = (byArea[p.area] || 0) + 1; });
    const nAuthors = D.people.length, nInv = pr.filter(p => p.invited && p.sess.type !== 'Plenary').length;
    const authorsPer = pr.reduce((a, p) => a + p.authors.length, 0) / Math.max(1, pr.filter(p => p.authors.length).length);
    const multiCountry = pr.filter(p => new Set(p.affs.map(a => a.country)).size > 1).length;
    const posters = pr.filter(p => p.sess.type === 'Poster').length;
    html += `<div class="grid3"><div class="stat"><div class="n">${pr.length}</div><div class="l">presentations</div></div><div class="stat"><div class="n">${D.sessions.length}</div><div class="l">sessions</div></div><div class="stat"><div class="n">${nInv}</div><div class="l">invited talks</div></div>
      <div class="stat"><div class="n">${nAuthors}</div><div class="l">distinct authors</div></div><div class="stat"><div class="n">${authorsPer.toFixed(1)}</div><div class="l">authors / paper</div></div><div class="stat"><div class="n">${Math.round(100 * multiCountry / pr.length)}%</div><div class="l">multi-country papers</div></div>
      <div class="stat"><div class="n">${D.countries.length}</div><div class="l">countries</div></div><div class="stat"><div class="n">${D.institutions.length}</div><div class="l">institutions</div></div><div class="stat"><div class="n">${posters}</div><div class="l">posters</div></div></div>`;
    html += `<h3>By day</h3>` + bars(DAYS.filter(d => byDay[d]).map(d => ({ label: DAY_LONG[d], n: byDay[d], href: '/program/' + d })));
    html += `<h3>By area</h3>` + bars(AREA_ORDER.filter(a => byArea[a]).map(a => ({ label: AREA_NAME[a], n: byArea[a], href: '/program/2026-09-08?area=' + a })));
    html += `<h3>By format</h3>` + bars(Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([t, n]) => ({ label: t, n, href: '/program/2026-09-08?type=' + t })));
    html += `<h3>Most mentioned topics</h3>` + bars(KW_COUNT.slice().sort((a, b) => b.n - a.n).slice(0, 25).map(k => ({ label: k.name, n: k.n, href: '/keyword/' + k.i })), 'var(--M)');
    html += `<h3>Busiest rooms</h3>` + bars(Object.values(ROOMS).sort((a, b) => b.sessions.length - a.sessions.length).slice(0, 12).map(r => ({ label: r.name, n: r.sessions.length, href: '/room/' + encodeURIComponent(r.name) })), 'var(--J)');
  }
  return { html, title: 'Explore', root: true, tab: 'explore', after };
};
/* squarified treemap */
function squarify(items, x, y, w, h) {
  const total = items.reduce((a, i) => a + i.v, 0); if (!total) return [];
  const out = []; let rows = []; let X = x, Y = y, W = w, H = h;
  const worst = (row, len) => { const s = row.reduce((a, i) => a + i.v, 0); const mx = Math.max(...row.map(i => i.v)), mn = Math.min(...row.map(i => i.v)); return Math.max(len * len * mx / (s * s), s * s / (len * len * mn)); };
  const scale = w * h / total; const its = items.map(i => ({ ...i, v: i.v * scale })).sort((a, b) => b.v - a.v);
  const layout = row => { const s = row.reduce((a, i) => a + i.v, 0); if (W >= H) { const cw = s / H; let cy = Y; row.forEach(i => { const ch = i.v / cw; out.push({ ...i, x: X, y: cy, w: cw, h: ch }); cy += ch; }); X += cw; W -= cw; } else { const ch = s / W; let cx = X; row.forEach(i => { const cw = i.v / ch; out.push({ ...i, x: cx, y: Y, w: cw, h: ch }); cx += cw; }); Y += ch; H -= ch; } };
  its.forEach(i => { const len = Math.min(W, H); if (!rows.length || worst([...rows, i], len) <= worst(rows, len)) rows.push(i); else { layout(rows); rows = [i]; } });
  if (rows.length) layout(rows);
  return out;
}
function treemap(groups) {
  const W = 360, H = 300; const areas = AREA_ORDER.filter(a => groups[a]).map(a => ({ a, v: groups[a].reduce((s, g) => s + g.n, 0) }));
  const cols = { E: '#4da3ff', L: '#ff9f43', M: '#3ddc97', J: '#c084fc', LM: '#f5c542', PL: '#ff5c7a' };
  let svg = `<svg class="treemap" viewBox="0 0 ${W} ${H}" width="100%" style="margin-top:8px">`;
  squarify(areas, 0, 0, W, H).forEach(r => {
    const tiles = squarify(groups[r.a].map(g => ({ v: g.n, name: g.sf.name, a: r.a })), r.x + 1, r.y + 1, r.w - 2, r.h - 2);
    tiles.forEach(t => { const show = t.w > 46 && t.h > 16; const lab = t.name.length > t.w / 5.2 ? t.name.slice(0, Math.max(3, Math.floor(t.w / 5.2) - 1)) + '…' : t.name; svg += `<rect x="${t.x.toFixed(1)}" y="${t.y.toFixed(1)}" width="${t.w.toFixed(1)}" height="${t.h.toFixed(1)}" fill="${cols[r.a]}" fill-opacity="${0.55 + 0.45 * Math.min(1, t.v / 5000)}" onclick="nav('/topic/${r.a}/${encodeURIComponent(t.name).replace(/'/g, '%27')}')"><title>${esc(t.name)}</title></rect>${show ? `<text x="${(t.x + 3).toFixed(1)}" y="${(t.y + 12).toFixed(1)}" font-size="9">${esc(lab)}</text>` : ''}`; });
  });
  return svg + '</svg>';
}
function donut(items, total) {
  let a0 = -Math.PI / 2; const R = 60, r = 36; let paths = '';
  items.forEach(i => { const a1 = a0 + 2 * Math.PI * i.n / total; const big = a1 - a0 > Math.PI ? 1 : 0; const p = (a, rr) => `${(80 + rr * Math.cos(a)).toFixed(1)},${(80 + rr * Math.sin(a)).toFixed(1)}`; paths += `<path d="M${p(a0, R)} A${R},${R} 0 ${big} 1 ${p(a1, R)} L${p(a1, r)} A${r},${r} 0 ${big} 0 ${p(a0, r)} Z" fill="${i.color}"><title>${esc(i.label)} ${i.n}</title></path>`; a0 = a1; });
  const rest = total - items.reduce((a, i) => a + i.n, 0);
  if (rest > 0) { const a1 = a0 + 2 * Math.PI * rest / total; const big = a1 - a0 > Math.PI ? 1 : 0; const p = (a, rr) => `${(80 + rr * Math.cos(a)).toFixed(1)},${(80 + rr * Math.sin(a)).toFixed(1)}`; paths += `<path d="M${p(a0, R)} A${R},${R} 0 ${big} 1 ${p(a1, R)} L${p(a1, r)} A${r},${r} 0 ${big} 0 ${p(a0, r)} Z" fill="#3a4560"><title>Other ${rest}</title></path>`; }
  return `<div class="row" style="margin-top:8px"><svg viewBox="0 0 160 160" width="150" height="150">${paths}</svg><div class="small" style="flex:1">${items.map(i => `<div class="row" style="gap:6px;padding:2px 0"><span style="width:10px;height:10px;border-radius:3px;background:${i.color};display:inline-block"></span><span class="grow">${flag(i.label)} ${esc(i.label)}</span><span class="muted">${Math.round(100 * i.n / total)}%</span></div>`).join('')}${rest > 0 ? `<div class="row" style="gap:6px;padding:2px 0"><span style="width:10px;height:10px;border-radius:3px;background:#3a4560;display:inline-block"></span><span class="grow">Other (${D.countries.length - items.length})</span><span class="muted">${Math.round(100 * rest / total)}%</span></div>` : ''}</div></div>`;
}
function roomMap(n) {
  const levels = [4, 3, 2]; const W = 360; let y = 0; let svg = '';
  levels.forEach(l => {
    const rooms = Object.values(ROOMS).filter(r => r.level === l && !/Foyer|Gallery &/.test(r.name)).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    const cols = l === 2 ? 2 : 4; const bw = (W - 10) / cols - 6, bh = 34; const rowsN = Math.ceil(rooms.length / cols);
    svg += `<text x="4" y="${y + 12}" font-size="11" fill="#9aa7c0" font-weight="700">LEVEL ${l}</text>`;
    rooms.forEach((r, i) => { const cx = 5 + (i % cols) * (bw + 6), cy = y + 18 + Math.floor(i / cols) * (bh + 6); const live = r.sessions.map(id => S[id]).some(s => statusOf(s.date, s.start, s.end) === 'now'); const nm = r.name.replace(' - Level', '').replace('Exhibit Hall BC', 'Exhibit Hall B/C (posters)'); svg += `<rect x="${cx}" y="${cy}" width="${bw}" height="${bh}" rx="6" fill="${live ? '#1f6b46' : '#232d42'}" stroke="${live ? '#5df0a8' : '#2c3850'}" onclick="nav('/room/${encodeURIComponent(r.name).replace(/'/g, '%27')}')"></rect><text x="${cx + bw / 2}" y="${cy + 20}" font-size="${nm.length > 16 ? 8 : 10}" fill="#e8edf7" text-anchor="middle" style="pointer-events:none">${esc(nm.length > 26 ? nm.slice(0, 25) + '…' : nm)}</text>`; });
    y += 18 + rowsN * (bh + 6) + 10;
  });
  return `<svg class="roomsvg" viewBox="0 0 ${W} ${y}" width="100%" style="margin-top:8px">${svg}</svg>`;
}
/* co-authorship network (canvas, simple force layout) */
function initNetwork() {
  const cv = $('#net'); if (!cv) return; const ctx = cv.getContext('2d');
  const dpr = window.devicePixelRatio || 1; const Wc = cv.clientWidth, Hc = cv.clientHeight; cv.width = Wc * dpr; cv.height = Hc * dpr; ctx.scale(dpr, dpr);
  // pick top authors by degree
  const edges = {}; const deg = {};
  D.presentations.forEach(p => { const ids = [...new Set(p.authors.map(a => a.pid).filter(Boolean))]; for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) { const k = ids[i] < ids[j] ? ids[i] + '|' + ids[j] : ids[j] + '|' + ids[i]; edges[k] = (edges[k] || 0) + 1; deg[ids[i]] = (deg[ids[i]] || 0) + 1; deg[ids[j]] = (deg[ids[j]] || 0) + 1; } });
  const top = Object.entries(deg).sort((a, b) => b[1] - a[1]).slice(0, 90).map(e => e[0]); const set = new Set(top);
  const nodes = top.map((id, i) => { const pp = PEOPLE[id]; const ang = i * 2.4; const rad = 40 + i * 1.6; return { id, pp, x: Wc / 2 + rad * Math.cos(ang), y: Hc / 2 + rad * Math.sin(ang), vx: 0, vy: 0, r: 4 + Math.sqrt(pp.pres.length) * 1.6, area: mainArea(pp) }; });
  const idx = Object.fromEntries(nodes.map((n, i) => [n.id, i]));
  const links = Object.entries(edges).filter(([k]) => { const [a, b] = k.split('|'); return set.has(a) && set.has(b); }).map(([k, w]) => { const [a, b] = k.split('|'); return { a: idx[a], b: idx[b], w }; });
  const cols = { E: '#4da3ff', L: '#ff9f43', M: '#3ddc97', J: '#c084fc', LM: '#f5c542', PL: '#ff5c7a' };
  let scale = 1, tx = 0, ty = 0, sel = null;
  for (let it = 0; it < 260; it++) {
    const k = it < 200 ? 0.9 : 0.4;
    for (const n of nodes) { n.vx += (Wc / 2 - n.x) * 0.002; n.vy += (Hc / 2 - n.y) * 0.002; }
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) { const a = nodes[i], b = nodes[j]; let dx = b.x - a.x, dy = b.y - a.y; let d2 = dx * dx + dy * dy + 0.01; const d = Math.sqrt(d2); const f = 900 / d2; const fx = dx / d * f, fy = dy / d * f; a.vx -= fx; a.vy -= fy; b.vx += fx; b.vy += fy; }
    for (const l of links) { const a = nodes[l.a], b = nodes[l.b]; const dx = b.x - a.x, dy = b.y - a.y; const d = Math.sqrt(dx * dx + dy * dy) + 0.01; const f = (d - 40) * 0.01 * Math.min(3, l.w); a.vx += dx / d * f; a.vy += dy / d * f; b.vx -= dx / d * f; b.vy -= dy / d * f; }
    for (const n of nodes) { n.x += n.vx * k; n.y += n.vy * k; n.vx *= 0.6; n.vy *= 0.6; }
  }
  // fit
  const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y); const minx = Math.min(...xs), maxx = Math.max(...xs), miny = Math.min(...ys), maxy = Math.max(...ys);
  scale = Math.min((Wc - 30) / (maxx - minx + 1), (Hc - 30) / (maxy - miny + 1)); tx = Wc / 2 - scale * (minx + maxx) / 2; ty = Hc / 2 - scale * (miny + maxy) / 2;
  function draw() {
    ctx.clearRect(0, 0, Wc, Hc); ctx.save(); ctx.translate(tx, ty); ctx.scale(scale, scale);
    ctx.lineWidth = 1 / scale;
    for (const l of links) { const a = nodes[l.a], b = nodes[l.b]; const hi = sel != null && (l.a === sel || l.b === sel); ctx.strokeStyle = hi ? 'rgba(255,209,102,.9)' : 'rgba(150,170,210,' + Math.min(0.5, 0.08 + l.w * 0.07) + ')'; ctx.lineWidth = (hi ? 2 : Math.min(4, l.w)) / scale; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    nodes.forEach((n, i) => { ctx.beginPath(); ctx.arc(n.x, n.y, n.r / Math.sqrt(scale), 0, Math.PI * 2); ctx.fillStyle = cols[n.area] || '#9aa7c0'; ctx.fill(); if (i === sel) { ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 3 / scale; ctx.stroke(); } });
    ctx.font = `${11 / scale}px sans-serif`; ctx.fillStyle = '#e8edf7'; ctx.textAlign = 'center';
    nodes.forEach((n, i) => { if (n.r > 9 || i === sel || scale > 1.6) ctx.fillText(n.pp.name.split(' ').pop(), n.x, n.y - n.r / Math.sqrt(scale) - 3 / scale); });
    ctx.restore();
  }
  draw();
  let drag = null, moved = false, pinch = null;
  const pos = e => { const r = cv.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return { x: t.clientX - r.left, y: t.clientY - r.top }; };
  const down = e => { if (e.touches && e.touches.length === 2) { pinch = { d: Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY), s: scale }; return; } drag = pos(e); moved = false; };
  const move = e => { if (pinch && e.touches && e.touches.length === 2) { const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); const ns = Math.max(0.3, Math.min(6, pinch.s * d / pinch.d)); tx = Wc / 2 - (Wc / 2 - tx) * ns / scale; ty = Hc / 2 - (Hc / 2 - ty) * ns / scale; scale = ns; draw(); e.preventDefault(); return; } if (!drag) return; const p = pos(e); tx += p.x - drag.x; ty += p.y - drag.y; if (Math.abs(p.x - drag.x) + Math.abs(p.y - drag.y) > 2) moved = true; drag = p; draw(); if (e.cancelable) e.preventDefault(); };
  const up = e => { if (pinch) { pinch = null; return; } if (drag && !moved) { const p = drag; const wx = (p.x - tx) / scale, wy = (p.y - ty) / scale; let best = null, bd = 1e9; nodes.forEach((n, i) => { const d = Math.hypot(n.x - wx, n.y - wy); if (d < bd) { bd = d; best = i; } }); if (best != null && bd * scale < 22) { sel = best; const n = nodes[best]; const nb = links.filter(l => l.a === best || l.b === best).sort((x, y) => y.w - x.w).slice(0, 6).map(l => nodes[l.a === best ? l.b : l.a]); $('#netinfo').innerHTML = `<div class="row">${avatar(n.pp)}<div class="grow"><a href="#/person/${n.id}"><b>${esc(n.pp.name)}</b></a><div class="muted small">${esc(n.pp.insts[0] || '')} · ${n.pp.pres.length} presentations</div><div class="small">Co-authors here: ${nb.map(m => `<a href="#/person/${m.id}">${esc(m.pp.name.split(' ').pop())}</a>`).join(', ')}</div></div></div>`; draw(); } } drag = null; };
  cv.addEventListener('mousedown', down); cv.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
  cv.addEventListener('touchstart', down, { passive: true }); cv.addEventListener('touchmove', move, { passive: false }); cv.addEventListener('touchend', up);
  cv.addEventListener('wheel', e => { e.preventDefault(); const p = pos(e); const ns = Math.max(0.3, Math.min(6, scale * (e.deltaY < 0 ? 1.15 : 0.87))); tx = p.x - (p.x - tx) * ns / scale; ty = p.y - (p.y - ty) * ns / scale; scale = ns; draw(); }, { passive: false });
  window.__net = { nodes, links };
}
function mainArea(pp) { const c = {}; pp.pres.forEach(id => { const a = P[id].area; c[a] = (c[a] || 0) + 1; }); return Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0] || 'L'; }

/* ---------- MY PLAN / SCHEDULE BUILDER ---------- */
function scorePres(p) {
  let sc = 0; const why = [];
  const sfKey = p.sess.area + '|' + p.sess.subfield;
  if (prefs.subfields.includes(sfKey)) { sc += 3; why.push('topic'); }
  if (prefs.areas.includes(p.area)) { sc += 1; }
  const km = p.kws.filter(k => prefs.keywords.includes(k)).length; if (km) { sc += Math.min(6, km * 2); why.push(km + ' keyword' + (km > 1 ? 's' : '')); }
  const fp = p.authors.filter(a => a.pid && prefs.people.includes(a.pid)); if (fp.length) { sc += 5 + (fp.some(a => a.p) ? 2 : 0); why.push('followed: ' + fp.map(a => a.n.split(' ').pop()).join(', ')); }
  if (p.invited && sc > 0) { sc += 1.5; why.push('invited'); }
  if (p.sess.area === 'PL') { sc += 2; why.push('plenary'); }
  if (stars.has(p.id)) { sc += 100; why.push('starred'); }
  if (p.withdrawn) sc = 0;
  return { sc, why };
}
function buildPlan() {
  const plan = { days: {} };
  const sessScore = {};
  D.sessions.forEach(s => {
    const talks = s.items.map(i => P[i]).filter(p => !p.aux).map(p => ({ p, ...scorePres(p) })).filter(t => t.sc > 0).sort((a, b) => b.sc - a.sc);
    let sc = talks.slice(0, 6).reduce((a, t) => a + t.sc, 0) + (prefs.subfields.includes(s.area + '|' + s.subfield) ? 4 : 0) + (stars.has(s.id) ? 100 : 0) + (s.area === 'PL' ? 3 : 0);
    sessScore[s.id] = { sc, talks };
  });
  DAYS.forEach(d => {
    const items = [];
    const sess = D.sessions.filter(s => s.date === d);
    // oral-type sessions grouped by start time → choose best
    const slots = {}; sess.filter(s => s.type !== 'Poster').forEach(s => (slots[s.start] = slots[s.start] || []).push(s));
    Object.keys(slots).sort((a, b) => toMin(a) - toMin(b)).forEach(st => {
      const ranked = slots[st].map(s => ({ s, ...sessScore[s.id] })).filter(x => x.sc > 0).sort((a, b) => b.sc - a.sc);
      if (!ranked.length) return;
      const best = ranked[0];
      items.push({ kind: 'session', start: st, end: best.s.end, s: best.s, sc: best.sc, talks: best.talks.slice(0, 5), alts: ranked.slice(1, 3) });
    });
    // poster blocks: pick top posters across parallel poster sessions
    const pblocks = {}; sess.filter(s => s.type === 'Poster').forEach(s => (pblocks[s.start] = pblocks[s.start] || []).push(s));
    Object.keys(pblocks).sort((a, b) => toMin(a) - toMin(b)).forEach(st => {
      const posters = pblocks[st].flatMap(s => sessScore[s.id].talks).sort((a, b) => b.sc - a.sc).slice(0, 12);
      if (posters.length) items.push({ kind: 'posters', start: st, end: pblocks[st][0].end, posters, sessions: pblocks[st] });
    });
    // starred talks whose session wasn't chosen (conflicts)
    [...stars].map(id => P[id]).filter(p => p && p.date === d && p.sess.type !== 'Poster').forEach(p => {
      const chosen = items.find(it => it.kind === 'session' && it.s.id === p.session);
      if (!chosen) items.push({ kind: 'talk', start: p.start, end: p.end, p, conflict: items.some(it => it.kind === 'session' && toMin(it.start) < toMin(p.end) && toMin(it.end) > toMin(p.start)) });
    });
    items.sort((a, b) => toMin(a.start) - toMin(b.start));
    if (items.length) plan.days[d] = items;
  });
  return plan;
}
routes.plan = (seg, q) => {
  const mode = seg[0] || (prefs.subfields.length || prefs.keywords.length || prefs.people.length || stars.size ? 'plan' : 'interests');
  let html = `<div class="seg"><button class="${mode === 'interests' ? 'active' : ''}" onclick="nav('/plan/interests')">1 · Interests</button><button class="${mode === 'plan' ? 'active' : ''}" onclick="nav('/plan/plan')">2 · Built schedule</button><button class="${mode === 'stars' ? 'active' : ''}" onclick="nav('/plan/stars')">★ Starred (${stars.size})</button></div>`;
  if (mode === 'interests') {
    const groups = {}; D.subfields.forEach(sf => (groups[sf.area] = groups[sf.area] || []).push(sf));
    html += `<div class="card"><div class="title">Tell the builder what you care about</div><div class="muted small">Pick subfields and topics; follow people from their pages. The builder scores every talk, picks the best session in each time slot, resolves parallel conflicts, and lists top posters by board number.</div></div>`;
    html += `<h3>Areas</h3><div class="chips">${['E', 'L', 'M', 'J'].map(a => `<span class="chip tap ${prefs.areas.includes(a) ? 'sel' : ''}" onclick="togglePref('areas','${a}')"><span class="area ${a}"></span>${AREA_NAME[a]}</span>`).join('')}</div>`;
    AREA_ORDER.filter(a => groups[a] && a !== 'PL').forEach(a => { html += `<h3><span class="area ${a}"></span>${AREA_NAME[a]} subfields</h3><div class="chips">${groups[a].map(sf => `<span class="chip tap ${prefs.subfields.includes(a + '|' + sf.name) ? 'sel' : ''}" onclick="togglePref('subfields','${(a + '|' + sf.name).replace(/'/g, "\\'")}')">${esc(sf.name)} <span class="muted">${sf.sessions.length}</span></span>`).join('')}</div>`; });
    html += `<h3>Topics & keywords</h3><div class="chips">${KW_COUNT.slice().sort((a, b) => b.n - a.n).map(k => `<span class="chip tap ${prefs.keywords.includes(k.i) ? 'sel' : ''}" onclick="togglePref('keywords',${k.i})">${esc(k.name)} <span class="muted">${k.n}</span></span>`).join('')}</div>`;
    html += `<h3>People you follow (${prefs.people.length})</h3><div class="chips">${prefs.people.map(id => PEOPLE[id] ? `<span class="chip tap sel" onclick="followPerson('${id}')">${esc(PEOPLE[id].name)} ✕</span>` : '').join('') || '<span class="muted small">Open any person page and tap “Follow”.</span>'}</div>`;
    html += `<div style="margin:16px 0;display:flex;gap:8px"><button class="btn" onclick="nav('/plan/plan')">Build my schedule →</button><button class="btn sec" onclick="clearPrefs()">Reset</button></div>`;
  } else if (mode === 'plan') {
    const plan = buildPlan(); const days = Object.keys(plan.days);
    const n = nowET();
    if (!days.length) html += `<div class="empty">No interests yet. <a href="#/plan/interests">Pick some topics</a> or star a few talks, then come back.</div>`;
    else {
      html += `<div class="card"><div class="row"><div class="grow"><div class="title">Your personalised schedule</div><div class="muted small">${prefs.subfields.length} subfields · ${prefs.keywords.length} keywords · ${prefs.people.length} people · ${stars.size} starred</div></div><button class="btn sm sec" onclick="exportICS()">📅 .ics</button></div></div>`;
      days.forEach(d => {
        html += `<h2 style="margin-top:18px">${DAY_LONG[d]}${d === n.date ? ' <span class="badge now">today</span>' : ''}</h2>`;
        plan.days[d].forEach(it => {
          if (it.kind === 'session') {
            html += `<div class="plan-slot"><div class="t">${fmtT(it.start)}<br><span class="muted">${fmtT(it.end)}</span></div><div class="grow">${sessionCard(it.s, { extra: `<div class="score">score ${it.sc.toFixed(0)} · ${it.talks.length ? 'top: ' + it.talks.map(t => esc(t.p.title.slice(0, 50)) + (t.p.title.length > 50 ? '…' : '')).slice(0, 2).join(' | ') : ''}</div>${it.alts.length ? `<div class="alt">Alternatives in this slot: ${it.alts.map(a => `<a href="#/session/${a.s.id}">${a.s.id} ${esc(a.s.title)} <span class="muted">(${a.sc.toFixed(0)})</span></a>`).join('')}</div>` : ''}` })}</div></div>`;
          } else if (it.kind === 'posters') {
            html += `<div class="plan-slot"><div class="t">${fmtT(it.start)}<br><span class="muted">${fmtT(it.end)}</span></div><div class="grow"><div class="card stripe ev"><div class="title">🖼️ Poster walk · Exhibit Hall B/C (Level 2)</div><div class="muted small">${it.sessions.length} parallel poster sessions · your top ${it.posters.length} boards</div>${it.posters.map(t => talkRow(t.p, { showSession: true })).join('')}</div></div></div>`;
          } else {
            html += `<div class="plan-slot"><div class="t">${fmtT(it.start)}</div><div class="grow"><div class="card ${it.conflict ? 'conf' : ''}">${it.conflict ? '<div class="tiny" style="color:#ff9b9b">⚠ overlaps a chosen session</div>' : ''}${talkRow(it.p, { showSession: true })}</div></div></div>`;
          }
        });
      });
    }
  } else {
    const list = [...stars].map(id => P[id] || S[id]).filter(Boolean).sort((a, b) => a.date.localeCompare(b.date) || toMin(a.start) - toMin(b.start));
    if (!list.length) html += `<div class="empty">Nothing starred yet. Tap ☆ on any talk or session.</div>`;
    else {
      html += `<div class="row" style="justify-content:flex-end;margin-bottom:6px"><button class="btn sm sec" onclick="exportICS()">📅 Export .ics</button></div>`;
      let last = '';
      list.forEach(x => {
        if (x.date !== last) { last = x.date; html += `<h3>${DAY_LONG[x.date]}</h3>`; }
        const overlap = list.some(y => y !== x && y.date === x.date && toMin(y.start) < toMin(x.end) && toMin(y.end) > toMin(x.start) && (x.session ? y.session !== x.session : true) && !(x.items && y.session === x.id) && !(y.items && x.session === y.id));
        html += x.items ? sessionCard(x, { extra: overlap ? '<div class="tiny" style="color:#ff9b9b">⚠ overlaps another starred item</div>' : '' }) : `<div class="card ${overlap ? 'conf' : ''}">${overlap ? '<div class="tiny" style="color:#ff9b9b">⚠ overlaps another starred item</div>' : ''}${talkRow(x, { showSession: true })}</div>`;
      });
    }
  }
  return { html, title: 'My Plan', root: true, tab: 'plan' };
};
window.togglePref = (k, v) => { const i = prefs[k].indexOf(v); if (i >= 0) prefs[k].splice(i, 1); else prefs[k].push(v); store.set('prefs', prefs); render(); };
window.clearPrefs = () => { prefs.subfields = []; prefs.keywords = []; prefs.people = []; prefs.areas = []; store.set('prefs', prefs); render(); };
window.exportICS = () => {
  const plan = buildPlan(); const ev = [];
  const dt = (d, t) => { const [h, m] = t.split(':').map(Number); const u = new Date(Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10), h + 4, m)); return u.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); };
  const add = (uid, d, s, e, title, loc, desc) => ev.push(`BEGIN:VEVENT\r\nUID:${uid}@asc2026\r\nDTSTAMP:${dt('2026-09-01', '00:00')}\r\nDTSTART:${dt(d, s)}\r\nDTEND:${dt(d, e)}\r\nSUMMARY:${title.replace(/[,;\\]/g, m => '\\' + m)}\r\nLOCATION:${loc.replace(/[,;\\]/g, m => '\\' + m)}\r\nDESCRIPTION:${desc.replace(/[,;\\]/g, m => '\\' + m).replace(/\n/g, '\\n')}\r\nEND:VEVENT`);
  Object.entries(plan.days).forEach(([d, items]) => items.forEach(it => { if (it.kind === 'session') add(it.s.id, d, it.start, it.end, it.s.id + ' ' + it.s.title, it.s.room + ' (Level ' + it.s.level + '), DLCC', it.talks.map(t => fmtT(t.p.start) + ' ' + t.p.title).join('\n')); else if (it.kind === 'posters') add('posters' + d + it.start, d, it.start, it.end, 'Poster walk: ' + it.posters.length + ' picks', 'Exhibit Hall BC (Level 2), DLCC', it.posters.map(t => '#' + (t.p.board || t.p.id) + ' ' + t.p.title).join('\n')); else add(it.p.id, d, it.start, it.end, it.p.id + ' ' + it.p.title, it.p.room + ', DLCC', it.p.session + ' ' + it.p.sess.title); }));
  const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//ASC2026 Navigator//EN\r\nCALSCALE:GREGORIAN\r\n${ev.join('\r\n')}\r\nEND:VCALENDAR\r\n`;
  if (window.AndroidBridge && AndroidBridge.saveFile) { AndroidBridge.saveFile('ASC2026-plan.ics', ics); toast('Saved ASC2026-plan.ics to Downloads'); }
  else { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'ASC2026-plan.ics'; document.body.appendChild(a); a.click(); a.remove(); toast('Calendar file downloaded'); }
  window.__lastICS = ics;
};

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('nav#tabs button').forEach(b => b.addEventListener('click', () => nav('/' + b.dataset.tab)));
  $('#back').addEventListener('click', goBack);
  render();
  setInterval(() => { if (!state.timeTravel && (location.hash === '' || location.hash.startsWith('#/now'))) render(); }, 60000);
});
