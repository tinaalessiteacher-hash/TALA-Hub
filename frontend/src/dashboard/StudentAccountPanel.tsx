export function StudentAccountPanel({ view }: { view: string }) {
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
