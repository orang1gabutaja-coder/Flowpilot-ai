import { randomUUID } from "node:crypto";

const workflows = new Map();
const STEP_STATUSES = new Set(["pending", "running", "completed", "failed"]);

function summarizeStatus(steps) {
  if (steps.some((step) => step.status === "failed")) return "failed";
  if (steps.length > 0 && steps.every((step) => step.status === "completed")) return "completed";
  if (steps.some((step) => step.status === "running" || step.status === "completed")) return "running";
  return "planned";
}

export function saveWorkflow(workflow) {
  const stored = structuredClone(workflow);
  workflows.set(stored.id, stored);
  return structuredClone(stored);
}

export function getWorkflow(id) {
  const workflow = workflows.get(id);
  return workflow ? structuredClone(workflow) : null;
}

export function updateStepStatus(workflowId, stepId, status) {
  if (!STEP_STATUSES.has(status)) {
    throw new TypeError("Status must be pending, running, completed, or failed.");
  }

  const workflow = workflows.get(workflowId);
  if (!workflow) return null;

  const step = workflow.steps.find((item) => item.id === stepId);
  if (!step) return null;

  step.status = status;
  workflow.status = summarizeStatus(workflow.steps);
  workflow.updatedAt = new Date().toISOString();
  return structuredClone(workflow);
}

export function clearWorkflows() {
  workflows.clear();
}
