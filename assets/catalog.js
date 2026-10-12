(() => {
  const grid = document.querySelector('#catalog-grid');
  if (!grid) return;
  const base = document.documentElement.dataset.base || '';

  const categoryMeta = [
    ['01', '自动化移液工作站'],
    ['02', '全自动克隆筛选接种工作站'],
    ['03', '分液仪'],
    ['04', '封膜仪'],
    ['05', '试剂耗材'],
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
    ['own-dangkang-x', '当康X封膜仪', '04', '/media/products/dangkang-x.webp', '卷膜方式连续封膜，适配3-60mm高度孔板。']
  ].map(([id, name, categoryCode, image, summary, model, details = {}]) => ({
    id,
    name,
    categoryCode,
    image,
    summary,
    ...(model ? { model } : {}),
    ...details,
    source: categoryCode === '05' ? 'consumable' : 'own'
  }));

  // Consumables are maintained by product code against 耗材清单.pdf (2026-10-12).
  // Blank remarks stay blank unless the user explicitly supplies a correction.
  // Z00353 packaging was confirmed by the user on 2026-10-12.
  const tipBox50 = ['一体盒', '10小盒/中盒', '5中盒/箱', '50小盒/箱', '（2箱起含运费）'];
  const tipBox16 = ['一体盒', '16小盒/箱', '（2箱起含运费）'];
  const tipBag = ['起订量：1箱', '（2箱起含运费）'];
  const consumableSeries = {
    i: { name: 'I-规格吸头', compatibility: '配套文鳐、吉量使用' },
    t: { name: 'T规格吸头', compatibility: '配套CH-200/CH-1000/文鳐96使用' },
    hg: { name: 'T规格吸头', compatibility: '配套文鳐96使用' },
    td: { name: 'TD袋装吸头' }
  };
  const consumableProducts = [
    ['Z05417', 'I-TIPS-12.5.10-S', 'i', 'i-12-5', '12.5μl透明灭菌-384/盒', tipBox50],
    ['Z05418', 'I-TIPS-12.5.11-S', 'i', 'i-12-5', '12.5μl透明灭菌-385/盒', tipBox50],
    ['Z05851', 'I-TIPS-125.10-S', 'i', 'i-125', '125μl透明灭菌-384/盒', tipBox50],
    ['Z00352', 'I-TIPS-125-LX.10-S', 'i', 'i-125', '125μl透明灭菌带滤芯-384/盒', tipBox50],
    ['Z05392', 'I-TIPS-300.10-S', 'i', 'i-300', '300μl透明灭菌-96/盒', tipBox50],
    ['Z00353', 'I-TIPS-300-LX.10-S', 'i', 'i-300', '300μl透明灭菌带滤芯-96/盒', tipBox50],
    ['Z05604', 'I-TIPS-1250.10-S', 'i', 'i-1250', '1250μl透明灭菌-96/盒'],
    ['Z05659', 'I-TIPS-1250-LX.10-S', 'i', 'i-1250', '1250μl透明灭菌带滤芯-96/盒'],
    ['Z06175', 'T-TIPS-50.10-S', 't', 't-50', '50μl透明灭菌-96支/盒', tipBox50],
    ['Z05658', 'T-TIPS-50-LX-S', 't', 't-50', '50μl透明灭菌带滤芯-96支/盒', tipBox50],
    ['Z06034', 'T-TIPS-200.10-S', 't', 't-200', '200μl透明灭菌-96支/盒', tipBox50],
    ['Z05592', 'T-TIPS-200-LX.10-S', 't', 't-200', '200μl透明灭菌带滤芯-96支/盒', tipBox50],
    ['Z06130', 'T-TIPS-1000.10-S', 't', 't-1000', '1000μl透明灭菌-96支/盒', tipBox16],
    ['Z06198', 'T-TIPS-1000-LX-S', 't', 't-1000', '1000μl透明灭菌带滤芯-96支/盒', tipBox16],
    // Z06323 replaces the 300μl SKU per the user's updated product record (2026-10-12).
    ['Z06323', 'TD-TIPS-50', 'T-规格吸头', 'td-tips', '50μL/透明/非灭菌，1000支/袋，10袋/箱', ['单位：箱', ...tipBag]],
    ['Z06074', 'TD-TIPS-200', 'td', 'td-tips', '200μl透明-1000支/袋，10袋/箱', tipBag],
    ['Z06167', 'TD-TIPS-1000', 'td', 'td-tips', '1000μl透明-1000支/袋，10袋/箱', tipBag],
    ['Z06178', 'T-TIPS-HG.50.10-S', 'hg', 'hg-50', '50μl透明灭菌-96支/盒', tipBox50],
    ['Z06179', 'T-TIPS-HG.50.10-LX-S', 'hg', 'hg-50', '50μl透明灭菌带滤芯-96支/盒', tipBox50],
    ['Z06124', 'T-TIPS-HG.200.10-S', 'hg', 'hg-200', '200μl透明灭菌-96支/盒', tipBox50],
    ['Z06126', 'T-TIPS-HG.200-LX.10-S', 'hg', 'hg-200', '200μl透明灭菌带滤芯-96支/盒', tipBox50],
    ['Z06180', 'T-TIPS-HG.1000.10-S', 'hg', 'hg-1000', '1000μl透明灭菌-96支/盒', tipBox50],
    ['Z06181', 'T-TIPS-HG.1000-LX.10-S', 'hg', 'hg-1000', '1000μl透明灭菌带滤芯-96支/盒', tipBox50],
    ['Z05946', 'C-195-96V', '96道单孔储液槽（锥底）', 'reservoir-96', '5个/袋，10袋/箱'],
    ['Z05948', 'C-195-96V-S', '96道单孔储液槽（锥底） 无菌', 'reservoir-96', '5个/袋，10袋/箱'],
    ['Z00329', 'C-195-S', '190ml储液槽', 'reservoir-190', '透明平底 灭菌，190ml，5块/袋，2袋/盒，10袋/箱'],
    ['Z05182', 'C-50-S', '50ml储液槽', 'reservoir-50', '白色锥底、灭菌 50ml、单个装'],
    ['Z02162', 'C-15-12V-S', '12道储液槽', 'reservoir-12', '5个/袋，10袋/箱'],
    ['Z05439', 'C-75-4V-S', '4道储液槽，高裙边', 'reservoir-4', '75ml/孔，灭菌，5个/袋，10袋/箱'],
    ['Z05959', 'B-2.2U-S', '96孔深孔板', 'deep-well-plate', '2.2ml，5个/包，10包/箱，灭菌，无热源，方孔U底'],
    ['Z05823', 'HSM-PA', '可穿刺-铝箔热封膜', 'film-pa', '125mm*80mm，10片/袋'],
    ['Z05341', 'HSM-TA', '光面铝箔热封膜（可撕）', 'film-ta', '100片/包，50包/箱 125mm*83mm'],
    ['Z05342', 'HSM-YW', '压纹铝箔热封板膜', 'film-yw', '100片/包，50包/箱 125mm*83mm'],
    ['Z00410', 'ZF-9-S-EP2', '96/384孔板用铝箔（2丝）', 'film-ep2', '100张/包'],
    ['Z06278', 'G-XQ-100', '血清移液管-100', 'serological-pipettes', '10支/包，10包/箱/灭菌（100支/箱）'],
    ['Z06277', 'G-XQ-50', '血清移液管-50', 'serological-pipettes', '25支/包，8包/箱/灭菌（200支/箱）'],
    ['Z06276', 'G-XQ-25', '血清移液管-25', 'serological-pipettes', '25支/包，10包/箱/灭菌（250支/箱）'],
    ['Z06275', 'G-XQ-10', '血清移液管-10', 'serological-pipettes', '50支/包，10包/箱/灭菌（500支/箱）'],
    ['Z06274', 'G-XQ-5', '血清移液管-5', 'serological-pipettes', '50支/包，10包/箱/灭菌（500支/箱）']
  ].map(([productCode, model, seriesOrName, image, summary, notes = []]) => ({
    // Retain this existing SKU's selection ID; removed generic IDs are filtered out on load.
    id: productCode === 'Z05851' ? 'consumable-i-tips-125-10-s' : `consumable-${productCode.toLowerCase()}`,
    ...(consumableSeries[seriesOrName] || { name: seriesOrName }),
    productCode,
    model,
    categoryCode: '05',
    source: 'consumable',
    image: `/media/catalog/consumables/${image}.webp`,
    summary,
    ...(notes.length ? {
      packaging: notes.filter((note) => !note.includes('含运费')),
      shipping: notes.find((note) => note.includes('含运费')) || ''
    } : {})
  }));

  const agencyGroups = [
    ['06', [
      'ZF系列全自动核酸提取仪', 'ZF-10梯度PCR仪', 'Gene-8C等温扩增实时荧光检测仪', 'ZJ-2000原位杂交仪', 'celetrix电转仪',
      'ZF-Multra系列多功能酶标仪', 'zMR系列全自动酶标仪', 'ZF-812洗板机', 'ZBC-108蓝光切胶仪', 'ZF-DE96自动开关盖机',
      'zNano系列超微量分光光度计', 'zFluo-1荧光计', 'NextGen FFE自由流电泳', 'JN系列超高压细胞破碎机', 'YM系列研磨仪',
      'ZF-T600A小动物麻醉机', '全自动二合一移液吸头装盒机',
      'AT-200实时荧光定量PCR仪器', 'AT-300全自动螺旋加样仪', 'ZRyes F6全波长酶标仪', 'ZF-Multi多功能酶标仪'
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
      'iSTORM系列超高分辨率显微成像系统', 'PanoScan-Dual智能倒置荧光显微分析系统', '赛乐微活细胞分析系统', 'INCount系列全自动细胞计数仪'
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
    '10': '显微成像、活细胞分析与细胞计数设备。',
    '11': '小动物活体、荧光、CT及多模态成像设备。'
  };

  const agencyImageOverrides = {
    'ZF-Multra系列多功能酶标仪': '/media/catalog/products/zf-multra.png',
    'zMR系列全自动酶标仪': '/media/catalog/products/zmr-v2.png',
    'AniView Pro': '/media/catalog/products/aniview-pro-v3.png',
    'AniView X系列多模式动物活体成像系统': '/media/catalog/products/aniview-x-dxa-v3.png',
    'AniView DXA系列多模式动物活体成像系统': '/media/catalog/products/aniview-x-dxa-v3.png',
    'AniView 30F近红外二区活体成像系统': '/media/catalog/products/aniview-30f-v4.png',
    'AniView Phoenix X/DXA系列全光谱动物活体成像系统': '/media/catalog/products/aniview-phoenix-v4.png',
    'AniView Kirin系列小动物活体三维成像系统': '/media/catalog/products/aniview-kirin-v4.png',
    'Gscan系列组织全景扫描仪': '/media/catalog/products/gscan-v3.png',
    'SkyView系列小动物活体CT多模态融合成像系统': '/media/catalog/products/skyview-v3.png'
  };

  const agencyProductDetails = {
    'AT-200实时荧光定量PCR仪器': {
      image: '/media/catalog/products/at-200-qpcr.png',
      summary: '集成磁珠提取、体系加样、qPCR扩增与结果分析，支持全流程自动化操作。'
    },
    'AT-300全自动螺旋加样仪': {
      image: '/media/catalog/products/at-300-spiral-plater.png',
      summary: '自动完成均质袋开袋、梯度稀释、培养皿加液与涂板，支持耗材自动上下料。'
    },
    'ZRyes F6全波长酶标仪': {
      image: '/media/catalog/products/zryes-f6.png',
      summary: '全波长酶标仪在生物，医学等领域广泛应用的分析仪器。适用蛋白质定量、细胞增殖与毒性检测、农药兽药残留检测等'
    },
    'ZF-Multi多功能酶标仪': {
      image: '/media/catalog/products/zf-multi.png',
      summary: '12英寸高分辨电容嵌入触摸屏，嵌入触摸屏幕支持6-384孔板。\n全波长比色皿功能：标准1cm立式比色皿'
    }
  };

  const agencyProducts = agencyGroups.flatMap(([categoryCode, names]) => names.map((name, index) => ({
    id: `agency-${categoryCode}-${String(index + 1).padStart(2, '0')}`,
    name,
    categoryCode,
    image: agencyImageOverrides[name] || `/media/catalog/products/agency-${categoryCode}-${String(index + 1).padStart(2, '0')}.webp`,
    summary: agencySummary[categoryCode],
    source: 'agency',
    ...agencyProductDetails[name]
  })));

  const products = [...ownProducts, ...consumableProducts, ...agencyProducts].map((product) => ({ ...product, category: categoryName[product.categoryCode] }));
  const productMap = new Map(products.map((product) => [product.id, product]));
  // Merge same-photo consumable cards, not their SKU records. Inquiry IDs stay exact.
  const productGroups = [];
  const consumableImageGroups = new Map();
  products.forEach((product) => {
    const existing = product.source === 'consumable' && consumableImageGroups.get(product.image);
    if (existing) {
      existing.variants.push(product);
    } else {
      const group = { id: product.id, variants: [product] };
      productGroups.push(group);
      if (product.source === 'consumable') consumableImageGroups.set(product.image, group);
    }
  });
  const groupMap = new Map(productGroups.map((group) => [group.id, group]));
  const variantChoices = new Map();
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
  const sourceLabel = (product) => product.source === 'own' ? '自动化产品' : product.source === 'consumable' ? '试剂耗材' : '常规仪器';
  const productName = (product) => product.name + (product.compatibility ? `（${product.compatibility}）` : '');
  const productLabel = (product) => product.model ? `${productName(product)}（${product.model}）` : productName(product);
  const selectedProducts = () => [...selected].map((id) => productMap.get(id)).filter(Boolean);
  const persistSelection = () => localStorage.setItem(storageKey, JSON.stringify([...selected]));

  function filteredProductGroups() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    const matches = (product) => {
      if (source !== 'all' && product.source !== source) return false;
      if (category !== 'all' && product.categoryCode !== category) return false;
      if (!query) return true;
      return `${productName(product)} ${product.model || ''} ${product.productCode || ''} ${product.category} ${product.summary} ${(product.packaging || []).join(' ')} ${product.shipping || ''} ${sourceLabel(product)}`.toLowerCase().includes(query);
    };
    return productGroups.map((group) => ({ group, matches: group.variants.filter(matches) })).filter((entry) => entry.matches.length);
  }

  function groupName(group, activeProduct = group.variants[0]) {
    const product = group.variants[0];
    if (product.source !== 'consumable') return product.name;
    if (product.model.startsWith('TD-TIPS-')) return activeProduct.name;
    if (product.model.startsWith('G-XQ-')) return '血清移液管';
    const capacities = [...new Set(group.variants.map((variant) => variant.summary.match(/^[\d.]+μl/)?.[0]))];
    return capacities.length === 1 && capacities[0] ? `${product.name} · ${capacities[0]}` : product.name;
  }

  function variantLabel(product, group) {
    if (group.variants.some((variant) => variant.summary.includes('带滤芯'))) {
      return product.summary.includes('带滤芯') ? '带滤芯' : '标准款';
    }
    if (product.model.startsWith('G-XQ-')) return product.model;
    if (product.model.startsWith('TD-TIPS-')) return product.summary.match(/^[\d.]+μl/i)?.[0] || product.model;
    if (group.variants.some((variant) => variant.name.includes('无菌'))) {
      return product.name.includes('无菌') ? '无菌款' : '标准款';
    }
    return product.summary;
  }

  function productDetailsMarkup(product) {
    return `${product.productCode ? `<p class="shop-product-model">产品编号：${escapeHtml(product.productCode)}</p>` : ''}${product.model ? `<p class="shop-product-model">型号：${escapeHtml(product.model)}</p>` : ''}${product.summary.split('\n').map((paragraph) => `<p class="shop-product-summary">${escapeHtml(paragraph)}</p>`).join('')}${product.packaging ? `<div class="shop-product-details"><ul class="shop-product-packaging">${product.packaging.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>${product.shipping ? `<p class="shop-product-shipping">${escapeHtml(product.shipping)}</p>` : ''}</div>` : ''}`;
  }

  function selectButtonMarkup(isSelected) {
    return `<span aria-hidden="true">${isSelected ? '✓' : '+'}</span>${isSelected ? '已加入咨询' : '加入咨询'}`;
  }

  function chosenVariant(group, matches) {
    const query = searchInput.value.trim().toLowerCase();
    const choice = variantChoices.get(group.id);
    // New searches reveal their matching SKU. Explicit choices made afterwards
    // survive rerenders, even if another variant originally matched that search.
    const product = choice && (choice.query === query || matches.some((variant) => variant.id === choice.id))
      ? productMap.get(choice.id) : matches[0];
    variantChoices.set(group.id, { id: product.id, query });
    return product;
  }

  function updateProductCard(card, product) {
    const isSelected = selected.has(product.id);
    const name = groupName(groupMap.get(card.dataset.productGroup), product);
    card.dataset.productId = product.id;
    card.classList.toggle('is-selected', isSelected);
    card.querySelector('h3').innerHTML = `${escapeHtml(name)}${product.compatibility ? `<span class="shop-product-compatibility">（${escapeHtml(product.compatibility)}）</span>` : ''}`;
    card.querySelector('.shop-product-media img').alt = name;
    card.querySelector('[data-product-variant]').setAttribute('aria-label', `${name}选择规格`);
    card.querySelector('.shop-product-specification').innerHTML = productDetailsMarkup(product);
    const button = card.querySelector('[data-select-product]');
    button.dataset.selectProduct = product.id;
    button.setAttribute('aria-pressed', String(isSelected));
    button.innerHTML = selectButtonMarkup(isSelected);
  }

  function renderProducts() {
    const visible = filteredProductGroups();
    const modelCount = visible.reduce((total, entry) => total + entry.matches.length, 0);
    resultCount.textContent = searchInput.value.trim()
      ? `找到${visible.length}款产品 · ${modelCount}个匹配型号`
      : `共${visible.length}款产品${modelCount !== visible.length ? ` · ${modelCount}个型号` : ''}`;
    emptyState.hidden = visible.length !== 0;
    grid.hidden = visible.length === 0;
    grid.innerHTML = visible.map(({ group, matches }) => {
      const product = chosenVariant(group, matches);
      const name = groupName(group, product);
      const isSelected = selected.has(product.id);
      const hasVariants = group.variants.length > 1;
      return `<article class="shop-product-card${isSelected ? ' is-selected' : ''}" data-product-id="${product.id}" data-product-group="${group.id}">
        <div class="shop-product-media"><img src="${base}${product.image}" alt="${escapeHtml(name)}" loading="lazy"><span class="shop-product-source shop-product-source--${product.source}">${sourceLabel(product)}</span></div>
        <div class="shop-product-copy"><p class="shop-product-category">${product.categoryCode} · ${escapeHtml(product.category)}</p><h3>${escapeHtml(name)}${product.compatibility ? `<span class="shop-product-compatibility">（${escapeHtml(product.compatibility)}）</span>` : ''}</h3>
          ${hasVariants ? `<label class="shop-product-variant"><span>选择规格 <small>${group.variants.length}种可选</small></span><select data-product-variant="${group.id}" aria-label="${escapeHtml(name)}选择规格">${group.variants.map((variant) => `<option value="${variant.id}"${variant.id === product.id ? ' selected' : ''}>${escapeHtml(variantLabel(variant, group))}</option>`).join('')}</select></label>` : ''}
          <div class="shop-product-specification"${hasVariants ? ' role="status" aria-live="polite" aria-atomic="true"' : ''}>${productDetailsMarkup(product)}</div>
        </div>
        <button class="shop-product-select" type="button" data-select-product="${product.id}" aria-pressed="${isSelected}">${selectButtonMarkup(isSelected)}</button>
      </article>`;
    }).join('');
  }

  function renderSelection() {
    const items = selectedProducts();
    selectionDock.hidden = items.length === 0;
    selectionCount.textContent = String(items.length);
    selectionListCount.textContent = String(items.length);
    selectionPreview.textContent = items.length ? items.slice(0, 2).map(productLabel).join('、') + (items.length > 2 ? ` 等${items.length}款` : '') : '请选择需要咨询的产品';
    selectionList.innerHTML = items.length ? items.map((product) => `<li><div><span>${sourceLabel(product)} · ${product.category}</span><strong>${escapeHtml(productLabel(product))}</strong></div><button type="button" data-remove-product="${product.id}" aria-label="从清单移除${escapeHtml(productLabel(product))}">移除</button></li>`).join('') : '<li class="selection-list-empty">还没有选择产品，请返回产品目录添加。</li>';
    document.body.classList.toggle('has-selection-dock', items.length > 0);
    persistSelection();
  }

  function toggleProduct(id) {
    if (selected.has(id)) selected.delete(id); else selected.add(id);
    renderProducts();
    renderSelection();
  }

  function setSource(nextSource) {
    source = nextSource;
    sourceButtons.forEach((button) => {
      const active = button.dataset.source === nextSource;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function clearFilters() {
    searchInput.value = '';
    categorySelect.value = 'all';
    setSource('all');
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
  grid.addEventListener('change', (event) => {
    const selector = event.target.closest('[data-product-variant]');
    if (!selector) return;
    const group = groupMap.get(selector.dataset.productVariant);
    const product = group && group.variants.find((variant) => variant.id === selector.value);
    if (!product) return;
    variantChoices.set(group.id, { id: product.id, query: searchInput.value.trim().toLowerCase() });
    // Keep the native select in place to preserve focus and keyboard operation.
    updateProductCard(selector.closest('.shop-product-card'), product);
  });
  searchInput.addEventListener('input', renderProducts);
  categorySelect.addEventListener('change', () => {
    const category = categorySelect.value;
    if (category !== 'all') {
      const matchingSources = [...new Set(products.filter((product) => product.categoryCode === category).map((product) => product.source))];
      if (matchingSources.length === 1) setSource(matchingSources[0]);
    }
    renderProducts();
  });
  sourceButtons.forEach((button) => button.addEventListener('click', () => {
    const nextSource = button.dataset.source;
    const category = categorySelect.value;
    if (category !== 'all' && nextSource !== 'all' && !products.some((product) => product.categoryCode === category && product.source === nextSource)) {
      categorySelect.value = 'all';
    }
    setSource(nextSource);
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
    const list = items.map((item, index) => `${index + 1}. ${productLabel(item)}（${sourceLabel(item)} / ${item.category}）${item.productCode ? ` / 产品编号：${item.productCode}` : ''}`).join('\n');
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
