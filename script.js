/* ===================================================
   국립공주박물관 — 통합 스크립트 (완성본)
   =================================================== */

// ── GOV BAR ──────────────────────────────────────────
function toggleGovInfo() {
  document.getElementById('govInfo')?.classList.toggle('open');
}

// ── LANG SELECT ──────────────────────────────────────
function toggleLang() {
  document.getElementById('langList')?.classList.toggle('open');
}
document.addEventListener('click', function (e) {
  if (!e.target.closest('.lang-select'))
    document.getElementById('langList')?.classList.remove('open');
});

// ── ALL MENU ─────────────────────────────────────────
function toggleAllMenu() {
  const ov = document.getElementById('allMenuOverlay');
  if (!ov) return;
  ov.classList.toggle('open');
  document.body.style.overflow = ov.classList.contains('open') ? 'hidden' : '';
}
document.addEventListener('click', function (e) {
  const ov = document.getElementById('allMenuOverlay');
  if (ov && e.target === ov) toggleAllMenu();
});

// ── SLIDER ───────────────────────────────────────────
(function () {
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) return;

  let current = 0;
  let paused  = false;
  let timer;
  const total = slides.length;

  function go(n) {
    current = (n + total) % total;
    const track = document.getElementById('sliderTrack');
    if (track) track.style.transform = `translateX(-${current * 100}%)`;
    document.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('active', i === current));
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
  }

  function startTimer() {
    clearInterval(timer);
    if (!paused) timer = setInterval(() => go(current + 1), 5000);
  }

  window.changeSlide = dir => { go(current + dir); startTimer(); };
  window.goToSlide   = n  => { go(n); startTimer(); };
  window.toggleSliderPause = () => {
    paused = !paused;
    const ic = document.querySelector('.pause-icon');
    if (ic) ic.textContent = paused ? '▶' : '⏸';
    startTimer();
  };

  go(0);
  startTimer();
})();

