import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import type { IconName } from "../components/Icon";
import { StudentSchedule } from "../components/StudentSchedule";
import { CourseCard } from "../components/CourseCard";
import { demoToolsEnabled } from "../services/authService";
import { skipCourseApi } from "../services/skipCourseApi";
import type {
  DemoScenario,
  DemoSession,
  StudentOverview,
} from "../services/serviceTypes";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: StudentOverview };
const views: { id: string; label: string; icon: IconName }[] = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "calendar", label: "Personal calendar", icon: "grid" },
  { id: "classes", label: "My classes", icon: "book" },
  { id: "slots", label: "Available class slots", icon: "book" },
  { id: "attendance", label: "Attendance hours", icon: "grid" },
  { id: "skipcourse", label: "SkipCourse account", icon: "user" },
  { id: "messages", label: "Messages", icon: "voice" },
  { id: "learning", label: "My learning", icon: "book" },
  { id: "projects", label: "My projects", icon: "folder" },
  { id: "profile", label: "My profile", icon: "user" },
];
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
      <aside className="dashboard-sidebar">
        <div className="hub-label">
          <Icon name="leaf" />
          <span>Student hub</span>
        </div>
        <details className="dashboard-view-picker" key={view}>
          <summary>
            Student hub: {views.find((item) => item.id === view)?.label}
          </summary>
          <nav aria-label="Student hub sections">
            {views.map((item) => (
              <Link
                key={item.id}
                to={`/dashboard?${new URLSearchParams({ view: item.id, scenario })}`}
                aria-current={view === item.id ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
        <nav aria-label="Dashboard">
          {views.map((item) => (
            <Link
              key={item.id}
              to={`/dashboard?${new URLSearchParams({ view: item.id, scenario })}`}
              aria-current={view === item.id ? "page" : undefined}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <span className="avatar">
            {session.name.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <strong>{session.name}</strong>
            <small>Demo learner</small>
          </div>
          <button
            className="signout-button"
            aria-label="Sign out"
            onClick={onLogout}
          >
            <Icon name="logout" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
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
function DashboardContent({
  scenario,
  onRetry,
  view,
  session,
}: {
  scenario: DemoScenario;
  onRetry: () => void;
  view: string;
  session: DemoSession;
}) {
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
  if (state.status === "loading")
    return (
      <div className="state-panel" role="status">
        <span className="loading-dot" />
        <h2>Gathering your learning…</h2>
        <p>Loading sample courses, projects, and progress.</p>
      </div>
    );
  if (state.status === "error")
    return (
      <div className="state-panel" role="alert">
        <Icon name="voice" />
        <h2>Let’s try that again.</h2>
        <p>{state.message}</p>
        <button className="button" onClick={onRetry}>
          Retry with demo data
        </button>
      </div>
    );
  const { data } = state;
  const completed = data.courses.reduce((sum, c) => sum + c.completed, 0);
  const total = data.courses.reduce((sum, c) => sum + c.lessons.length, 0);
  if (view === "profile")
    return (
      <section className="profile-panel">
        <div className="profile-heading">
          <span className="avatar avatar-large">
            {session.name.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <h2>{session.name}</h2>
            <p>Frontend demo profile</p>
          </div>
        </div>
        <dl>
          <div>
            <dt>Email</dt>
            <dd>{session.email}</dd>
          </div>
          <div>
            <dt>Learning focus</dt>
            <dd>{data.focus}</dd>
          </div>
          <div>
            <dt>Account connection</dt>
            <dd>Not linked to SkipCourse</dd>
          </div>
        </dl>
        <p className="small">
          Profile editing and verified account details will be available after
          the backend is connected. No personal information is sent from this
          demo.
        </p>
      </section>
    );
  if (!data.courses.length && !data.projects.length)
    return (
      <div className="state-panel">
        <Icon name="leaf" />
        <h2>A little room for what’s next.</h2>
        <p>
          No courses or projects to show yet. In a connected account, your
          assigned learning will appear here.
        </p>
        <Link className="button" to="/programs">
          Explore TALA programs
        </Link>
      </div>
    );
  return (
    <>
      {view === "overview" && (
        <>
          <div className="notice">
            <strong>Your next step</strong>
            <p>
              <Link to="/dashboard?view=slots">Choose an available class</Link>,
              then find it in your{" "}
              <Link to="/dashboard?view=calendar">personal calendar</Link>.
            </p>
          </div>
          <div className="stats-row">
            <div>
              <span className="stat-number">{data.courses.length}</span>
              <span>Learning paths</span>
            </div>
            <div>
              <span className="stat-number">
                {completed}
                <small> / {total}</small>
              </span>
              <span>Lessons completed</span>
            </div>
            <div>
              <span className="stat-number">{data.projects.length}</span>
              <span>Projects</span>
            </div>
          </div>
        </>
      )}
      {(view === "overview" || view === "learning") && (
        <section className="dashboard-section">
          <div className="section-heading">
            <h2>
              {view === "overview" ? "Your learning" : "Your learning paths"}
            </h2>
            {view === "overview" && (
              <Link
                className="text-link"
                to={`/dashboard?view=learning&scenario=${scenario}`}
              >
                View all learning <Icon name="arrow" />
              </Link>
            )}
          </div>
          <div className="course-grid">
            {(view === "overview"
              ? data.courses.slice(0, 2)
              : data.courses
            ).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}
      {(view === "overview" || view === "projects") && (
        <section className="dashboard-section">
          <div className="section-heading">
            <h2>Your projects</h2>
          </div>
          <div className="project-list">
            {data.projects.map((project) => (
              <article key={project.id}>
                <div className="project-icon">
                  <Icon name="folder" />
                </div>
                <div>
                  <p className="category">{project.category}</p>
                  <h3>{project.title}</h3>
                  <details>
                    <summary>View sample project</summary>
                    <p>{project.description}</p>
                    <p className="small">
                      This example has no uploaded files. Real portfolio content
                      awaits SkipCourse integration.
                    </p>
                  </details>
                </div>
                <span className="project-status">{project.status}</span>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function StudentAccountPanel({ view }: { view: string }) {
  return (
    <section className="profile-panel">
      {view === "attendance" ? (
        <>
          <h2>Attendance hours</h2>
          <p className="stat-number">
            0 <small>verified hours</small>
          </p>
          <p>
            No verified attendance is available in this demo. Adding a future
            class does not record attendance.
          </p>
          <p>
            AWAITING BACKEND — check-in, attended time and approved attendance
            records.
          </p>
        </>
      ) : view === "skipcourse" ? (
        <>
          <h2>Your SkipCourse connection</h2>
          <p className="demo-pill">Not connected</p>
          <p>
            Registration will provision a linked SkipCourse account once the
            backend contract is confirmed.
          </p>
          <p>
            AWAITING BACKEND — account creation, single sign-on and student data
            synchronization.
          </p>
        </>
      ) : (
        <>
          <h2>No messages yet</h2>
          <p>
            School and class messages will appear here when messaging is
            connected.
          </p>
          <p>
            AWAITING BACKEND — message delivery. AWAITING TINA — communication
            permissions.
          </p>
        </>
      )}
    </section>
  );
}
function CommunityWorkspace({
  session,
  onLogout,
}: {
  session: DemoSession;
  onLogout: () => void;
}) {
  return (
    <section className="container enrollment-page">
      <p className="eyebrow">Community demo · {session.role}</p>
      <h1>{session.role} workspace</h1>
      <p>Welcome, {session.name}.</p>
      <div className="notice">
        <strong>AWAITING BACKEND</strong>
        <p>This is a role preview, not verified access to school records.</p>
      </div>
      {session.role === "Parent" ? (
        <>
          <h2>Your family space</h2>
          <p>
            Parent account details, enrollment updates and family communications
            will appear here.
          </p>
          <Link
            className="button"
            to="/login"
            state={{
              role: "Parent",
              family: {
                parentName: session.name,
                parentEmail: session.email,
                studentName: session.studentName ?? "Alex Morgan",
                studentEmail: session.studentEmail ?? "alex@example.com",
              },
            }}
          >
            Choose my student’s demo view
          </Link>
          <p>
            Choose “On behalf of” on the login page to explore the sample
            student calendar.
          </p>
        </>
      ) : (
        <>
          <h2>Your community space</h2>
          <p>
            AWAITING TINA — final {session.role?.toLowerCase()} tools and access
            permissions.
          </p>
        </>
      )}
      <h2>Community calendar</h2>
      <p>AWAITING SPONSOR — no confirmed events to display.</p>
      <Link to="/events">Community events</Link>
      <h2>Messages</h2>
      <p>
        No messages yet. Sending and receiving messages are AWAITING BACKEND.
      </p>
      <button className="button button-outline" onClick={onLogout}>
        Sign out
      </button>
    </section>
  );
}
