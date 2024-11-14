"use client"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useAuth } from "@/app/context/store"
import { useState } from "react";
import { AppSidebar } from "./app-sidebar"
import MessageInp from "./MessageInp";
import Header from "./Header";
import Messages from "./Messages";

export default function Hello() {
  const { selectedUser } = useAuth();
  const [message, setMessage] = useState("");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        {selectedUser ? (
          <div className="flex flex-col h-[90vh]">
            <Messages />
            <MessageInp setMessage={setMessage} message={message} />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-center">
            <div className="text-gray-500 text-2xl font-semibold animate-pulse">
              Start a Conversation
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider >
  );
}