/* ==========================================================

==nav dropdown
==sticky header

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
  // 加上 sticky-header 後 header 高度會變矮，移除時高度恢復變大。
  // 這個高度差會讓瀏覽器的 scroll anchoring 把 scrollY 往上推，
  // 若移除門檻不夠低，就會在門檻附近反覆觸發，造成抖動與「滾不到頂」。
  //
  // 解法：
  //  - 加上 sticky：scrollY 超過 ENTER_THRESHOLD 時觸發（一般距離）
  //  - 移除 sticky：只在 scrollY 回到 0 時才移除，確保已真正到頂，
  //    不會再被 scroll anchoring 的補償動作二次觸發。
  const ENTER_THRESHOLD = 60; // 滾動超過此值才「加上」sticky-header
  const EXIT_SCROLL_Y = 0;    // scrollY 回到 0 才「移除」sticky-header
  const MOBILE_BREAKPOINT = '(max-width: 991.98px)';

  let ticking = false;

  function shouldStickyHeaderWork() {
    return !window.matchMedia(MOBILE_BREAKPOINT).matches;
  }

  function updateStickyHeader() {
    ticking = false;

    if (!shouldStickyHeaderWork()) {
      document.body.classList.remove('sticky-header');
      return;
    }

    const isSticky = document.body.classList.contains('sticky-header');
    const scrollY = window.scrollY;

    if (!isSticky && scrollY > ENTER_THRESHOLD) {
      document.body.classList.add('sticky-header');
    } else if (isSticky && scrollY <= EXIT_SCROLL_Y) {
      document.body.classList.remove('sticky-header');
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateStickyHeader);
    }
  }

  // 初始判斷一次（例如重新整理時頁面已在滾動位置）
  updateStickyHeader();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.matchMedia(MOBILE_BREAKPOINT).addEventListener('change', updateStickyHeader);
})();
