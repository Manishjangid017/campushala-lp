(function () {
  'use strict';

  var d = document;
  var w = window;

  var reduceMotion = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in w)) return; // everything simply stays visible

  var ANIMS = [
    /* ---------- TOP BAR + HEADER + HERO (page load) ---------- */
    ['.top-bar__text', 'down', 0],
    ['.site-brand', 'down', 80],
    ['.site-header__actions .btn-dpu', 'down', 160, 90],
    ['.hero__edge-tab', 'grow-x', 600],
    ['.hero__title', 'up', 200],
    ['.hero__desc', 'up', 380],
    ['.btn-join', 'up', 520],
    ['.enquiry-card', 'up-scale', 300],
    ['.enquiry-card__head, .enquiry-card__sub', 'up', 700, 80],
    ['.enquiry-card .field', 'up', 800, 80],
    ['.enquiry-card .btn-submit', 'up', 1050],
    ['.enquiry-card__foot', 'fade', 1150],
    ['.side-enquiry', 'right', 1300],

    /* ---------- NIRF ---------- */
    ['.nirf-logo', 'left', 0],
    ['.nirf-awards__img', 'zoom', 100, 130],
    ['.nirf-banner', 'right', 150],
    ['.nirf-banner__title', 'up', 450],

    /* ---------- COURSE ---------- */
    ['.course-media__accent', 'grow', 0],
    ['.course-media__img', 'clip-left', 40],
    ['.course-card', 'right', 100],
    ['.course-card__label', 'up', 380],
    ['.course-card__title', 'up', 460],
    ['.course-card__list li', 'up', 540, 70],
    ['.course-card__btn', 'up', 1000],
    ['.course-info__box', 'up', 1080, 110],

    /* ---------- CAREERS ---------- */
    ['.careers-head .section-label', 'up', 0],
    ['.careers-head__title', 'up-blur', 90],
    ['.careers-btn', 'right', 180],
    ['.career-card', 'up-scale', 0, 140],
    ['.career-card .img-zoom', 'clip-up', 120, 140],

    /* ---------- RECRUITERS ---------- */
    ['.recruiters-head .section-label', 'up', 0],
    ['.recruiters-head__title', 'up-blur', 90],
    ['.marquee-row--left', 'left', 200],
    ['.marquee-row--right', 'right', 320],

    /* ---------- INFRASTRUCTURE ---------- */
    ['.infra-head__label', 'up', 0],
    ['.infra-head__title', 'up-blur', 90],
    ['.infra-card', 'up-scale', 150, 120],
    ['.infra-card .img-zoom', 'clip-up', 270, 120],
    ['.infra-dots', 'fade', 0],

    /* ---------- TESTIMONIALS ---------- */
    ['.testi-head__label', 'up', 0],
    ['.testi-head__title', 'up-blur', 90],
    ['.testi-quote--left', 'zoom', 100],
    ['.testi-quote--right', 'zoom', 100],
    ['.testi-card', 'up', 200, 140],

    /* ---------- FAQ ---------- */
    ['.faq-head__label', 'up', 0],
    ['.faq-head__title', 'up-blur', 90],
    ['.faq-media__img', 'clip-left', 50],
    ['.faq-accordion .accordion-item', 'right', 250, 90],
    ['.faq-dots', 'fade', 0],

    /* ---------- ADMISSION PROCESS ---------- */
    ['.process-head__label', 'up', 0],
    ['.process-head__title', 'up-blur', 90],
    ['.process-steps', 'line', 250],
    ['.step-card', 'up-scale', 200, 150],
    ['.step-card__num', 'pop', 350, 150],

    /* ---------- CTA ---------- */
    ['.cta-banner', 'up-scale', 0],
    ['.cta-photo', 'right', 250],
    ['.cta-circle', 'zoom', 450],
    ['.cta-pill', 'up', 350],
    ['.cta-title', 'up-blur', 450],
    ['.cta-chips__item', 'up', 560, 100],
    ['.cta-btn', 'up', 760],

    /* ---------- FOOTER ---------- */
    /* footer removed from scroll-reveal: being at the very bottom of the page
       means the IntersectionObserver (threshold 0.12, -6% rootMargin) often
       never fires, leaving opacity at 0. Footer is always fully visible. */
  ];

  var targets = [];
  var io = null;

  function revealAll() {
    d.querySelectorAll('.rv, .rv-line').forEach(function (el) {
      el.classList.remove('rv', 'rv-line');
    });
  }

  try {
    /* wrap card images so they can zoom inside their rounded box on hover */
    d.querySelectorAll('.career-card__img, .infra-card__img').forEach(function (img) {
      var parent = img.parentElement;
      if (!parent || parent.classList.contains('img-zoom')) return;
      var wrap = d.createElement('span');
      wrap.className = 'img-zoom';
      parent.insertBefore(wrap, img);
      wrap.appendChild(img);
    });

    /* mark everything as hidden (synchronously, before first paint) */
    ANIMS.forEach(function (cfg, gi) {
      var list = d.querySelectorAll(cfg[0]);
      for (var i = 0; i < list.length; i++) {
        var el = list[i];
        if (el.classList.contains('rv') || el.classList.contains('rv-line')) continue;

        if (cfg[1] === 'line') {
          el.classList.add('rv-line');
        } else {
          el.classList.add('rv', 'rv-' + cfg[1]);
        }
        el.dataset.rvD = cfg[2] || 0;
        el.dataset.rvS = cfg[3] || 0;
        el.dataset.rvG = gi;
        targets.push(el);
      }
    });

    /* reveal when scrolled into view; elements entering together are staggered */
    io = new IntersectionObserver(
      function (entries) {
        var vis = entries.filter(function (e) {
          return e.isIntersecting;
        });
        if (!vis.length) return;

        // document order
        vis.sort(function (a, b) {
          return a.target.compareDocumentPosition(b.target) & 4 ? -1 : 1;
        });

        // delays are relative to the earliest item in this batch,
        // so late-entering items never wait for a long absolute delay
        var min = Infinity;
        vis.forEach(function (e) {
          min = Math.min(min, +e.target.dataset.rvD);
        });

        var rank = {};
        vis.forEach(function (e) {
          var el = e.target;
          var g = el.dataset.rvG;
          rank[g] = rank[g] || 0;
          var delay = +el.dataset.rvD - min + rank[g] * +el.dataset.rvS;
          rank[g]++;

          el.style.setProperty('--rv-delay', delay + 'ms');
          el.classList.add('is-in');
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    /* when an animation finishes, give control back to your own CSS (hover etc.) */
    d.addEventListener('animationend', function (e) {
      if (e.pseudoElement) return;
      var el = e.target;
      if (el.classList && el.classList.contains('rv') && el.classList.contains('is-in')) {
        el.classList.add('rv-done');
      }
    });

    /* start after fonts are ready (avoids text jumping), with safety timeouts */
    var started = false;
    var start = function () {
      if (started) return;
      started = true;
      targets.forEach(function (el) {
        io.observe(el);
      });
    };

    if (d.fonts && d.fonts.ready) {
      Promise.race([
        d.fonts.ready,
        new Promise(function (r) {
          setTimeout(r, 800);
        })
      ]).then(start);
    } else {
      w.addEventListener('load', start);
    }
    setTimeout(start, 1200);
  } catch (err) {
    // never leave content hidden if something goes wrong
    revealAll();
    if (w.console) console.warn('animation.js disabled:', err);
    return;
  }

  /* ------------------------------------------------------------
     Soft parallax for the dotted background shapes
     (uses the separate `translate` property, so your own
     transform: translateY(50%) is untouched)
     ------------------------------------------------------------ */
  var dots = [].slice.call(d.querySelectorAll('.infra-dots, .faq-dots'));

  if (dots.length) {
    var ticking = false;

    var parallax = function () {
      ticking = false;
      var vh = w.innerHeight;

      dots.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -300 || r.top > vh + 300) return;

        var p = (r.top + r.height / 2 - vh / 2) / vh;
        p = Math.max(-1, Math.min(1, p));
        el.style.translate = '0 ' + (p * -36).toFixed(1) + 'px';
      });
    };

    w.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          ticking = true;
          w.requestAnimationFrame(parallax);
        }
      },
      { passive: true }
    );
    w.addEventListener('resize', parallax);
    parallax();
  }
})();
