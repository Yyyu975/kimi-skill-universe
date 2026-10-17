import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router";
import {
  FileText, TrendingUp, Sparkles, Code2, Search, PenLine,
  Terminal, Zap, ChevronRight, Flame, BookOpen, MousePointerClick,
  Users, Hammer, ExternalLink, Bot,
} from "lucide-react";
import { categories, allSkills, type Skill } from "@/data/skills";
import { AuthButtons } from "@/components/AuthButtons";
import { trpc } from "@/providers/trpc";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, TrendingUp, Sparkles, Code2, Search, PenLine, Users,
};

/* ---------- mouse tracking glow handler ---------- */
export function useGlow() {
  return useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }, []);
}

/* ---------- scroll reveal ---------- */
function useReveal(dep?: unknown) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("revealed");
          io.unobserve(en.target);
        }
      }),
      { threshold: 0.05 }
    );
    document.querySelectorAll(".reveal:not(.revealed)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}

/* ---------- AI badges ---------- */
function AiBadges({ ais }: { ais: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Bot className="h-3 w-3 text-amber-400/60" />
      {ais.map((a) => (
        <span
          key={a}
          className="rounded-full border border-amber-400/25 bg-amber-400/[0.07] px-2 py-0.5 text-[10px] font-medium text-amber-200/80"
        >
          {a}
        </span>
      ))}
    </div>
  );
}

/* ---------- Skill Card ---------- */
function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const glow = useGlow();
  const [open, setOpen] = useState(false);
  return (
    <div
      className="glow-card corner-dots reveal flex cursor-pointer flex-col p-6 group"
      style={{ transitionDelay: `${(index % 3) * 90}ms` }}
      onMouseMove={glow}
      onClick={() => setOpen(!open)}
    >
      <span className="dot" /><span className="dot" /><span className="dot" /><span className="dot" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono-tech text-[11px] tracking-widest text-amber-400/70 uppercase">
            {skill.en}
          </div>
          <h3 className="mt-1.5 flex items-center gap-2 text-xl font-bold text-white">
            {skill.name}
            {skill.hot && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                <Flame className="h-3 w-3" /> 热门
              </span>
            )}
          </h3>
        </div>
        <ChevronRight
          className={`h-4 w-4 shrink-0 text-amber-400/60 transition-transform duration-300 ${open ? "rotate-90" : "group-hover:translate-x-1"}`}
        />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-white/60">{skill.desc}</p>

      <div className="mt-3">
        <AiBadges ais={skill.ais} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {skill.tags.map((t) => (
          <span key={t} className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/50">
            {t}
          </span>
        ))}
      </div>

      <div
        className="grid transition-all duration-500 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="mt-5 border-t border-amber-400/15 pt-4">
            <div className="flex items-center gap-2 font-mono-tech text-[11px] tracking-widest text-amber-400/80 uppercase">
              <Terminal className="h-3.5 w-3.5" /> 使用说明
            </div>
            <ul className="mt-3 space-y-2.5">
              {skill.usage.map((u, i) => (
                <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-white/70">
                  <span className="font-mono-tech mt-0.5 shrink-0 text-amber-400/70">{String(i + 1).padStart(2, "0")}</span>
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="font-mono-tech text-[10px] tracking-widest text-white/25 group-hover:text-amber-400/60 transition-colors">
          {open ? "点击收起 ↑" : "点击展开使用说明 →"}
        </span>
        <a
          href={skill.link}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/60 transition-all hover:border-amber-400/50 hover:text-amber-300 hover:shadow-[0_0_14px_rgba(255,184,0,0.25)]"
        >
          前往使用 <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

/* ---------- Community Skill Card ---------- */
export function CommunityCard({
  skill,
  index,
}: {
  skill: {
    id: number;
    name: string;
    category: string;
    desc: string;
    tags: string;
    usage: string | null;
    authorName: string | null;
    authorAvatar: string | null;
  };
  index: number;
}) {
  const glow = useGlow();
  const [open, setOpen] = useState(false);
  const usageLines = (skill.usage ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  const tagList = skill.tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean);

  return (
    <div
      className="glow-card corner-dots reveal flex cursor-pointer flex-col p-6 group"
      style={{ transitionDelay: `${(index % 3) * 90}ms` }}
      onMouseMove={glow}
      onClick={() => setOpen(!open)}
    >
      <span className="dot" /><span className="dot" /><span className="dot" /><span className="dot" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono-tech text-[11px] tracking-widest text-amber-400/70 uppercase">
            COMMUNITY · {skill.category}
          </div>
          <h3 className="mt-1.5 text-xl font-bold text-white">{skill.name}</h3>
        </div>
        <ChevronRight
          className={`h-4 w-4 shrink-0 text-amber-400/60 transition-transform duration-300 ${open ? "rotate-90" : "group-hover:translate-x-1"}`}
        />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-white/60">{skill.desc}</p>

      <div className="mt-3">
        <AiBadges ais={["Kimi"]} />
      </div>

      {tagList.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tagList.map((t) => (
            <span key={t} className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/50">
              {t}
            </span>
          ))}
        </div>
      )}

      <div
        className="grid transition-all duration-500 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          {usageLines.length > 0 && (
            <div className="mt-5 border-t border-amber-400/15 pt-4">
              <div className="flex items-center gap-2 font-mono-tech text-[11px] tracking-widest text-amber-400/80 uppercase">
                <Terminal className="h-3.5 w-3.5" /> 使用说明
              </div>
              <ul className="mt-3 space-y-2.5">
                {usageLines.map((u, i) => (
                  <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-white/70">
                    <span className="font-mono-tech mt-0.5 shrink-0 text-amber-400/70">{String(i + 1).padStart(2, "0")}</span>
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto flex items-center gap-2 border-t border-white/5 pt-3">
        {skill.authorAvatar ? (
          <img src={skill.authorAvatar} alt="" className="h-5 w-5 rounded-full object-cover" />
        ) : (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/20 text-[10px] font-bold text-amber-300">
            {(skill.authorName ?? "匿").slice(0, 1)}
          </span>
        )}
        <span className="text-xs text-white/40">by {skill.authorName ?? "匿名用户"}</span>
      </div>
    </div>
  );
}

/* ---------- Community Grid ---------- */
function CommunityGrid() {
  const { data, isLoading } = trpc.skills.listPublished.useQuery();

  if (isLoading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-52 animate-pulse rounded-xl border border-white/5 bg-white/[0.03]" />
        ))}
      </div>
    );
  }
  if (!data || data.length === 0) {
    return (
      <div className="glass-pill reveal rounded-xl p-12 text-center">
        <Hammer className="mx-auto h-8 w-8 text-amber-400/50" />
        <p className="mt-4 text-white/50">还没有社区技能，来做第一个发布的人吧！</p>
        <Link
          to="/studio"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-2.5 text-sm font-bold text-black transition-transform hover:scale-105"
        >
          <Hammer className="h-4 w-4" /> 进入 Skill 工坊
        </Link>
      </div>
    );
  }
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {data.map((s, i) => (
        <CommunityCard key={s.id} skill={s} index={i} />
      ))}
    </div>
  );
}

