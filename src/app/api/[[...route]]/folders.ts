// External Dependencies
import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

// Internal Dependencies
import { db } from "@/server/db";
import { folders } from "@/server/db/schema";

const folderApp = new Hono();

const createFolderSchema = z.object({
  name: z.string().min(1),
});

const updateFolderSchema = z.object({
  name: z.string().min(1),
});

folderApp.get("/", async (c) => {
  const allFolders = await db.query.folders.findMany({
    orderBy: (folders, { desc }) => [desc(folders.createdAt)],
  });
  return c.json(allFolders);
});

folderApp.post("/", zValidator("json", createFolderSchema), async (c) => {
  const data = c.req.valid("json");
  const newFolder = await db.insert(folders).values(data).returning();
  return c.json(newFolder[0]);
});

folderApp.put("/:id", zValidator("json", updateFolderSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");

  const updatedFolder = await db
    .update(folders)
    .set(data)
    .where(eq(folders.id, id))
    .returning();

  if (!updatedFolder.length) {
    return c.json({ error: "Folder not found" }, 404);
  }

  return c.json(updatedFolder[0]);
});

folderApp.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const deletedFolder = await db
    .delete(folders)
    .where(eq(folders.id, id))
    .returning();

  if (!deletedFolder.length) {
    return c.json({ error: "Folder not found" }, 404);
  }

  return c.json(deletedFolder[0]);
});

export default folderApp;
