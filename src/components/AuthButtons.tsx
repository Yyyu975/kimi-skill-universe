import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, LogOut, Hammer } from "lucide-react";

export function AuthButtons() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div className="h-8 w-24 animate-pulse rounded-full bg-white/10" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-[13px] font-medium text-amber-300 transition-all hover:bg-amber-400/20 hover:shadow-[0_0_16px_rgba(255,184,0,0.3)]"
        >
          <LogIn className="h-3.5 w-3.5" /> 登录 / 注册
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/studio"
        className="hidden items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-[13px] font-medium text-amber-300 transition-all hover:bg-amber-400/20 hover:shadow-[0_0_16px_rgba(255,184,0,0.3)] sm:flex"
      >
        <Hammer className="h-3.5 w-3.5" /> Skill 工坊
      </Link>
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3">
        {user?.avatar ? (
          <img src={user.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400/20 text-[11px] font-bold text-amber-300">
            {(user?.name ?? "U").slice(0, 1)}
          </span>
        )}
        <span className="max-w-[80px] truncate text-xs text-white/80">{user?.name ?? "用户"}</span>
        <button
          onClick={logout}
          title="退出登录"
          className="text-white/40 transition-colors hover:text-amber-300"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
