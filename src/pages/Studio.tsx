import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Zap, Hammer, Save, Rocket, Trash2, Pencil, Plus, Copy, Check,
  FileCode2, Eye, ArrowLeft, Loader2, CircleDot,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { useGlow } from "@/pages/Home";
import { LOGIN_PATH } from "@/const";

const CATEGORY_OPTIONS = ["办公文档", "金融数据", "创意生成", "开发建站", "研究与助手", "写作创作", "其他"];

const DEFAULT_PROMPT = `# 我的新技能

## 触发场景
当用户说到「XXX」时，使用本技能。

## 工作流程
1. 第一步……
2. 第二步……
3. 第三步……

## 注意事项
- 在这里写下约束和规则
`;

/* ---- 极简 markdown 渲染 ---- */
function renderMarkdown(md: string) {
  const lines = md.split("\n");
  const out: React.ReactNode[] = [];
  let inCode = false;
  let codeBuf: string[] = [];
  let key = 0;

  const inline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((p, i) => {
      if (p.startsWith("**") && p.endsWith("**"))
        return <strong key={i} className="font-bold text-amber-300">{p.slice(2, -2)}</strong>;
      if (p.startsWith("`") && p.endsWith("`"))
        return <code key={i} className="rounded bg-amber-400/10 px-1.5 py-0.5 font-mono-tech text-[0.85em] text-amber-200">{p.slice(1, -1)}</code>;
      return p;
    });
  };

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      if (inCode) {
        out.push(
          <pre key={key++} className="my-3 overflow-x-auto rounded-lg border border-white/10 bg-black/60 p-4 font-mono-tech text-xs leading-relaxed text-amber-100/80">
            {codeBuf.join("\n")}
          </pre>
        );
        codeBuf = [];
        inCode = false;
      } else inCode = true;
      continue;
    }
    if (inCode) { codeBuf.push(line); continue; }

    if (line.startsWith("### "))
      out.push(<h3 key={key++} className="mt-5 text-base font-bold text-white">{inline(line.slice(4))}</h3>);
    else if (line.startsWith("## "))
      out.push(<h2 key={key++} className="mt-6 border-b border-amber-400/15 pb-2 text-lg font-bold text-amber-200">{inline(line.slice(3))}</h2>);
    else if (line.startsWith("# "))
      out.push(<h1 key={key++} className="mt-2 text-2xl font-black text-white">{inline(line.slice(2))}</h1>);
    else if (/^\d+\.\s/.test(line.trim()))
      out.push(
        <div key={key++} className="flex gap-2.5 pl-2 text-sm leading-relaxed text-white/70">
          <span className="font-mono-tech shrink-0 text-amber-400/70">{line.trim().match(/^\d+/)?.[0]}.</span>
          <span>{inline(line.trim().replace(/^\d+\.\s*/, ""))}</span>
        </div>
      );
    else if (line.trim().startsWith("- "))
      out.push(
        <div key={key++} className="flex gap-2.5 pl-2 text-sm leading-relaxed text-white/70">
          <span className="text-amber-400/70">▸</span>
          <span>{inline(line.trim().slice(2))}</span>
        </div>
      );
    else if (line.trim() === "") out.push(<div key={key++} className="h-2" />);
    else out.push(<p key={key++} className="text-sm leading-relaxed text-white/70">{inline(line)}</p>);
  }
  return out;
}

function buildSkillMd(meta: { name: string; category: string; desc: string; tags: string }, prompt: string) {
  return `---
name: ${meta.name}
description: ${meta.desc}
category: ${meta.category}
tags: ${meta.tags}
---

${prompt}`;
}

type FormState = {
  name: string;
  category: string;
  desc: string;
  tags: string;
  usage: string;
  prompt: string;
};

const emptyForm: FormState = {
  name: "",
  category: "其他",
  desc: "",
  tags: "",
  usage: "",
  prompt: DEFAULT_PROMPT,
};

