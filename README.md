# Skill 宇宙 · Kimi Skill Universe

> 一站式 Skill 技能索引站：收录全部技能，分类导航 + 大白话使用说明 + 适用 AI 标注 + 官方直达链接；登录后还能在「Skill 工坊」制作并发布你自己的技能。

## 功能特性

- **技能索引**：20+ 技能按 6 大类整理（办公文档 / 金融数据 / 创意生成 / 开发建站 / 研究与助手 / 写作创作），横条分类导航，点击切换
- **大白话说明**：每个技能讲清楚「是干嘛的、怎么用」，附使用示例
- **适用 AI 标注**：每个技能标明该在哪个 AI / 平台使用（Kimi、Kimi 插件、第三方官方站）
- **全局搜索**：按名称、标签、适用平台秒搜
- **账号系统**：Kimi OAuth 一键登录 + 邮箱/用户名密码注册登录
- **Skill 工坊**：Markdown 编辑器 + 实时预览，制作、保存草稿、发布个人技能
- **社区技能**：用户发布的技能展示在首页社区板块，带作者署名

## 技术栈

- **前端**：React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **后端**：Hono + tRPC 11（端到端类型安全）
- **数据库**：Drizzle ORM + MySQL
- **认证**：OAuth 2.0（Kimi）+ 本地邮箱密码（scrypt 加盐哈希，JWT 会话）

## 目录结构

```
api/          Hono + tRPC 后端（路由、中间件、查询层）
contracts/    前后端共享类型与常量
db/           Drizzle 数据库 Schema
src/
  data/       技能数据（分类、说明、适用 AI、链接）
  pages/      首页 / 登录 / Skill 工坊
  components/ UI 组件
```

## 本地开发

```bash
npm install
cp .env.example .env   # 配置 DATABASE_URL、OAuth 等环境变量
npm run db:push        # 同步数据库结构
npm run dev            # http://localhost:3000
```

## 常用命令

| 命令 | 说明 |
|---|---|
| `npm run dev` | 开发服务器（HMR） |
| `npm run build` | 生产构建 |
| `npm run check` | TypeScript 类型检查 |
| `npm run db:push` | 同步数据库 Schema |

## 开源协议

MIT


## 关于 shadcn/ui 组件

`src/components/ui/` 下的组件为标准 shadcn/ui 生成物（体积原因未收录进本仓库），clone 后执行以下命令一键补齐：

```bash
npx shadcn@latest add accordion alert-dialog alert aspect-ratio avatar badge breadcrumb button-group button calendar card carousel chart checkbox collapsible command context-menu dialog drawer dropdown-menu empty field form hover-card input-group input-otp input item kbd label menubar navigation-menu pagination popover progress radio-group resizable scroll-area select separator sheet sidebar skeleton slider sonner spinner switch table tabs textarea toggle-group toggle tooltip
```
