// External Dependencies
import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

// Internal Dependencies
import transcriptions from "./transcriptions";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

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

const routes = app.route("/transcriptions", transcriptions);

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
