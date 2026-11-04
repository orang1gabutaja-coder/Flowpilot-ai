import { createServer } from "node:http";
import { createPlan } from "./planner.js";

const PORT = Number(process.env.PORT) || 3000;
const MAX_BODY_BYTES = 32 * 1024;

function sendJson(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(data, null, 2));
}

async function readJson(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
      const error = new Error("Request body is too large.");
      error.statusCode = 413;
      throw error;
    }
  }
  try { return JSON.parse(body || "{}"); }
  catch {
    const error = new Error("Request body must contain valid JSON.");
    error.statusCode = 400;
    throw error;
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  if (request.method === "GET" && url.pathname === "/health") {
    return sendJson(response, 200, { ok: true, name: "Flowpilot AI", version: "0.1.0" });
  }
  if (request.method === "POST" && url.pathname === "/api/workflows") {
    try {
      const body = await readJson(request);
      if (typeof body.task !== "string" || !body.task.trim()) {
        return sendJson(response, 400, { error: "Please provide a non-empty 'task' string." });
      }
      return sendJson(response, 201, { workflow: createPlan(body.task) });
    } catch (error) {
      return sendJson(response, error.statusCode || 500, { error: error.message || "Unexpected server error." });
    }
  }
  return sendJson(response, 404, { error: "Route not found." });
});

server.listen(PORT, "0.0.0.0", () => console.log(`Flowpilot AI is running on port ${PORT}`));
