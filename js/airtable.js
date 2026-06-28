// ============================================================
// airtable.js — PIN CHU 網站 Airtable 串接設定
// ============================================================

const AIRTABLE_TOKEN = 'patUPh1zxrMoBTDWv.259fa09f7b257ea9c862bfd03c8d0c4c94e3ecd10f74497d9b9a07d4e4069590';
const BASE_ID = 'appNNODrVowI0hJnA';

// 數字補零：1 → 01
function padNum(n) {
  return String(n).padStart(2, '0');
}

// 從網址取得參數
function getParam(key) {
  return new URLSearchParams(window.location.search).get(key) || '';
}

// ── service_list.html 用 ──────────────────────────────────
async function loadServices() {
  const loadingEl  = document.getElementById('loading-state');
  const errorEl    = document.getElementById('error-state');
  const cardsEl    = document.getElementById('service-cards');
  const dropdownEl = document.getElementById('nav-service-dropdown');
  if (!cardsEl) return; // 不在 service_list 頁就略過

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/Services?filterByFormula={Is_Active}=1`,
      { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } }
    );
    if (!res.ok) throw new Error('API 錯誤');
    const data = await res.json();
    const records = (data.records || []).reverse();

    loadingEl.style.display = 'none';
    if (!records || records.length === 0) {
      errorEl.textContent = '目前沒有服務項目。';
      errorEl.style.display = 'block';
      return;
    }

    records.forEach((record, index) => {
      const f = record.fields;
      const slug    = f.Slug || record.id;
      const title   = f.Title || '';
      const num     = padNum(index + 1);
      const desc    = f.Short_Description || '';
      const iconSrc = f.Icon?.[0]?.url || '';

      // 卡片
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-4 d-flex';
      col.innerHTML = `
        <a href="service_info.html?slug=${encodeURIComponent(slug)}"
           class="do-item d-flex flex-column position-relative overflow-hidden h-100 shadow w-100 align-items-stretch"
           style="min-height:100%;height:100%;">
          <div class="num">${num}</div>
          ${iconSrc ? `<img src="${iconSrc}" alt="${title}" width="80" class="d-block mb-3">` : ''}
          <h3 class="item-title color">${title}</h3>
          <p class="txt-gray two-row">${desc}</p>
          <small class="d-flex gap-2 more-btn position-relative justify-content-end">了解更多<i class="bi-arrow-right"></i></small>
        </a>`;
      cardsEl.appendChild(col);

      // 導覽列下拉
      if (dropdownEl) {
        const li = document.createElement('li');
        li.innerHTML = `<a class="dropdown-item" href="service_info.html?slug=${encodeURIComponent(slug)}">${title}</a>`;
        dropdownEl.appendChild(li);
      }
    });

  } catch (err) {
    console.error(err);
    loadingEl.style.display = 'none';
    errorEl.style.display = 'block';
  }
}

// ── service_info.html 用 ──────────────────────────────────

// 產生流程步驟 HTML
// 格式：每行一步驟，用 | 分隔標題和 badge；最後一個 badge 顯示綠色
function buildProcessSteps(stepsText) {
  if (!stepsText) return '';
  const lines = stepsText.split('\n').map(l => l.trim()).filter(l => l);
  const lastIndex = lines.length - 1;

  let html = '<div class="d-flex flex-wrap flex-lg-nowrap justify-content-between align-items-center">';
  lines.forEach((line, i) => {
    const [stepTitle, badge] = line.split('|').map(s => s.trim());
    const isLast = i === lastIndex;
    const badgeClass = isLast ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary';

    html += `
      <div class="item d-flex flex-column align-items-center gap-2${isLast ? ' last' : ''}">
        <div class="num rounded-circle d-flex align-items-center justify-content-center">${padNum(i + 1)}</div>
        <h3 class="item-title mb-0 mt-1 text-center">${stepTitle}</h3>
        ${badge ? `<span class="badge ${badgeClass}">${badge}</span>` : ''}
      </div>`;
    if (!isLast) {
      html += `<div class="arrow-img"><img src="img/arrow.svg" alt="" width="60"></div>`;
    }
  });
  html += '</div>';
  return html;
}

// 產生單一方案的 tab pane HTML
function buildPlanPane(plan, tabId, isFirst) {
  const f = plan.fields;
  const title        = f.Plan_Title || '';
  const desc         = f.Description || '';
  const price        = f.Price ? Number(f.Price).toLocaleString() : '';
  const priceNote    = f.Price_Note || '';
  const timeline     = f.Timeline || '';
  const timelineNote = f.Timeline_Note || '';
  const timelineSub  = f.Timeline_Sub || '';
  const steps        = f.Process_Steps || '';
  const imgSrc       = f.Image?.[0]?.url || 'img/service/service_960x595_1.png';

  return `
    <div class="tab-pane fade${isFirst ? ' show active' : ''}" id="${tabId}">
      <div class="service-item">
        <div class="row mb-4 mb-lg-5">
          <div class="col-lg-5">
            <img src="${imgSrc}" alt="${title}">
          </div>
          <div class="col-lg-7 mt-4 mt-lg-0">
            <div class="ps-lg-4">
              <div class="mb-4 mb-lg-5">
                <div class="d-inline-flex gap-3 mb-3">
                  <img src="img/title-deco.svg" alt="${title}">
                  <h1 class="info-title mb-0">${title}</h1>
                </div>
                <p>${desc}</p>
              </div>
              <div class="detail-wrap d-flex align-items-start py-4 border-top border-bottom position-relative">
                <div class="item">
                  <ul class="list-unstyled semicircle mb-2"><li>預估報價</li></ul>
                  <p class="price d-inline-flex align-items-end gap-2 mt-1 mb-2">
                    <span class="num">${price}</span><span class="word">起</span>
                  </p>
                  ${priceNote ? `<small class="txt-gray d-block">${priceNote}</small>` : ''}
                </div>
                <div class="item">
                  <ul class="list-unstyled semicircle mb-2"><li>預估時程</li></ul>
                  <p class="price d-inline-flex align-items-end gap-2 mt-1 mb-2">
                    <span class="num">${timeline}</span>
                    ${timelineNote ? `<span class="word">${timelineNote}</span>` : ''}
                  </p>
                  ${timelineSub ? `<small class="txt-gray d-block">${timelineSub}</small>` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
        ${steps ? `
        <div class="process-wrap">
          <ul class="list-unstyled semicircle mb-2 mb-lg-4"><li>服務流程</li></ul>
          ${buildProcessSteps(steps)}
        </div>` : ''}
      </div>
    </div>`;
}

async function loadServiceInfo() {
  const mainEl     = document.getElementById('main-content');
  if (!mainEl) return; // 不在 service_info 頁就略過

  const loadingEl  = document.getElementById('loading-state');
  const errorEl    = document.getElementById('error-state');
  const slug       = getParam('slug');

  try {
    // 1. 找到對應 slug 的服務
    const svcRes = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/Services?filterByFormula=AND({Is_Active}=1,{Slug}="${slug}")&maxRecords=1`,
      { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } }
    );
    if (!svcRes.ok) throw new Error('Services API 錯誤');
    const svcData = await svcRes.json();
    if (!svcData.records?.length) throw new Error('找不到服務');

    const service      = svcData.records[0];
    const sf           = service.fields;
    const serviceId    = service.id;
    const serviceTitle = sf.Title || '';
    const serviceDesc  = sf.Short_Description || '';

    // 2. 所有服務（導覽列 & 編號用）
    const allRes  = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/Services?filterByFormula={Is_Active}=1`,
      { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } }
    );
    const allData = await allRes.json();
    const allServices = (allData.records || []).reverse();

    // 3. 所有方案，前端篩選
    const plansRes = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/Service_Plans?filterByFormula={Is_Active}=1&sort[0][field]=Sort_Order&sort[0][direction]=asc`,
      { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } }
    );
    if (!plansRes.ok) throw new Error('Service_Plans API 錯誤');
    const plansData = await plansRes.json();
    const plans = (plansData.records || []).filter(r => {
      const svcField = r.fields.Service;
      return Array.isArray(svcField) && svcField.includes(serviceId);
    });

    // ── 填入頁面 ──

    // 編號（依 allServices 陣列位置）
    const idx        = allServices.findIndex(r => r.id === serviceId);
    const displayNum = padNum(idx + 1);

    document.title = `${serviceTitle} | PIN CHU`;
    document.getElementById('breadcrumb-title').textContent = serviceTitle;
    document.getElementById('service-num').textContent      = displayNum;
    document.getElementById('service-title').textContent    = serviceTitle;
    document.getElementById('service-desc').textContent     = serviceDesc;

    // 導覽列下拉
    const dropdown = document.getElementById('nav-service-dropdown');
    if (dropdown) {
      allServices.forEach(r => {
        const li = document.createElement('li');
        li.innerHTML = `<a class="dropdown-item" href="service_info.html?slug=${encodeURIComponent(r.fields.Slug || r.id)}">${r.fields.Title || ''}</a>`;
        dropdown.appendChild(li);
      });
    }

    // 方案 tabs
    const tabsEl    = document.getElementById('plan-tabs');
    const contentEl = document.getElementById('plan-content');

    if (!plans.length) {
      contentEl.innerHTML = '<p class="txt-gray text-center">此服務尚未設定方案。</p>';
    } else {
      plans.forEach((plan, i) => {
        const tabId   = `plan-tab-${i}`;
        const isFirst = i === 0;

        const li = document.createElement('li');
        li.className = 'nav-item';
        const tabLabel = plan.fields.Tab_Name || plan.fields.Plan_Title || `方案 ${i + 1}`;
        li.innerHTML = `<button class="nav-link${isFirst ? ' active' : ''}" data-bs-toggle="tab" data-bs-target="#${tabId}" type="button">${tabLabel}</button>`;
        tabsEl.appendChild(li);

        contentEl.innerHTML += buildPlanPane(plan, tabId, isFirst);
      });
    }

    loadingEl.style.display = 'none';
    mainEl.style.display    = 'block';

  } catch (err) {
    console.error(err);
    loadingEl.style.display = 'none';
    errorEl.style.display   = 'block';
  }
}


