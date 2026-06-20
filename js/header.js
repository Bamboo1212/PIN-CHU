/* ==========================================================

==nav dropdown

========================================================== */


/* ==========================================================
==nav dropdown
手機版次選單：點擊 toggle 展開/收合
========================================================== */
(function () {
  const MOBILE_BREAKPOINT = '(max-width: 991.98px)';
  const dropdowns = document.querySelectorAll('.navbar .dropdown');

  function isMobile() {
    return window.matchMedia(MOBILE_BREAKPOINT).matches;
  }

  function closeDropdown(dropdown) {
    dropdown.classList.remove('show');
    dropdown.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
  }

  function closeAllDropdowns(except) {
    dropdowns.forEach(function (dropdown) {
      if (dropdown !== except) closeDropdown(dropdown);
    });
  }

  dropdowns.forEach(function (dropdown) {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');

    toggle.addEventListener('click', function (e) {
      if (!isMobile()) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const isOpen = dropdown.classList.contains('show');

      if (isOpen) {
        closeDropdown(dropdown);
      } else {
        closeAllDropdowns();
        dropdown.classList.add('show');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!isMobile()) return;
    if (e.target.closest('.navbar .dropdown')) return;
    closeAllDropdowns();
  });

  window.matchMedia(MOBILE_BREAKPOINT).addEventListener('change', function () {
    closeAllDropdowns();
  });
})();


/* ==========================================================
==sticky header
========================================================== */
(function () {
  const SCROLL_THRESHOLD = 0; // 滾動超過幾 px 後加上 class，可依需求調整
  const MOBILE_BREAKPOINT = '(max-width: 991.98px)';

  function shouldStickyHeaderWork() {
    return !window.matchMedia(MOBILE_BREAKPOINT).matches;
  }

  function updateStickyHeader() {
    if (!shouldStickyHeaderWork()) {
      document.body.classList.remove('sticky-header');
      return;
    }
    if (window.scrollY > SCROLL_THRESHOLD) {
      document.body.classList.add('sticky-header');
    } else {
      document.body.classList.remove('sticky-header');
    }
  }

  // 初始判斷一次（例如重新整理時頁面已在滾動位置）
  updateStickyHeader();

  window.addEventListener('scroll', updateStickyHeader, { passive: true });
  window.matchMedia(MOBILE_BREAKPOINT).addEventListener('change', updateStickyHeader);
})();
