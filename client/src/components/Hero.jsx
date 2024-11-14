"use client"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useAuth } from "@/app/context/store"
import {useState } from "react";
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
        <Header/>
        {selectedUser ? (
          <div className="flex flex-col h-[90vh]">
            <Messages/>
            <MessageInp setMessage={setMessage} message={message} />
          </div>
        ) : (
          <div className="flex min-h-100 justify-center items-center my-auto text-orange-600 text-2xl">
            Start Message
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}