// External Dependencies
import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

// Internal Dependencies
import transcriptions from "./transcriptions";
import folders from "./folders";
import notes from "./notes";
import auth from "./auth";
import { auth as authClient } from "@/lib/auth";

export const runtime = "nodejs";

const app = new Hono<{
  Variables: {
    user: typeof authClient.$Infer.Session.user | null;
    session: typeof authClient.$Infer.Session.session | null;
  };
}>().basePath("/api");

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: [
      "Accept",
      "Authorization",
      "Content-Type",
      "Origin",
      "X-Requested-With",
    ],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  }),
);

app.use("*", async (c, next) => {
  const session = await authClient.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

const routes = app
  .route("/transcriptions", transcriptions)
  .route("/folders", folders)
  .route("/notes", notes)
  .route("/auth", auth);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
