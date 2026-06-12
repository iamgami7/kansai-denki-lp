(function () {
  'use strict';

  /* ---- hamburger menu toggle ------------------------------------------- */
  var burger = document.getElementById('js-burger');
  var menu = document.getElementById('js-menu');
  var body = document.body;

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = burger.classList.toggle('is-open');
      menu.classList.toggle('is-open', open);
      body.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // close the menu when a navigation link is tapped
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        burger.classList.remove('is-open');
        menu.classList.remove('is-open');
        body.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- live clock (header "○○:○○ 現在") -------------------------------- */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function tickClock() {
    var now = new Date();
    var label = pad(now.getHours()) + ':' + pad(now.getMinutes());
    var nodes = document.querySelectorAll('time[datetime]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = label;
      nodes[i].setAttribute('datetime', label);
    }
  }
  tickClock();
  setInterval(tickClock, 1000 * 30);

  /* ---- count-up numbers (achievements) --------------------------------- */
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function runCount(el) {
    var to = parseInt(el.getAttribute('data-count-to'), 10);
    var from = parseInt(el.getAttribute('data-count-from'), 10);
    if (isNaN(to)) { return; }
    if (isNaN(from)) { from = 0; }
    var spin = el.getAttribute('data-count-spin') === 'true';
    var duration = 1400;
    var start = null;

    function frame(ts) {
      if (start === null) { start = ts; }
      var p = Math.min((ts - start) / duration, 1);
      var eased = easeOutCubic(p);
      if (spin && p < 1) {
        // brief rolling effect before settling
        el.textContent = Math.floor(Math.random() * 9) + 1;
      } else {
        var val = Math.round(from + (to - from) * eased);
        el.textContent = val;
      }
      if (p < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = to;
      }
    }
    requestAnimationFrame(frame);
  }

  /* ---- floating CTA reveal on scroll ----------------------------------- */
  var fcta = document.getElementById('js-fcta');
  if (fcta) {
    var onScroll = function () {
      var show = window.pageYOffset > 520;
      fcta.classList.toggle('is-visible', show);
      fcta.setAttribute('aria-hidden', show ? 'false' : 'true');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var counters = document.querySelectorAll('[data-count-to]');
  if ('IntersectionObserver' in window && counters.length) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    for (var j = 0; j < counters.length; j++) { io.observe(counters[j]); }
  } else {
    for (var k = 0; k < counters.length; k++) { runCount(counters[k]); }
  }
})();
