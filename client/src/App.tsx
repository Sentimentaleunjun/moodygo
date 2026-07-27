import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import Player from "./pages/Player";
import Setup from "./pages/Setup";


function Router() {
  return (
    <Switch>

      <Route 
        path="/" 
        component={Landing} 
      />


      <Route
        path="/setup"
        component={Setup}
      />


      <Route
        path="/app"
        component={Player}
      />


      <Route
        path="/404"
        component={NotFound}
      />


      <Route component={NotFound} />

    </Switch>
  );
}


function App() {

  return (

    <ErrorBoundary>

      <ThemeProvider
        defaultTheme="light"
      >

        <TooltipProvider>

          <Toaster />

          <Router />

        </TooltipProvider>

      </ThemeProvider>

    </ErrorBoundary>

  );

}


export default App;
