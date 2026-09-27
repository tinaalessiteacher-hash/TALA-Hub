import { useEffect, useState } from "react";
import { skipCourseApi } from "./skipCourseApi";
import type { DemoScenario } from "../shared/services/serviceTypes";
import type { StudentOverview } from "./learningTypes";
type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: StudentOverview };
export function useStudentOverview(scenario: DemoScenario) {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  useEffect(() => {
    const controller = new AbortController();
    skipCourseApi
      .getOverview(scenario, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ status: "ready", data });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setState({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "Learning data is unavailable. Please try again.",
          });
      });
    return () => controller.abort();
  }, [scenario]);
  return state;
}
