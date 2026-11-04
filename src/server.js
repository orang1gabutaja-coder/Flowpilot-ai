import { createServer } from "node:http";
import { createPlan } from "./planner.js";
import { getWorkflow, saveWorkflow, updateStepStatus } from "./workflow-store.js";

const PORT = Number(process.env.PORT) || 3000;
const MAX_BODY_BYTES = 32 * 1024;

function sendJson(response, status, data) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(data, null, 2));
}

async function readJson(request) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error("Request body is too large.");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    const error = new Error("Request body must contain valid JSON.");
    error.statusCode = 400;
    throw error;
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  if (request.method === "GET" && url.pathname === "/health") {
    return sendJson(response, 200, { ok: true, name: "Flowpilot AI", version: "0.2.0" });
  }

  if (request.method === "POST" && url.pathname === "/api/workflows") {
    try {
      const body = await readJson(request);
      if (typeof body.task !== "string" || !body.task.trim()) {
        return sendJson(response, 400, { error: "Please provide a non-empty 'task' string." });
      }
      const workflow = saveWorkflow(createPlan(body.task));
      return sendJson(response, 201, { workflow });
    } catch (error) {
      return sendJson(response, error.statusCode || 500, { error: error.message || "Unexpected server error." });
    }
  }

  const workflowMatch = url.pathname.match(/^\/api\/workflows\/([^/]+)$/);
  if (request.method === "GET" && workflowMatch) {
    const workflow = getWorkflow(decodeURIComponent(workflowMatch[1]));
    return workflow
      ? sendJson(response, 200, { workflow })
      : sendJson(response, 404, { error: "Workflow not found." });
  }

  const stepMatch = url.pathname.match(/^\/api\/workflows\/([^/]+)\/steps\/([^/]+)$/);
  if (request.method === "PATCH" && stepMatch) {
    try {
      const body = await readJson(request);
      if (typeof body.status !== "string") {
        return sendJson(response, 400, { error: "Please provide a step 'status'." });
      }
      const workflow = updateStepStatus(
        decodeURIComponent(stepMatch[1]),
        decodeURIComponent(stepMatch[2]),
        body.status
      );
      if (!workflow) return sendJson(response, 404, { error: "Workflow or step not found." });
      return sendJson(response, 200, { workflow });
    } catch (error) {
      return sendJson(response, error instanceof TypeError ? 400 : (error.statusCode || 500), {
        error: error.message || "Unexpected server error."
      });
    }
  }

  return sendJson(response, 404, { error: "Route not found." });
});

server.listen(PORT, "0.0.0.0", () => console.log(`Flowpilot AI is running on port ${PORT}`));
