import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import NewsletterPopup from "@/components/NewsletterPopup";
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
import Colleges from "./pages/Colleges";
import CollegeProfile from "./pages/CollegeProfile";
import Races from "./pages/Races";
import RaceProfile from "./pages/RaceProfile";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import TravelEd from "./pages/TravelEd";
import ClassicalSchools from "./pages/ClassicalSchools";
import BookClub from "./pages/BookClub";
import Videos from "./pages/Videos";
import TravelEdDestination from "./pages/TravelEdDestination";
import FederalTaxCredit from "./pages/FederalTaxCredit";
import Mission from "./pages/Mission";
import Membership from "./pages/Membership";
import StateHub from "./pages/StateHub";
import CityHub from "./pages/CityHub";
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
import Dmca from "./pages/Dmca";
import StatementOfFaith from "./pages/StatementOfFaith";
import SignUp from "./pages/SignUp";
import Contact from "./pages/Contact";
import ListCourse from "./pages/ListCourse";
import CurriculumGuide from "./pages/CurriculumGuide";
import CurriculumComparison from "./pages/CurriculumComparison";
import LessonPlanning from "./pages/LessonPlanning";
import LessonPlanner from "./pages/LessonPlanner";
import ToolsHub from "./pages/tools/ToolsHub";
import TeacherResources from "./pages/TeacherResources";
import WorksheetGenerator from "./pages/tools/WorksheetGenerator";
import BibleVerseMaker from "./pages/tools/BibleVerseMaker";
import Flashcards from "./pages/tools/Flashcards";

const MathWorksheets = () => <WorksheetGenerator presetSubject="math" />;
const SpellingWorksheets = () => <WorksheetGenerator presetSubject="spelling" />;
const HandwritingWorksheets = () => <WorksheetGenerator presetSubject="handwriting" />;
const ReadingWorksheets = () => <WorksheetGenerator presetSubject="reading" />;
const VocabularyWorksheets = () => <WorksheetGenerator presetSubject="vocabulary" />;
import Submit from "./pages/Submit";
import Feedback from "./pages/Feedback";
import { FloatingDonateButton } from "./components/FloatingDonateButton";
import { SeoHead } from "./components/SeoHead";
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
      <Route path="/city/:code/:city" component={CityHub} />
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
      <Route path="/dmca" component={Dmca} />
      <Route path="/statement-of-faith" component={StatementOfFaith} />
      <Route path="/colleges" component={Colleges} />
      <Route path="/college/:slug" component={CollegeProfile} />
      <Route path="/races" component={Races} />
      <Route path="/race/:slug" component={RaceProfile} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/news" component={News} />
      <Route path="/news/:slug" component={NewsArticle} />
      <Route path="/traveled" component={TravelEd} />
      <Route path="/classical-christian-schools" component={ClassicalSchools} />
      <Route path="/book-club" component={BookClub} />
      <Route path="/videos" component={Videos} />
      <Route path="/traveled/:slug" component={TravelEdDestination} />
      <Route path="/federal-tax-credit" component={FederalTaxCredit} />
      <Route path="/signup" component={SignUp} />
      <Route path="/contact" component={Contact} />
      <Route path="/list-course" component={ListCourse} />
      <Route path="/curriculum-guide" component={CurriculumGuide} />
      <Route path="/curriculum-comparison" component={CurriculumComparison} />
      <Route path="/lesson-planning" component={LessonPlanning} />
      <Route path="/lesson-planner" component={LessonPlanner} />
      <Route path="/tools" component={ToolsHub} />
      <Route path="/teacher-resources" component={TeacherResources} />
      <Route path="/tools/worksheet-generator" component={MathWorksheets} />
      <Route path="/tools/math-worksheet-generator" component={MathWorksheets} />
      <Route path="/tools/spelling-worksheet-generator" component={SpellingWorksheets} />
      <Route path="/tools/handwriting-worksheet-generator" component={HandwritingWorksheets} />
      <Route path="/tools/reading-worksheet-generator" component={ReadingWorksheets} />
      <Route path="/tools/vocabulary-worksheet-generator" component={VocabularyWorksheets} />
      <Route path="/tools/bible-verse-maker" component={BibleVerseMaker} />
      <Route path="/tools/flashcards" component={Flashcards} />
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
          <SeoHead />
          <Router />
          <FloatingDonateButton />
          <NewsletterPopup />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
