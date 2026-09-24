# TALA-Hub

ASU Capstone 的 TALA 前端 MVP：公共网站、演示注册/登录，以及为未来 SkipCourse 接入准备的学生 dashboard。**目前是可运行的 frontend demo，没有真实认证、账户创建或后端连接。**

## 开始运行

需要 Node.js **22.13.x 或 24+**（推荐 Node 24 LTS）与 npm。克隆仓库后进入 TALA-Hub，先确认在 `staging`：

```bash
git branch --show-current
npm install
npm run dev
```

打开终端显示的本地地址，默认是 http://127.0.0.1:5173/。无需 API key，也无需创建 `.env`。已有锁文件时，团队/CI 可使用 `npm ci` 安装相同版本。

## 技术栈与常用命令

React 19、TypeScript、Vite、React Router、普通 CSS；运行时依赖只有 React、React DOM 和 React Router。ESLint 检查代码，Playwright 覆盖浏览器流程，axe 检查常见可访问性问题。具体版本以 `package.json` 和 `package-lock.json` 为准。

```bash
npm run build       # TypeScript 检查后构建到 dist/
npm run preview     # 本地查看构建结果，不会部署
npm run lint
npm run typecheck
npx playwright install chromium webkit  # 首次运行测试前下载浏览器
npm test            # 自动构建并启动独立的 4173 端口预览服务
npm run test:ui     # 交互式测试界面
npm run format     # 只格式化应用、测试和工程配置，不改第三方 Skills
```

测试要求 4173 端口空闲。Linux 测试环境可使用 `npx playwright install --with-deps chromium webkit` 安装浏览器系统依赖。测试报告在被 Git 忽略的 `playwright-report/`，失败截图和 trace 在 `test-results/`。

项目的 VS Code 设置仅隐藏 `node_modules/`、`dist/`、`playwright-report/`、`test-results/`，让 Explorer 更清楚。这些目录都不进入 Git；依赖可通过 `npm install` 恢复，构建和测试产物可由上述命令重新生成。目录用途与安全清理边界见 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)。

## 五分钟演示

1. Home → **Start registration**：先填样例家长姓名、邮箱和演示密码，再填学生信息。
2. 选择 Enrollment / Waiting list、学习方式和两小时课段偏好；确认当前没有提交任何材料。
3. Billing / funding 选择 **ESA / STO / Private**；无金额、银行卡字段或真实支付。Review 可以返回修改每一步。
4. 完成演示 → Student demo login，输入自拟演示密码。**没有创建任何 TALA 或 SkipCourse 账户。**
5. 也可直接进入 **Community Login**，选择 Student / Parent / Alumni / Staff。家长明确选择以自己身份进入或代表样例学生。快捷样例入口仍保留，便于展示。
6. Student hub → Available class slots → Join class → Personal calendar / My classes。选择仅影响本标签页，不占用真实名额。手机和平板展开 “Student hub: …” 菜单选择页面，选完自动收起。
7. 出勤、SkipCourse 和 Messages 有明确未连接/空状态；原来的学习路径、项目和 Profile 继续保留。
8. Sign out 清除演示身份；本标签页的样例选课可以继续保留。刷新可恢复演示身份和角色；浏览器复制/恢复标签页的行为由浏览器决定。

普通演示隐藏 QA 控件。开启 `VITE_DEMO_TOOLS=true` 后，可测试注册/登录失败、选课失败以及 dashboard 的加载/空数据/错误/重试。`npm test` 自动启用这些选项。

课程样例集中在 `src/services/demoData.ts`。密码不会写入 storage、日志或网络；不要使用真实资料。注册草稿离开或刷新页面会清除；完成后仅样例家长/学生姓名和邮箱经路由状态传递。演示会话、角色和选课可保留在 sessionStorage；这些都不是生产认证或安全存储。

## 环境变量

[.env.example](.env.example) 有两个公开开关，需要修改时复制到 `.env.local` 并重启 Vite/重新构建：

- `VITE_DEMO_MODE=true`：默认启用有明确标识的演示服务。
- `VITE_DEMO_TOOLS=false`：默认隐藏测试控件，适合 Sponsor 演示。只有本地 QA 才设为 `true`；`npm test` 自动为独立测试构建开启，无需修改个人环境文件。

测试会生成带 QA 控件的 `dist/`。演示构建请重新运行 `npm run build`，确认本地 `VITE_DEMO_TOOLS` 未设为 `true`，再运行 `npm run preview`。

`VITE_DEMO_MODE` 为 `false` 或其他非 `true` 值会关闭演示服务，并显示尚未连接的信息；**不会自动开启 production API**。前端的 `VITE_*` 会进入浏览器代码，不能放秘密、私钥或后端凭据。真实环境配置须等 API 契约确认后再增加。

## 路由与托管注意事项

主要页面为 `/#/`、`/#/learn-more`、`/#/register`、`/#/events`、`/#/contact`、`/#/login`、`/#/dashboard`。原有 `/#/about` 和 `/#/programs` 保留；未知路径显示 404。

