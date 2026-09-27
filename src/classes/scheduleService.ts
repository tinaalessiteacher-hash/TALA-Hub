import { demoClassSlots } from "./demoClassSlots";
import { demoEnabled } from "../shared/services/demoConfig";
import type { DemoScenario } from "../shared/services/serviceTypes";
export type ClassSlot = (typeof demoClassSlots)[number];
export interface ScheduleData {
  slots: readonly ClassSlot[];
  joined: string[];
}
export interface ScheduleService {
  load(
    student: string,
    scenario: DemoScenario,
    signal: AbortSignal,
  ): Promise<ScheduleData>;
  join(
    student: string,
    classId: string,
    simulateError?: boolean,
  ): Promise<string[]>;
}
const selections = new Map<string, string[]>();
function read(student: string): string[] {
  if (selections.has(student)) return [...selections.get(student)!];
  try {
    const data: unknown = JSON.parse(
      sessionStorage.getItem(`tala.demo.classes.${student}`) ?? "[]",
    );
    if (Array.isArray(data))
      return data.filter(
        (id): id is string =>
          typeof id === "string" &&
          demoClassSlots.some(
            (slot) => slot.id === id && slot.status === "Available",
          ),
      );
  } catch {
    /* In-memory demo remains usable. */
  }
  return [];
}
export const scheduleService: ScheduleService = {
  async load(student, scenario, signal) {
    if (!demoEnabled)
      throw new Error("AWAITING BACKEND — scheduling is not connected.");
    await new Promise((resolve) =>
      setTimeout(resolve, scenario === "loading" ? 4000 : 400),
    );
    if (signal.aborted) throw new DOMException("Cancelled", "AbortError");
    if (scenario === "error")
      throw new Error("The demo schedule could not load. Please retry.");
    return {
      slots: scenario === "empty" ? [] : demoClassSlots,
      joined: read(student),
    };
  },
  async join(student, classId, simulateError) {
    if (!demoEnabled)
      throw new Error("AWAITING BACKEND — scheduling is not connected.");
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (simulateError)
      throw new Error(
        "The class was not added. Turn off the test error and try again.",
      );
    const slot = demoClassSlots.find((item) => item.id === classId);
    if (!slot || slot.status !== "Available")
      throw new Error("This class is not available. Choose another class.");
    const joined = read(student);
    const next = joined.includes(classId) ? joined : [...joined, classId];
    selections.set(student, next);
    try {
      sessionStorage.setItem(
        `tala.demo.classes.${student}`,
        JSON.stringify(next),
      );
    } catch {
      /* Session-only fallback. */
    }
    return [...next];
  },
};
