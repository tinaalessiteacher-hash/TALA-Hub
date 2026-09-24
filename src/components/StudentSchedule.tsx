import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { scheduleService } from "../services/scheduleService";
import type { ScheduleData } from "../services/scheduleService";
import { demoToolsEnabled } from "../services/authService";
import type { DemoScenario } from "../services/serviceTypes";
export function StudentSchedule({
  student,
  view,
  scenario,
  onRetry,
}: {
  student: string;
  view: string;
  scenario: DemoScenario;
  onRetry: () => void;
}) {
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
  if (error)
    return (
      <div className="state-panel" role="alert">
        <h2>Schedule unavailable</h2>
        <p>{error}</p>
        <button className="button" onClick={onRetry}>
          Retry with demo data
        </button>
      </div>
    );
  if (!data)
    return (
      <div className="state-panel" role="status">
        Loading your sample schedule…
      </div>
    );
  const catalog = view === "slots";
  const slots = data.slots.filter(
    (slot) =>
      (catalog || data.joined.includes(slot.id)) &&
      (!catalog || mode === "All" || slot.mode === mode),
  );
  return (
    <section className="dashboard-section">
      <div className="section-heading">
        <h2>
          {catalog
            ? "Choose your next class"
            : view === "calendar"
              ? "Your weekly calendar"
              : "Your scheduled classes"}
        </h2>
        {!catalog && (
          <Link className="text-link" to="/dashboard?view=slots">
            Find a class
          </Link>
        )}
      </div>
      <p className="small">
        Sample weekly timetable · Arizona time. Joining changes this browser tab
        only; no real seat is reserved.
      </p>
      {catalog && (
        <div className="form-field">
          <label htmlFor="class-mode">Class format</label>
          <select
            id="class-mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option>All</option>
            <option>In-Person</option>
            <option>Online</option>
          </select>
        </div>
      )}
      <p role="status">{message}</p>
      {joinError && (
        <p className="notice error" role="alert">
          {joinError}
        </p>
      )}
      {!slots.length ? (
        <div className="state-panel">
          <h3>
            {catalog ? "No classes to show" : "Your schedule has room to grow."}
          </h3>
          <p>
            {catalog
              ? "Try another format or return when demo classes are available."
              : "Choose an available class to add it to your calendar."}
          </p>
          {!catalog && (
            <Link className="button" to="/dashboard?view=slots">
              Browse available classes
            </Link>
          )}
        </div>
      ) : (
        <ul className="schedule-list">
          {slots.map((slot) => {
            const joined = data.joined.includes(slot.id);
            return (
              <li key={slot.id}>
                <div className="class-time">
                  <strong>{slot.day}</strong>
                  <span>
                    {slot.start}–{slot.end}
                  </span>
                </div>
                <div className="class-description">
                  <h3>{slot.title}</h3>
                  <p>
                    {slot.mode} ·{" "}
                    {joined ? "Added to your demo schedule" : slot.status}
                  </p>
                  {catalog && (
                    <p className="small">
                      {slot.seats - (joined ? 1 : 0)} sample places remaining
                    </p>
                  )}
                </div>
                {catalog && (
                  <button
                    className="button button-outline"
                    disabled={
                      !!joining || joined || slot.status !== "Available"
                    }
                    aria-label={
                      joined
                        ? `${slot.title} added`
                        : slot.status === "Available"
                          ? `Join ${slot.title}`
                          : `${slot.title}: ${slot.status}`
                    }
                    onClick={async () => {
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
                        setMessage(
                          `${slot.title} added to My classes and Personal calendar.`,
                        );
                      } catch (e) {
                        setJoinError(
                          e instanceof Error ? e.message : "Please retry.",
                        );
                      } finally {
                        setJoining("");
                      }
                    }}
                  >
                    {joining === slot.id
                      ? "Adding…"
                      : joined
                        ? "Added"
                        : slot.status === "Available"
                          ? "Join class"
                          : slot.status}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {catalog && (
        <>
          <p>
            <Link className="text-link" to="/dashboard?view=calendar">
              View personal calendar →
            </Link>
          </p>
          <p className="small">
            Full and waiting-list classes cannot be joined in this demo.
            AWAITING BACKEND — live capacity, waiting lists and calendar
            synchronization.
          </p>
          {demoToolsEnabled && (
            <details className="demo-tools">
              <summary>Class testing options</summary>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={simulateError}
                  onChange={(e) => setSimulateError(e.target.checked)}
                />
                Simulate class error
              </label>
            </details>
          )}
        </>
      )}
    </section>
  );
}
