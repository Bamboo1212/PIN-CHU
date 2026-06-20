/* ==========================================================

==nav bottom line
==hero marquee
==go to top
==float sns hide on scroll

========================================================== */


/* ==========================================================
==nav bottom line
========================================================== */
(function () {
  const MOBILE_BREAKPOINT = '(max-width: 991.98px)';
  const NAV_LINE_OFFSET = 32;
  const nav = document.querySelector('.navbar-nav');
  const navbarCollapse = document.getElementById('navbarNav');

  function isMobile() {
    return window.matchMedia(MOBILE_BREAKPOINT).matches;
  }

  function clearNavLine() {
    if (!nav) return;
    nav.style.removeProperty('--nav-line-top');
    nav.style.removeProperty('--nav-line-left');
    nav.style.removeProperty('--nav-line-width');
  }

  function updateNavBottomLine() {
    if (!nav || isMobile()) {
      clearNavLine();
      return;
    }

    const rect = nav.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;

    nav.style.setProperty('--nav-line-top', rect.bottom + 'px');
    nav.style.setProperty('--nav-line-left', (rect.left - NAV_LINE_OFFSET) + 'px');
    nav.style.setProperty('--nav-line-width', (viewportWidth - rect.left + NAV_LINE_OFFSET) + 'px');
  }

  window.matchMedia(MOBILE_BREAKPOINT).addEventListener('change', updateNavBottomLine);
  window.addEventListener('resize', updateNavBottomLine);
  window.addEventListener('scroll', updateNavBottomLine, { passive: true });
  window.addEventListener('load', updateNavBottomLine);

  if (navbarCollapse) {
    navbarCollapse.addEventListener('shown.bs.collapse', updateNavBottomLine);
    navbarCollapse.addEventListener('hidden.bs.collapse', updateNavBottomLine);
  }

  if (typeof ResizeObserver !== 'undefined') {
    const resizeObserver = new ResizeObserver(updateNavBottomLine);
    resizeObserver.observe(document.documentElement);
    if (nav) resizeObserver.observe(nav);
  }

  updateNavBottomLine();
})();


/* ==========================================================
==hero marquee
========================================================== */
(function () {
  const wrap = document.querySelector('#hero .hero-items-wrap');
  if (!wrap) return;

  const speed = 0.8;
  let x = 0;
  let halfWidth = 0;

  function tick() {
    x += speed;
    if (x >= halfWidth) {
      x -= halfWidth;
    }
    wrap.style.transform = `translateX(${-x}px)`;
    requestAnimationFrame(tick);
  }

  window.addEventListener('load', () => {
    halfWidth = wrap.scrollWidth / 2;
    requestAnimationFrame(tick);
  });
})();


/* ==========================================================
==go to top
========================================================== */
window.addEventListener('DOMContentLoaded', function() {
  var totopBtn = document.getElementById('totop-btn');
  if (totopBtn) {
    totopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});


/* ==========================================================
==float sns hide on scroll
========================================================== */
(function () {
  const floatSns = document.querySelector('.float-sns-wrap');
  if (!floatSns) return;

  const SCROLL_THRESHOLD = 10; // 滾動超過多少 px 才判斷方向，避免過度敏感
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateFloatSns() {
    const currentScrollY = window.scrollY;
    const diff = currentScrollY - lastScrollY;

    if (Math.abs(diff) > SCROLL_THRESHOLD) {
      if (diff > 0 && currentScrollY > 0) {
        // 向下滑：隱藏
        floatSns.classList.add('hide');
      } else {
        // 向上滑：顯示
        floatSns.classList.remove('hide');
      }
      lastScrollY = currentScrollY;
    }

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateFloatSns);
      ticking = true;
    }
  }, { passive: true });
})();
