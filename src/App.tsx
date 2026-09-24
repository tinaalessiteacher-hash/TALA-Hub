import { lazy, Suspense, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { SiteLayout } from "./components/SiteLayout";
import { RouteFocus } from "./components/RouteFocus";
import { CommunityPage } from "./pages/CommunityPage";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ProgramsPage } from "./pages/ProgramsPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
const StudentDashboard = lazy(() =>
  import("./pages/StudentDashboard").then((module) => ({
    default: module.StudentDashboard,
  })),
);
import { NotFoundPage } from "./pages/NotFoundPage";
import { readDemoSession, saveDemoSession } from "./services/authService";
import type { DemoSession } from "./services/serviceTypes";
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
