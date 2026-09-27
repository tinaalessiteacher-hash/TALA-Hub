import { lazy, Suspense, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { SiteLayout } from "./shared/SiteLayout";
import { RouteFocus } from "./shared/RouteFocus";
import { CommunityPage } from "./public-site/CommunityPage";
import { HomePage } from "./public-site/HomePage";
import { AboutPage } from "./public-site/AboutPage";
import { ProgramsPage } from "./public-site/ProgramsPage";
import { RegisterPage } from "./registration/RegisterPage";
import { LoginPage } from "./authentication/LoginPage";
const StudentDashboard = lazy(() =>
  import("./dashboard/StudentDashboard").then((module) => ({
    default: module.StudentDashboard,
  })),
);
import { NotFoundPage } from "./public-site/NotFoundPage";
import { readDemoSession, saveDemoSession } from "./authentication/authService";
import type { DemoSession } from "./shared/services/serviceTypes";
export default function App() {
  const [session, setSession] = useState(readDemoSession);
  const navigate = useNavigate();
  function login(next: DemoSession) {
    saveDemoSession(next);
    setSession(next);
  }
  function logout() {
    saveDemoSession(null);
    setSession(null);
    navigate("/login", { replace: true });
  }
  return (
    <>
      <Routes>
        <Route element={<SiteLayout session={session} />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="learn-more" element={<AboutPage />} />
          <Route path="events" element={<CommunityPage kind="events" />} />
          <Route path="contact" element={<CommunityPage kind="contact" />} />
          <Route path="programs" element={<ProgramsPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage onLogin={login} />} />
          <Route
            path="dashboard"
            element={
              session ? (
                <Suspense
                  fallback={
                    <div className="container state-panel" role="status">
                      Opening your student hub…
                    </div>
                  }
                >
                  <StudentDashboard session={session} onLogout={logout} />
                </Suspense>
              ) : (
                <Navigate to="/login" state={{ fromDashboard: true }} replace />
              )
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <RouteFocus />
    </>
  );
}
