// External Dependencies
import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

// Internal Dependencies
import { db } from "@/server/db";
import { notes } from "@/server/db/schema";

const createNoteSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  videoUrl: z.string(),
  folderId: z.string().optional(),
});

const updateNoteSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  videoUrl: z.string().url().optional(),
  folderId: z.string().optional().nullable(),
});

const app = new Hono()
  .get("/", async (c) => {
    const allNotes = await db.query.notes.findMany({
      orderBy: (notes, { desc }) => [desc(notes.createdAt)],
      with: {
        folder: true,
      },
    });
    return c.json(allNotes);
  })
  .get("/folder/:folderId", async (c) => {
    const folderId = c.req.param("folderId");
    const folderNotes = await db.query.notes.findMany({
      where: eq(notes.folderId, folderId),
      orderBy: (notes, { desc }) => [desc(notes.createdAt)],
      with: {
        folder: true,
      },
    });
    return c.json(folderNotes);
  })
  .post("/", zValidator("json", createNoteSchema), async (c) => {
    const data = c.req.valid("json");
    const newNote = await db.insert(notes).values(data).returning();
    return c.json(newNote[0]);
  })
  .put("/:id", zValidator("json", updateNoteSchema), async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");

    const updatedNote = await db
      .update(notes)
      .set(data)
      .where(eq(notes.id, id))
      .returning();

    if (!updatedNote.length) {
      return c.json({ error: "Note not found" }, 404);
    }

    return c.json(updatedNote[0]);
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");

    const deletedNote = await db
      .delete(notes)
      .where(eq(notes.id, id))
      .returning();

    if (!deletedNote.length) {
      return c.json({ error: "Note not found" }, 404);
    }

    return c.json(deletedNote[0]);
  });

export default app;
