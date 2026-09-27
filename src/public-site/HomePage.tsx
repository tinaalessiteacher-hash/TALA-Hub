import { Link } from "react-router-dom";
import { Icon } from "../shared/Icon";
import { ProgramCards } from "./ProgramCards";
import { StartBanner } from "./StartBanner";
import learningDesk from "../assets/learning-desk.svg";
export function HomePage() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="seed-dot" /> Tucson Adaptive Learning Academy
          </p>
          <h1>
            Find your way
            <br />
            to learn with TALA.
          </h1>
          <p className="lead">
            A planned school community for medically fragile and neurodivergent
            learners. Explore a flexible blend of in-person and online learning,
            starting with your family.
          </p>
          <div className="button-row">
            <Link className="button" to="/register">
              Start registration <Icon name="arrow" />
            </Link>
            <Link className="text-link" to="/learn-more">
              Learn more
            </Link>
          </div>
        </div>
        <figure className="hero-art">
          <img
            src={learningDesk}
            width="600"
            height="570"
            alt="An illustrated learning journal with a seedling, a mountain sketch, and notes to ask, explore, and grow."
          />
          <figcaption>
            A little curiosity can open a whole new world.
          </figcaption>
        </figure>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Concept previews · AWAITING SPONSOR</p>
            <h2>Explore the possibilities.</h2>
          </div>
          <p>
            These early concepts are not a confirmed course catalog. Final
            programs, availability and enrollment details await TALA’s approval.
          </p>
        </div>
        <ProgramCards />
      </section>
      <section className="container information-sections">
        <article>
          <h2>A school taking shape</h2>
          <p>
            AWAITING SPONSOR — opening date, campus details and virtual tour.
            The registration and community areas are demonstrations; no
            application is submitted.
          </p>
          <Link className="text-link" to="/events">
            Community events →
          </Link>
        </article>
      </section>
      <StartBanner />
    </>
  );
}
