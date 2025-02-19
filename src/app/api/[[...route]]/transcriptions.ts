// External Dependencies
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { YoutubeTranscript } from "youtube-transcript";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Relative Dependencies

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY ?? "");

const youtubeUrlSchema = z.object({
  url: z.string().url(),
});

const summaryRequestSchema = z.object({
  transcript: z.array(
    z.object({
      text: z.string(),
      duration: z.number(),
      offset: z.number(),
    }),
  ),
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
  })
  .post("/summary", zValidator("json", summaryRequestSchema), async (c) => {
    try {
      const { transcript } = c.req.valid("json");

      const fullText = transcript.map((segment) => segment.text).join(" ");

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Please provide a comprehensive summary of the following video transcript. Focus on the main points, key ideas, and important details. Make it clear and concise: ${fullText}`;

      const result = await model.generateContent(prompt);
      console.log("result", result);
      const response = result.response;
      const summary = response.text();

      return c.json({ summary });
    } catch (error) {
      console.error("Error generating summary:", error);
      return c.json({ error: "Failed to generate summary" }, 500);
    }
  });

export default app;
