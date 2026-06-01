import { Outlet } from "react-router";
import { Sidebar } from "@/app/components/layout/Sidebar";
import { Header } from "@/app/components/layout/Header";
import { Footer } from "@/app/components/layout/Footer";
import { ChatRail } from "@/app/components/messaging/ChatRail";
import { useDesignVariant } from "@/app/contexts/DesignVariantContext";

export function MainLayout() {
  const { variant } = useDesignVariant();

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar className="hidden md:flex" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
        <Footer />
      </div>
      {/* Variant A: Collapsed chat rail on the right */}
      {variant === "A" && <ChatRail />}
    </div>
  );
}
