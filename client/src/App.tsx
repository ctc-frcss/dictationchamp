// client/src/App.tsx

import { Switch, Route, Router } from "wouter"; // <--- CHANGE #1: Add 'Router' here
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Welcome from "@/pages/welcome";
import WordBank from "@/pages/word-bank";
import Game from "@/pages/game";
import Results from "@/pages/results";

// This function now includes the Router with the basepath
function AppRouter() { // Renamed the component to avoid confusion
return (
    // <--- CHANGE #2: Wrap the Switch with the Router component
    <Router basepath="/dictationchamp">
      <Switch>
  <Route path="/" component={Welcome} />
  <Route path="/word-bank" component={WordBank} />
  <Route path="/game" component={Game} />
  <Route path="/results" component={Results} />
  </Switch>
    </Router>
);
}

function App() {
return (
<QueryClientProvider client={queryClient}>
<TooltipProvider>
<Toaster />
<div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
          {/* Use the updated router component */}
<AppRouter />
</div>
</TooltipProvider>
</QueryClientProvider>
);
}

export default App;