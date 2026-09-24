# TALA-Hub 项目约定

## 工作范围

- 修改前确认当前分支为 `staging`；不要在 `main` 上修改、提交或合并。
- 保留现有项目内容，不执行未经授权的删除、重置或强制推送。
- 用户已于 2026-09-20 授权前端 MVP 开发。可以在 staging 开发和测试网站；真实后端契约、最终内容及 production 部署仍须等待相应负责人确认。
- Skills 仅安装在本项目 `.agents/skills/`，不要为本项目修改用户级或其他项目的技能配置。

## 技能使用

Codex 从 `.agents/skills/<name>/SKILL.md` 发现项目技能。开始相关任务时先阅读对应入口，按需读取该技能的 `references/`、`rules/` 或 `AGENTS.md`；不要一次载入全部参考资料。技能目录内的 `AGENTS.md` 是上游参考指南，不替代本项目约定。

| 任务 | 技能名称（对应 `.agents/skills/<name>/SKILL.md`） |
| --- | --- |
| 视觉方向、排版、配色和布局 | `frontend-design` |
| 可访问性、响应式和交互体验 | `ui-design` |
| UI 审查 | `web-design-guidelines` |
| React 组件和 Hooks | `react` |
| Next.js 路由、缓存和服务端组件 | `nextjs` |
| TypeScript 类型与配置 | `typescript` |
| Tailwind 与 shadcn/ui | `tailwind`、`shadcn` |
| 请求缓存、表单、校验、URL 状态 | `tanstack-query`、`react-hook-form`、`zod`、`nuqs` |
| 单元测试、端到端测试、接口模拟 | `vitest`、`playwright`、`msw` |
| 明确采用测试驱动开发的任务 | `tdd` |
| 功能模块架构、组件组合和性能 | `feature-arch`、`vercel-composition-patterns`、`vercel-react-best-practices` |

- 可显式调用，例如 `$frontend-design`、`$react`；也可按任务匹配技能。
- 视觉任务结合 `frontend-design` 与 `ui-design`，遵循用户简报及已有设计系统；工程任务只选择实际适用的技能。
- 使用框架技能前检查项目清单和锁文件。技能的存在不代表项目已选用该技术，不要因此添加依赖或升级版本。
- 上游 README 的版本表、规则数量及技能正文可能不同步。以项目实际版本对应的官方文档为准；冲突时遵循用户要求、本项目约定及实际代码约束。
- `web-design-guidelines` 审查时需要联网获取其指定规则，可使用 Codex 的网页读取工具；无法获取时说明限制，不声称已验证最新规则。

来源、固定版本和维护说明见 [docs/skills/README.md](docs/skills/README.md)。

## 目录、命名与简单架构

- 维护 [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)，使用学生开发者容易理解的语言解释实际目录、文件归属和 TALA / SkipCourse 集成位置。新增、移动或合并主要目录时同步更新，不把规划写成已实现的代码。
- 每个目录必须有明确且唯一的职责；职责高度重叠时优先合并。只在有实际文件需要时创建目录，不创建空目录，也不为单个文件建目录，除非功能预计自然扩展。
- 根据实际技术栈组织代码，不机械创建 components、pages、layouts、features 等完整目录树。框架已有路由约定时沿用它，不维护两套页面目录。
- 简单组件能解决的问题不引入复杂设计模式。页面专用代码先留在页面附近；仅对真正复用的逻辑进行抽象，较大且独立的业务功能才考虑 features。
- 使用表达用途的名字，例如 StudentDashboard.tsx、StudentProfileCard.tsx、skipCourseApi.ts、useStudentProfile.ts。禁止 Page1.tsx、Component2.tsx、utils2.ts、dataNew.ts 等含混命名，以及 misc、stuff、temp、new、test2、other、helpers2、components-new、final、final2 等含混目录。
- 上游技能的架构建议须服从上述简单性要求，不为应用技能引入额外层次。

## 简单进度记录

- 每轮重要修改同步更新根目录 `汇报给老板.md`，最新记录放在最上面，用简单中文说明做了什么、哪些还是演示、测试结果和等待事项；不把未完成或未验证的内容写成完成。
- `会议演示.md` 与 `汇报给老板.md` 是仅留本机的私人文件，已加入 `.gitignore`。Codex 可以继续更新，但绝对不要提交、强制添加或重新跟踪它们；团队文档不要链接到这些本地文件。
- Sponsor 需求、附件差异及待确认范围维护在 `docs/SPONSOR_REQUIREMENTS.md`。

## 完成前的仓库清洁检查

- 每次开发结束前检查：无用文件、重复组件、重复 CSS、未使用的 import、死代码、调试代码、console.log、临时文件、生成垃圾、误纳入 Git 的构建产物、不必要依赖及含混的文件或目录名。
- 仅删除能安全确认无用途的临时文件；用途不明的已有文件保留，并在最终报告中说明。上游 Skills 的示例、索引和参考资料不按应用死代码清理。
- 检查 .gitignore 能排除依赖目录、构建产物、环境密钥及 IDE 临时文件；同时检查已跟踪文件，因为新增忽略规则不会取消已有跟踪。
- 保留可复现安装所需的依赖锁文件、无敏感值的环境变量示例和有意共享的配置。根据实际工具补充规则，不用过宽规则隐藏源码或静态资源。
- 在最终报告中说明清洁检查结果和无法确认用途的保留项；没有应用代码时明确相关检查不适用。
