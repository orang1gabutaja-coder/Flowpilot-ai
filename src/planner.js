import { randomUUID } from "node:crypto";

/**
 * Predictable starter planner. It does not call an external AI provider.
 */
const patterns = [
  { test: /website|web app|portfolio|dashboard/i, steps: ["Clarify the goal and target users", "Plan the pages and user flows", "Choose the technology and project structure", "Build the core interface", "Implement the main features", "Test the result and fix issues"] },
  { test: /research|analisis|analysis|riset/i, steps: ["Define the research question and scope", "Identify reliable information sources", "Collect relevant evidence", "Compare findings and check for gaps", "Summarize conclusions and limitations"] },
  { test: /write|article|essay|document|tulis|artikel/i, steps: ["Clarify the audience and purpose", "Create an outline", "Draft the main content", "Review accuracy, structure, and clarity", "Prepare the final version"] }
];

export function createPlan(task) {
  if (typeof task !== "string" || task.trim().length === 0) {
    throw new TypeError("Task must be a non-empty string.");
  }

  const cleanTask = task.trim();
  const match = patterns.find((item) => item.test.test(cleanTask));
  const titles = match?.steps ?? ["Understand the goal and expected result", "Break the work into smaller tasks", "Complete the tasks in a sensible order", "Review the result against the original goal"];

  return {
    id: `wf_${randomUUID()}`,
    task: cleanTask,
    status: "planned",
    steps: titles.map((title) => ({ id: `step_${randomUUID()}`, title, status: "pending" })),
    createdAt: new Date().toISOString()
  };
}
