# TALA Hub 项目结构

先打开 `src/`，按功能找代码。每个功能目录直接放自己的页面、组件、服务和 CSS，不再套多层 components/pages/services 文件夹。

## 目录一览

```text
TALA-Hub/
├── src/                       网站代码
│   ├── public-site/           首页、学校介绍、项目、活动、联系页面
│   ├── registration/          家长优先注册、材料确认、Funding、复查与完成页
│   ├── authentication/        登录、身份选择、演示会话
│   ├── dashboard/             学生/家长工作区、导航、学习记录、个人资料
│   ├── classes/               可选课程、加入课程、My Classes、个人日历
│   ├── shared/                多个功能真正共用的组件
│   │   ├── services/          Demo 开关、延迟、样例身份和共用会话类型
│   │   └── styles/            设计变量、公共布局、按钮、表单、提示样式
│   ├── assets/                网站实际使用的图片
│   ├── App.tsx                路由、会话状态、登录和退出后的跳转
│   └── main.tsx               React 启动、HashRouter 和样式入口
├── project/
│   ├── docs/                  团队需要的项目、后端接入和检查说明
│   └── tests/                 Playwright 自动化测试
├── README.md                  简短入口
└── 配置文件                    npm、Vite、TypeScript、ESLint、Playwright 等
```

`package.json`、锁文件、`index.html`、各工具配置、`.env.example`、`.gitignore` 和 `CNAME` 保留在根目录。所有 npm 命令仍在根目录执行。没有移动或修改域名配置。

## 各功能怎么找

| 要修改什么 | 打开哪里 |
| --- | --- |
| 首页 / Learn More / Programs / Events / Contact | `src/public-site/` 中对应的 `*Page.tsx`；共用项目文案在 `programContent.ts` |
| 注册总体布局、上一步/下一步按钮 | `src/registration/RegisterPage.tsx` |
| 注册草稿、校验、提交和焦点 | `src/registration/useRegistration.ts`；校验与服务接口在 `enrollmentService.ts` |
| 家长、学生、入学、材料和 Funding 字段 | `src/registration/RegistrationFields.tsx` |
| Review / 注册完成 | `RegistrationReview.tsx` / `RegistrationComplete.tsx` |
| 登录与 Student / Parent / Alumni / Staff 选择 | `src/authentication/LoginPage.tsx` |
| 登录输入、错误、等待状态 | `src/authentication/AuthForm.tsx`；输入校验在 `formValidation.ts` |
| 登录服务与会话存取 | `src/authentication/authService.ts`；模拟实现是 `demoAuthAdapter.ts` |
| Dashboard 选择显示哪个视图 | `src/dashboard/StudentDashboard.tsx` |
| Dashboard 导航项目、手机和桌面导航 | `dashboardViews.ts` / `DashboardNavigation.tsx` |
| 学习与项目 / 课程卡 / 个人资料 | `DashboardContent.tsx` / `CourseCard.tsx` / `StudentProfile.tsx` |
| 出勤、SkipCourse、消息待接入说明 | `StudentAccountPanel.tsx` |
| 家长、Alumni、Staff 演示工作区 | `CommunityWorkspace.tsx` |
| 加载学习概览 | `useStudentOverview.ts` → `skipCourseApi.ts` → `demoStudentAdapter.ts` |
| Available Classes / My Classes / Personal Calendar | `src/classes/StudentSchedule.tsx`；共用一套课表与数据，不维护三份列表 |
| 选课、加载和本标签页保存 | `src/classes/useStudentSchedule.ts` → `scheduleService.ts` |

**Calendar** 目前就是已选课程的日历视图，所以和 Classes 放在一起。**Funding** 目前就是注册中的偏好选择，不是真实支付系统，所以留在 Registration。确认有独立业务后再拆目录，不预建空的 calendar/funding 文件夹。

## Shared 放什么

- `SiteLayout.tsx`：公共页面框架、页脚、跳过导航链接。
- `SiteHeader.tsx`：站点顶部导航、手机菜单和键盘关闭逻辑。
- `Brand.tsx` / `Icon.tsx`：品牌显示和共用图标。
- `TextField.tsx`：注册、登录共用的输入标签、提示和错误关联。
- `RouteFocus.tsx`：路由切换后的页面标题和阅读焦点。
- `styles/base.css`：颜色、间距、圆角、文字和焦点规则；`shared.css`：按钮、公共面板和提示；`forms.css`：输入控件；`layout.css`：站点布局。`global.css` 只统一导入顺序和 reduced-motion 设置。

专属于某个功能的组件和 CSS 放回该功能目录。不要为了每个按钮或十几行代码单独建文件夹；现有按钮共用 CSS 类，不需要再包一层组件。

## Mock 和后端接口在哪里

- `dashboard/demoLearningData.ts`：虚构学习与项目数据；`learningTypes.ts`：对应前端类型。
- `classes/demoClassSlots.ts`：虚构课程和余位；`scheduleService.ts`：课表类型、读取和加入接口。
- `shared/services/demoData.ts`：登录及家长演示共用的样例学生身份。
- `shared/services/demoConfig.ts`：Demo 与测试控件开关；`demoDelay.ts`：演示异步延迟；`serviceTypes.ts`：共用会话和认证接口类型。

页面 → 对应功能的服务接口 → 模拟实现。未来真实接口在服务层替换，不把 fetch 和凭据散落进组件。这里没有真实认证、付款、材料上传或 SkipCourse 连接。详细需求见 [INTEGRATION.md](INTEGRATION.md) 和 [BACKEND_INTEGRATION_NEEDED.md](BACKEND_INTEGRATION_NEEDED.md)。

## 以后在哪里加代码

1. 修改已有功能，先进入对应目录，复用已有页面、服务和 CSS。
2. 新的独立功能足够大时，在 `src/` 新建一个能直接说明用途的目录，并在 `App.tsx` 接入路由。
3. 只有跨功能复用的 UI 放 `shared/`；只有跨功能共用的服务代码放 `shared/services/`。
4. 自动测试放 `project/tests/`，团队说明放 `project/docs/`；不把说明或测试截图放进业务目录。
5. 不新增重复页面、不创建空目录、不因为一个类型或一个文件再套一层目录。

## 安装、检查和本地文件

在仓库根目录执行 `npm install` 安装依赖，`npm run dev` 启动。检查依次为 `npm run format`、`npm run lint`、`npm run typecheck`、`npm run build`、`npm test`。浏览器首次安装可运行 `npx playwright install chromium webkit`。Playwright 使用端口 4173，测试四种尺寸：320、390、768、1440。

测试会启用 QA 控件。演示前使用 `VITE_DEMO_MODE=true VITE_DEMO_TOOLS=false npm run build` 重新构建，然后 `npm run preview`。HashRouter 的页面地址形如 `/#/register`。

`node_modules/`、`dist/`、测试报告是生成文件，不进入 Git。Skills、代理指引、编辑器设置和个人笔记只留本机，不上传。不要使用 `git add -f` 绕过这些忽略规则。历史检查记录中的旧路径属于当时版本，当前路径以本文为准。
