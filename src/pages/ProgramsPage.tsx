import { Link, useSearchParams } from "react-router-dom";
import { programs } from "../content";
import { Icon } from "../components/Icon";
export function ProgramsPage() {
  const [params, setParams] = useSearchParams();
  const requested = params.get("program");
  const selected = programs.some((program) => program.id === requested)
    ? (requested ?? "all")
    : "all";
  const shown =
    selected === "all" ? programs : programs.filter((p) => p.id === selected);
  return (
    <>
      <section className="page-intro container">
        <p className="eyebrow">Programs & learning experiences</p>
        <h1>Find a way to learn.</h1>
        <p className="lead">
          Explore different ways to learn with TALA, from focused support to
          discoveries beyond the classroom.
        </p>
        <p className="content-note">
          AWAITING SPONSOR — early concept previews, not a confirmed course
          catalog. Details, eligibility, pricing and schedules are not yet
          confirmed.
        </p>
      </section>
      <section
        className="container programs-section"
        aria-label="Learning opportunities"
      >
        <div className="program-select">
          <label htmlFor="program-filter">Filter programs</label>
          <select
            id="program-filter"
            value={selected}
            onChange={(event) =>
              setParams(
                event.target.value === "all"
                  ? {}
                  : { program: event.target.value },
              )
            }
          >
            <option value="all">All opportunities</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.category}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-row" aria-label="Filter programs">
          <button
            className={selected === "all" ? "filter active" : "filter"}
            aria-pressed={selected === "all"}
            onClick={() => setParams({})}
          >
            All opportunities
          </button>
          {programs.map((p) => (
            <button
              key={p.id}
              className={selected === p.id ? "filter active" : "filter"}
              aria-pressed={selected === p.id}
              onClick={() => setParams({ program: p.id })}
            >
              {p.category}
            </button>
          ))}
        </div>
        <p className="results-count" role="status">
          Showing {shown.length}{" "}
          {shown.length === 1
            ? "learning opportunity"
            : "learning opportunities"}
        </p>
        <div className="program-details">
          {shown.map((p) => (
            <article className="program-detail" key={p.id}>
              <div className={`program-visual ${p.color}`} aria-hidden="true">
                <Icon name={p.icon} />
              </div>
              <div className="program-detail-copy">
                <p className="eyebrow">{p.category}</p>
                <h2>{p.title}</h2>
                <p className="lead">{p.description}</p>
                <p>{p.detail}</p>
                <Link className="text-link" to="/register">
                  Start registration demo <Icon name="arrow" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="container program-note">
        <Icon name="voice" />
        <div>
          <h2>Wondering which path is right for you?</h2>
          <p>
            Confirmed contact details and enrollment guidance will be added by
            the TALA team. In the meantime, you can explore the student
            experience without enrolling.
          </p>
          <Link to="/login" className="text-link">
            Explore the demo hub <Icon name="arrow" />
          </Link>
        </div>
      </section>
    </>
  );
}
