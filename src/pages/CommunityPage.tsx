import { Link } from "react-router-dom";
export function CommunityPage({ kind }: { kind: "events" | "contact" }) {
  return (
    <section className="page-intro container">
      <p className="eyebrow">TALA community</p>
      <h1>{kind === "events" ? "Community events" : "Contact TALA"}</h1>
      {kind === "events" ? (
        <>
          <p className="lead">A place to connect, share and learn.</p>
          <div className="state-panel">
            <h2>No confirmed events yet</h2>
            <p>
              AWAITING SPONSOR — event dates, locations and registration
              details.
            </p>
          </div>
          <h2>Lecture series & visiting professors</h2>
          <p>Guest announcements will appear here once approved.</p>
        </>
      ) : (
        <>
          <p className="lead">The right next step for your family.</p>
          <div className="notice">
            <strong>AWAITING SPONSOR — verified contact details</strong>
            <p>
              Official email, phone, address and response arrangements have not
              been confirmed for publication. This preview cannot send an
              inquiry.
            </p>
          </div>
        </>
      )}
      <div className="button-row">
        <Link className="button" to="/register">
          Explore registration demo
        </Link>
        <Link className="text-link" to="/learn-more">
          Learn more about TALA
        </Link>
      </div>
    </section>
  );
}