export default function Studio() {
  const { user, isLoading } = useAuth({ redirectOnUnauthenticated: true, redirectPath: LOGIN_PATH });
  const glow = useGlow();
  const utils = trpc.useUtils();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const mySkills = trpc.skills.listMine.useQuery(undefined, { enabled: !!user });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const invalidate = () => {
    utils.skills.listMine.invalidate();
    utils.skills.listPublished.invalidate();
  };

  const createMut = trpc.skills.create.useMutation({
    onSuccess: () => { invalidate(); showToast("已保存 ✓"); resetForm(); },
    onError: (e) => showToast(`保存失败：${e.message}`),
  });
  const updateMut = trpc.skills.update.useMutation({
    onSuccess: () => { invalidate(); showToast("已更新 ✓"); resetForm(); },
    onError: (e) => showToast(`更新失败：${e.message}`),
  });
  const deleteMut = trpc.skills.remove.useMutation({
    onSuccess: () => { invalidate(); showToast("已删除"); },
  });

  const saving = createMut.isPending || updateMut.isPending;

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const save = (status: "draft" | "published") => {
    const payload = { ...form, status };
    if (editingId) updateMut.mutate({ id: editingId, data: payload });
    else createMut.mutate(payload);
  };

  const loadForEdit = (s: NonNullable<typeof mySkills.data>[number]) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      category: s.category,
      desc: s.desc,
      tags: s.tags,
      usage: s.usage ?? "",
      prompt: s.prompt ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const skillMd = useMemo(() => buildSkillMd(form, form.prompt), [form]);

  const copySkillMd = () => {
    navigator.clipboard.writeText(skillMd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  useEffect(() => {
    document.title = "Skill 工坊 · 技能宇宙";
  }, []);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[rgb(var(--bg))]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    );
  }

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="relative min-h-screen bg-[rgb(var(--bg))]">
      <div className="pointer-events-none fixed inset-0 grid-bg" />
      <div className="pointer-events-none fixed left-1/2 top-[-300px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[140px]" />

      {/* toast */}
      {toast && (
        <div className="glass-pill fixed left-1/2 top-20 z-[60] -translate-x-1/2 rounded-full border-amber-400/40 px-5 py-2 text-sm text-amber-200 shadow-[0_0_24px_rgba(255,184,0,0.25)]">
          {toast}
        </div>
      )}

      {/* header */}
      <header className="glass-pill fixed left-1/2 top-4 z-50 flex w-[min(96vw,1100px)] -translate-x-1/2 items-center justify-between rounded-full px-5 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_18px_rgba(255,184,0,0.5)]">
            <Zap className="h-4 w-4 text-black" />
          </span>
          <span className="text-sm font-bold tracking-wide text-white">
            SKILL <span className="text-amber-400">工坊</span>
          </span>
          <span className="font-mono-tech hidden text-[10px] tracking-widest text-white/30 sm:inline">CREATOR STUDIO</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[13px] text-white/70 transition-colors hover:border-amber-400/40 hover:text-amber-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> 返回首页
        </Link>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 pb-32 pt-32">
        {/* title */}
        <div className="mb-10">
          <div className="font-mono-tech text-xs tracking-[0.3em] text-amber-400/70 uppercase">SKILL CREATOR STUDIO</div>
          <h1 className="mt-2 flex items-center gap-3 text-4xl font-black text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-amber-400/30 bg-amber-400/10">
              <Hammer className="h-5 w-5 text-amber-300" />
            </span>
            {editingId ? "编辑技能" : "制作你的 Skill"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/50">
            在这里编写你自己的技能：填好基本信息，用 Markdown 写技能正文，右边实时预览效果。
            可以保存为草稿慢慢打磨，也可以直接发布到首页的「社区技能」让大家看到。
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* ------- left: form ------- */}
          <div className="space-y-5">
            <div className="glow-card corner-dots p-6" onMouseMove={glow}>
              <span className="dot" /><span className="dot" /><span className="dot" /><span className="dot" />
              <div className="font-mono-tech mb-5 text-[11px] tracking-[0.25em] text-amber-400/70 uppercase">01 · 基本信息</div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs text-white/50">技能名称 *</label>
                  <input
                    value={form.name}
                    onChange={set("name")}
                    placeholder="例如：周报生成器"
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-amber-400/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs text-white/50">所属分类 *</label>
                    <select
                      value={form.category}
                      onChange={set("category")}
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-amber-400/50"
                    >
                      {CATEGORY_OPTIONS.map((c) => <option key={c} value={c} className="bg-neutral-900">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-white/50">标签（逗号分隔）</label>
                    <input
                      value={form.tags}
                      onChange={set("tags")}
                      placeholder="效率, 写作"
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-amber-400/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs text-white/50">一句话介绍（大白话）*</label>
                  <textarea
                    value={form.desc}
                    onChange={set("desc")}
                    rows={2}
                    placeholder="用最通俗的话告诉大家这个技能是干嘛的"
                    className="w-full resize-none rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-amber-400/50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs text-white/50">使用说明（每行一条）</label>
                  <textarea
                    value={form.usage}
                    onChange={set("usage")}
                    rows={3}
                    placeholder={"说「帮我把这周的工作整理成周报」\n上传资料后说「按这个模板来」"}
                    className="w-full resize-none rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-amber-400/50"
                  />
                </div>
              </div>
            </div>

            <div className="glow-card corner-dots p-6" onMouseMove={glow}>
              <span className="dot" /><span className="dot" /><span className="dot" /><span className="dot" />
              <div className="mb-5 flex items-center justify-between">
                <div className="font-mono-tech text-[11px] tracking-[0.25em] text-amber-400/70 uppercase">02 · 技能正文（Markdown）</div>
                <div className="flex gap-1 rounded-full border border-white/10 bg-black/40 p-1">
                  <button
                    onClick={() => setTab("edit")}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors ${tab === "edit" ? "bg-amber-400/15 text-amber-300" : "text-white/40 hover:text-white"}`}
                  >
                    <FileCode2 className="h-3 w-3" /> 编辑
                  </button>
                  <button
                    onClick={() => setTab("preview")}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors ${tab === "preview" ? "bg-amber-400/15 text-amber-300" : "text-white/40 hover:text-white"}`}
                  >
                    <Eye className="h-3 w-3" /> 预览
                  </button>
                </div>
              </div>

              {tab === "edit" ? (
                <textarea
                  value={form.prompt}
                  onChange={set("prompt")}
                  rows={16}
                  spellCheck={false}
                  className="w-full resize-y rounded-lg border border-white/10 bg-black/60 px-4 py-3 font-mono-tech text-[13px] leading-relaxed text-amber-100/90 placeholder-white/25 outline-none transition-colors focus:border-amber-400/50"
                  placeholder="用 Markdown 写技能的工作流程、规则和注意事项…"
                />
              ) : (
                <div className="min-h-[300px] rounded-lg border border-white/10 bg-black/40 px-5 py-4">
                  {renderMarkdown(form.prompt)}
                </div>
              )}

              {/* actions */}
              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
                <button
                  onClick={() => save("draft")}
                  disabled={saving || !form.name || !form.desc}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/80 transition-all hover:border-amber-400/40 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  存为草稿
                </button>
                <button
                  onClick={() => save("published")}
                  disabled={saving || !form.name || !form.desc}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-2.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(255,184,0,0.35)] transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                  {editingId ? "更新并发布" : "发布到社区"}
                </button>
                {editingId && (
                  <button onClick={resetForm} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white">
                    <Plus className="h-3.5 w-3.5" /> 新建一个
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ------- right: live preview ------- */}
          <div className="space-y-8">
            <div className="glow-card corner-dots sticky top-24 p-6" onMouseMove={glow}>
              <span className="dot" /><span className="dot" /><span className="dot" /><span className="dot" />
              <div className="mb-4 flex items-center justify-between">
                <div className="font-mono-tech text-[11px] tracking-[0.25em] text-amber-400/70 uppercase">SKILL.md 实时预览</div>
                <button
                  onClick={copySkillMd}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 transition-colors hover:border-amber-400/40 hover:text-amber-300"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-amber-300" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "已复制" : "复制"}
                </button>
              </div>
              <pre className="max-h-[420px] overflow-auto rounded-lg border border-white/10 bg-black/60 p-4 font-mono-tech text-xs leading-relaxed text-amber-100/75 whitespace-pre-wrap">
                {skillMd}
              </pre>
              <p className="mt-3 text-[11px] leading-relaxed text-white/35">
                这就是标准的 Skill 文件格式：头部是元信息（名称、介绍、分类、标签），正文是 Markdown 写的工作流程。
              </p>
            </div>
          </div>
        </div>

        {/* ------- my skills ------- */}
        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between border-b border-white/10 pb-5">
            <div>
              <div className="font-mono-tech text-xs tracking-[0.3em] text-amber-400/70 uppercase">MY SKILLS</div>
              <h2 className="mt-2 text-3xl font-black text-white">
                我的技能
                <span className="font-mono-tech ml-3 text-sm font-normal text-white/30">{mySkills.data?.length ?? 0} 个</span>
              </h2>
            </div>
          </div>

          {mySkills.isLoading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2].map((i) => <div key={i} className="h-44 animate-pulse rounded-xl border border-white/5 bg-white/[0.03]" />)}
            </div>
          ) : !mySkills.data || mySkills.data.length === 0 ? (
            <div className="glass-pill rounded-xl p-12 text-center text-white/40">
              还没有作品，用上面的编辑器创建你的第一个 Skill 吧
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {mySkills.data.map((s) => (
                <div key={s.id} className="glow-card corner-dots p-6" onMouseMove={glow}>
                  <span className="dot" /><span className="dot" /><span className="dot" /><span className="dot" />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-mono-tech text-[11px] tracking-widest text-amber-400/70 uppercase">{s.category}</div>
                      <h3 className="mt-1 text-lg font-bold text-white">{s.name}</h3>
                    </div>
                    <span className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${
                      s.status === "published"
                        ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                        : "border-white/15 bg-white/5 text-white/45"
                    }`}>
                      <CircleDot className="h-3 w-3" />
                      {s.status === "published" ? "已发布" : "草稿"}
                    </span>
                  </div>
                  <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-white/55">{s.desc}</p>
                  <div className="font-mono-tech mt-3 text-[10px] text-white/25">
                    更新于 {new Date(s.updatedAt).toLocaleString("zh-CN")}
                  </div>
                  <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
                    <button
                      onClick={() => loadForEdit(s)}
                      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-white/70 transition-colors hover:border-amber-400/40 hover:text-amber-300"
                    >
                      <Pencil className="h-3 w-3" /> 编辑
                    </button>
                    <button
                      onClick={() => deleteMut.mutate({ id: s.id })}
                      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-white/70 transition-colors hover:border-red-400/50 hover:text-red-300"
                    >
                      <Trash2 className="h-3 w-3" /> 删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
