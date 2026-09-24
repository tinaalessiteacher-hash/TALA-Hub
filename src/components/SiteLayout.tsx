import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import type { DemoSession } from "../services/serviceTypes";
import { demoEnabled } from "../services/authService";
import { Brand } from "./Brand";
import { Icon } from "./Icon";

export function SiteLayout({ session }: { session: DemoSession | null }) {
  const location = useLocation();
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Skip to content
      </a>
      <div className="preview-banner">
        TALA preview <span aria-hidden="true">·</span>{" "}
        {demoEnabled
          ? "Demo only. No real accounts."
          : "Live account services are not connected."}
      </div>
      <Header key={location.pathname} session={session} />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-top">
          <div>
            <Brand />
            <p>
              Room to learn.
              <br />
              Space to become yourself.
            </p>
          </div>
          <nav aria-label="Footer">
            <Link to="/about">About TALA</Link>
            <Link to="/programs">Explore programs</Link>
            <Link to={session ? "/dashboard" : "/login"}>Student hub</Link>
          </nav>
          <div className="footer-note">
            <p>A learning experience, taking shape.</p>
            <small>
              Website content is a preview and awaits final review by the TALA
              team.
            </small>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>TALA-Hub · ASU Capstone frontend</span>
          <span>Built with curiosity. Designed for everyone.</span>
        </div>
      </footer>
    </>
  );
}
function Header({ session }: { session: DemoSession | null }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: Event) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("focusin", closeOutside);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("focusin", closeOutside);
    };
  }, [open]);
  return (
    <header
      className="site-header"
      ref={header}
      onClick={(event) => {
        if (
          open &&
          event.target instanceof Element &&
          event.target.closest("a")
        ) {
          setOpen(false);
          // A current-page link does not remount the header or run route focus.
          toggle.current?.focus();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <div className="container nav-row">
        <Brand />
        <button
          ref={toggle}
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "close" : "menu"} />
          <span>{open ? "Close menu" : "Menu"}</span>
        </button>
        <nav
          id="primary-navigation"
          aria-label="Main navigation"
          className={open ? "primary-nav is-open" : "primary-nav"}
        >
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/learn-more">Learn More</NavLink>
          <NavLink to="/register">Enrollment</NavLink>
          <NavLink to="/events">Community Events</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <div className="nav-actions">
            <NavLink to={session ? "/dashboard" : "/login"}>
              {session ? "My dashboard" : "Community Login"}
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
