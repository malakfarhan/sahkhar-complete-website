import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Cars from "@/pages/Cars";
import Locations from "@/pages/Locations";
import Contact from "@/pages/Contact";
import Booking from "@/pages/Booking";
import ThankYou from "@/pages/ThankYou";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";
import { LanguageProvider } from "@/i18n/LanguageContext";

const queryClient = new QueryClient();

// Higher-order component to wrap public pages with Navbar and Footer
function withPublicLayout(Component: React.ComponentType) {
  return function WrappedComponent(params: any) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Component {...params} />
        </main>
        <Footer />
      </div>
    );
  };
}

// Create these once, outside of Routes. Creating them while Routes renders
// gives React a new component type on every hash change and can break the DOM
// reconciliation during navigation.
const PublicHome = withPublicLayout(Home);
const PublicCars = withPublicLayout(Cars);
const PublicLocations = withPublicLayout(Locations);
const PublicContact = withPublicLayout(Contact);
const PublicBooking = withPublicLayout(Booking);
const PublicThankYou = withPublicLayout(ThankYou);
const PublicNotFound = withPublicLayout(NotFound);

function Routes() {
  return (
    <Switch>
      {/* Dashboard (Without Navbar/Footer) */}
      <Route path="/dashboard" component={Dashboard} />

      {/* Public Pages (With Navbar/Footer) */}
      <Route path="/" component={PublicHome} />
      <Route path="/cars" component={PublicCars} />
      <Route path="/locations" component={PublicLocations} />
      <Route path="/contact" component={PublicContact} />
      <Route path="/booking" component={PublicBooking} />
      <Route path="/thank-you" component={PublicThankYou} />

      {/* 404 Not Found */}
      <Route component={PublicNotFound} />
    </Switch>
  );
}

function App() {
  return (
    <LanguageProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter hook={useHashLocation}>
          <Routes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;
