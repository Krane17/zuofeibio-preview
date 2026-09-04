const FIELD_IDS = Object.freeze({
  submittedAt: 'f1KmMd',
  leadType: 'f2PV8L',
  name: 'f7KA0M',
  phone: 'fAYM51',
  company: 'fCtBzj',
  email: 'fH4zcX',
  products: 'fL3gfh',
  message: 'fMMABV',
  pageUrl: 'fb4KRk',
  status: 'fl2GrD',
  requestId: 'fsdL0Y'
});

const FORM_TYPES = Object.freeze({
  contact: '方案咨询',
  resource: '资料申请',
  products: '产品咨询'
});

function doGet() {
  return HtmlService.createHtmlOutput(
    '<!doctype html><meta charset="utf-8"><title>ZUOFEI Form Service</title>' +
    '<p>ZUOFEI 官网表单接口正在运行。</p>'
  );
}

function doPost(event) {
  let requestId = '';
  try {
    const input = parseRequest_(event);
    requestId = safeRequestId_(input.requestId);
    input.requestId = requestId;

    if (input.website) return response_({ ok: true, requestId, message: '提交成功。' });
    validate_(input);

    const cache = CacheService.getScriptCache();
    if (cache.get('lead-' + requestId)) {
      return response_({ ok: true, requestId, message: '该请求已处理。' });
    }

    const properties = PropertiesService.getScriptProperties();
    const sheetWebhook = String(properties.getProperty('SMARTSHEET_WEBHOOK') || '').trim();
    if (!sheetWebhook) throw new Error('SMARTSHEET_WEBHOOK 尚未配置');

    const lead = normalizeLead_(input);
    writeSmartSheet_(sheetWebhook, lead);

    const warnings = [];
    try {
      sendEmail_(properties.getProperty('NOTIFY_EMAIL') || 'info@zuofeibio.com', lead);
    } catch (error) {
      warnings.push('邮件通知失败：' + error.message);
      console.error(error);
    }

    const botWebhook = String(properties.getProperty('WECOM_BOT_WEBHOOK') || '').trim();
    if (botWebhook) {
      try {
        sendWeComBot_(botWebhook, lead);
      } catch (error) {
        warnings.push('企微群通知失败：' + error.message);
        console.error(error);
      }
    }

    cache.put('lead-' + requestId, '1', 21600);
    if (warnings.length) console.warn(warnings.join('\n'));
    return response_({ ok: true, requestId, message: '提交成功。' });
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return response_({
      ok: false,
      requestId: requestId || safeRequestId_(''),
      message: error && error.message ? error.message : '提交失败，请稍后重试。'
    });
  }
}

function parseRequest_(event) {
  const parameters = event && event.parameter ? event.parameter : {};
  if (Object.keys(parameters).length) return parameters;

  const body = event && event.postData && event.postData.contents;
  if (!body) return {};
  try {
    return JSON.parse(body);
  } catch (error) {
    throw new Error('请求内容无法解析');
  }
}

function safeRequestId_(value) {
  const candidate = String(value || '').trim();
  if (/^[A-Za-z0-9._-]{6,80}$/.test(candidate)) return candidate;
  return Utilities.getUuid();
}

function clean_(value, maxLength) {
  return String(value == null ? '' : value).trim().slice(0, maxLength);
}

function validate_(input) {
  const formType = clean_(input.formType, 30);
  const name = clean_(input.name, 50);
  const phone = clean_(input.phone, 30);
  const company = clean_(input.company, 100);
  const email = clean_(input.email, 120);
  const message = clean_(input.message, 1500);

  if (!FORM_TYPES[formType]) throw new Error('无法识别的表单类型');
  if (!name || !company) throw new Error('请填写姓名和公司/机构');
  if (!/^1[3-9]\d{9}$/.test(phone)) throw new Error('请填写正确的11位手机号码');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('请填写正确的邮箱地址');
  if (formType === 'contact' && !message) throw new Error('请填写需求说明');
  if (formType === 'resource' && !clean_(input.resource, 200)) throw new Error('未找到申请的资料');
  if (formType === 'products' && !clean_(input.products, 5000)) throw new Error('未找到咨询产品');
}

