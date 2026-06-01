# tests/ — 验证工具测试夹具

本目录存放**供 `tools/validate_*.py` 工具自检**的样本文件，**不参与运行时**。

## 目录结构

```
tests/
├── README.md                      # 本文件
├── fixtures/
│   ├── html/
│   │   ├── minimal.html           # 最小合法 HTML（应通过）
│   │   ├── with-errors.html       # 已知错误的 HTML（应被检出）
│   │   ├── good-classes.html      # 合法 BEM class（应通过）
│   │   └── bad-classes.html       # 非法 BEM class（应被检出）
│   ├── tokens/
│   │   ├── tokens-good.json       # 与 styles.css 一致
│   │   └── tokens-bad.json        # 含非法 token
│   └── css/
│       └── styles-sample.css      # 合法 CSS 样本
└── snapshots/                     # 未来：视觉回归快照
    └── .gitkeep
```

## 用法

验证工具扫描**项目根的 `*.html` / `tokens.json` / `styles.css`**，
本目录的 fixture **不**被自动扫描。

如需在 CI 中测试验证工具本身的健壮性，可：

```bash
# 1. 复制 fixture 到临时目录
mkdir -p /tmp/ds-test
cp -r tests/fixtures/* /tmp/ds-test/

# 2. 在临时目录运行验证工具（修改 ROOT 路径）
# 或编写专用 runner（见 docs/TESTING.md「未来工作」）
```

## 未来工作

- [ ] 编写 `tests/run_fixtures.py` — 自动跑 fixture 验证
- [ ] 引入 pytest（如依赖允许）
- [ ] 视觉回归快照（Playwright）
