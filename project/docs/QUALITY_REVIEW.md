# MVP 检查记录

此文保留第一阶段记录；最新四尺寸回归和视觉结果见 [Frontend Excellence Review](FRONTEND_EXCELLENCE.md)。

日期：2026-09-20。开发与检查均在 `staging`；没有提交、推送、合并或部署。

## 验证结果

| 检查 | 结果 |
| --- | --- |
| `npm install` | PASS；锁文件已生成 |
| `npm run dev` | PASS；实际启动并通过浏览器查看 |
| `npm run build` | PASS；包含 TypeScript 检查 |
| `npm run lint` | PASS；零警告 |
| `npm run typecheck` | PASS |
| `npm test` | PASS；8 个场景 × 3 个浏览器配置，共 24 项 |
| `npm audit --omit=dev` | 当日查询未发现运行时依赖已知漏洞 |
| `.gitignore` 与已跟踪文件检查 | PASS；没有已跟踪的依赖、环境文件或构建产物 |
| 原有 `CNAME` 与 `main` 引用 | 未修改 |

浏览器配置：1440px 桌面 Chromium、Pixel 7 手机 Chromium、iPad 平板 WebKit。另在 320px 窄屏下检查长姓名/邮箱与主要页面溢出。使用 Chromium 实际截图检查公共页面、表单和 dashboard 的桌面/移动布局；临时截图放在仓库外，不纳入源码。

测试覆盖：公共页面导航、项目筛选、刷新/前进后退、404、注册必填/邮箱/密码匹配校验、演示注册成功、登录校验与服务失败恢复、dashboard 入口保护、四个 dashboard 视图、学习大纲/项目展开、加载/空/错误/重试、退出后回退、键盘菜单/退出/skip link、损坏或被禁用的 sessionStorage、减少动画。全部测试同时检查 browser console error 与运行时异常。

axe 使用 WCAG 2 A/AA 和 2.1 AA 规则扫描 Home、About、Programs、Login、Register、Dashboard，在三个配置中均未报告违规。这不等于完整 WCAG 认证；尚需真实屏幕阅读器、用户和业务内容审核。

补充手动脚本验证：

- 在独立本地 Vite 服务中关闭 demo，登录/注册/示例入口禁用，已有或伪造的 demo session 也不能进入 dashboard。
- 用不提供 SPA fallback 的简单静态服务器加载 `dist/`，放在 `/TALA-Hub/` 下。项目深链接刷新、站内导航及图片加载正常。
- 演示注册/登录没有外部网络请求；浏览器 storage 中没有密码。

## 第二轮自查与修复

- 修复表单 blur 时出现错误文字导致提交按钮移动、首次点击可能落空的问题。现在提交时校验，并在用户纠正时更新已有错误。
- 修正未知项目筛选参数的回退，让“All opportunities”与显示内容一致。
- dashboard 子视图切换后更新阅读焦点；手机菜单支持 Escape 关闭并返回触发按钮。
- 改善小屏项目状态标签的位置，避免把项目名称挤得过窄。
- 明确 demo 不是真实认证；数据模型、账户开通和学生关联均未冒充现有 SkipCourse 契约。

## 结构与清洁

仅保留页面、复用 UI、服务、样式、资源和测试这些有具体用途的目录，没有预建空目录。没有新增状态管理、UI 框架、表单框架或重复测试框架。单一表单组件服务注册/登录；共享项目内容和 demo 数据集中存放；样式由统一 CSS 变量管理。

严格 TypeScript + ESLint 检查未使用的变量/import、类型和常见 React 问题；人工检查了死代码、重复 UI/CSS、含混命名和无用依赖。应用中没有 console.log、debugger 或散落的 fetch。常见密钥模式扫描未发现敏感值。生成的依赖、构建结果和测试报告都被忽略；临时截图和检查脚本不在仓库内。

未删除任何原有项目内容。`CNAME` 是原有生产域名配置，保留；Skills 的上游示例/索引/许可证不属于应用死代码，保留。没有发现需要用户判断才能清理的未知原有文件。

## 视觉与内容边界