function normalizeLead_(input) {
  const formType = clean_(input.formType, 30);
  const productText = formType === 'resource'
    ? clean_(input.resource, 200)
    : clean_(input.products, 5000);
  const submitted = input.submittedAt ? new Date(input.submittedAt) : new Date();
  const submittedAt = isNaN(submitted.getTime()) ? new Date() : submitted;
  let pageUrl = clean_(input.pageUrl, 1000);
  if (!/^https?:\/\//i.test(pageUrl)) pageUrl = 'https://www.zuofeibio.com/';

  return {
    formType,
    leadType: FORM_TYPES[formType],
    submittedAt: Utilities.formatDate(submittedAt, 'Asia/Shanghai', 'yyyy-MM-dd HH:mm:ss'),
    name: clean_(input.name, 50),
    phone: clean_(input.phone, 30),
    company: clean_(input.company, 100),
    email: clean_(input.email, 120),
    products: productText,
    message: clean_(input.message, 1500),
    pageUrl,
    requestId: safeRequestId_(input.requestId)
  };
}

function writeSmartSheet_(webhook, lead) {
  const values = {};
  values[FIELD_IDS.submittedAt] = lead.submittedAt;
  values[FIELD_IDS.leadType] = [{ text: lead.leadType }];
  values[FIELD_IDS.name] = lead.name;
  values[FIELD_IDS.phone] = lead.phone;
  values[FIELD_IDS.company] = lead.company;
  values[FIELD_IDS.email] = lead.email;
  values[FIELD_IDS.products] = lead.products;
  values[FIELD_IDS.message] = lead.message;
  values[FIELD_IDS.pageUrl] = [{ link: lead.pageUrl, text: '官网来源页面' }];
  values[FIELD_IDS.status] = [{ text: '待跟进' }];
  values[FIELD_IDS.requestId] = lead.requestId;

  const response = UrlFetchApp.fetch(webhook, {
    method: 'post',
    contentType: 'application/json; charset=utf-8',
    payload: JSON.stringify({ add_records: [{ values }] }),
    muteHttpExceptions: true
  });
  const status = response.getResponseCode();
  const text = response.getContentText();
  let result = null;
  try { result = JSON.parse(text); } catch (_) {}

  if (status < 200 || status >= 300 || (result && Number(result.errcode || 0) !== 0)) {
    const detail = result && (result.errmsg || result.message) ? (result.errmsg || result.message) : ('HTTP ' + status);
    throw new Error('写入客户线索表失败：' + detail);
  }
}

function sendEmail_(recipient, lead) {
  const subject = '【官网' + lead.leadType + '】' + lead.company + ' - ' + lead.name;
  const lines = [
    '线索类型：' + lead.leadType,
    '提交时间：' + lead.submittedAt,
    '姓名：' + lead.name,
    '联系电话：' + lead.phone,
    '公司/机构：' + lead.company,
    '邮箱：' + (lead.email || '未填写'),
    '咨询产品/资料：' + (lead.products || '未填写'),
    '需求说明：' + (lead.message || '未填写'),
    '来源页面：' + lead.pageUrl,
    '请求编号：' + lead.requestId
  ];
  const options = {
    to: recipient,
    subject,
    body: lines.join('\n\n'),
    name: '昨非官网客户线索'
  };
  if (lead.email) options.replyTo = lead.email;
  MailApp.sendEmail(options);
}

function sendWeComBot_(webhook, lead) {
  const content = [
    '### 昨非官网新' + lead.leadType,
    '> **公司/机构：** ' + markdown_(lead.company),
    '> **联系人：** ' + markdown_(lead.name),
    '> **电话：** ' + markdown_(lead.phone),
    '> **产品/资料：** ' + markdown_(lead.products || '未填写'),
    '> **需求：** ' + markdown_(lead.message || '未填写')
  ].join('\n');
  const response = UrlFetchApp.fetch(webhook, {
    method: 'post',
    contentType: 'application/json; charset=utf-8',
    payload: JSON.stringify({ msgtype: 'markdown', markdown: { content } }),
    muteHttpExceptions: true
  });
  if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) {
    throw new Error('HTTP ' + response.getResponseCode());
  }
}

function markdown_(value) {
  return String(value || '').replace(/[<>]/g, '').replace(/\n+/g, '；').slice(0, 800);
}

function response_(payload) {
  const serialized = JSON.stringify({ source: 'zuofei-form', ...payload }).replace(/</g, '\\u003c');
  return HtmlService.createHtmlOutput(
    '<!doctype html><meta charset="utf-8"><title>表单提交</title>' +
    '<script>window.parent.postMessage(' + serialized + ', "*");<\/script>' +
    '<p>' + (payload.ok ? '提交成功。' : '提交失败。') + '</p>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
