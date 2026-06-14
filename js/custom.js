/* ==========================================================

==nav bottom line
==hero marquee

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
