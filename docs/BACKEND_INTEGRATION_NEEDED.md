# Backend Team 需要提供什么

更新：2026-09-22。状态：**AWAITING BACKEND**。

这是前端的交接问题清单，不是已确认的 API 文档。当前所有账户、身份、课程与资助流程都是 DEMO，没有请求真实后端。下面不提供猜测的 URL、HTTP method 或 JSON。

代码入口和替换方式见 [INTEGRATION.md](INTEGRATION.md)。业务来源和 Tina/Sponsor 待确认项见 [SPONSOR_REQUIREMENTS.md](SPONSOR_REQUIREMENTS.md)。

## 每一项都需要的契约

以下状态适用于下面 **全部 12 项接入**，并非已默认采用某种认证或请求格式。

| 契约内容 | 当前状态 | 请 Backend Team 提供 |
| --- | --- | --- |
| Endpoint / base URL | AWAITING BACKEND | 获准使用的测试环境地址、版本和各接口路径 |
| HTTP method | AWAITING BACKEND | 每个操作实际使用的方法 |
| Request JSON | AWAITING BACKEND | 字段名、类型、必填项、合法值和无敏感资料的样例 |
| Response JSON | AWAITING BACKEND | 成功、空结果、处理中等实际响应样例与字段含义 |
| Authentication method | AWAITING BACKEND | 登录方式、会话过期、退出、跨域与 CSRF 要求；哪些工作由服务端完成 |
| Error response | AWAITING BACKEND | HTTP 状态、机器可读错误代码、字段错误、可展示消息和重试条件 |
| Permissions | AWAITING BACKEND | Student / Parent / Alumni / Staff 可读写范围，以及服务端如何验证亲子关联 |
| Loading behavior | AWAITING BACKEND | 同步或异步、预期耗时、取消、分页、轮询/推送及限流规则 |

不要把密钥写入本文件、Git 或 `VITE_*`。前端只接收浏览器可以持有的公开配置，秘密由后端管理。

## 12 项接入清单

下表是前端想展示或处理的信息，**不是请求/响应 schema，也不是已经批准的业务规则**。所有行的 endpoint、method、JSON、认证、错误格式和权限均为上表的 **AWAITING BACKEND**。

| 接入 | 前端需要 Backend Team 说明什么 | UI 等待、失败和重试需求 |
| --- | --- | --- |
| 1. Registration API | 注册数据存在哪里；由一个流程还是多个操作完成；验证、入学、资料、付款与学生 access 的先后状态；是否保存草稿 | 当前有提交中、错误、重试和成功页；真实提交需明确幂等与部分失败恢复，避免重试重复建号 |
| 2. Parent account creation | 如何创建家长；邮箱验证、重复账号与恢复流程；同意条款由谁确认 | 提交时禁用重复操作；字段错误指向具体输入；创建失败不展示成功 |
| 3. Student account creation | 谁创建学生；学生标识；什么时候允许登录；TALA 与 SkipCourse 建号由谁协调 | 区分待开通、失败、可访问；不能把前端完成页当成已开通 |
| 4. Parent → Student relationship | 关联由谁批准和验证；可访问的学生列表；撤销关联和多学生选择规则 | 等关联结果后才展示获授权学生；无权限时不能回落到其他学生数据 |
| 5. Login / Authentication | 使用哪个身份系统；登录、退出、会话恢复、过期处理；四种角色如何确认 | 有登录中、失败和重试；过期需重新登录；不由前端角色下拉框授予权限 |
| 6. Student profile | 稳定学生 ID、允许展示的字段、可编辑字段和保存规则 | 有加载、缺少资料与失败反馈；哪些字段允许家长修改需确认 |
| 7. Student evidence results | Evidence 来源与可读字段、学生归属、处理状态、结果时间、来源引用；是否允许上传/删除待确认 | 尚无专门页面；将来按真实 contract 展示未提交、处理中、空结果和失败，不显示虚构分析 |
| 8. Evidence matching results | 匹配对象、后端生成的解释、证据引用、排序与分数含义/单位、版本和限制 | 尚无专门页面；分清待计算、无匹配与失败；重试是否重新计算需确认 |
| 9. SkipCourse student data | 学生 profile 来源、TALA/SkipCourse 标识映射、账户状态、允许的登录或跳转方式 | 明确未关联与无法加载；不猜测 SkipCourse 地址或自动创建账户 |
| 10. SkipCourse course / progress data | 课程、时区、班次、真实余位、已选课程、进度、出勤；选课冲突与等待名单；消息是否另有接口 | 加载/空/错误/重试已可演示；真实选课需后端校验余位、并发与重复请求，再更新日历 |
| 11. AZ Transfer data | API 实际返回什么；机构/课程标识、有效期、来源链接、等价关系含义、分页与使用限制 | 尚无专门页面；区分无数据和请求失败；不将匹配结果表述成已批准学分 |
| 12. Billing / Funding integration | ESA / STO / Private 的真实流程、资格/审核状态、费用来源、托管付款方式；付款如何影响 access | 当前只选择偏好、不收费；真实流程需区分待审核、待付款、取消、失败和完成；浏览器不确认付款成功 |

