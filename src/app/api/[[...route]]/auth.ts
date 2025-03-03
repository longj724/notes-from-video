// External Dependencies
import { Hono } from "hono";

// Internal Dependencies
import { auth } from "@/lib/auth";

const app = new Hono()
  .get("/*", async (c) => {
    return c.redirect("/notes");
  })
  .post("/*", async (c) => {
    return auth.handler(c.req.raw);
  });

export default app;
