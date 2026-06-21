/* ==========================================================

==nav bottom line
==hero marquee
==go to top
==float sns hide on scroll
==index portfolio swiper
==do-section deco-word pseudo-sticky

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


/* ==========================================================
==index portfolio swiper
========================================================== */
(function() {
  var swiperContainers = document.querySelectorAll('.portfoiloSwiper');
  if (swiperContainers.length > 0 && typeof Swiper !== "undefined") {
    swiperContainers.forEach(function(container){
      new Swiper(container, {
        slidesPerView: 1,
        spaceBetween: 0,
        centeredSlides: true,
        loop: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          575: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          991: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
        },
      });
    });
  }
})();


/* ==========================================================
==do-section deco-word pseudo-sticky
========================================================== */
(function () {
  const section = document.querySelector('.do-section');
  const decoWord = section ? section.querySelector('.deco-word') : null;
  if (!section || !decoWord) return;

  const STICK_TOP = 80; // 距離 viewport 頂部多少 px 開始停留

  let offsetLeft = 0; // deco-word 預設狀態下，相對 .do-section 左側的距離
  let decoHeight = 0; // deco-word 自身高度（直書文字的縱向長度）

  // 清除 inline style，讓元素還原成 CSS 預設的定位狀態
  function resetStyle() {
    decoWord.style.position = '';
    decoWord.style.top = '';
    decoWord.style.bottom = '';
    decoWord.style.left = '';
  }

  // 量測預設狀態下的位置與高度，resize 時需要重新量測
  function measure() {
    resetStyle();
    const sectionRect = section.getBoundingClientRect();
    const decoRect = decoWord.getBoundingClientRect();
    offsetLeft = decoRect.left - sectionRect.left;
    decoHeight = decoRect.height;
  }

  function update() {
    const sectionRect = section.getBoundingClientRect();

    // 階段一：section 頂部還沒到達停留位置，維持 CSS 預設定位
    if (sectionRect.top > STICK_TOP) {
      resetStyle();
      return;
    }

    // 階段三：section 底部已經追上 deco-word，固定貼齊 section 底部
    if (sectionRect.bottom - decoHeight <= STICK_TOP) {
      decoWord.style.position = 'absolute';
      decoWord.style.top = 'auto';
      decoWord.style.bottom = '0px';
      decoWord.style.left = offsetLeft + 'px';
      return;
    }

    // 階段二：停留階段，用 fixed 模擬 sticky 停在 viewport 的 STICK_TOP 位置
    decoWord.style.position = 'fixed';
    decoWord.style.top = STICK_TOP + 'px';
    decoWord.style.bottom = 'auto';
    decoWord.style.left = sectionRect.left + offsetLeft + 'px';
  }

  function refresh() {
    measure();
    update();
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', refresh);
  window.addEventListener('load', refresh);
  document.addEventListener('DOMContentLoaded', refresh);

  refresh();
})();