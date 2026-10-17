import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import {
  listPublishedSkills,
  listMySkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "./queries/skills";

const skillInput = z.object({
  name: z.string().min(1, "请填写技能名称").max(100),
  category: z.string().min(1, "请选择分类").max(50),
  desc: z.string().min(1, "请填写一句话介绍").max(500),
  tags: z.string().max(255).default(""),
  usage: z.string().max(5000).default(""),
  prompt: z.string().max(50000).default(""),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const skillsRouter = createRouter({
  // 公开：已发布的社区技能
  listPublished: publicQuery.query(() => listPublishedSkills()),

  // 需要登录：我的技能列表
  listMine: authedQuery.query(({ ctx }) => listMySkills(ctx.user.id)),

  create: authedQuery.input(skillInput).mutation(({ ctx, input }) =>
    createSkill({ ...input, userId: ctx.user.id })
  ),

  update: authedQuery
    .input(z.object({ id: z.number().int().positive(), data: skillInput }))
    .mutation(({ ctx, input }) => updateSkill(input.id, ctx.user.id, input.data)),

  remove: authedQuery
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ ctx, input }) => deleteSkill(input.id, ctx.user.id)),
});
