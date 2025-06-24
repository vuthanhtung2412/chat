import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import Room from "@/components/room";
import "@/styles/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { HashRouter, Routes, Route } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 flex flex-col h-screen">
          <SidebarTrigger />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="rooms/:room_id" element={<Room />} />
            </Routes>
          </div>
        </main>
      </SidebarProvider>
    </HashRouter>
  </StrictMode>
);