设计围绕学习笔记、自然观察和不同学习路径展开：墨绿 `#173f38`、纸白 `#fbfcf9`、浅绿 `#e6eee5`、浅蓝 `#e0edf2`、暖黄 `#f5e4aa` 与柔粉 `#f3e4dd`。主体使用本机无衬线字体，插图文字采用衬线；不依赖外部字体或图片请求。桌面采用文字/学习日记左右布局，手机改为连续阅读；没有营销数字、评价或合作方标志。

品牌标志和插图是设计草案，等待 Sponsor 确认。正式文案、dashboard 最终字段/布局、真实后端/账户开通与生产托管仍待确认，见 [INTEGRATION.md](INTEGRATION.md)。当前页面以英文呈现。课程进度只读，文件上传、真实课程内容和 profile 编辑未实现，也没有用空按钮暗示这些功能已经存在。

## Repository cleanup verification — 2026-09-24

Documentation and Git tracking only; application source, tests and root tool configurations are unchanged. The project structure guide now lives in `project/docs/PROJECT_STRUCTURE.md`, and the root README is a concise English entry point. Local personal notes are excluded from Git. Existing integration documents, Skills and historical QA records remain useful and were retained.

- Build, Lint and Typecheck: PASS.
- Playwright: **60/60 PASS**, no failures, skipped tests or retries; Chromium at 320/390/1440 px and WebKit/iPad at 768 px.
- Registration, login, community roles, dashboard, class selection and calendar regression tests pass.
- Shared documentation links resolve. No generated artifacts are tracked; existing Git ignore and Explorer exclusions remain in effect.
- The normal demo build was regenerated after testing with QA controls disabled. No application functionality or production configuration changed.


## Feature folder cleanup — 2026-09-27

Code now lives directly under `src/registration`, `authentication`, `dashboard`, `classes`, `public-site` and `shared`. Page-specific services, mock fixtures and styles live with their feature; class selection and calendar retain one shared implementation. The header is separately discoverable. The unused Icon style passthrough was removed; no long inline styles were found. Shared input/error markup and visual tokens reuse the previously verified refactor.

Team documentation and the unchanged test source moved into `project/docs` and `project/tests`. Only test discovery, typecheck inclusion and formatting paths changed in root tool configuration; no dependency or production configuration changed. Skills, agent notes, editor preferences and personal notes remain local and ignored, and are no longer Git-tracked.

- Format, Lint, Typecheck and Build: PASS.
- Complete original Playwright suite: **60/60 PASS**, no skipped tests or retries; Chromium at 320/390/1440 px and WebKit/iPad at 768 px. Test source is byte-identical to the previous staging version.
- Ordinary demo build: the full registration → funding → review → login → class selection → calendar → refresh journey passes at all four widths, without QA controls, external requests, console errors or horizontal overflow.
- 24/24 captured screenshots, visible text and page dimensions match the pre-refactor baseline. This comparison covers Home, registration entry, login, dashboard, available classes and empty calendar.
- Relative documentation links resolve; no empty source folders, debug output, source inline styles or new dependencies. Build and test artifacts are removed after verification; temporary QA scripts/screenshots stay outside the repository.

Only the requested structure cleanup and necessary documentation/configuration path updates are in this change. Main, CNAME, DNS and production settings are unchanged. The later user instruction authorizes a normal commit and push to staging, without rewriting history or merging.

## Standalone frontend directory — 2026-09-27

The application, standard tool configuration and automated tests now live together in `frontend/`. Run npm commands from that directory. Team documentation remains in `project/docs/`; README, Git ignore rules and the unchanged CNAME remain at repository root.

- All 60 source files, the original test source and dependency lock file are byte-identical to the previous staging version. Only directory references and documentation changed.
- Format, Lint, Typecheck and Build: PASS.
- Complete Playwright suite: **60/60 PASS**, without failures, skips or retries, across 320/390/1440 px Chromium and 768 px WebKit/iPad.
- Generated build and test output removed after validation; dependencies remain locally ignored.
- Future preview setup must use `frontend` as its application root. No external hosting or production settings changed.
