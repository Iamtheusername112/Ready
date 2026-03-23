import { z } from "zod";

/** Snapshot of dashboard assumption sliders + optional note */
export const scenarioPayloadSchema = z.object({
  annualReturn: z.number().min(0).max(25),
  inflation: z.number().min(0).max(15),
  ssMonthly: z.number().min(0).max(50000),
});

export type ScenarioPayload = z.infer<typeof scenarioPayloadSchema>;

export type SavedScenarioRow = {
  id: string;
  name: string;
  payload: ScenarioPayload;
  created_at: string;
};
