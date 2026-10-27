(function () {
  var body = document.body;
  var btn = document.getElementById('langBtn');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- language ---------- */
  var phrases = {
    en: ['AI undergraduate', 'Data Mining researcher', 'RAG & ML builder', 'Content creator'],
    vi: ['Sinh viên Trí tuệ nhân tạo', 'Nghiên cứu Data Mining', 'Xây dựng RAG & ML', 'Làm truyền thông']
  };
  var lang = 'en';
  function setLang(l) {
    lang = l;
    body.classList.toggle('lang-en', l === 'en');
    body.classList.toggle('lang-vi', l === 'vi');
    document.documentElement.lang = l;
    btn.textContent = l === 'en' ? 'VI' : 'EN';
    try { localStorage.setItem('lang', l); } catch (e) {}
    pi = 0; ci = 0; del = false;
  }

  /* ---------- typed line ---------- */
  var typedEl = document.getElementById('typed');
  var pi = 0, ci = 0, del = false;
  function tick() {
    var list = phrases[lang], word = list[pi % list.length];
    if (reduce) { typedEl.textContent = word; return; }
    typedEl.textContent = word.slice(0, ci);
    var d = del ? 35 : 80;
    if (!del && ci === word.length) { del = true; d = 1400; }
    else if (del && ci === 0) { del = false; pi++; d = 300; }
    else { ci += del ? -1 : 1; }
    setTimeout(tick, d);
  }

  var saved = 'en';
  try { saved = localStorage.getItem('lang') || 'en'; } catch (e) {}
  setLang(saved);
  btn.addEventListener('click', function () { setLang(lang === 'en' ? 'vi' : 'en'); });
  tick();

  /* ---------- certificates ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('img');
  document.querySelectorAll('.cert').forEach(function (fig) {
    var src = fig.dataset.img;
    var thumb = fig.querySelector('.thumb');
    var img = new Image();
    img.alt = '';
    img.onload = function () { thumb.appendChild(img); fig.dataset.ok = '1'; };
    img.onerror = function () { thumb.classList.add('empty'); thumb.textContent = src.split('/').pop(); };
    img.src = src;
    fig.addEventListener('click', function () {
      if (!fig.dataset.ok) return;
      lbImg.src = src;
      lb.hidden = false;
    });
  });
  document.querySelectorAll('.ev').forEach(function (fig) {
    fig.addEventListener('click', function () { lbImg.src = fig.dataset.img; lb.hidden = false; });
  });
  lb.addEventListener('click', function () { lb.hidden = true; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.hidden = true; });

  /* ---------- scroll progress ---------- */
  var bar = document.getElementById('progress');
  function onScroll() {
    var h = document.documentElement;
    var p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    bar.style.width = (p * 100).toFixed(1) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- reveal on scroll (staggered) ---------- */
  var els = document.querySelectorAll('.section > *, .card, .skill, .tool, .cert, .timeline li, .ev, .pose');
  els.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.setProperty('--d', ((i % 4) * 0.08) + 's');
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- count-up numbers ---------- */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10);
    if (reduce) return;
    var start = null, dur = 1400;
    el.textContent = (0).toFixed(dec);
    function step(t) {
      if (!start) start = t;
      var k = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = (target * e).toFixed(dec);
      if (k < 1) requestAnimationFrame(step); else el.textContent = target.toFixed(dec);
    }
    setTimeout(function () { requestAnimationFrame(step); }, 500);
  });

  /* ---------- 3D tilt on cards (mouse only) ---------- */
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tilt').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(800px) rotateY(' + (x * 6).toFixed(2) + 'deg) rotateX(' + (-y * 6).toFixed(2) + 'deg) translateY(-4px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });

    /* parallax on hero chips + portrait */
    var hero = document.querySelector('.hero');
    var chips = document.querySelectorAll('.chip');
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      chips.forEach(function (c, i) {
        var s = (i + 1) * 6;
        c.style.translate = (x * s).toFixed(1) + 'px ' + (y * s).toFixed(1) + 'px';
      });
    });
  }
})();
