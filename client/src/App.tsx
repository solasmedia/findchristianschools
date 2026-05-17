import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import SchoolProfile from "./pages/SchoolProfile";
import Resources from "./pages/Resources";
import Jobs from "./pages/Jobs";
import Events from "./pages/Events";
import Mission from "./pages/Mission";
import Membership from "./pages/Membership";
import StateHub from "./pages/StateHub";
import StatesIndex from "./pages/States";
import International from "./pages/International";
import SubmitSchool from "./pages/SubmitSchool";
import SubmitInternational from "./pages/SubmitInternational";
import MapSearch from "./pages/MapSearch";
import Admin from "./pages/Admin";
import Sponsor from "./pages/Sponsor";
import Profile from "./pages/Profile";
import Compare from "./pages/Compare";
import SaveToHomeScreen from "./pages/SaveToHomeScreen";
import Welcome from "./pages/Welcome";
import LearningResources from "./pages/LearningResources";
import AdminLogin from "./pages/AdminLogin";
import AdminSetup from "./pages/AdminSetup";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import LegalContact from "./pages/LegalContact";
import Disclaimer from "./pages/Disclaimer";
import SignUp from "./pages/SignUp";
import Contact from "./pages/Contact";
import ListCourse from "./pages/ListCourse";
import CurriculumGuide from "./pages/CurriculumGuide";
import CurriculumComparison from "./pages/CurriculumComparison";
import LessonPlanning from "./pages/LessonPlanning";
import LessonPlanner from "./pages/LessonPlanner";
import Submit from "./pages/Submit";
import Feedback from "./pages/Feedback";
import { FloatingDonateButton } from "./components/FloatingDonateButton";
import { usePageTracking } from "./hooks/useAnalytics";

function Router() {
  const [location] = useLocation();
  usePageTracking();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={SearchResults} />
      <Route path="/map" component={MapSearch} />
      <Route path="/school/:slug" component={SchoolProfile} />
      <Route path="/resources" component={Resources} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/events" component={Events} />
      <Route path="/mission" component={Mission} />
      <Route path="/membership" component={Membership} />
      <Route path="/states" component={StatesIndex} />
      <Route path="/state/:code" component={StateHub} />
      <Route path="/international" component={International} />
      <Route path="/submit-school" component={SubmitSchool} />
      <Route path="/submit-international" component={SubmitInternational} />
      <Route path="/admin" component={Admin} />
      <Route path="/sponsor" component={Sponsor} />
      <Route path="/profile" component={Profile} />
      <Route path="/compare" component={Compare} />
      <Route path="/save-to-home-screen" component={SaveToHomeScreen} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/learning-resources" component={LearningResources} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin-setup" component={AdminSetup} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/legal-contact" component={LegalContact} />
      <Route path="/disclaimer" component={Disclaimer} />
      <Route path="/signup" component={SignUp} />
      <Route path="/contact" component={Contact} />
      <Route path="/list-course" component={ListCourse} />
      <Route path="/curriculum-guide" component={CurriculumGuide} />
      <Route path="/curriculum-comparison" component={CurriculumComparison} />
      <Route path="/lesson-planning" component={LessonPlanning} />
      <Route path="/lesson-planner" component={LessonPlanner} />
      <Route path="/submit" component={Submit} />
      <Route path="/feedback" component={Feedback} />
      {/* Redirect routes for common URL variations */}
      <Route path="/donate" component={Mission} />
      <Route path="/compare-schools" component={Compare} />
      <Route path="/international-schools" component={International} />
      <Route path="/list-your-school" component={Membership} />
      <Route path="/become-a-sponsor" component={Sponsor} />
      <Route path="/our-mission" component={Mission} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          <FloatingDonateButton />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
