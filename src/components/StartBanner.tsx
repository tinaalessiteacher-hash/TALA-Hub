import { Link } from "react-router-dom";
import { Icon } from "./Icon";
export function StartBanner() {
  return (
    <section className="start-banner container">
      <div>
        <p className="eyebrow">The student hub</p>
        <h2>Your learning, in one place.</h2>
        <p>Preview sample learning paths, progress, and projects.</p>
      </div>
      <div>
        <Link to="/login" className="button button-light">
          Explore the demo hub <Icon name="arrow" />
        </Link>
        <p className="small">A frontend demo. No enrollment required.</p>
      </div>
    </section>
  );
}
