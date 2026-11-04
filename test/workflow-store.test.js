import test from "node:test";
import assert from "node:assert/strict";
import { createPlan } from "../src/planner.js";
import { clearWorkflows, getWorkflow, saveWorkflow, updateStepStatus } from "../src/workflow-store.js";

test.beforeEach(() => clearWorkflows());

test("stores and retrieves an independent workflow snapshot", () => {
  const saved = saveWorkflow(createPlan("Build a small website"));
  const fetched = getWorkflow(saved.id);
  assert.equal(fetched.id, saved.id);
  assert.equal(fetched.status, "planned");
  assert.notEqual(fetched, saved);
});

test("updates step status and derives workflow status", () => {
  const saved = saveWorkflow(createPlan("Write a short article"));
  const first = saved.steps[0];

  const running = updateStepStatus(saved.id, first.id, "running");
  assert.equal(running.status, "running");
  assert.equal(running.steps[0].status, "running");

  for (const step of running.steps) {
    updateStepStatus(saved.id, step.id, "completed");
  }
  assert.equal(getWorkflow(saved.id).status, "completed");
});

test("marks workflow failed when a step fails", () => {
  const saved = saveWorkflow(createPlan("Research a topic"));
  const result = updateStepStatus(saved.id, saved.steps[0].id, "failed");
  assert.equal(result.status, "failed");
});

test("rejects unsupported step statuses", () => {
  const saved = saveWorkflow(createPlan("Do a task"));
  assert.throws(() => updateStepStatus(saved.id, saved.steps[0].id, "finished"), /Status must be/);
});

test("returns null for unknown workflows or steps", () => {
  assert.equal(getWorkflow("missing"), null);
  assert.equal(updateStepStatus("missing", "missing", "pending"), null);

  const saved = saveWorkflow(createPlan("Do another task"));
  assert.equal(updateStepStatus(saved.id, "missing", "pending"), null);
});
