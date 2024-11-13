"use client"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useAuth } from "@/app/context/store"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { AppSidebar } from "./app-sidebar"
import { Avatar } from "@radix-ui/react-avatar";
import { IoSendSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function Hello() {
  const { selectedUser,setSelectedUser } = useAuth();
  const [message, setMessage] = useState(null)
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/logout`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) { 
        setSelectedUser(null)
        router.push("/sign-in");
      } else {
        console.error("Logout failed: ", response.statusText);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">

          {
            selectedUser && <div className="flex-1"> <Avatar src={selectedUser?.profilePhoto} />
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold mr-2 text-xl">{selectedUser?.fullName}</span>
                <span>Typing...</span>
              </div>
            </div>
          }
          <Button onClick={handleLogout} >Logout</Button>
        </header>
        {
          selectedUser ?
            <div className="flex flex-col h-[90%]">
              <div className="flex-1 mx-2 overflow-y-auto p-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam iure mollitia at placeat dignissimos architecto perferendis quia sequi autem inventore, ipsam in quisquam similique doloremque quo labore. Tenetur asperiores exercitationem repellat voluptatum obcaecati ipsa nobis eveniet harum cupiditate modi placeat illum ducimus quaerat praesentium, eos magnam? Repudiandae fugit quo ipsam neque. Saepe necessitatibus repellat doloribus, veniam nisi cupiditate facilis, vitae, quam porro quisquam sunt quae ea consectetur mollitia! Eius temporibus minima dolor iure. Modi dolorum officia natus fugit error molestiae reprehenderit odio ratione voluptas. Dolores necessitatibus dolorem veniam voluptatum cupiditate architecto error iste labore at similique saepe, nulla illo fugiat!
              </div>
              <div className="flex w-full items-center space-x-2 p-2">
                <Input
                  type="text"
                  placeholder="Enter Message..."
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button className="mr-1">
                  <IoSendSharp />
                </Button>
              </div>
            </div>



            : <div className="flex min-h-100 justify-center items-center my-auto text-orange-600 text-2xl">
              Start Message
            </div>
        }
      </SidebarInset>
    </SidebarProvider >
  )
}

