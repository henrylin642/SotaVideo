import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CreditsProvider } from "./contexts/CreditsContext";
import FreeCreditsPopup from "./components/FreeCreditsPopup";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import AIVideoGenerator from "./pages/AIVideoGenerator";
import AIImageGenerator from "./pages/AIImageGenerator";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/ai-video-generator"} component={AIVideoGenerator} />
      <Route path={"/ai-image-generator"} component={AIImageGenerator} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <CreditsProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
              <FreeCreditsPopup />
            </TooltipProvider>
          </CreditsProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
