# TALA-Hub 项目结构

先从 `src/App.tsx` 看页面路由，再打开你要改的页面。项目只有一个前端应用，没有后端、数据库或复杂的分层框架。

## 当前结构

```text
TALA-Hub/
├── .agents/skills/          → 已安装的 19 个 AI 开发技能（上游资料）
├── .vscode/settings.json    → 只隐藏 Explorer 中的依赖与生成产物
├── docs/
│   ├── skills/             → 技能来源、安装记录和许可证
│   ├── INTEGRATION.md      → SkipCourse 接入边界和待确认信息
│   ├── BACKEND_INTEGRATION_NEEDED.md → 12 项后端接口需求、未知契约和提问清单
│   ├── QUALITY_REVIEW.md   → MVP 测试与清洁检查记录
│   ├── FRONTEND_EXCELLENCE.md → 第二阶段视觉审查、设计取舍与验证
│   └── SPONSOR_REQUIREMENTS.md → 最新需求来源、实现状态与本轮检查
├── src/
│   ├── assets/             → 网站使用的本地插图
│   ├── components/         → 复用 UI 和站点公共行为
│   ├── pages/              → 完整页面及页面专用逻辑
│   ├── services/           → 认证、学生数据、demo adapter 和相关类型
│   ├── styles/             → 统一设计变量、组件样式与响应式规则
│   ├── App.tsx            → 路由、演示会话与 dashboard 入口保护
│   ├── main.tsx           → React 启动、HashRouter 和 CSS 入口
│   └── content.ts         → 两个页面共用的四类项目预览文案
├── tests/frontend.spec.ts  → 关键浏览器流程、可访问性与响应式测试
├── .env.example            → 安全的公开环境配置示例
├── .gitignore              → 依赖、产物、本地环境与临时文件忽略规则
├── AGENTS.md               → 开发规则
├── CNAME                   → 原有域名配置，未修改
├── index.html              → Vite 的 HTML 入口
├── package.json            → 依赖与运行命令
├── package-lock.json       → 精确依赖树，应该进入 Git
├── tsconfig.json           → 严格 TypeScript 配置
├── vite.config.ts          → React 插件和相对资源路径
├── eslint.config.js        → lint 规则
├── playwright.config.ts    → 测试浏览器、尺寸和构建预览服务
├── 汇报给老板.md            → 每轮修改的简单中文记录，最新在上
├── 会议演示.md              → 本地演示地址、逐步点击路线和简单英语讲稿
├── PROJECT_STRUCTURE.md    → 本文档
└── README.md               → 安装、运行、演示入口
```

运行后会出现 `node_modules/`、`dist/`、`playwright-report/`、`test-results/` 等本地产物，它们被 Git 忽略，不属于源码结构。`.git/` 由 Git 管理，不手动整理。

## 本地目录与清理边界

| 分类 | 对应内容 | 保留或清理原则 |
| --- | --- | --- |
| A 源码 | `src/`、`index.html` | 保留；图片和样式也属于源码 |
| B 必需配置 | package 清单/锁文件、TypeScript/Vite/ESLint/Playwright 配置、`.gitignore`、`.env.example`、`.vscode/settings.json`、`CNAME` | 保留；域名和部署相关配置不作为垃圾处理 |
| C 文档 | README、本文、`docs/` | 保留接入说明、不同阶段的质量记录和技能许可证 |
| D 测试源码 | `tests/frontend.spec.ts` | 保留，可以通过 `npm test` 执行 |
| E 依赖 | `node_modules/` | 本地保留以便开发和测试；不进入 Git，可用 `npm install` 恢复 |
| F 构建产物 | `dist/` | 可删除；`npm run build` 会重新生成 |
| G 测试产物 | `playwright-report/`、`test-results/` | 可删除；测试会重新生成报告、截图和 trace |
| H 临时/缓存 | 依赖内部的 Vite 缓存、日志、编辑器临时文件 | 不属于源码；只删除已确认的临时文件 |
| I Agent 开发资料 | `.agents/skills/`、`AGENTS.md`、`docs/skills/` | 保留，技能不是一次性产物，不改写第三方内容 |
| J 疑似未使用文件 | 本次未发现能确认无用的源码或资产 | 未被 import 不等于无用；配置、文档、测试还可能被工具或人读取 |

`.vscode/settings.json` 仅在当前项目的 Explorer 隐藏 `node_modules/`、`dist/`、`playwright-report/`、`test-results/`，不影响运行，也不隐藏源码、测试、文档、Skills 或重要配置。需要查看报告时，可直接打开路径，或临时关闭对应的 `files.exclude` 项。

2026-09-22 清理：移除可再生成的构建和测试产物，保留已安装依赖。后续 build/test 再生成上述目录是正常行为；Git 忽略和 Explorer 隐藏会持续生效，不需要为了侧栏整洁反复删除。没有移动源码目录或删除工程历史文档。清理后 Build、Lint、Typecheck 和 40/40 Playwright 测试通过，随后再次清除生成产物。

## 每个目录放什么、不放什么

| 目录 | 应该放进去 | 不应该放进去 |
| --- | --- | --- |
| `src/pages/` | 完整页面、仅该页面使用的逻辑 | 在多个页面重复使用的 UI、直接调用后端的请求代码 |
| `src/components/` | 导航、品牌、按钮组合、共享表单、课程卡、路由焦点处理等 | 完整页面、散落的 fetch、单页业务的复杂框架 |
| `src/services/` | 服务接口、输入校验、demo 数据、adapter、服务需要的共享类型 | JSX、CSS、真实密钥；未来服务端认证代码也不能塞进浏览器目录 |
| `src/styles/` | CSS 变量、统一控件、公共和页面布局、响应式与 reduced-motion 规则 | 同一组件的多份重复样式、生成 CSS |
| `src/assets/` | 本地 SVG、未来确认的品牌图像和图标 | 生成截图、临时设计稿或大段 base64 数据 |
| `tests/` | 浏览器端的关键用户流程测试 | 真实账户凭据、应用运行代码、构建产物 |
| `docs/` | 给学生开发者看的维护和接入说明 | 业务源码、重复的目录结构说明 |
| `.agents/skills/` | 保持完整的上游技能与参考资料 | 应用代码、临时文件或业务数据 |

