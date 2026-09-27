import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthForm } from "./AuthForm";
import { Icon } from "../shared/Icon";
import { authService } from "./authService";
import { demoEnabled } from "../shared/services/demoConfig";
import { sampleSession } from "../shared/services/demoData";
import type { EnrollmentReceipt } from "../registration/enrollmentService";
import type {
  CommunityRole,
  DemoSession,
} from "../shared/services/serviceTypes";
export function LoginPage({
  onLogin,
}: {
  onLogin: (session: DemoSession) => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [quickPending, setQuickPending] = useState(false);
  const [quickError, setQuickError] = useState("");
  const state = location.state as {
    registered?: { name: string; email: string };
    fromDashboard?: boolean;
    family?: EnrollmentReceipt;
    role?: CommunityRole;
  } | null;
  const registered = state?.registered;
  const [role, setRole] = useState<CommunityRole>(state?.role ?? "Student");
  const [parentView, setParentView] = useState("self");
  const family = state?.family;
  const studentName = family?.studentName ?? sampleSession.name;
  function enter(session: DemoSession) {
    onLogin({
      ...session,
      role,
      name:
        role === "Parent"
          ? (family?.parentName ?? "Demo parent")
          : role === "Student"
            ? session.name
            : `Demo ${role.toLowerCase()}`,
      studentName: role === "Parent" ? studentName : undefined,
      studentEmail:
        role === "Parent"
          ? (family?.studentEmail ?? sampleSession.email)
          : undefined,
      representing:
        role === "Parent" && parentView === "student" ? studentName : undefined,
    });
    navigate("/dashboard", { replace: true });
  }
  return (
    <section className="auth-layout container">
      <div className="auth-panel">
        <p className="eyebrow">Community login</p>
        <h1>Welcome back.</h1>
        <p>
          New to TALA? <Link to="/register">Create a demo profile</Link>
        </p>
        {state?.fromDashboard && (
          <div className="notice" role="status">
            Open a demo session to explore the student dashboard.
          </div>
        )}
        <div className="notice">
          <strong>Demo sign-in, not real authentication.</strong> Use any sample
          email and a made-up password of 8+ characters. Identity is not
          verified.
        </div>
        <div className="form-field">
          <label htmlFor="community-role">I am a</label>
          <select
            id="community-role"
            value={role}
            onChange={(event) => setRole(event.target.value as CommunityRole)}
          >
            {(["Student", "Parent", "Alumni", "Staff"] as const).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        {role === "Parent" && (
          <fieldset className="identity-choice">
            <legend>Enter the community</legend>
            <label className="checkbox-row">
              <input
                type="radio"
                name="parent-view"
                checked={parentView === "self"}
                onChange={() => setParentView("self")}
              />
              As myself (parent)
            </label>
            <label className="checkbox-row">
              <input
                type="radio"
                name="parent-view"
                checked={parentView === "student"}
                onChange={() => setParentView("student")}
              />
              On behalf of {studentName} (sample student)
            </label>
          </fieldset>
        )}
        <p className="small">
          AWAITING BACKEND — verified identity and permissions. This selector
          changes the demo experience only.
        </p>
        <AuthForm
          key={role}
          initialEmail={
            role === "Parent" ? family?.parentEmail : registered?.email
          }
          onSubmit={async (values, simulateError) =>
            enter(
              await authService.login(
                values.email,
                values.password,
                registered?.name,
                simulateError,
              ),
            )
          }
        />
        <div className="or-divider">
          <span>Just taking a look?</span>
        </div>
        <button
          className="button button-outline button-full"
          disabled={quickPending || !demoEnabled}
          onClick={async () => {
            setQuickPending(true);
            setQuickError("");
            try {
              enter(
                await authService.login(
                  role === "Parent"
                    ? (family?.parentEmail ?? "parent@example.com")
                    : sampleSession.email,
                  "",
                  sampleSession.name,
                ),
              );
            } catch (error) {
              setQuickError(
                error instanceof Error
                  ? error.message
                  : "Demo unavailable. Try again.",
              );
            } finally {
              setQuickPending(false);
            }
          }}
        >
          {quickPending ? "Opening demo…" : "Explore with a sample profile"}
          <Icon name="arrow" />
        </button>
        {quickError && (
          <p className="field-error" role="alert">
            {quickError}
          </p>
        )}
        <p className="small">
          The demo identity and role stay in this browser tab until sign-out.
          Class selections may remain for this tab. Passwords are never saved.
        </p>
      </div>
      <aside className="auth-story">
        <p className="eyebrow">Your student hub</p>
        <h2>
          A little progress.
          <br />
          New possibilities.
        </h2>
        <p>
          Your learning, your projects, and your next steps. All with room to
          grow.
        </p>
        <div className="login-illustration" aria-hidden="true">
          <Icon name="book" />
          <span>Keep your curiosity close.</span>
          <div className="pencil-line" />
        </div>
        <p className="auth-story-note">
          A preview of your future learning space.
        </p>
      </aside>
    </section>
  );
}