// ── portfolio_list.html 用 ────────────────────────────────
async function loadPortfolioList() {
  const cardsEl   = document.getElementById('portfolio-cards');
  if (!cardsEl) return;
  const loadingEl = document.getElementById('portfolio-loading');
  const errorEl   = document.getElementById('portfolio-error');
  const catListEl = document.getElementById('category-list');

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/Portfolios?filterByFormula={Is_Active}=1&sort[0][field]=Sort_Order&sort[0][direction]=asc`,
      { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } }
    );
    if (!res.ok) throw new Error('API 錯誤');
    const { records } = await res.json();

    loadingEl.style.display = 'none';
    if (!records || records.length === 0) {
      errorEl.style.display = 'block';
      return;
    }

    // 收集所有分類
    const categories = [...new Set(records.map(r => r.fields.Category).filter(Boolean))];
    categories.forEach(cat => {
      const li = document.createElement('li');
      li.className = 'py-1 my-2';
      li.dataset.category = cat;
      li.innerHTML = `<a href="javascript:void(0)">${cat}</a>`;
      catListEl.appendChild(li);
    });

    // 產生卡片
    function renderCards(filter) {
      cardsEl.innerHTML = '';
      const filtered = filter === 'all' ? records : records.filter(r => r.fields.Category === filter);
      filtered.forEach(record => {
        const f = record.fields;
        const slug    = f.Slug || record.id;
        const title   = f.Title || '';
        const desc    = f.Short_Description || '';
        const coverSrc = f.Cover?.[0]?.url || '';
        const col = document.createElement('div');
        col.className = 'col-6 col-lg-4';
        col.innerHTML = `
          <a href="portfolio_info.html?slug=${encodeURIComponent(slug)}" class="info-portfolio-item d-block position-relative">
            <div class="img-wrap border position-relative overflow-hidden">
              ${coverSrc ? `<img src="${coverSrc}" alt="${title}" class="d-block w-100">` : ''}
            </div>
            <div class="txt-wrap d-flex flex-column align-items-start justify-content-center border-top-0 border">
              <div class="p-sm-3">
                <h3 class="item-title two-row mb-1">${title}</h3>
                <p class="txt-gray two-row">${desc}</p>
              </div>
              <div class="more-btn px-sm-3 py-1 py-sm-2 border-top w-100 text-end">
                <small class="d-inline-flex gap-1">了解更多<i class="bi-arrow-right"></i></small>
              </div>
            </div>
          </a>`;
        cardsEl.appendChild(col);
      });
    }

    // 讀取網址 ?category 參數，自動篩選
    const initCategory = getParam('category') || 'all';
    const initLi = catListEl.querySelector(`li[data-category="${initCategory}"]`) || catListEl.querySelector('li[data-category="all"]');
    catListEl.querySelectorAll('li').forEach(l => l.classList.remove('active'));
    if (initLi) initLi.classList.add('active');
    renderCards(initCategory);

    // 分類篩選點擊
    catListEl.addEventListener('click', e => {
      const li = e.target.closest('li[data-category]');
      if (!li) return;
      catListEl.querySelectorAll('li').forEach(l => l.classList.remove('active'));
      li.classList.add('active');
      renderCards(li.dataset.category);
    });

  } catch (err) {
    console.error(err);
    loadingEl.style.display = 'none';
    errorEl.style.display = 'block';
  }
}

// ── portfolio_info.html 用 ────────────────────────────────
async function loadPortfolioInfo() {
  const mainEl = document.getElementById('portfolio-main');
  if (!mainEl) return;
  const loadingEl = document.getElementById('portfolio-loading');
  const errorEl   = document.getElementById('portfolio-error');
  const slug = getParam('slug');

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/Portfolios?filterByFormula=AND({Is_Active}=1,{Slug}="${slug}")&maxRecords=1`,
      { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } }
    );
    if (!res.ok) throw new Error('API 錯誤');
    const data = await res.json();
    if (!data.records?.length) throw new Error('找不到作品');

    const f = data.records[0].fields;
    const title    = f.Title || '';
    const desc     = f.Description || '';
    const tools    = f.Tools || '';
    const history  = f.History || '';
    const moreInfo = f.More_Info || '';
    const extUrl   = f.External_URL || '';
    const category = f.Category || '';
    const images   = f.Images || [];

    document.title = `${title} | PIN CHU`;
    const breadcrumbCat = document.getElementById('breadcrumb-category');
    breadcrumbCat.textContent = category;
    breadcrumbCat.href = `portfolio_list.html?category=${encodeURIComponent(category)}`;
    document.getElementById('breadcrumb-title').textContent    = title;
    document.getElementById('portfolio-title').textContent     = title;
    document.getElementById('portfolio-desc').textContent      = desc;

    // 外連連結
    const linkEl = document.getElementById('portfolio-link');
    if (extUrl) {
      linkEl.href = extUrl;
      linkEl.style.display = 'flex';
    } else {
      linkEl.style.display = 'none';
    }

    // 使用工具
    const toolsWrap = document.getElementById('portfolio-tools-wrap');
    if (tools) {
      document.getElementById('portfolio-tools').textContent = tools;
    } else {
      toolsWrap.style.display = 'none';
    }

    // 作品歷程（格式：標題|內容，每行一項）
    const historyWrap = document.getElementById('portfolio-history-wrap');
    if (history) {
      const historyEl = document.getElementById('portfolio-history');
      historyEl.innerHTML = history.split('\n').filter(l => l.trim()).map(l => {
        const parts = l.split('|');
        const label = parts[0].trim();
        const val   = parts[1] ? parts[1].trim() : '';
        return `<li class="d-flex flex-wrap align-items-start mb-1"><span>${label}</span><span class="txt-gray ms-1">${val}</span></li>`;
      }).join('');
    } else {
      historyWrap.style.display = 'none';
    }

    // 更多資訊
    const moreWrap = document.getElementById('portfolio-more-wrap');
    if (moreInfo) {
      document.getElementById('portfolio-more').textContent = moreInfo;
    } else {
      moreWrap.style.display = 'none';
    }

    // 圖片
    const imagesEl = document.getElementById('portfolio-images');
    if (images.length > 0) {
      images.forEach(img => {
        const el = document.createElement('img');
        el.src = img.url;
        el.alt = title;
        el.className = 'shadow d-block w-100 mb-3';
        imagesEl.appendChild(el);
      });
    }

    loadingEl.style.display = 'none';
    mainEl.style.display = 'block';

  } catch (err) {
    console.error(err);
    loadingEl.style.display = 'none';
    errorEl.style.display = 'block';
  }
}


