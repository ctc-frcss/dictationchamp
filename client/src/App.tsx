import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Welcome from "@/pages/welcome";
import WordBank from "@/pages/word-bank";
import Game from "@/pages/game";
import Results from "@/pages/results";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/word-bank" component={WordBank} />
      <Route path="/game" component={Game} />
      <Route path="/results" component={Results} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
// client/src/App.tsx