"use client"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useAuth } from "@/app/context/store"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useState, useRef } from "react";
import { AppSidebar } from "./app-sidebar"
import { IoSendSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AvatarImage, Avatar } from "./ui/avatar";

export default function Hello() {
  const { selectedUser, setSelectedUser, messages, setMessages } = useAuth();
  const scroll = useRef();
  const [message, setMessage] = useState("")


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


  const handleMessageSend = async () => {
    if (!message) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/message?id=${selectedUser?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      if (data.success) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { message, createdAt: new Date() },
        ]);
      } else {
        toast.error("Message send failed:", data.message);
      }
    } catch (error) {
      toast.error("Error sending message:" + error.message);
    }
    finally{
      setMessage("");
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/message?id=${selectedUser._id}`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setMessages(data.messages);
          } else {
            toast.error("Failed to fetch messages.");
          }
        } else {
          toast.error("Conversation Not Found");
          setMessage([])
        }
      } catch (error) {
        toast.error("Error fetching messages: " + error.message);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">

          {
            selectedUser && <div className="flex-1 flex gap-1 my-auto">
              <Avatar>
                <AvatarImage src={selectedUser?.profilePhoto} />
              </Avatar>
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
                {
                  messages.length === 0 ? <h1>No Message</h1> : (
                    <>
                      {
                        selectedUser ? (
                          messages.map((item, index) => (
                            <div ref={scroll}  key={index}>
                              <div className={`chat ${item?.user === selectedUser._id ? 'chat-start' : 'chat-end'} m-1`}>
                                <div className="chat-image avatar">
                                  <div className="w-10 rounded-full">
                                    <img alt="Tailwind CSS chat bubble component" src={item?.user === selectedUser._id ? `${selectedUser.profilePhoto}` : 'chat-end'} />
                                  </div>
                                </div>
                                <div className="chat-bubble">{item?.message}</div>
                                <span className="text-xs text-black font-semibold">
                                  {new Date(item?.createdAt).toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true
                                  })}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : null
                      }
                    </>
                  )
                }
              </div>

              <div className="flex w-full items-center space-x-2 p-2">
                <Input
                  type="text"
                  placeholder="Enter Message..."
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button className="mr-1" onClick={handleMessageSend}>
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

