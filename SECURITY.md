# 安全策略（Security Policy）

## 支持的版本

| 版本 | 支持 |
|------|------|
| 最新 `main` 分支 | ✅ 积极维护 |
| 最近 1 个 minor 版本 | ✅ 安全更新 |
| 之前 minor 版本 | ⚠️ 视情况 |
| 更早版本 | ❌ 不再支持 |

由于本项目是**纯静态资源**（HTML / CSS / JS / SVG / 文档），无后端、无服务端逻辑，
安全风险面极小。潜在风险包括：

- CDN / GitHub Pages 自身安全（不归本项目管控）
- 第三方嵌入的脚本 / iframe（当前项目无）
- 任何在 Issue / PR 中披露的敏感信息

## 报告漏洞

**请勿在公开 Issue 中报告安全漏洞。**

请通过以下私密渠道联系：

- 📧 Email: **security@cgartlab.com**（加密邮件首选 PGP，公钥见下文）
- 🐙 GitHub: [Security Advisories](../../security/advisories/new)

收到报告后，维护者会在 **48 小时内**确认，并在合理时间内（通常 ≤ 14 天）发布修复。

## 披露原则

我们遵循 **负责任披露（Coordinated Disclosure）** 流程：

1. **报告者**私下告知我们漏洞详情（重现步骤、影响面）
2. **维护者**确认并开发修复
3. **修复发布**后（可能在下次 release，也可能 hotfix）
4. **公开致谢**（如报告者愿意），或在 CHANGELOG 安全章节中记录

在修复发布前，请**不要**在公开场合讨论该漏洞。

## 安全最佳实践（贡献者）

### 不要提交的内容

- ❌ 真实邮箱 / 电话 / 物理地址
- ❌ API key / 凭证 / token
- ❌ 用户隐私数据（截图、log、profile）
- ❌ 内部 URL / 内部网络信息
- ❌ 含有公司机密或商业秘密的内容

### 代码审计清单（PR 评审时关注）

- [ ] 引入的 CDN 资源是否可信（仅用系统字体栈或显式可信 CDN）
- [ ] inline `<script>` 是否必要（首选外部 `scripts.js`）
- [ ] `href="javascript:..."` 是否误用
- [ ] 第三方 iframe / embed 是否沙箱化
- [ ] 暗色模式对比度是否仍满足 WCAG AA（4.5:1）
- [ ] 表单是否使用 `rel="noopener"` 打开外链

## 历史安全事件

无记录（项目自 v1.0.0 起公开）。

## PGP 公钥

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
[请替换为实际公钥]
-----END PGP PUBLIC KEY BLOCK-----
```

> 注：实际部署时，请在 [keybase.io/cgartlab](https://keybase.io) 或类似服务发布公钥后，
> 将上面的占位符替换为真实公钥块。

## 致谢

感谢所有负责任地披露漏洞的安全研究者。
