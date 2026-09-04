# 昨非官网表单接口部署

这个 Google Apps Script Web App 会把官网的“方案咨询”、“资料申请”和“产品咨询”统一写入企业微信智能表格，同时发送邮件到 `info@zuofeibio.com`。如配置企微群机器人 Webhook，还会向企微群发送通知。

## 1. 新建 Apps Script 项目

1. 打开 [Google Apps Script](https://script.google.com/) 并新建项目。
2. 把 `Code.gs` 的全部内容粘贴到项目的 `Code.gs`。
3. 在“项目设置”中勾选“在编辑器中显示 `appsscript.json` 清单文件”，再用本目录的 `appsscript.json` 替换其内容。

## 2. 配置脚本属性

在“项目设置 → 脚本属性”中添加：

- `SMARTSHEET_WEBHOOK`：企业微信智能表格的数据接收 Webhook（必填）。
- `NOTIFY_EMAIL`：`info@zuofeibio.com`（可选，不填也会使用该邮箱）。
- `WECOM_BOT_WEBHOOK`：企业微信群机器人 Webhook（可选，可稍后添加）。

不要把 Webhook 直接写入 `Code.gs`，也不要上传到 GitHub。

## 3. 发布为 Web App

1. 点击“部署 → 新建部署”。
2. 类型选择“Web 应用”。
3. “执行身份”选择“我”。
4. “谁可以访问”选择“任何人”，这样官网访客才能提交表单。
5. 授权并完成部署，复制以 `/exec` 结尾的 Web App 地址。

## 4. 连接官网

把 `/exec` 地址粘贴到 `assets/form-config.js` 中：

```js
window.ZUOFEI_FORM_CONFIG = {
  endpoint: 'https://script.google.com/macros/s/你的部署ID/exec',
  timeout: 20000
};
```

保存后，分别测试联系页、资料下载页和产品咨询清单。企微表格中应新增一条记录，`info@zuofeibio.com` 应收到通知邮件。

## 安全说明

- 官网不会暴露企微表格 Webhook。
- 表单含隐藏反垃圾字段、必填项校验和请求去重。
- 部署新版代码时，在 Apps Script 中编辑现有部署并创建新版本，`/exec` 地址可保持不变。