没有创建空的 hooks、types、utils、features、layouts 目录。当前服务类型直接放在 `services/serviceTypes.ts`；共用布局在 `components/SiteLayout.tsx`。一份有明确章节的 CSS 管理全站视觉，顶部集中放设计变量；没有独立的 UI 框架。手机 Programs 使用原生 select，筛选与桌面按钮共享同一 URL 状态。

## 页面和 UI 去哪里找

| 页面/职责 | 文件 |
| --- | --- |
| Home | `src/pages/HomePage.tsx` |
| About / Learn More | `src/pages/AboutPage.tsx` |
| Programs（筛选保存在 URL） | `src/pages/ProgramsPage.tsx` |
| 六步注册、Funding 与成功页 | `src/pages/RegisterPage.tsx` |
| 四种社区身份、家长代表学生、示例快捷入口 | `src/pages/LoginPage.tsx` |
| Student dashboard 与其它社区角色工作区 | `src/pages/StudentDashboard.tsx` |
| Community Events / Contact 占位页 | `src/pages/CommunityPage.tsx` |
| 课程选择、个人日历与 My Classes | `src/components/StudentSchedule.tsx` |
| 未知路径 | `src/pages/NotFoundPage.tsx` |
| 响应式导航、页脚、skip link | `src/components/SiteLayout.tsx` |
| 登录表单（注册使用独立分步表单） | `src/components/AuthForm.tsx` |
| 可展开课程卡 | `src/components/CourseCard.tsx` |
| 项目卡、共用 CTA、品牌、图标 | `src/components/ProgramCards.tsx`、`StartBanner.tsx`、`Brand.tsx`、`Icon.tsx` |
| 页面标题、切换页面后的阅读焦点 | `src/components/RouteFocus.tsx` |
| 配色、文字、间距和所有响应式规则 | `src/styles/global.css` |

## 认证、数据和 SkipCourse 在哪里

```text
RegisterPage
  → enrollmentService.ts：步骤名称、校验、提交接口与演示结果
  → 无真实账户、材料上传、支付；仅返回样例家长/学生姓名和邮箱
LoginPage → AuthForm → formValidation.ts → authService.ts → demoAdapter.ts
StudentDashboard → skipCourseApi.ts → demoAdapter.ts → demoData.ts
StudentSchedule → scheduleService.ts → demoData.ts 中的虚构课程
```

`App.tsx` 管理演示身份与退出、按需加载 Dashboard。`authService.ts` 保存/恢复明确标记的演示姓名、邮箱、社区角色及家长关联的样例学生；`scheduleService.ts` 保存本标签页的选课 ID。浏览器不支持存储时仍能在当前页面演示。它们不是生产认证、权限或真实课程记录。

注册草稿仅在组件状态中，刷新或离开会清除；完成后的样例家庭信息经路由 state 传给登录页。密码、文件、医疗记录和支付资料不存储、不发送。Funding 目前只有偏好选项。

`serviceTypes.ts` 是前端需要的数据形状，不是 SkipCourse 已确认的 schema。未来拿到真实接口后，在服务层新增 adapter，把响应转换为这些前端类型，并根据实际需求调整。完整待确认清单见 [INTEGRATION.md](docs/INTEGRATION.md)。无需重做页面，也不要重新实现 SkipCourse 后端。

## 新功能放哪里

- **新页面**：在 `pages/` 新增清楚的名字，在 `App.tsx` 注册路由，更新 `RouteFocus.tsx` 标题及相关导航。
- **复用组件**：确实有复用时放入 `components/`；只在一个页面使用的简单 UI 先留在该页面。
- **API/共享数据类型**：放入 `services/`。组件不要自己拼 URL 或携带后端秘密。
- **可复用 hook**：目前不需要独立目录；未来多个页面真正共用时再创建 `hooks/`。
- **较大业务功能**：规模确实增长时才考虑 features，先说明与 pages 的区别，避免同一个页面实现两遍。
- **测试**：当前统一在 `tests/frontend.spec.ts`，包含四种屏幕尺寸、完整注册/登录/选课和可访问性检查；新增独立测试主题时用 `registration.spec.ts` 之类具体名称，不叫 test2。

文件与目录有变化时同步更新本文。先选最容易解释的组织方式，不为“看起来专业”增加层次。

## 最新收尾验证（2026-09-22）

Sponsor 需求对齐版本完成了 Build、Lint、Typecheck 与最新 60/60 Playwright 检查。手机/平板 Dashboard 使用可展开的导航链接，选完自动收起；桌面保留侧栏。普通演示构建另经 320、390、768、1440 四尺寸检查。详情见 [需求与验证记录](docs/SPONSOR_REQUIREMENTS.md)，简单进度见 [汇报给老板](汇报给老板.md)。

Vercel Preview 的构建命令、输出目录、hash 路由和远端待核对条件维护在 README；后端要提供的 12 项契约维护在 `docs/BACKEND_INTEGRATION_NEEDED.md`。Evidence / AZ Transfer 尚无页面或算法实现，不为等待中的接口创建空目录。
