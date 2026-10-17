import { desc, eq, and } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertCustomSkill } from "@db/schema";
import { getDb } from "./connection";

export async function listPublishedSkills() {
  return getDb()
    .select({
      id: schema.customSkills.id,
      name: schema.customSkills.name,
      category: schema.customSkills.category,
      desc: schema.customSkills.desc,
      tags: schema.customSkills.tags,
      usage: schema.customSkills.usage,
      status: schema.customSkills.status,
      createdAt: schema.customSkills.createdAt,
      authorName: schema.users.name,
      authorAvatar: schema.users.avatar,
    })
    .from(schema.customSkills)
    .leftJoin(schema.users, eq(schema.customSkills.userId, schema.users.id))
    .where(eq(schema.customSkills.status, "published"))
    .orderBy(desc(schema.customSkills.createdAt));
}

export async function listMySkills(userId: number) {
  return getDb()
    .select()
    .from(schema.customSkills)
    .where(eq(schema.customSkills.userId, userId))
    .orderBy(desc(schema.customSkills.updatedAt));
}

export async function createSkill(data: InsertCustomSkill) {
  const result = await getDb().insert(schema.customSkills).values(data);
  return { id: Number(result[0].insertId) };
}

export async function updateSkill(
  id: number,
  userId: number,
  data: Partial<InsertCustomSkill>
) {
  await getDb()
    .update(schema.customSkills)
    .set(data)
    .where(
      and(eq(schema.customSkills.id, id), eq(schema.customSkills.userId, userId))
    );
  return { ok: true };
}

export async function deleteSkill(id: number, userId: number) {
  await getDb()
    .delete(schema.customSkills)
    .where(
      and(eq(schema.customSkills.id, id), eq(schema.customSkills.userId, userId))
    );
  return { ok: true };
}
