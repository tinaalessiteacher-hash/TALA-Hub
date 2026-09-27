import { demoDelay } from "../shared/services/demoDelay";
import { demoStudent, emptyStudent } from "./demoLearningData";
import type { StudentAdapter } from "./learningTypes";
export const demoStudentAdapter: StudentAdapter = {
  async getOverview(scenario, signal) {
    await demoDelay(scenario === "loading" ? 4000 : 650, signal);
    if (scenario === "error")
      throw new Error(
        "We could not load your learning overview. Please try again.",
      );
    return structuredClone(scenario === "empty" ? emptyStudent : demoStudent);
  },
};