// ── index.html 用：網站設計 & 平面設計區塊 ───────────────
async function loadIndexPortfolios() {
  const websiteEl = document.getElementById('index-website-cards');
  const graphicEl = document.querySelector('.portfoiloSwiper .swiper-wrapper');
  if (!websiteEl && !graphicEl) return;

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/Portfolios?filterByFormula={Is_Active}=1&sort[0][field]=Sort_Order&sort[0][direction]=asc`,
      { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } }
    );
    if (!res.ok) return;
    const { records } = await res.json();

    // 網站設計：前 6 筆
    if (websiteEl) {
      const websiteRecords = records.filter(r => r.fields.Category === '網站設計').slice(0, 6);
      websiteRecords.forEach(record => {
        const f = record.fields;
        const slug    = f.Slug || record.id;
        const title   = f.Title || '';
        const desc    = f.Short_Description || '';
        const coverSrc = f.Cover?.[0]?.url || '';
        const div = document.createElement('div');
        div.innerHTML = `
          <a href="portfolio_info.html?slug=${encodeURIComponent(slug)}" class="portfolio-item position-relative">
            ${coverSrc ? `<img src="${coverSrc}" alt="${title}" class="d-block w-100">` : ''}
            <div class="portfolio-overlay d-flex flex-column align-items-start justify-content-center z-1">
              <h3 class="item-title two-row mb-1 mb-lg-2">${title}</h3>
              <p class="txt two-row mb-2 mb-lg-3">${desc}</p>
              <small class="d-inline-flex gap-2 more-btn position-relative align-self-end">了解更多<i class="bi-arrow-right"></i></small>
            </div>
          </a>`;
        websiteEl.appendChild(div);
      });
    }

    // 平面設計：前 6 筆，swiper slides
    if (graphicEl) {
      graphicEl.innerHTML = '';
      const graphicRecords = records.filter(r => r.fields.Category === '平面設計').slice(0, 6);
      graphicRecords.forEach(record => {
        const f = record.fields;
        const slug    = f.Slug || record.id;
        const title   = f.Title || '';
        const desc    = f.Short_Description || '';
        const coverSrc = f.Cover?.[0]?.url || '';
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
          <a href="portfolio_info.html?slug=${encodeURIComponent(slug)}" class="portfolio-item position-relative">
            ${coverSrc ? `<img src="${coverSrc}" alt="${title}" class="d-block">` : ''}
            <div class="portfolio-overlay d-flex flex-column align-items-center align-items-lg-start justify-content-center z-1">
              <h3 class="item-title two-row mb-1 mb-lg-2">${title}</h3>
              <p class="txt two-row mb-2 mb-lg-3">${desc}</p>
              <small class="d-inline-flex gap-2 more-btn position-relative align-self-lg-end">了解更多<i class="bi-arrow-right"></i></small>
            </div>
          </a>`;
        graphicEl.appendChild(slide);
      });
    }

    // AOS 重新掃描動態載入的元素
    if (typeof AOS !== 'undefined') AOS.refresh();

    // 資料載入完成後再初始化 Swiper
    if (graphicEl && typeof Swiper !== 'undefined') {
      const container = document.querySelector('.portfoiloSwiper');
      if (container) {
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
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          breakpoints: {
            575: { slidesPerView: 2, spaceBetween: 10 },
            991: { slidesPerView: 3, spaceBetween: 15 },
          },
        });
      }
    }

  } catch (err) {
    console.error('Index portfolios error:', err);
  }
}

