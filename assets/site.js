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

const formService = window.ZUOFEI_FORM_CONFIG || {};
let formRequestSequence = 0;

const isTrustedFormResponse = (event) => {
  if (formService.allowAnyResponseOrigin) return true;
  try {
    const hostname = new URL(event.origin).hostname;
    return hostname === 'script.google.com' || hostname.endsWith('.googleusercontent.com');
  } catch (_) {
    return false;
  }
};

const submitLead = (fields) => new Promise((resolve, reject) => {
  const endpoint = String(formService.endpoint || '').trim();
  if (!endpoint || endpoint.includes('PASTE_YOUR')) {
    reject(new Error('FORM_NOT_CONFIGURED'));
    return;
  }

  const requestId = `${Date.now()}-${++formRequestSequence}`;
  const targetName = `zuofei-form-target-${requestId}`;
  const frame = document.createElement('iframe');
  const relay = document.createElement('form');
  frame.name = targetName;
  frame.hidden = true;
  frame.setAttribute('aria-hidden', 'true');
  relay.hidden = true;
  relay.method = 'post';
  relay.action = endpoint;
  relay.target = targetName;

  const payload = {
    ...fields,
    requestId,
    pageUrl: location.href,
    submittedAt: new Date().toISOString()
  };
  Object.entries(payload).forEach(([name, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = String(value ?? '');
    relay.append(input);
  });

  let timer;
  const cleanup = () => {
    window.removeEventListener('message', onMessage);
    clearTimeout(timer);
    frame.remove();
    relay.remove();
  };
  const onMessage = (event) => {
    if (!isTrustedFormResponse(event)) return;
    if (event.data?.source !== 'zuofei-form' || event.data?.requestId !== requestId) return;
    cleanup();
    if (event.data.ok) resolve(event.data);
    else reject(new Error(event.data.message || 'SUBMIT_FAILED'));
  };

  window.addEventListener('message', onMessage);
  document.body.append(frame, relay);
  timer = window.setTimeout(() => {
    cleanup();
    reject(new Error('SUBMIT_TIMEOUT'));
  }, Number(formService.timeout || 20000));
  relay.submit();
});

const setSubmitting = (form, submitting, message = '', state = '') => {
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-status');
  if (button) {
    if (!button.dataset.label) button.dataset.label = button.textContent;
    button.disabled = submitting;
    button.textContent = submitting ? '正在提交…' : button.dataset.label;
  }
  form.setAttribute('aria-busy', String(submitting));
  if (status) {
    status.textContent = message;
    status.classList.toggle('is-success', state === 'success');
    status.classList.toggle('is-error', state === 'error');
  }
};

const submissionErrorMessage = (error) => {
  if (error?.message === 'FORM_NOT_CONFIGURED') return '在线接收服务尚未启用，请先致电 15800616566 或发送邮件至 info@zuofeibio.com。';
  if (error?.message === 'SUBMIT_TIMEOUT') return '提交超时，请检查网络后重试；如仍失败，请直接联系我们。';
  return '暂时未能提交，请稍后重试或直接联系我们。';
};

// 供产品目录等其他经典脚本复用同一套在线提交服务。
window.ZUOFEI_FORMS = Object.freeze({
  submitLead,
  setSubmitting,
  submissionErrorMessage
});

const contactForm = document.querySelector('#contact-form');
contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const data = new FormData(contactForm);
  const phone = String(data.get('phone') || '').trim();

  if (!/^1[3-9]\d{9}$/.test(phone)) {
    setSubmitting(contactForm, false, '请输入正确的11位手机号码。', 'error');
    contactForm.elements.phone.focus();
    return;
  }

  setSubmitting(contactForm, true, '正在安全提交你的需求…');
  try {
    await submitLead({
      formType: 'contact',
      name: String(data.get('name') || '').trim(),
      phone,
      company: String(data.get('company') || '').trim(),
      email: String(data.get('email') || '').trim(),
      message: String(data.get('message') || '').trim(),
      website: String(data.get('website') || '').trim()
    });
    contactForm.reset();
    setSubmitting(contactForm, false, '提交成功。昨非团队已收到需求，我们会尽快与你联系。', 'success');
  } catch (error) {
    setSubmitting(contactForm, false, submissionErrorMessage(error), 'error');
  }
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
    if (resourceForm) setSubmitting(resourceForm, false, '');
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

resourceForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!resourceForm.reportValidity()) return;

  const data = new FormData(resourceForm);
  const phone = String(data.get('phone') || '').trim();
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    setSubmitting(resourceForm, false, '请输入正确的11位手机号码。', 'error');
    resourceForm.elements.phone.focus();
    return;
  }

  setSubmitting(resourceForm, true, '正在提交并登记资料申请…');
  try {
    await submitLead({
      formType: 'resource',
      resource: requestedResource.name,
      name: String(data.get('name') || '').trim(),
      phone,
      company: String(data.get('company') || '').trim(),
      email: String(data.get('email') || '').trim(),
      website: String(data.get('website') || '').trim()
    });
    if (requestedResource.href) {
      resourceContinue.href = requestedResource.href;
      resourceContinue.textContent = requestedResource.href.toLowerCase().endsWith('.pptx') ? '打开PPTX资料' : '查看资料';
      resourceContinue.classList.remove('is-hidden');
      setSubmitting(resourceForm, false, '提交成功，资料已开放查看。', 'success');
    } else {
      resourceContinue.classList.add('is-hidden');
      setSubmitting(resourceForm, false, '登记成功。资料更新后，我们会与你联系。', 'success');
    }
  } catch (error) {
    resourceContinue.classList.add('is-hidden');
    setSubmitting(resourceForm, false, submissionErrorMessage(error), 'error');
  }
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

const sceneCarousel = document.querySelector('[data-scene-carousel]');
const scenePrev = document.querySelector('[data-scene-prev]');
const sceneNext = document.querySelector('[data-scene-next]');
const moveSceneCarousel = (direction) => {
  if (!sceneCarousel) return;
  sceneCarousel.scrollBy({
    left: sceneCarousel.clientWidth * 0.72 * direction,
    behavior: 'smooth'
  });
};
scenePrev?.addEventListener('click', () => moveSceneCarousel(-1));
sceneNext?.addEventListener('click', () => moveSceneCarousel(1));

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
