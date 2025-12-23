import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Incorporation from "@/pages/incorporation";
import Login from "@/pages/login";
import AdminDashboard from "@/pages/admin";
import Tracking from "@/pages/tracking";
import Denuncias from "@/pages/denuncias";
import Boletin from "@/pages/boletin";
import QuienesSomos from "@/pages/quienes-somos";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/quienes-somos" component={QuienesSomos} />
      <Route path="/denuncias" component={Denuncias} />
      <Route path="/incorporacion" component={Incorporation} />
      <Route path="/seguimiento" component={Tracking} />
      <Route path="/boletin" component={Boletin} />
      <Route path="/login" component={Login} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