材料清单和家长同意要求为 **AWAITING TINA**；费用、资助资格和正式付款说明为 **AWAITING SPONSOR**。后端规则不能由前端样例倒推。

## 现有前端可以复用什么

- `enrollmentService.ts`：注册表单类型、校验与提交边界。现在返回的姓名/邮箱只用于 demo；真实注册状态、ID、验证和开通结果要按合同扩展。
- `authService.ts` / `serviceTypes.ts`：认证选择入口与 UI 类型。当前 sessionStorage 是演示标记，真实身份接入时必须替换，不能当成权限凭据。
- `skipCourseApi.ts` / `demoAdapter.ts`：学生概览与模拟数据实现分开。真实 adapter 需要从服务端身份解析学生；当前 `getOverview` 没有真实身份契约。
- `scheduleService.ts`：载入和加入课程边界。当前以样例 email 存标签页选课；接入时改用经过验证的学生标识，并由后端完成选课事务。`ClassSlot` 当前从集中样例推导，真实契约到位后再确定独立类型。
- `demoData.ts`：学生学习与课程 fixture 集中在这里。未来真实响应在服务层校验并转换成页面需要的类型，不把请求散落进页面。

这些边界允许逐步接入，**不意味着拿到任意 API 后无需调整类型、错误处理或页面状态**。

## Evidence / AZ Transfer 的准备范围

当前架构没有阻碍：将来确认 contract 后，数据访问仍放 `src/services/`；完整页面放 `src/pages/`，真正共用的 UI 放 `src/components/`，浏览器流程放 `tests/`。

本轮没有新增空目录、占位页面、猜测的数据模型或假结果。前端不实现 tokenization、embeddings、cosine similarity、Neo4j、graph algorithms、evidence scoring 或 AZ Transfer 后端。分数与解释由后端提供，UI 只展示获准展示的结果和状态。

## Questions for Backend Team

1. Where should registration data be stored?
2. Which API creates parent and student accounts?
3. How is a parent linked to a student account?
4. What authentication system should the frontend use?
5. What is the response JSON for evidence matching?
6. What data will the AZ Transfer API return?
7. Which endpoints provide SkipCourse student profile/course data?
8. What error format should the frontend expect?
9. How should registration recover if account creation, billing, or SkipCourse provisioning fails?
10. Which registration and billing states allow student access?
11. How should the frontend handle an expired session or revoked parent access?
12. Which preview origins are allowed, and what safe test accounts can we use?

## 拿到契约后的验收

先使用获准的测试环境和样例账号，验证成功/空/错误、会话过期、跨学生访问限制、重复提交和部分失败恢复。再替换 demo 实现，并复测注册到选课的完整路线。真实付款、敏感资料、production 和域名操作不属于当前授权范围。
