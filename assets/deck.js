/* ═══════════════════════════════════════════════════════════════
   BNi&C Whitepaper Deck - navigation, scaling, language, theme
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var SLIDE_W = 1280, SLIDE_H = 720;

  var stage = document.querySelector('.stage');
  var frame = document.getElementById('frame');
  var track = document.getElementById('track');
  var slides = Array.prototype.slice.call(track.querySelectorAll('.slide'));
  var total = slides.length;
  var idx = 0;

  var elPrev = document.getElementById('prev');
  var elNext = document.getElementById('next');
  var elCur = document.getElementById('cur');
  var elTot = document.getElementById('tot');
  var elNow = document.getElementById('now');
  var elBar = document.getElementById('bar');
  var jumpBtns = Array.prototype.slice.call(document.querySelectorAll('.jump button'));

  /* ---------- fit the 16:9 frame into the viewport ---------- */
  /* Scale the 1280x720 frame to fill the stage (the gap between the two bars).
     The stage's own box supplies the available room, so the bar heights live in
     one place - the stylesheet - and cannot drift out of sync with this file.
     scale() precedes translate(-50%,-50%) so the shift is half the SCALED size. */
  function fit() {
    var pad = 20;                                  // breathing room around the slide
    var w = stage.clientWidth - pad * 2;
    var h = stage.clientHeight - pad * 2;
    var s = Math.min(w / SLIDE_W, h / SLIDE_H);
    if (!isFinite(s) || s <= 0) s = 0.1;
    frame.style.transform = 'scale(' + s + ') translate(-50%, -50%)';
  }

  /* ---------- go to a slide ---------- */
  function go(n, quiet) {
    idx = Math.max(0, Math.min(total - 1, n));
    track.style.transform = 'translateX(' + (-idx * SLIDE_W) + 'px)';

    elCur.textContent = pad2(idx + 1);
    elPrev.disabled = idx === 0;
    elNext.disabled = idx === total - 1;
    elBar.style.width = (total > 1 ? (idx / (total - 1)) * 100 : 100) + '%';

    var s = slides[idx];
    elNow.textContent = s.getAttribute('data-title-' + lang()) || '';

    var sec = s.getAttribute('data-sec') || '';
    jumpBtns.forEach(function (b) {
      b.setAttribute('aria-current', b.getAttribute('data-sec') === sec ? 'true' : 'false');
    });

    slides.forEach(function (el, i) {
      el.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
    });

    if (!quiet) {
      try { history.replaceState(null, '', '#' + (idx + 1)); } catch (e) {}
    }
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function lang() { return document.documentElement.getAttribute('data-lang') || 'ko'; }

  function next() { if (idx < total - 1) go(idx + 1); }
  function prev() { if (idx > 0) go(idx - 1); }

  /* ---------- language ---------- */
  function setLang(l) {
    document.documentElement.setAttribute('data-lang', l);
    document.documentElement.lang = l;
    document.getElementById('btn-ko').setAttribute('aria-pressed', l === 'ko' ? 'true' : 'false');
    document.getElementById('btn-en').setAttribute('aria-pressed', l === 'en' ? 'true' : 'false');
    try { localStorage.setItem('bnic-lang', l); } catch (e) {}
    go(idx, true);
  }

  /* ---------- theme ---------- */
  function setTheme(t) {
    if (t === 'auto') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', t);
    }
    document.getElementById('btn-light').setAttribute('aria-pressed', t === 'light' ? 'true' : 'false');
    document.getElementById('btn-dark').setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
    try {
      if (t === 'auto') localStorage.removeItem('bnic-theme');
      else localStorage.setItem('bnic-theme', t);
    } catch (e) {}
  }

  function currentTheme() { return document.documentElement.getAttribute('data-theme') || 'auto'; }

  /* ---------- wiring ---------- */
  elPrev.addEventListener('click', prev);
  elNext.addEventListener('click', next);

  jumpBtns.forEach(function (b) {
    b.addEventListener('click', function () { go(parseInt(b.getAttribute('data-go'), 10)); });
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-goto]'), function (b) {
    b.addEventListener('click', function () { go(parseInt(b.getAttribute('data-goto'), 10)); });
  });

  /* print / PDF: the print stylesheet lays every slide out as its own
     1280x720 page, so there is nothing to prepare beyond opening the dialog. */
  document.getElementById('print').addEventListener('click', function () {
    window.print();
  });

  document.getElementById('btn-ko').addEventListener('click', function () { setLang('ko'); });
  document.getElementById('btn-en').addEventListener('click', function () { setLang('en'); });
  document.getElementById('btn-light').addEventListener('click', function () {
    setTheme(currentTheme() === 'light' ? 'auto' : 'light');
  });
  document.getElementById('btn-dark').addEventListener('click', function () {
    setTheme(currentTheme() === 'dark' ? 'auto' : 'dark');
  });

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': case ' ': case 'Enter':
        next(); e.preventDefault(); break;
      case 'ArrowLeft': case 'PageUp': case 'Backspace':
        prev(); e.preventDefault(); break;
      case 'Home': go(0); e.preventDefault(); break;
      case 'End': go(total - 1); e.preventDefault(); break;
      default:
        if (/^[0-9]$/.test(e.key)) { /* number keys reserved */ }
    }
  });

  /* wheel: horizontal intent or shift+wheel pages the deck */
  var wheelLock = 0;
  window.addEventListener('wheel', function (e) {
    var now = Date.now();
    if (now < wheelLock) return;
    var dx = e.shiftKey ? e.deltaY : e.deltaX;
    if (Math.abs(dx) < 24) return;
    wheelLock = now + 420;
    if (dx > 0) next(); else prev();
  }, { passive: true });

  /* touch swipe */
  var tx = 0, ty = 0, tracking = false;
  window.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { tracking = false; return; }
    tx = e.touches[0].clientX; ty = e.touches[0].clientY; tracking = true;
  }, { passive: true });
  window.addEventListener('touchend', function (e) {
    if (!tracking) return;
    tracking = false;
    var t = e.changedTouches[0];
    var dx = t.clientX - tx, dy = t.clientY - ty;
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) next(); else prev();
  }, { passive: true });

  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);
  /* a resize event is not guaranteed for every box change (device rotation,
     browser UI collapsing, zoom); watch the stage itself as well */
  if (window.ResizeObserver) new ResizeObserver(fit).observe(stage);

  /* ---------- boot ---------- */
  elTot.textContent = pad2(total);
  fit();

  var start = 0;
  var h = (location.hash || '').replace('#', '');
  if (/^\d+$/.test(h)) start = parseInt(h, 10) - 1;
  else if (h) {
    var byId = document.getElementById(h);
    if (byId) start = slides.indexOf(byId);
  }

  // position the deck without animating in from slide 1 on a deep link
  track.style.transition = 'none';
  setLang(lang());
  setTheme(currentTheme());
  go(start >= 0 ? start : 0, true);
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { track.style.transition = ''; });
  });

  window.addEventListener('hashchange', function () {
    var v = (location.hash || '').replace('#', '');
    if (/^\d+$/.test(v)) go(parseInt(v, 10) - 1, true);
  });
})();
