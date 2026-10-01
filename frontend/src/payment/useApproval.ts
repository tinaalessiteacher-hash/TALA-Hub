import { useEffect, useState } from "react";
import type { DemoSession } from "../shared/services/serviceTypes";
import { paymentService } from "./paymentService";
import type { ApprovalStatus } from "./paymentService";
type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; approval: ApprovalStatus };
export function useApproval(session: DemoSession) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [request, setRequest] = useState({ version: 0, simulateError: false });
  useEffect(() => {
    const controller = new AbortController();
    paymentService
      .getApproval(session, controller.signal, request.simulateError)
      .then((approval) => {
        if (!controller.signal.aborted) setState({ status: "ready", approval });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setState({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "Could not load status. Try again.",
          });
      });
    return () => controller.abort();
  }, [session, request]);
  function reload(simulateError = false) {
    setState({ status: "loading" });
    setRequest((current) => ({ version: current.version + 1, simulateError }));
  }
  return { state, reload };
}
