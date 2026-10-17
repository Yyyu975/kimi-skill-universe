import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import * as cookie from "cookie";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, publicQuery } from "./middleware";
import { signSessionToken } from "./kimi/session";
import { findUserByEmail, upsertUser } from "./queries/users";
import { env } from "./lib/env";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

async function issueSession(
  resHeaders: Headers,
  reqHeaders: Headers,
  unionId: string
) {
  const token = await signSessionToken({ unionId, clientId: env.appId });
  const opts = getSessionCookieOptions(reqHeaders);
  resHeaders.append(
    "set-cookie",
    cookie.serialize(Session.cookieName, token, {
      httpOnly: opts.httpOnly,
      path: opts.path,
      sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
      secure: opts.secure,
      maxAge: Session.maxAgeMs / 1000,
    })
  );
}

const emailSchema = z.string().email("邮箱格式不正确").max(320);
const passwordSchema = z.string().min(6, "密码至少 6 位").max(72);

export const localAuthRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        name: z.string().min(1, "请填写用户名").max(50),
        email: emailSchema,
        password: passwordSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email.toLowerCase();
      const existing = await findUserByEmail(email);
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "该邮箱已注册，请直接登录" });
      }
      const unionId = `local:${email}`;
      await upsertUser({
        unionId,
        name: input.name,
        email,
        passwordHash: hashPassword(input.password),
        lastSignInAt: new Date(),
      });
      await issueSession(ctx.resHeaders, ctx.req.headers, unionId);
      return { ok: true };
    }),

  login: publicQuery
    .input(z.object({ email: emailSchema, password: z.string().min(1, "请输入密码") }))
    .mutation(async ({ ctx, input }) => {
      const email = input.email.toLowerCase();
      const user = await findUserByEmail(email);
      if (!user || !user.passwordHash || !verifyPassword(input.password, user.passwordHash)) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "邮箱或密码不正确" });
      }
      await upsertUser({
        unionId: user.unionId,
        lastSignInAt: new Date(),
      });
      await issueSession(ctx.resHeaders, ctx.req.headers, user.unionId);
      return { ok: true };
    }),
});