// 所有頁面都執行：填經典案例下拉
async function loadPortfolioNavDropdown() {
  const dropdownEl = document.getElementById('nav-portfolio-dropdown');
  if (!dropdownEl) return;

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/Portfolios?filterByFormula={Is_Active}=1`,
      { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } }
    );
    if (!res.ok) return;
    const data = await res.json();
    const categories = [...new Set((data.records || []).map(r => r.fields.Category).filter(Boolean))];

    categories.forEach(cat => {
      const li = document.createElement('li');
      li.innerHTML = `<a class="dropdown-item" href="portfolio_list.html?category=${encodeURIComponent(cat)}">${cat}</a>`;
      dropdownEl.appendChild(li);
    });
  } catch (err) {
    console.error('Portfolio nav error:', err);
  }
}

// 所有頁面都執行：填導覽列下拉
async function loadNavDropdown() {
  const dropdownEl = document.getElementById('nav-service-dropdown');
  if (!dropdownEl) return;
  // service_list 和 service_info 自己的函式會填，不重複
  if (document.getElementById('service-cards')) return;
  if (document.getElementById('main-content')) return;

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/Services?filterByFormula={Is_Active}=1`,
      { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } }
    );
    if (!res.ok) return;
    const data = await res.json();
    const records = (data.records || []).reverse();
    records.forEach(r => {
      const slug  = r.fields.Slug || r.id;
      const title = r.fields.Title || '';
      const li = document.createElement('li');
      li.innerHTML = `<a class="dropdown-item" href="service_info.html?slug=${encodeURIComponent(slug)}">${title}</a>`;
      dropdownEl.appendChild(li);
    });
  } catch (err) {
    console.error('Nav dropdown error:', err);
  }
}

// 自動判斷在哪一頁並執行
document.addEventListener('DOMContentLoaded', () => {
  loadNavDropdown();
  loadPortfolioNavDropdown();
  if (document.getElementById('service-cards'))   loadServices();
  if (document.getElementById('main-content'))     loadServiceInfo();
  if (document.getElementById('portfolio-cards'))  loadPortfolioList();
  if (document.getElementById('portfolio-main'))   loadPortfolioInfo();
  if (document.getElementById('index-website-cards') || document.querySelector('.portfoiloSwiper')) loadIndexPortfolios();
});
