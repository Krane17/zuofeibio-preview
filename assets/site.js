const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

const legacyRoutes = {
  '#/home': '/zuofeibio-preview/',
  '#/product': '/zuofeibio-preview/products/',
  '#/detail': '/zuofeibio-preview/products/',
  '#/new': '/zuofeibio-preview/',
  '#/news': '/zuofeibio-preview/',
  '#/about': '/zuofeibio-preview/about/',
  '#/history': '/zuofeibio-preview/about/',
  '#/contact': '/zuofeibio-preview/contact/'
};
const legacyKey = Object.keys(legacyRoutes).find((key) => location.hash.startsWith(key));
if (legacyKey) location.replace(legacyRoutes[legacyKey]);

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('is-open', !open);
  document.body.classList.toggle('menu-open', !open);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    toggle?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  });
});

document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const contactForm = document.querySelector('#contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const data = new FormData(contactForm);
  const phone = String(data.get('phone') || '').trim();
  const status = contactForm.querySelector('.form-status');

  if (!/^1[3-9]\d{9}$/.test(phone)) {
    status.textContent = '请输入正确的11位手机号码。';
    contactForm.elements.phone.focus();
    return;
  }

  const name = String(data.get('name') || '').trim();
  const company = String(data.get('company') || '').trim();
  const subject = `官网咨询｜${company || name}`;
  const body = [
    `姓名：${name}`,
    `联系电话：${phone}`,
    `公司：${company}`,
    `邮箱：${String(data.get('email') || '').trim() || '未填写'}`,
    '',
    '需求说明：',
    String(data.get('message') || '').trim()
  ].join('\n');

  status.textContent = '正在打开邮件客户端，请确认后发送。';
  window.location.href = `mailto:wuyu@zuofeibio.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const resourceDialog = document.querySelector('#resource-dialog');
const resourceForm = document.querySelector('#resource-form');
const resourceName = document.querySelector('#resource-name');
const resourceContinue = document.querySelector('#resource-continue');
let requestedResource = { name: '', href: '' };

document.querySelectorAll('.resource-open').forEach((button) => {
  button.addEventListener('click', () => {
    requestedResource = {
      name: button.dataset.resource || '产品资料',
      href: button.dataset.resourceHref || ''
    };
    resourceForm?.reset();
    resourceForm?.querySelector('.form-status')?.replaceChildren();
    resourceContinue?.classList.add('is-hidden');
    if (resourceName) resourceName.textContent = requestedResource.name;
    if (resourceForm?.elements.resource) resourceForm.elements.resource.value = requestedResource.name;
    resourceDialog?.showModal();
  });
});

resourceDialog?.querySelector('.dialog-close')?.addEventListener('click', () => resourceDialog.close());
resourceDialog?.addEventListener('click', (event) => {
  if (event.target === resourceDialog) resourceDialog.close();
});

resourceForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!resourceForm.reportValidity()) return;

  const data = new FormData(resourceForm);
  const phone = String(data.get('phone') || '').trim();
  const status = resourceForm.querySelector('.form-status');
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    status.textContent = '请输入正确的11位手机号码。';
    resourceForm.elements.phone.focus();
    return;
  }

  const body = [
    `申请资料：${requestedResource.name}`,
    `姓名：${String(data.get('name') || '').trim()}`,
    `联系电话：${phone}`,
    `公司/机构：${String(data.get('company') || '').trim()}`,
    `邮箱：${String(data.get('email') || '').trim() || '未填写'}`
  ].join('\n');

  if (requestedResource.href) {
    resourceContinue.href = requestedResource.href;
    resourceContinue.textContent = requestedResource.href.toLowerCase().endsWith('.pptx') ? '如未打开，点击打开PPTX' : '如未打开，点击查看资料';
    resourceContinue.classList.remove('is-hidden');
    window.open(requestedResource.href, '_blank', 'noopener');
    status.textContent = '资料已在新窗口打开；同时请在邮件客户端确认发送。';
  } else {
    resourceContinue.classList.add('is-hidden');
    status.textContent = '请在邮件客户端确认发送，资料更新后我们将与你联系。';
  }
  window.location.href = `mailto:wuyu@zuofeibio.com?subject=${encodeURIComponent(`官网资料申请｜${requestedResource.name}`)}&body=${encodeURIComponent(body)}`;
});

const resourceCards = [...document.querySelectorAll('.resource-card')];
const resourceFilters = [...document.querySelectorAll('.resource-filter')];
const resourceSearch = document.querySelector('#resource-search');
const resourceCount = document.querySelector('#resource-count');
const resourceEmpty = document.querySelector('#resource-empty');
let activeResourceFilter = 'all';

const updateResourceLibrary = () => {
  const keyword = String(resourceSearch?.value || '').trim().toLowerCase();
  let visibleCount = 0;
  resourceCards.forEach((card) => {
    const categoryMatch = activeResourceFilter === 'all' || card.dataset.resourceCategory === activeResourceFilter;
    const keywordMatch = !keyword || String(card.dataset.resourceTitle || card.textContent).toLowerCase().includes(keyword);
    card.hidden = !(categoryMatch && keywordMatch);
    if (!card.hidden) visibleCount += 1;
  });
  if (resourceCount) resourceCount.textContent = `共 ${visibleCount} 项资料`;
  resourceEmpty?.classList.toggle('is-hidden', visibleCount !== 0);
};

resourceFilters.forEach((button) => {
  button.addEventListener('click', () => {
    activeResourceFilter = button.dataset.resourceFilter || 'all';
    resourceFilters.forEach((item) => item.classList.toggle('is-active', item === button));
    updateResourceLibrary();
  });
});
resourceSearch?.addEventListener('input', updateResourceLibrary);

const revealItems = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
