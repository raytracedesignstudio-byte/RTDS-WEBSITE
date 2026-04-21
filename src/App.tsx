import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import GeometricPattern from "@/components/layout/GeometricPattern";
import { useVerticals } from "@/lib/useVerticals";

const Home = lazy(() => import("@/pages/home"));
const About = lazy(() => import("@/pages/about"));
const Projects = lazy(() => import("@/pages/projects"));
const ProjectDetail = lazy(() => import("@/pages/project-detail"));
const Vertical = lazy(() => import("@/pages/vertical"));
const Careers = lazy(() => import("@/pages/careers"));
const Contact = lazy(() => import("@/pages/contact"));
const Admin = lazy(() => import("@/pages/admin"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router({
  onLogoAnimationComplete,
}: {
  onLogoAnimationComplete?: () => void;
}) {
  const [location] = useLocation();
  const { verticals, loading } = useVerticals();
  const matchedVertical = verticals.find(
    (vertical) => vertical.path === location,
  );
  const isKnownStaticRoute =
    location === "/" ||
    location === "/about" ||
    location === "/projects" ||
    location === "/careers" ||
    location === "/contact" ||
    location === "/admin" ||
    location.startsWith("/projects/");

  return (
    <Suspense fallback={null}>
      {matchedVertical ? (
        <AnimatePresence mode="wait">
          <Vertical type={matchedVertical.id} />
        </AnimatePresence>
      ) : loading && !isKnownStaticRoute ? null : (
        <AnimatePresence mode="wait">
          <Switch>
            <Route path="/">
              {() => <Home onLogoAnimationComplete={onLogoAnimationComplete} />}
            </Route>
            <Route path="/about" component={About} />
            <Route path="/projects" component={Projects} />
            <Route path="/projects/:id" component={ProjectDetail} />
            <Route path="/careers" component={Careers} />
            <Route path="/contact" component={Contact} />
            <Route path="/admin" component={Admin} />
            <Route component={NotFound} />
          </Switch>
        </AnimatePresence>
      )}
    </Suspense>
  );
}

function AppShell() {
  const [showNav, setShowNav] = useState(false);
  const [location] = useLocation();

  const handleLogoAnimationComplete = useCallback(() => {
    setShowNav(true);

    if (location !== "/") return;

    const scrollHintOffset = Math.min(
      120,
      Math.max(70, Math.round(window.innerHeight * 0.12)),
    );

    window.setTimeout(() => {
      window.scrollTo({
        top: scrollHintOffset,
        left: 0,
        behavior: "smooth",
      });
    }, 260);
  }, [location]);

  useEffect(() => {
    if (location !== "/") {
      setShowNav(true);
    }
  }, [location]);

  const isAdmin = location === "/admin";
  const showPattern = !isAdmin;

  return (
    <>
      <ScrollToTop />
      <div className="flex flex-col min-h-dvh bg-background text-foreground overflow-x-hidden">
        {showPattern && <GeometricPattern />}
        {!isAdmin && <Navbar showNav={showNav} />}
        <main className="flex-1 flex flex-col relative z-1">
          <Router onLogoAnimationComplete={handleLogoAnimationComplete} />
        </main>
        {!isAdmin && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppShell />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