// ── EXHIBIT TABS ─────────────────────────────────────
const TAB_DATA = {
  current: [
    { img:'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80', badge:'특별전시', badgeCls:'',              title:'무령왕릉 발굴 50주년 기념 특별전',      period:'2025.04.01 ~ 2025.07.31', place:'국립공주박물관',       href:'exhibit.html#special' },
    { img:'images/웅진백제실.jpg', badge:'상설전시', badgeCls:'badge--permanent', title:'웅진백제실 — 백제의 숨결',              period:'상설',                  place:'국립공주박물관 1층',   href:'exhibit.html' },
    { img:'https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=600&q=80',    badge:'상설전시', badgeCls:'badge--permanent', title:'충청남도 역사문화실',                  period:'상설',                  place:'국립공주박물관 2층',   href:'exhibit.html#chungnam' },
  ],
  upcoming: [
    { img:'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&q=80', badge:'예정전시', badgeCls:'', title:'2025 가을 특별전: 백제의 공예',      period:'2025.09.01 ~ 2025.11.30', place:'기획전시실',       href:'exhibit.html#special' },
    { img:'https://images.unsplash.com/photo-1531907700752-62799b2a3e84?w=600&q=80', badge:'예정전시', badgeCls:'', title:'어린이와 함께하는 백제 이야기',      period:'2025.08.01 ~ 2025.08.31', place:'어린이 체험실',     href:'exhibit.html' },
    { img:'https://images.unsplash.com/photo-1551029506-0807df4e2031?w=600&q=80',    badge:'예정전시', badgeCls:'', title:'한국 고대 왕릉 비교전',              period:'2025.10.15 ~ 2025.12.15', place:'국립공주박물관',   href:'exhibit.html' },
  ],
  past: [
    { img:'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=600&q=80', badge:'지난전시', badgeCls:'badge--past', title:'2024 공주의 보물: 금동대향로 특별전', period:'2024.09.01 ~ 2024.12.31', place:'국립공주박물관',   href:'exhibit.html' },
    { img:'https://images.unsplash.com/photo-1593702288056-7cc22e7f4b8e?w=600&q=80', badge:'지난전시', badgeCls:'badge--past', title:'충남의 고인돌과 청동기 문화',         period:'2024.05.01 ~ 2024.08.31', place:'국립공주박물관',   href:'exhibit.html' },
    { img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',    badge:'지난전시', badgeCls:'badge--past', title:'백제 불교 미술의 세계',               period:'2024.01.10 ~ 2024.04.30', place:'국립공주박물관',   href:'exhibit.html' },
  ],
};

function switchTab(btn, tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderExhibits(tab);
}

function renderExhibits(tab) {
  const grid = document.getElementById('exhibitGrid');
  if (!grid) return;
  grid.innerHTML = (TAB_DATA[tab] || TAB_DATA.current).map(it => `
    <article class="exhibit-card">
      <a href="${it.href}">
        <div class="exhibit-card__thumb">
          <img src="${it.img}" alt="${it.title}" class="exhibit-card__img-real" loading="lazy"/>
          <span class="exhibit-card__badge ${it.badgeCls}">${it.badge}</span>
        </div>
        <div class="exhibit-card__info">
          <h3>${it.title}</h3>
          <p class="exhibit-card__period">${it.period}</p>
          <p class="exhibit-card__place">${it.place}</p>
        </div>
      </a>
    </article>`).join('');
}
// 초기 렌더
renderExhibits('current');

// ── MINI CALENDAR ────────────────────────────────────
const EVENT_DAYS = [5, 12, 19, 20, 28];
let calYear, calMonth;

function buildMiniCalendar(y, m) {
  const cal = document.getElementById('miniCalendar');
  if (!cal) return;
  const names    = ['일','월','화','수','목','금','토'];
  const firstDay = new Date(y, m, 1).getDay();
  const days     = new Date(y, m + 1, 0).getDate();
  const today    = new Date();

  let html = `<div class="mini-cal-header">
    <button class="mini-cal-btn" onclick="changeMonth(-1)">‹</button>
    <span>${y}년 ${m + 1}월</span>
    <button class="mini-cal-btn" onclick="changeMonth(1)">›</button>
  </div><div class="mini-cal-grid">
  ${names.map((n,i)=>`<div class="cal-day-name" style="${i===0?'color:var(--red)':i===6?'color:#1a4a9a':''}">${n}</div>`).join('')}`;

  let d = 1;
  for (let i = 0; i < 42; i++) {
    if (i < firstDay || d > days) { html += `<div class="cal-day"></div>`; }
    else {
      const isToday = y === today.getFullYear() && m === today.getMonth() && d === today.getDate();
      const col = i % 7;
      const cls = ['cal-day',
        isToday ? 'today' : '',
        EVENT_DAYS.includes(d) ? 'has-event' : '',
        col === 0 ? 'sunday' : '',
        col === 6 ? 'saturday' : ''
      ].filter(Boolean).join(' ');
      html += `<div class="${cls}">${d}</div>`;
      d++;
    }
  }
  html += '</div>';
  cal.innerHTML = html;
}

function changeMonth(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  buildMiniCalendar(calYear, calMonth);
}

(function () {
  const now = new Date();
  calYear  = now.getFullYear();
  calMonth = now.getMonth();
  buildMiniCalendar(calYear, calMonth);
})();

// ── TO TOP ───────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('toTop')?.classList.toggle('visible', window.scrollY > 400);
});
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// ── RELATED SITES ────────────────────────────────────
function toggleRelated() {
  document.getElementById('relatedList')?.classList.toggle('open');
}
document.addEventListener('click', function (e) {
  if (!e.target.closest('.footer__related'))
    document.getElementById('relatedList')?.classList.remove('open');
});

// ── ACTIVE NAV HIGHLIGHT (subpage) ───────────────────
(function () {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.gnb__link').forEach(a => {
    if (a.getAttribute('href') === path) a.style.color = 'var(--gold-light)';
  });
})();
