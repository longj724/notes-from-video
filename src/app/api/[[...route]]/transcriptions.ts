// External Dependencies
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { YoutubeTranscript } from "youtube-transcript";

// Relative Dependencies

const youtubeUrlSchema = z.object({
  url: z.string().url(),
});

const app = new Hono()
  .get("/", (c) => {
    return c.json({ message: "Hello, world!" });
  })
  .post("/", zValidator("json", youtubeUrlSchema), async (c) => {
    try {
      const { url } = c.req.valid("json");

      const videoId = url.split("v=")[1]?.split("&")[0];
      if (!videoId) {
        return c.json({ error: "Invalid YouTube URL" }, 400);
      }

      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      return c.json({ transcript, videoId });
    } catch (error) {
      return c.json({ error: "Failed to fetch transcript" }, 500);
    }
  });

export default app;
