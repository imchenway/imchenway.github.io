---
title: "跨终端 Vibe Coding 方案：用 Telegram Bot 随走随写"
date: 2025-09-28
tags: ['#Tools', '#AI', '#VIBE']
---

### 本文目录
<!-- toc -->

# 1. 项目概览
- vibeBot 是一套“Telegram → Mac CLI → Telegram 回推”的自动化工作流，核心由 `bot.py`（aiogram 3 Worker）驱动，通过 tmux 与本地模型 CLI 协作，关键步骤整理自 `/Users/david/hypha/tools/vibeBot/README.md`，亦可配合 [Context7 官方说明](https://github.com/upstash/context7/blob/master/README.md) 获取最新文档上下文。
- 项目主目录分为三类：运行脚本 (`scripts/*.sh`)、模型配置 (`scripts/models/*.sh`)、运行日志 (`logs/<model>/<project>/…`)，结合 `.env` 与 `config/projects.json` 管理多项目实例。
- 定位：提供统一的 master bot 控制入口，同时为每个项目启动独立 worker，满足多模型（Codex/ClaudeCode/Gemini）并行处理需求。

# 2. 快速上手流程
1. 准备环境：确保 macOS 具备 Python 3.11+、tmux、Telegram Bot Token。
2. 初始化配置：
   - 复制模板：
     ```bash
     cd ~/vibeBot
     cp .env.example .env
     cp config/projects.sample.json config/projects.json
     ```
   - 在 `.env` 中仅填写 master 侧参数：`MASTER_BOT_TOKEN`、`MASTER_WHITELIST`、`MODEL_DEFAULT`、`TMUX_SESSION_PREFIX` 等。
   - 在 `config/projects.json` 为每个项目写入 `bot_name`、`bot_token`、`project_slug`、`default_model`、`workdir` 等字段，`allowed_chat_id` 留空可自动记录首个合法会话。
3. 启动并验证：
   ```bash
   ./scripts/run_bot.sh --model codex --project mall-backend
   tail -f logs/codex/mall-backend/run_bot.log
   ```
   - `run_bot.sh` 自动创建虚拟环境、安装依赖、启动 tmux session，再调用模型 CLI 与 `bot.py`。
   - 如需前台调试，可追加 `--foreground`；要跳过预先 stop，加 `--no-stop`。
4. 停止或切换：
   ```bash
   ./scripts/stop_bot.sh --model codex --project mall-backend
   ./scripts/run_bot.sh --model claudecode --project mall-backend
   ```
   - `stop_bot.sh` 会尝试 `tmux kill-session`、结束 `bot.pid` 指定进程并清理缓存，确保切换模型时幂等。

# 3. 常用操作清单
| 场景 | 脚本/命令 | 说明 |
| --- | --- | --- |
| 启动 worker | `./scripts/run_bot.sh --model <name> --project <slug>` | 自动建 venv、导入配置并后台运行，可加 `--foreground` 调试 |
| 停止 worker | `./scripts/stop_bot.sh --model <name> --project <slug>` | 关闭 tmux session 与 `bot.py`，删除临时状态 |
| 查看模型日志 | `tail -f logs/<model>/<project>/model.log` | 由 tmux pipe-pane 捕获模型 CLI 输出，排查上下文注入是否成功 |
| 查看运行日志 | `tail -f logs/<model>/<project>/run_bot.log` | 记录脚本启动流程、`.env` 解析、依赖安装信息 |
| 当前会话定位 | `cat logs/<model>/<project>/current_session.txt` | 存储 JSONL 会话路径，便于追踪同一对话上下文 |
| Master 控制 | `/projects`、`/run <project>`、`/stop <project>` | 通过管理员 bot（`MASTER_BOT_TOKEN`）统一指挥，状态写入 `state/state.json` |

# 4. 日志与监控要点
- 目录结构：
  ```
  logs/
    └─ codex/
        └─ mall-backend/
             ├─ run_bot.log
             ├─ model.log
             ├─ bot.pid
             └─ current_session.txt
  ```
- 诊断建议：
  - `run_bot.log` 关注虚拟环境创建、依赖安装与 tmux session 名称。
  - `model.log` 可校验命令注入与模型输出是否超时。
  - `current_session.txt` 指向 JSONL 历史记录，出错时可配合 Context7 调取代码文档，快速定位 prompt。

# 5. 模型切换与 Context7 增强
- `scripts/models/` 目录分别维护 `codex.sh`、`claudecode.sh`、`gemini.sh`，公共逻辑在 `common.sh`，确保互不干扰。
- 切换步骤：先执行 `stop_bot.sh --model <旧>`，再 `run_bot.sh --model <新>`，`ACTIVE_MODEL` 会在 `/start` 回复中提示。
- 在 Cursor 等 IDE 中，可直接在 prompt 末尾追加 `use context7`，即时拉取依赖库或脚本的最新文档示例：[官方说明](https://github.com/upstash/context7/blob/master/README.md)。
- CLI 集成示例：
  ```bash
  npx @upstash/context7-mcp@latest --transport stdio
  ```
  - 结合 vibeBot，可在 watcher 阶段读取 Context7 返回的上下文片段，提高多模型协同准确度。

# 6. FAQ 与排障
- **为何 `.env` 只配置 master？** 项目级 Token 放在 `config/projects.json`，便于按项目授权与版本控制。
- **`allowed_chat_id` 为空会怎样？** worker 首次收到合法消息会写入 `state/state.json`，后续自动鉴权。
- **如何定位命令未执行？** 查看 `model.log` 是否存在 prompt 注入日志，必要时进入 tmux 会话手工输入。
- **tmux 会话残留怎么办？** `stop_bot.sh` 已对 `tmux kill-session` 和 `bot.pid` 做了幂等处理，若仍存在需手动 `tmux ls` 排查，同步清理。
- **日志过大**：定期清理 `logs/<model>/<project>/` 或调整脚本输出阈值；注意不要删除当前会话 JSONL。

# 7. 最佳实践与安全建议
- 不要将 `.env`、`config/projects.json` 提交版本库；敏感 Token 改用 CI/CD 密钥或 macOS 钥匙串。
- 切换模型前务必执行 `stop_bot.sh`，避免多实例争用 tmux 名称或 JSONL 文件。
- 建议将 `run_bot.log`、`model.log` 纳入集中日志系统，配合 Context7 检索最新脚本变更。
- 定期运行 `./scripts/stop_bot.sh --model <name> --project <slug>` 做健康检查，确认 `bot.pid` 已释放。

# 8. 参考资料
- `/Users/david/hypha/tools/vibeBot/README.md`
- Context7 MCP 官方文档：https://github.com/upstash/context7/blob/master/README.md
- Hexo 写作规范：https://hexo.io/docs/writing
