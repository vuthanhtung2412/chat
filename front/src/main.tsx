import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "@/components/home";
import Chat from "@/components/chat";
import "@/styles/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { HashRouter, Routes, Route } from "react-router";
import { useAuthDialog } from "@/hooks/use-auth-dialog"
import { UsernameDialog } from "@/components/username-dialog"
import X from "@/components/x";

function App() {
  const {
    user,
    usernameError,
    isConnecting,
    handleUsernameSubmit
  } = useAuthDialog()

  return (
    <>
      <UsernameDialog
        isOpen={user === null}
        onSubmit={handleUsernameSubmit}
        error={usernameError}
        isConnecting={isConnecting}
      />
      <HashRouter>
        <SidebarProvider>
          <AppSidebar
            user={user}
          />
          <main className="flex-1 flex flex-col h-screen">
            <SidebarTrigger className="fixed z-20" />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="rooms/:room_id"
                element={
                  user ? (
                    <Chat user={user} />
                  ) : (
                    <div className="justify-center">
                      Please login to view the chat.
                    </div>
                  )
                }
              />
              <Route path="x" element={<X />} />
            </Routes>
          </main>
        </SidebarProvider>
      </HashRouter>
    </>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
