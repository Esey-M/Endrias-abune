/* ============================================================
   Debre Tsige Abune Endryas — site scripts
   ============================================================ */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     Active navigation state
     ---------------------------------------------------------- */
  function markActiveNav() {
    var current = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.site-nav a[href]').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#' || href.indexOf('://') > -1) return;

      if (href === current) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');

        // Highlight the parent dropdown toggle too
        var menu = link.closest('.dropdown-menu');
        if (menu) {
          var toggle = menu.parentElement.querySelector('.dropdown-toggle');
          if (toggle) toggle.classList.add('active');
        }
      }
    });
  }

  /* ----------------------------------------------------------
     Close the mobile offcanvas when a link is tapped
     ---------------------------------------------------------- */
  function closeMenuOnNavigate() {
    var panel = document.getElementById('mainMenu');
    if (!panel || typeof bootstrap === 'undefined') return;

    panel.querySelectorAll('a[href]').forEach(function (link) {
      link.addEventListener('click', function () {
        if (link.classList.contains('dropdown-toggle')) return;
        var instance = bootstrap.Offcanvas.getInstance(panel);
        if (instance) instance.hide();
      });
    });
  }

  /* ----------------------------------------------------------
     Hero slider
     ---------------------------------------------------------- */
  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) return;

    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    if (slides.length < 2) return;

    var dotsWrap = hero.querySelector('[data-hero-dots]');
    var caption = hero.querySelector('[data-hero-caption]');
    var prevBtn = hero.querySelector('[data-hero-prev]');
    var nextBtn = hero.querySelector('[data-hero-next]');
    var interval = parseInt(hero.getAttribute('data-interval'), 10) || 6000;

    var index = 0;
    var timer = null;
    var dots = [];

    // Build dots
    if (dotsWrap) {
      slides.forEach(function (slide, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'hero-dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Ga naar afbeelding ' + (i + 1) + ' van ' + slides.length);
        dot.addEventListener('click', function () {
          go(i);
          restart();
        });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    function setCaption(i) {
      if (!caption) return;
      var img = slides[i].querySelector('img');
      caption.textContent = (img && img.getAttribute('data-caption')) || '';
    }

    function go(next) {
      if (next === index) return;
      var from = slides[index];
      var to = slides[next];

      from.classList.remove('is-active');
      from.classList.add('is-leaving');
      to.classList.remove('is-leaving');
      to.classList.add('is-active');

      window.setTimeout(function () {
        from.classList.remove('is-leaving');
      }, 1100);

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === next);
      });

      // Load the neighbour ahead of time
      var upcoming = slides[(next + 1) % slides.length].querySelector('img');
      if (upcoming && upcoming.getAttribute('loading') === 'lazy') {
        upcoming.setAttribute('loading', 'eager');
      }

      index = next;
      setCaption(index);
    }

    function step(delta) {
      go((index + delta + slides.length) % slides.length);
    }

    function start() {
      if (reduceMotion) return;
      stop();
      timer = window.setInterval(function () { step(1); }, interval);
    }

    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }

    function restart() { stop(); start(); }

    if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); restart(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { step(1); restart(); });

    // Pause while hovered or focused, and while the tab is hidden
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    hero.addEventListener('focusin', stop);
    hero.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });

    // Keyboard
    hero.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { step(-1); restart(); }
      if (e.key === 'ArrowRight') { step(1); restart(); }
    });

    // Touch swipe
    var touchX = null;
    hero.addEventListener('touchstart', function (e) {
      touchX = e.changedTouches[0].clientX;
      stop();
    }, { passive: true });

    hero.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var delta = e.changedTouches[0].clientX - touchX;
      if (Math.abs(delta) > 45) step(delta < 0 ? 1 : -1);
      touchX = null;
      start();
    }, { passive: true });

    setCaption(0);
    start();
  }

  /* ----------------------------------------------------------
     Jaarboek: uitklapbare jaren
     ---------------------------------------------------------- */
  function initAccordions() {
    var toggles = document.querySelectorAll('.year-toggle');
    if (!toggles.length) return;

    function setHeight(panel, open) {
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : null;
    }

    toggles.forEach(function (toggle) {
      var panel = document.getElementById(toggle.getAttribute('aria-controls'));
      if (!panel) return;

      // A panel marked open in the markup starts expanded.
      if (toggle.getAttribute('aria-expanded') === 'true') setHeight(panel, true);

      toggle.addEventListener('click', function () {
        var open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        panel.classList.toggle('is-open', !open);
        setHeight(panel, !open);
      });
    });

    // Re-measure open panels whenever the layout can have shifted: on resize,
    // and once the web fonts have actually rendered (they change text height).
    function remeasureOpen() {
      document.querySelectorAll('.year-toggle[aria-expanded="true"]').forEach(function (toggle) {
        var panel = document.getElementById(toggle.getAttribute('aria-controls'));
        if (panel) {
          panel.style.maxHeight = 'none';
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    }

    window.addEventListener('resize', remeasureOpen);
    window.addEventListener('load', remeasureOpen);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasureOpen);
  }

  /* ----------------------------------------------------------
     Afbeeldingen: vergrote weergave
     ---------------------------------------------------------- */
  function initLightbox() {
    var box = document.getElementById('lightbox');
    var shots = Array.prototype.slice.call(document.querySelectorAll('.shot-btn'));
    if (!box || !shots.length) return;

    var img = document.getElementById('lb-img');
    var cap = document.getElementById('lb-cap');
    var index = 0;
    var lastFocus = null;

    function show(i) {
      index = (i + shots.length) % shots.length;
      var source = shots[index].querySelector('img');
      var figure = shots[index].closest('.shot');
      // Use the largest source available rather than the thumbnail
      img.src = source.getAttribute('srcset').split(',').pop().trim().split(' ')[0];
      img.alt = source.alt;
      cap.textContent = figure ? figure.querySelector('figcaption').textContent : '';
    }

    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      box.hidden = false;
      document.body.style.overflow = 'hidden';
      box.querySelector('[data-lb-close]').focus();
    }

    function close() {
      box.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    shots.forEach(function (btn, i) {
      btn.addEventListener('click', function () { open(i); });
    });

    box.querySelector('[data-lb-close]').addEventListener('click', close);
    box.querySelector('[data-lb-prev]').addEventListener('click', function () { show(index - 1); });
    box.querySelector('[data-lb-next]').addEventListener('click', function () { show(index + 1); });

    // Click the backdrop to dismiss
    box.addEventListener('click', function (e) {
      if (e.target === box) close();
    });

    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
  }

  /* ----------------------------------------------------------
     Scroll to top
     ---------------------------------------------------------- */
  function initToTop() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'to-top';
    btn.setAttribute('aria-label', 'Terug naar boven');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(btn);

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    function update() {
      btn.classList.toggle('is-visible', window.pageYOffset > 400);
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ----------------------------------------------------------
     Reveal on scroll
     ---------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ----------------------------------------------------------
     Current year in the footer
     ---------------------------------------------------------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    markActiveNav();
    closeMenuOnNavigate();
    initHero();
    initAccordions();
    initLightbox();
    initToTop();
    initReveal();
    initYear();
  });
})();
