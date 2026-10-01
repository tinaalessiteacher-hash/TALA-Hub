import { Link } from "react-router-dom";
import type { DemoSession } from "../shared/services/serviceTypes";
import { sampleSession } from "../shared/services/demoData";
export function CommunityWorkspace({
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
                studentName: session.studentName ?? sampleSession.name,
                studentEmail: session.studentEmail ?? sampleSession.email,
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
      <p>
        <Link to="/enrollment-status">Enrollment status &amp; payment</Link>
      </p>
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
