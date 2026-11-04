import test from "node:test";
import assert from "node:assert/strict";
import { createPlan } from "../src/planner.js";

test("creates a general workflow for a non-empty task", () => {
  const plan = createPlan("Organize my study schedule");
  assert.equal(plan.task, "Organize my study schedule");
  assert.equal(plan.status, "planned");
  assert.ok(plan.steps.length >= 3);
  assert.equal(plan.steps[0].status, "pending");
});

test("uses a website-specific workflow", () => {
  const plan = createPlan("Build a portfolio website");
  assert.ok(plan.steps.some((step) => /interface/i.test(step.title)));
});

test("rejects an empty task", () => {
  assert.throws(() => createPlan("   "), /non-empty string/);
});
