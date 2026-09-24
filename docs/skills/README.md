# 项目前端 Skills 安装记录

安装日期：2026-09-20。范围：仅 TALA-Hub，分支 `staging`。

## 来源与安装方式

安装前阅读了两个仓库的 README、Frontend Design 的 SKILL.md，以及 React 技能包的安装、使用说明。按照 [Codex 官方技能文档](https://learn.chatgpt.com/docs/build-skills)，使用仓库级 `.agents/skills/`。

| 来源 | 固定提交 | 安装范围 |
| --- | --- | --- |
| [anthropics/skills](https://github.com/anthropics/skills) | `34040c9c568585f6929bedeaad110ad08f079624` | `skills/frontend-design` |
| [PyModel/react-frontend-skills](https://github.com/PyModel/react-frontend-skills) | `f70c71c7739a83b45cd29f1e74dc8764a3a3f8b5` | `skills/` 下全部 18 个技能 |

Anthropic README 的插件命令面向 Claude Code；其独立 SKILL.md 格式可用于 Codex。PyModel README 提供 Codex 专用 `npx skills add ... -a codex -s '*' -y` 命令，也支持直接使用标准技能目录。本次统一使用 Codex 自带 skill-installer 的 `install-skill-from-github.py`，指定 `--repo`、上述 `--ref`、各 `--path`、`--method download` 和 `--dest /Users/yichenceng/capstone/TALA-Hub/.agents/skills`，避免默认用户级安装。

每个技能安装于 `.agents/skills/<name>/`，完整保留上游 SKILL.md、参考资料及技能内索引；未修改上游内容。共 19 个技能，完整名称和任务映射见根目录 [AGENTS.md](../../AGENTS.md)。没有安装 npm 依赖、MCP 服务或 Claude 插件，也没有修改全局配置。

## 许可证

- Frontend Design 的许可证随技能保存在 [LICENSE.txt](../../.agents/skills/frontend-design/LICENSE.txt)。
- React 技能包仓库根目录的 MIT 许可证保存在 [react-frontend-skills.LICENSE](react-frontend-skills.LICENSE)，适用于导入的技能包；各技能原有署名和元数据保持原样。

## 使用与检查

下一轮可使用 `$frontend-design` 或 `$react` 显式调用，也可由相关任务自动触发。如果界面没有刷新，重新打开当前项目或重启 Codex。

安装时已核对 19 个入口的名称与描述、名称唯一性、入口中的本地链接及所引用的 AGENTS.md。780 个上游文件逐字节与固定提交归档一致。原有 README.md、CNAME 及 main 分支保持不变。

这是安装结构和完整性检查；尚未通过网站开发任务验证实际生成效果。上游 README 的版本表与部分技能正文存在差异，项目约定要求使用实际依赖版本的官方文档。`web-design-guidelines` 在审查时需要联网获取最新指南，其余技能参考资料已保存在本地。

## 后续维护

更新时先阅读上游变更，在临时目录安装新版本并比较差异，再有针对性地更新项目文件、许可证及本记录。不要用全局安装参数，也不要为更新技能覆盖整个项目。当前安装文件尚未提交，后续可随 staging 的正常版本管理流程纳入仓库。
