import { Link, useSearchParams } from "react-router-dom";
import { Icon } from "../shared/Icon";
import { demoToolsEnabled } from "../shared/services/demoConfig";
import type {
  DemoScenario,
  DemoSession,
} from "../shared/services/serviceTypes";
import { dashboardViews as views } from "./dashboardViews";
import { DashboardNavigation } from "./DashboardNavigation";
import { DashboardContent } from "./DashboardContent";
import { CommunityWorkspace } from "./CommunityWorkspace";
import { StudentAccountPanel } from "./StudentAccountPanel";
import { StudentSchedule } from "../classes/StudentSchedule";
export function StudentDashboard({
  session,
  onLogout,
}: {
  session: DemoSession;
  onLogout: () => void;
}) {
  const [params, setParams] = useSearchParams();
  const selectedView = params.get("view") ?? "overview";
  const view = views.some((item) => item.id === selectedView)
    ? selectedView
    : "overview";
  const requestedScenario = demoToolsEnabled
    ? (params.get("scenario") ?? "success")
    : "success";
  const scenario: DemoScenario = [
    "success",
    "empty",
    "error",
    "loading",
  ].includes(requestedScenario)
    ? (requestedScenario as DemoScenario)
    : "success";
  if (session.role && session.role !== "Student" && !session.representing)
    return <CommunityWorkspace session={session} onLogout={onLogout} />;
  const learner = session.representing
    ? {
        ...session,
        name: session.representing,
        email: session.studentEmail ?? session.email,
      }
    : session;
  return (
    <div className="dashboard container">
      <DashboardNavigation
        view={view}
        scenario={scenario}
        session={session}
        onLogout={onLogout}
      />
      <div className="dashboard-main">
        <div className="dashboard-heading">
          <div>
            <h1 tabIndex={-1}>
              {view === "overview"
                ? `Hello, ${learner.name.split(" ")[0] || "learner"}.`
                : views.find((v) => v.id === view)?.label}
            </h1>
            <p>
              {view === "overview"
                ? "Your sample learning at a glance."
                : "Explore this preview of your student hub."}
            </p>
          </div>
          <span className="demo-pill">Demo preview</span>
        </div>
        {session.representing && (
          <div className="notice">
            <strong>
              Parent demo: {session.name}, representing {session.representing}
            </strong>
            <p>
              These are sample student records. Real delegated access is
              AWAITING BACKEND.{" "}
              <Link
                to="/login"
                state={{
                  role: "Parent",
                  family: {
                    parentName: session.name,
                    parentEmail: session.email,
                    studentName: session.studentName,
                    studentEmail: session.studentEmail,
                  },
                }}
              >
                Switch identity
              </Link>
            </p>
          </div>
        )}
        <div className="integration-notice">
          <Icon name="book" />
          <div>
            <strong>
              Sample learning data · SkipCourse not connected · AWAITING BACKEND
            </strong>
          </div>
        </div>
        {demoToolsEnabled && (
          <details className="demo-tools dashboard-tools">
            <summary>Demo preview settings</summary>
            <div className="scenario-control">
              <label htmlFor="scenario">Preview data state</label>
              <select
                id="scenario"
                value={scenario}
                onChange={(e) => setParams({ view, scenario: e.target.value })}
              >
                <option value="success">Demo data</option>
                <option value="loading">Slow loading (4 seconds)</option>
                <option value="empty">No learning data</option>
                <option value="error">Connection error</option>
              </select>
            </div>
          </details>
        )}
        {["calendar", "classes", "slots"].includes(view) ? (
          <StudentSchedule
            key={`${scenario}-${session.email}-${session.representing ?? "self"}`}
            student={
              session.representing
                ? (session.studentEmail ?? session.email)
                : session.email
            }
            view={view}
            scenario={scenario}
            onRetry={() => setParams({ view, scenario: "success" })}
          />
        ) : ["attendance", "skipcourse", "messages"].includes(view) ? (
          <StudentAccountPanel view={view} />
        ) : (
          <DashboardContent
            key={`${scenario}-${session.email}`}
            scenario={scenario}
            onRetry={() => {
              setParams({ view, scenario: "success" });
              document
                .querySelector<HTMLHeadingElement>(".dashboard-heading h1")
                ?.focus();
            }}
            view={view}
            session={learner}
          />
        )}
      </div>
    </div>
  );
}
