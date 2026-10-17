import { useState } from "react";
import { Zap, ArrowLeft, Mail, Lock, User, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

type Mode = "kimi" | "login" | "register";

export default function Login() {
  const [mode, setMode] = useState<Mode>("kimi");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const onSuccess = async () => {
    await utils.invalidate();
    navigate("/studio");
  };

  const loginMut = trpc.localAuth.login.useMutation({
    onSuccess,
    onError: (e) => setError(e.message),
  });
  const registerMut = trpc.localAuth.register.useMutation({
    onSuccess,
    onError: (e) => setError(e.message),
  });
  const pending = loginMut.isPending || registerMut.isPending;

  const submit = () => {
    setError(null);
    if (mode === "login") loginMut.mutate({ email, password });
    else registerMut.mutate({ name, email, password });
  };

  const tabs: { key: Mode; label: string }[] = [
    { key: "kimi", label: "Kimi 一键登录" },
    { key: "login", label: "邮箱登录" },
    { key: "register", label: "注册新账号" },
  ];

  const inputCls =
    "w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 pl-10 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-amber-400/50";

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[rgb(var(--bg))] px-6 py-24">
      <div className="pointer-events-none fixed inset-0 grid-bg" />
      <div className="pointer-events-none fixed left-1/2 top-[-300px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[140px]" />

      <Link
        to="/"
        className="glass-pill fixed left-1/2 top-4 z-50 flex w-[min(96vw,1100px)] -translate-x-1/2 items-center gap-2.5 rounded-full px-5 py-3"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_18px_rgba(255,184,0,0.5)]">
          <Zap className="h-4 w-4 text-black" />
        </span>
        <span className="text-sm font-bold tracking-wide text-white">
          SKILL <span className="text-amber-400">宇宙</span>
        </span>
      </Link>

      <div className="glow-card corner-dots relative w-full max-w-sm p-8">
        <span className="dot" /><span className="dot" /><span className="dot" /><span className="dot" />
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_30px_rgba(255,184,0,0.5)]">
            <Zap className="h-7 w-7 text-black" />
          </span>
          <h1 className="mt-5 text-2xl font-black text-white">
            {mode === "register" ? "创建账号" : "欢迎回来"}
          </h1>
          <p className="font-mono-tech mt-2 text-[11px] tracking-[0.25em] text-amber-400/60 uppercase">
            AUTHENTICATION
          </p>
        </div>

        {/* tabs */}
        <div className="mt-6 flex gap-1 rounded-full border border-white/10 bg-black/40 p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setMode(t.key); setError(null); }}
              className={`flex-1 rounded-full px-2 py-1.5 text-xs transition-colors ${
                mode === t.key ? "bg-amber-400/15 text-amber-300" : "text-white/40 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {mode === "kimi" ? (
            <>
              <p className="text-sm leading-relaxed text-white/50">
                使用 Kimi 账号一键登录，即可在 Skill 工坊制作、发布你自己的技能。
              </p>
              <button
                onClick={() => { window.location.href = getOAuthUrl(); }}
                className="mt-6 w-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 py-3 text-sm font-bold text-black shadow-[0_0_24px_rgba(255,184,0,0.35)] transition-all hover:scale-[1.03] active:scale-95"
              >
                使用 Kimi 账号登录
              </button>
            </>
          ) : (
            <div className="space-y-4">
              {mode === "register" && (
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="用户名" className={inputCls} />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="邮箱" className={inputCls}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "register" ? "密码（至少 6 位）" : "密码"}
                  className={inputCls}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-xs text-red-300">
                  {error}
                </div>
              )}

              <button
                onClick={submit}
                disabled={pending || !email || !password || (mode === "register" && !name)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 py-3 text-sm font-bold text-black shadow-[0_0_24px_rgba(255,184,0,0.35)] transition-all hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              >
                {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "register" ? "注册并登录" : "登录"}
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-amber-300"
          >
            <ArrowLeft className="h-3 w-3" /> 先随便逛逛
          </Link>
        </div>
      </div>
    </div>
  );
}
