(() => {
  const grid = document.querySelector('#catalog-grid');
  if (!grid) return;
  const base = document.documentElement.dataset.base || '';

  const categoryMeta = [
    ['01', '自动化移液工作站'],
    ['02', '全自动克隆筛选接种工作站'],
    ['03', '分液仪'],
    ['04', '封膜仪'],
    ['05', '耗材与试剂'],
    ['06', '核酸、蛋白、细胞与动物实验'],
    ['07', '摇床、培养箱、恒温与混匀'],
    ['08', '离心、干燥与浓缩'],
    ['09', '蛋白质研究'],
    ['10', '细胞生物学研究'],
    ['11', '小动物体内研究']
  ];

  const ownProducts = [
    ['own-wenyao', '文鳐', '01', '/media/products/wenyao.webp', '中高端、高通量、高灵活的自动化样品处理系统，支持模块集成与场景方案微定制。'],
    ['own-chenghuang-ze', '乘黄-ZE', '01', '/media/products/chenghuang-ze.webp', '新一代96通道全自动样品处理系统，兼顾高性价比、安全性与软件功能。'],
    ['own-jiliang-et', '吉量-ET', '01', '/media/products/jiliang-zt.webp', '面向多耗材液体操作与合规场景的紧凑型自动化样品处理平台。'],
    ['own-yingzhao', '英招全自动克隆筛选接种工作站', '02', '/media/catalog/products/own-yingzhao.webp', '支持标准平皿自动涂布与划线，面向克隆筛选接种流程的无人值守运行。'],
    ['own-qinggeng', '青耕分液仪', '03', '/media/products/qinggeng.webp', '最高12通道分液，支持孔板、管类耗材与多种液体分配。'],
    ['own-qinggeng-8', '青耕-8分液仪', '03', '/media/products/qinggeng-8.webp', '紧凑型8通道快速分液平台，适配多规格SBS标准板。'],
    ['own-bifang', '毕方分液仪', '03', '/media/products/bifang.webp', '基于Scara运动技术的高效率自动分液平台。'],
    ['own-dangkang', '当康封膜仪', '04', '/media/products/dangkang.webp', '一键快速片膜封膜，兼容多种高度孔板。'],
    ['own-dangkang-x', '当康X封膜仪', '04', '/media/products/dangkang-x.webp', '卷膜方式连续封膜，适配3-60mm高度孔板。'],
    ['own-auto-tip', '自动化吸头', '05', '/media/catalog/products/own-consumable-01.webp', '面向自动化移液平台的配套吸头。'],
    ['own-universal-tip', '通用吸头', '05', '/media/catalog/products/own-consumable-02.webp', '覆盖常用移液规格的通用吸头。'],
    ['own-microplate', '微孔板', '05', '/media/catalog/products/own-consumable-03.webp', '适配实验室自动化流程的多规格微孔板。'],
    ['own-reservoir', '储液槽', '05', '/media/catalog/products/own-consumable-04.webp', '适用于自动化液体分配流程的储液耗材。'],
    ['own-protein', '植物源重组蛋白', '05', '/media/catalog/products/own-consumable-05.webp', '植物源表达的重组蛋白产品。']
  ].map(([id, name, categoryCode, image, summary]) => ({ id, name, categoryCode, image, summary, source: 'own' }));

  const agencyGroups = [
    ['06', [
      'ZF系列全自动核酸提取仪', 'ZF-10梯度PCR仪', 'Gene-8C等温扩增实时荧光检测仪', 'ZJ-2000原位杂交仪', 'celetrix电转仪',
      'ZF-Multra系列多功能酶标仪', 'zMR系列全自动酶标仪', 'ZF-812洗板机', 'ZBC-108蓝光切胶仪', 'ZF-DE96自动开关盖机',
      'zNano系列超微量分光光度计', 'zFluo-1荧光计', 'NextGen FFE自由流电泳', 'JN系列超高压细胞破碎机', 'YM系列研磨仪',
      'ZF-T600A小动物麻醉机', '全自动二合一移液吸头装盒机'
    ]],
    ['07', [
      'ZS系列加热型恒温摇床', 'YC系列轨道式细胞摇床', 'RS系列翘板摇床', 'ZFGZ-Q系列LED光照培养箱', 'ZFGZ系列LED光照培养箱',
      'ZN10系列试管恒温仪', '微孔板恒温振荡器', 'ZF2000-2干式恒温器', 'Mini系列金属浴', 'MiniT生物指示剂培养器',
      'JSY系列金属浴', 'SYD系列热盖金属浴', 'JSY-L干式恒温器', 'HY-3000混匀小精灵', 'HY-2500迷你混合仪',
      'HY-1500R恒温混匀仪', 'HY-1迷你涡旋仪', 'ZWH系列恒温水浴槽', 'FY系列微孔板恒温振荡器', 'WKBZD-4微孔板振荡器',
      'GWJSY系列金属浴', 'HY-100多管涡旋混合仪', 'ZVM-100旋转混合仪', 'ZTM-80转盘混合仪', 'ZRT-20 3D混合仪',
      'ZRM-80滚轴混合仪', 'ZS-8多通道磁力搅拌器', 'ZHS-350加热型磁力搅拌器', 'ZHS-350C加热型磁力搅拌器', 'MJ系列红外接种环灭菌器',
      '玻璃珠灭菌器', 'ZFA纯水机'
    ]],
    ['08', [
      'ZF-T系列台式离心机', 'LX系列微型微量高速离心机', 'LX-B微孔板迷你离心机', '干燥箱', 'DC-150氮吹仪', 'ZF系列真空离心浓缩仪'
    ]],
    ['09', [
      'InnoElectro360多功能电泳工作站', 'WB-600Auto全自动蛋白印迹处理系统', 'WB-600Pro全自动蛋白印迹处理系统', 'WB-1200Auto全自动蛋白印迹处理系统', 'GelView9000 Max智能图像工作站',
      'GelView6000 Max智能图像工作站', 'GelView4000 Lite智能视界凝胶成像系统', 'GelView9000 Lite智能视界化学发光成像系统', 'GelView5000 Pro II全自动凝胶成像系统', 'GelView6000 Pro II多功能图像工作站',
      'GelView5000 Plus智能凝胶成像系统', 'GelView6000 Plus智能图像工作站', 'Lux-T020 Pro高灵敏度管式发光检测仪', 'Lux-P110高灵敏度板式发光检测仪', 'FCS分子互作分析仪'
    ]],
    ['10', [
      'iSTORM系列超高分辨率显微成像系统', 'PanoScan-Dual智能倒置荧光显微分析系统', '赛乐微活细胞分析系统', 'INCount系列全自动细胞计数仪', '干式智能细胞复苏仪'
    ]],
    ['11', [
      'AniView SE小动物活体成像系统', 'AniView 100/600多模式动物活体成像系统', 'AniView Pro', 'AniView X系列多模式动物活体成像系统', 'AniView DXA系列多模式动物活体成像系统',
      'AniView 30F近红外二区活体成像系统', 'AniView Phoenix X/DXA系列全光谱动物活体成像系统', 'AniView Kirin系列小动物活体三维成像系统', 'Gscan系列组织全景扫描仪',
      'SkyView系列小动物活体CT多模态融合成像系统', '多模态显微/内窥小动物成像系统'
    ]]
  ];

  const categoryName = Object.fromEntries(categoryMeta);
  const agencySummary = {
    '06': '核酸处理、检测分析、样品制备及动物实验基础设备。',
    '07': '培养、恒温、振荡、混匀、搅拌与灭菌设备。',
    '08': '离心、干燥、氮吹与真空浓缩设备。',
    '09': '电泳、蛋白印迹、凝胶与发光成像分析设备。',
    '10': '显微成像、活细胞分析、细胞计数与复苏设备。',
    '11': '小动物活体、荧光、CT及多模态成像设备。'
  };

  const agencyProducts = agencyGroups.flatMap(([categoryCode, names]) => names.map((name, index) => ({
    id: `agency-${categoryCode}-${String(index + 1).padStart(2, '0')}`,
    name,
    categoryCode,
    image: `/media/catalog/products/agency-${categoryCode}-${String(index + 1).padStart(2, '0')}.webp`,
    summary: agencySummary[categoryCode],
    source: 'agency'
  })));

  const products = [...ownProducts, ...agencyProducts].map((product) => ({ ...product, category: categoryName[product.categoryCode] }));
  const productMap = new Map(products.map((product) => [product.id, product]));
  const storageKey = 'zuofei-product-selection-v1';

  const searchInput = document.querySelector('#product-search');
  const categorySelect = document.querySelector('#product-category');
  const sourceButtons = [...document.querySelectorAll('[data-source]')];
  const resultCount = document.querySelector('#catalog-result-count');
  const clearFiltersButton = document.querySelector('#clear-filters');
  const emptyState = document.querySelector('#catalog-empty');
  const emptyClear = document.querySelector('#empty-clear');
  const selectionDock = document.querySelector('#selection-dock');
  const selectionCount = document.querySelector('#selection-count');
  const selectionPreview = document.querySelector('#selection-preview');
  const selectionDialog = document.querySelector('#selection-dialog');
  const selectionList = document.querySelector('#selection-list');
  const selectionListCount = document.querySelector('#selection-list-count');
  const selectionStatus = document.querySelector('#selection-status');
  const form = document.querySelector('#selection-form');
  let source = 'all';
  let selected = new Set();

  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    selected = new Set(stored.filter((id) => productMap.has(id)));
  } catch (_) {}

  categoryMeta.forEach(([code, name]) => {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = `${code} · ${name}`;
    categorySelect.append(option);
  });

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
  const selectedProducts = () => [...selected].map((id) => productMap.get(id)).filter(Boolean);
  const persistSelection = () => localStorage.setItem(storageKey, JSON.stringify([...selected]));

  function filteredProducts() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    return products.filter((product) => {
      if (source !== 'all' && product.source !== source) return false;
      if (category !== 'all' && product.categoryCode !== category) return false;
      if (!query) return true;
      return `${product.name} ${product.category} ${product.summary} ${product.source === 'own' ? '昨非 自研' : '代理'}`.toLowerCase().includes(query);
    });
  }

  function renderProducts() {
    const visible = filteredProducts();
    resultCount.textContent = `共${visible.length}款产品`;
    emptyState.hidden = visible.length !== 0;
    grid.hidden = visible.length === 0;
    grid.innerHTML = visible.map((product) => {
      const isSelected = selected.has(product.id);
      return `<article class="shop-product-card${isSelected ? ' is-selected' : ''}" data-product-id="${product.id}">
        <div class="shop-product-media"><img src="${base}${product.image}" alt="${escapeHtml(product.name)}" loading="lazy"><span class="shop-product-source shop-product-source--${product.source}">${product.source === 'own' ? '昨非自研' : '精选代理'}</span></div>
        <div class="shop-product-copy"><p class="shop-product-category">${product.categoryCode} · ${escapeHtml(product.category)}</p><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.summary)}</p></div>
        <button class="shop-product-select" type="button" data-select-product="${product.id}" aria-pressed="${isSelected}"><span aria-hidden="true">${isSelected ? '✓' : '+'}</span>${isSelected ? '已加入咨询' : '加入咨询'}</button>
      </article>`;
    }).join('');
  }

  function renderSelection() {
    const items = selectedProducts();
    selectionDock.hidden = items.length === 0;
    selectionCount.textContent = String(items.length);
    selectionListCount.textContent = String(items.length);
    selectionPreview.textContent = items.length ? items.slice(0, 2).map((item) => item.name).join('、') + (items.length > 2 ? ` 等${items.length}款` : '') : '请选择需要咨询的产品';
    selectionList.innerHTML = items.length ? items.map((product) => `<li><div><span>${product.source === 'own' ? '自研' : '代理'} · ${product.category}</span><strong>${escapeHtml(product.name)}</strong></div><button type="button" data-remove-product="${product.id}" aria-label="从清单移除${escapeHtml(product.name)}">移除</button></li>`).join('') : '<li class="selection-list-empty">还没有选择产品，请返回产品目录添加。</li>';
    document.body.classList.toggle('has-selection-dock', items.length > 0);
    persistSelection();
  }

  function toggleProduct(id) {
    if (selected.has(id)) selected.delete(id); else selected.add(id);
    renderProducts();
    renderSelection();
  }

  function clearFilters() {
    searchInput.value = '';
    categorySelect.value = 'all';
    source = 'all';
    sourceButtons.forEach((button) => {
      const active = button.dataset.source === 'all';
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    renderProducts();
  }

  function openSelection() {
    renderSelection();
    selectionStatus.textContent = '';
    if (typeof selectionDialog.showModal === 'function') selectionDialog.showModal();
  }

  grid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-select-product]');
    if (button) toggleProduct(button.dataset.selectProduct);
  });
  searchInput.addEventListener('input', renderProducts);
  categorySelect.addEventListener('change', renderProducts);
  sourceButtons.forEach((button) => button.addEventListener('click', () => {
    source = button.dataset.source;
    sourceButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    renderProducts();
  }));
  clearFiltersButton.addEventListener('click', clearFilters);
  emptyClear.addEventListener('click', clearFilters);
  document.querySelector('#open-selection').addEventListener('click', openSelection);
  document.querySelector('#help-open-selection').addEventListener('click', openSelection);
  document.querySelector('.selection-close').addEventListener('click', () => selectionDialog.close());
  selectionDialog.addEventListener('click', (event) => { if (event.target === selectionDialog) selectionDialog.close(); });
  selectionList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove-product]');
    if (!button) return;
    selected.delete(button.dataset.removeProduct);
    renderProducts();
    renderSelection();
  });
  document.querySelector('#clear-selection').addEventListener('click', () => {
    selected.clear();
    renderProducts();
    renderSelection();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const items = selectedProducts();
    if (!items.length) {
      selectionStatus.textContent = '请先选择至少一款产品。';
      return;
    }
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const phone = String(values.get('phone') || '').trim();
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      selectionStatus.textContent = '请输入正确的11位手机号码。';
      selectionStatus.classList.add('is-error');
      form.elements.phone.focus();
      return;
    }
    const list = items.map((item, index) => `${index + 1}. ${item.name}（${item.source === 'own' ? '昨非自研' : '精选代理'} / ${item.category}）`).join('\n');
    const forms = window.ZUOFEI_FORMS;
    if (!forms) {
      selectionStatus.textContent = '在线接收服务尚未加载，请刷新页面后重试。';
      selectionStatus.classList.add('is-error');
      return;
    }

    forms.setSubmitting(form, true, '正在提交产品咨询…');
    try {
      await forms.submitLead({
        formType: 'products',
        products: list,
        name: String(values.get('name') || '').trim(),
        phone,
        company: String(values.get('company') || '').trim(),
        email: String(values.get('email') || '').trim(),
        message: String(values.get('message') || '').trim(),
        website: ''
      });
      form.reset();
      selected.clear();
      renderProducts();
      renderSelection();
      forms.setSubmitting(form, false, '提交成功。昨非团队已收到产品清单，会尽快联系你。', 'success');
    } catch (error) {
      forms.setSubmitting(form, false, forms.submissionErrorMessage(error), 'error');
    }
  });

  renderProducts();
  renderSelection();
})();