/* ---------- Home Page ---------- */
export default function Home() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<string>(categories[0].id);
  useReveal(tab);

  const activeCat = categories.find((c) => c.id === tab);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return allSkills.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.en.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q)) ||
        s.ais.some((a) => a.toLowerCase().includes(q))
    );
  }, [query]);

  const total = allSkills.length;

  return (
    <div className="relative min-h-screen bg-[rgb(var(--bg))]">
      {/* ambient background */}
      <div className="pointer-events-none fixed inset-0 grid-bg" />
      <div className="pointer-events-none fixed left-1/2 top-[-300px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[140px]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-px overflow-visible">
        <div className="scanline mx-auto h-[2px] w-full bg-gradient-to-r from-transparent via-amber-400/25 to-transparent" />
      </div>

      {/* header */}
      <header className="glass-pill fixed left-1/2 top-4 z-50 flex w-[min(96vw,1100px)] -translate-x-1/2 items-center justify-between rounded-full px-5 py-3">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_18px_rgba(255,184,0,0.5)]">
            <Zap className="h-4 w-4 text-black" />
          </span>
          <span className="text-sm font-bold tracking-wide text-white">
            SKILL <span className="text-amber-400">宇宙</span>
          </span>
          <span className="font-mono-tech hidden text-[10px] tracking-widest text-white/30 sm:inline">v3.0 · {total} SKILLS</span>
        </button>
        <div className="flex items-center gap-3">
          <Link
            to="/studio"
            className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[13px] text-white/70 transition-colors hover:border-amber-400/40 hover:text-amber-300 md:flex"
          >
            <Hammer className="h-3.5 w-3.5" /> Skill 工坊
          </Link>
          <AuthButtons />
        </div>
      </header>

      {/* hero */}
      <section className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-6 pb-10 pt-36 text-center">
        <div className="float-slow mb-8 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/5 px-4 py-1.5 backdrop-blur">
          <span className="pulse-glow h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(255,184,0,0.9)]" />
          <span className="font-mono-tech text-xs tracking-[0.25em] text-amber-300/90">SYSTEM ONLINE · 面向所有用户的技能索引</span>
        </div>

        <h1 className="text-glow-gradient text-5xl font-black leading-tight tracking-tight sm:text-7xl">
          所有 Skill
          <br />
          一站式索引
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
          收录 <span className="font-bold text-amber-300">{total}</span> 个技能，按
          <span className="font-bold text-amber-300"> {categories.length} </span>大类整理。
          每个技能都标明「该在哪个 AI 里用」，附官方直达链接。
        </p>

        {/* search */}
        <div className="glass-pill mt-10 flex w-full max-w-lg items-center gap-3 rounded-full px-5 py-3.5 transition-shadow focus-within:shadow-[0_0_0_1px_rgba(255,184,0,0.4),0_0_30px_rgba(255,184,0,0.15)]">
          <Search className="h-4 w-4 shrink-0 text-amber-400/70" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜技能，比如：PPT、股票、3D、视频…"
            className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="font-mono-tech text-xs text-white/40 hover:text-amber-300">
              清空
            </button>
          )}
        </div>

        {/* marquee */}
        <div className="pointer-events-none mt-14 w-full max-w-3xl overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
          <div className="marquee flex w-max gap-8 font-mono-tech text-xs tracking-[0.3em] text-white/20">
            {[...allSkills, ...allSkills].map((s, i) => (
              <span key={i} className="flex items-center gap-8 whitespace-nowrap">
                {s.en.toUpperCase()} <span className="text-amber-400/40">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* category tab bar */}
      {!results && (
        <div className="sticky top-[72px] z-40 mx-auto max-w-7xl px-6">
          <div className="glass-pill flex items-center gap-1 overflow-x-auto rounded-2xl p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((c) => {
              const Icon = iconMap[c.icon] ?? Sparkles;
              const isActive = tab === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setTab(c.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-amber-400 to-amber-600 font-bold text-black shadow-[0_0_18px_rgba(255,184,0,0.4)]"
                      : "text-white/50 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {c.name}
                  <span className={`font-mono-tech text-[10px] ${isActive ? "text-black/60" : "text-white/25"}`}>
                    {c.skills.length}
                  </span>
                </button>
              );
            })}
            <div className="mx-1 h-6 w-px shrink-0 bg-white/10" />
            <button
              onClick={() => setTab("community")}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-all duration-300 ${
                tab === "community"
                  ? "bg-gradient-to-r from-amber-400 to-amber-600 font-bold text-black shadow-[0_0_18px_rgba(255,184,0,0.4)]"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Users className="h-4 w-4" />
              社区技能
            </button>
          </div>
        </div>
      )}

      {/* content */}
      <main className="relative mx-auto max-w-7xl px-6 pb-32 pt-12">
        {results ? (
          <section>
            <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-5">
              <MousePointerClick className="h-5 w-5 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">
                「{query}」搜到 {results.length} 个技能
              </h2>
            </div>
            {results.length === 0 ? (
              <div className="glass-pill rounded-xl p-12 text-center text-white/40">
                没搜到相关技能，换个关键词试试？
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {results.map((s, i) => (
                  <div key={s.id} className="relative">
                    <div className="absolute -top-2.5 left-4 z-10 rounded-full border border-amber-400/30 bg-black px-2.5 py-0.5 font-mono-tech text-[10px] tracking-widest text-amber-300">
                      {s.category}
                    </div>
                    <SkillCard skill={s} index={i} />
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : tab === "community" ? (
          <section>
            <div className="reveal mb-8 flex items-end justify-between border-b border-white/10 pb-5">
              <div>
                <div className="font-mono-tech text-xs tracking-[0.3em] text-amber-400/70 uppercase">COMMUNITY</div>
                <h2 className="mt-2 text-3xl font-black text-white">社区技能</h2>
                <p className="mt-2 text-sm text-white/50">用户们在 Skill 工坊里制作并发布的技能</p>
              </div>
              <Link
                to="/studio"
                className="hidden items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-300 transition-all hover:bg-amber-400/20 hover:shadow-[0_0_20px_rgba(255,184,0,0.3)] sm:flex"
              >
                <Hammer className="h-4 w-4" /> 去制作 Skill
              </Link>
            </div>
            <CommunityGrid />
          </section>
        ) : activeCat ? (
          <section key={activeCat.id}>
            <div className="reveal mb-8 border-b border-white/10 pb-5">
              <div className="font-mono-tech text-xs tracking-[0.3em] text-amber-400/70 uppercase">{activeCat.en}</div>
              <h2 className="mt-2 flex items-center gap-3 text-3xl font-black text-white">
                {activeCat.name}
                <span className="font-mono-tech text-sm font-normal text-white/30">{activeCat.skills.length} 个技能</span>
              </h2>
              <p className="mt-2 text-sm text-white/50">{activeCat.blurb}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {activeCat.skills.map((s, i) => (
                <SkillCard key={s.id} skill={s} index={i} />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      {/* footer */}
      <footer className="relative border-t border-white/10 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center">
          <div className="flex items-center gap-2 text-white/60">
            <BookOpen className="h-4 w-4 text-amber-400/70" />
            <span className="text-sm">提示：在对应的 AI 里直接说出你的需求，技能就会自动生效</span>
          </div>
          <div className="font-mono-tech text-[10px] tracking-[0.35em] text-white/25">
            SKILL UNIVERSE · {total} SKILLS INDEXED · {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}
