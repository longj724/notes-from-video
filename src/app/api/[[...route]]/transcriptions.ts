// External Dependencies
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

// Relative Dependencies

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "Hello, world!" });
});

export default app;