使用 [React Router HashRouter](https://reactrouter.com/api/declarative-routers/HashRouter)，hash 路由不会发送到服务器；配合 Vite 的相对资源路径，根域名和 repository 子路径都可加载，不需要 GitHub Pages 的 SPA 重写设置。项目筛选和 dashboard 视图保存在 hash 内的 query 中，支持刷新和前进/后退。

目前**没有部署工作流**。根目录现有 `CNAME` 保持原样，不会自动复制进 `dist/`；未来正式托管时需由 Sponsor 决定是否/如何使用它。不要直接发布本 demo 到 talaedu.com，也不要修改域名、DNS 或生产 Pages 设置。

## Vercel Preview 准备状态

**当前 staging 工作区具备前端 Preview 的构建与路由条件；尚未部署，也没有验证远端项目设置。** 团队已连接 GitHub 与域名的信息来自项目负责人，本轮没有访问或改动 Vercel 项目。

供团队之后核对的条件：

| 项目 | 本仓库对应值 |
| --- | --- |
| Framework Preset | Vite（这里用 React Router 的 HashRouter，不是 React Router framework/SSR 项目） |
| Root Directory | `package.json` 所在的仓库根目录 |
| Install | `npm ci` 可复现锁文件，也保留普通开发的 `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node | 现有 engines 支持 Node 24；本机实际验证版本为 25.6.1，远端 Node 24 构建尚未实测 |
| Public build variables | `VITE_DEMO_MODE` 控制演示服务；`VITE_DEMO_TOOLS` 控制仅供本地 QA 的开关。用途与演示取值见 `.env.example`，无需 secret |
| Preview branch | 用户审查后再确认 `staging` 的 Preview 设置和 production branch；本轮不 push |

Vercel 支持 Vite 项目，框架预设可自动配置构建输出；本项目无需额外插件或 `vercel.json`。[Vercel Vite 文档](https://vercel.com/docs/frameworks/frontend/vite)、[Build 配置](https://vercel.com/docs/builds/configure-a-build)。Node 24 在其支持版本内，但仍须以首次获准的远端构建结果为准。[Node 版本说明](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)。

分享页面请使用 `/#/register`、`/#/login`、`/#/dashboard?view=calendar` 这样的地址。HashRouter 把 `#` 后的部分留在浏览器，刷新仍请求 `/`，所以本项目不需要 SPA rewrite。`/register` 这样的无 hash 地址不是本项目的页面链接；不为尚未使用的路由形式增加托管配置。[HashRouter 文档](https://reactrouter.com/api/declarative-routers/HashRouter)。

静态图片、CSS 和 JS 均来自本地构建产物；QA 产物、依赖和环境文件不进入 Git。Preview 应保留 DEMO / AWAITING 提示并关闭测试控件。演示界面完整不等于生产认证、权限或支付已经完成。

**远端待核对**：团队成员在获得后续授权后核对 Preview 范围、现有 Build/Output overrides、环境变量、访问保护和 Node 版本。然后才决定 push；Git 连接可能自动触发部署，不能把 push 当作纯备份操作。本轮没有新增部署配置、部署命令或工作流。

## 找代码与后续接入

- [会议演示](会议演示.md)：本地地址、指定样例资料、逐步点击路线和简单英语。
- [Backend Team 交接清单](docs/BACKEND_INTEGRATION_NEEDED.md)：12 项接口需求、未知契约、Evidence / AZ Transfer 边界与待问问题。

- [汇报给老板](汇报给老板.md)：每轮修改的简单中文记录。
- [Sponsor 需求对齐](docs/SPONSOR_REQUIREMENTS.md)：来源、已完成范围、差异、待确认事项和本轮验证。

- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)：目录和文件导航，包括认证、数据、样式与测试。
- [AGENTS.md](AGENTS.md)：staging 工作规则、简单架构与清洁检查。
- [SkipCourse 接入说明](docs/INTEGRATION.md)：服务边界、已实现的 demo、待确认事项。
- [MVP 检查记录](docs/QUALITY_REVIEW.md)：第一阶段验证范围与限制。
- [Frontend Excellence Review](docs/FRONTEND_EXCELLENCE.md)：第二阶段逐页审查、设计取舍、前后指标和历史验证。
- [Skills 安装记录](docs/skills/README.md)：项目技能的上游来源和版本。

## 当前限制

- **AWAITING BACKEND**：真实认证、账户关联/自动开通、学生数据和进度写回。现有 sessionStorage 标记只用于演示导航，不是安全边界。
- **AWAITING TINA**：正式注册字段/材料、监护与社区权限、出勤和消息的详细规则。
- **AWAITING SPONSOR**：正式公开文案、费用、资助资格、线上班级人数差异、联系渠道与业务规则。
- **AWAITING SPONSOR**：Ayushi 的正式文案；当前标志、图标和插图是本次制作的设计草案，需要品牌确认。
- 课程大纲和项目可展开查看，但没有真实课件播放、文件上传、成绩修改或真实报名功能。
- 当前为英文界面；自动化可访问性检查不能代替真实辅助技术与用户测试。

只在 `staging` 开发。提交、推送、合并或部署需遵循团队流程；本次没有执行这些操作。

最新收尾验证：Build / Lint / Typecheck 全部通过，Playwright **60/60 通过（零失败、零跳过、零重试）**，覆盖 320 / 390 / 768 / 1440 四种尺寸，包含新增的 hash 链接刷新与加强后的键盘焦点回归检查。当前可用于 Sponsor 前端 Demo 演示；真实账号、付款和 SkipCourse 连接仍未启用。
