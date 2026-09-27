import { useEffect, useState } from "react";
import { scheduleService } from "./scheduleService";
import type { ScheduleData } from "./scheduleService";
import type { DemoScenario } from "../shared/services/serviceTypes";
export function useStudentSchedule(student: string, scenario: DemoScenario) {
  const [data, setData] = useState<ScheduleData | null>(null);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState("");
  const [message, setMessage] = useState("");
  const [joinError, setJoinError] = useState("");
  const [simulateError, setSimulateError] = useState(false);
  const [mode, setMode] = useState("All");
  useEffect(() => {
    const controller = new AbortController();
    scheduleService
      .load(student, scenario, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setData(result);
      })
      .catch((e: unknown) => {
        if (!controller.signal.aborted)
          setError(e instanceof Error ? e.message : "Please retry.");
      });
    return () => controller.abort();
  }, [student, scenario]);
  async function joinClass(slot: ScheduleData["slots"][number]) {
    if (!data) return;
    setJoining(slot.id);
    setMessage("");
    setJoinError("");
    try {
      const joinedIds = await scheduleService.join(
        student,
        slot.id,
        simulateError,
      );
      setData({ ...data, joined: joinedIds });
      setMessage(`${slot.title} added to My classes and Personal calendar.`);
    } catch (e) {
      setJoinError(e instanceof Error ? e.message : "Please retry.");
    } finally {
      setJoining("");
    }
  }
  return {
    data,
    error,
    joining,
    message,
    joinError,
    simulateError,
    setSimulateError,
    mode,
    setMode,
    joinClass,
  };
}
