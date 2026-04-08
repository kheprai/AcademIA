import { Outlet } from "@remix-run/react";

import { CartSidebar } from "~/modules/Cart/CartSidebar";

import { AuroraBackground } from "./components/AuroraBackground";
import { GrainOverlay } from "./components/GrainOverlay";
import { LandingFooter } from "./components/LandingFooter";
import { LandingHeader } from "./components/LandingHeader";

export default function LandingLayout() {
  return (
    <div className="dark relative flex min-h-screen flex-col overflow-x-hidden">
      <AuroraBackground />
      <GrainOverlay />
      <LandingHeader />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <LandingFooter />
      <CartSidebar />
    </div>
  );
}
