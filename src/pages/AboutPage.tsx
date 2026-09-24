import { Link } from "react-router-dom";
export function AboutPage() {
  return (
    <>
      <section className="page-intro container">
        <p className="eyebrow">Learn more · About TALA</p>
        <h1>A place for different ways to learn.</h1>
        <p className="lead">
          Tucson Adaptive Learning Academy is planning a flexible learning
          environment for medically fragile and neurodivergent students.
        </p>
        <p className="content-note">
          AWAITING SPONSOR — final public wording, opening date and program
          availability.
        </p>
      </section>
      <section className="container information-sections">
        <article>
          <h2>Our mission</h2>
          <p>
            The supplied school brief puts each learner’s health, dignity and
            potential at the center of learning. The proposed approach combines
            mastery, projects and individual support.
          </p>
          <p className="small">
            AWAITING SPONSOR — approved mission statement.
          </p>
        </article>
        <article>
          <h2>Registration</h2>
          <p>
            Start with a parent account, add a student, share enrollment
            preferences, review required information and choose a funding
            preference before student access.
          </p>
          <Link className="button" to="/register">
            Start registration demo
          </Link>{" "}
          <Link className="text-link" to="/register?intent=waiting-list">
            Waiting list demo
          </Link>
        </article>
        <article>
          <h2>How our schedule works</h2>
          <p>
            The proposed model offers in-person and online learning across a
            50-week year, using two-hour blocks between 6 AM and 6 PM, Arizona
            time. Final schedules and availability need school confirmation.
          </p>
          <p>
            Explore sample class availability and build a personal calendar in
            the student demo.
          </p>
          <Link className="text-link" to="/programs">
            Meet the learning opportunities →
          </Link>
        </article>
        <article>
          <h2>Funding sources</h2>
          <p>
            Registration includes ESA, STO and Private funding preferences.
            Eligibility, coverage, fees and payment instructions are AWAITING
            SPONSOR. No funding or payment is approved by this demo.
          </p>
        </article>
        <article>
          <h2>About our founders</h2>
          <p>AWAITING SPONSOR — approved biographies and photos.</p>
        </article>
        <article>
          <h2>Community events</h2>
          <p>
            Gatherings and learning opportunities will be listed once confirmed.
          </p>
          <Link className="text-link" to="/events">
            View community events →
          </Link>
        </article>
        <article>
          <h2>Lecture series</h2>
          <p>AWAITING SPONSOR — speakers, topics and dates.</p>
        </article>
        <article>
          <h2>Visiting professors</h2>
          <p>AWAITING SPONSOR — confirmed participants and program details.</p>
        </article>
      </section>
    </>
  );
}
