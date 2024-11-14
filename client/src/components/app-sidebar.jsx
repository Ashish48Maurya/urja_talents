"use client";
import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "./ui/sidebar";
import { Input } from "./ui/input";
import Fuse from "fuse.js";
import { useAuth } from "@/app/context/store";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

export function AppSidebar({ ...props }) {
    const router = useRouter()
        ; const [searchQuery, setSearchQuery] = React.useState("");
    const { selectedUser, setSelectedUser, setMessages,onlineUser, otherUsers } = useAuth();


    const fuse = React.useMemo(() => new Fuse(otherUsers, { keys: ["fullName"], threshold: 0.6 }), [otherUsers]);

    const filteredData = React.useMemo(
        () => (searchQuery ? fuse.search(searchQuery).map((result) => result.item) : otherUsers),
        [searchQuery, fuse]
    );

    const handleUserClick = (user) => {
        setMessages([])
        setSelectedUser(user);
    };

    return (
        <Sidebar variant="floating" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="font-bold text-xl">UrjaTalents</div>
                            </a>
                        </SidebarMenuButton>
                        <div className="flex w-full max-w-sm items-center space-x-2 my-1">
                            <Input
                                type="text"
                                placeholder="Search or Start Chat"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu className="gap-2">
                        {filteredData.map((item) => (
                            <SidebarMenuItem
                                className={`hover:bg-sidebar-hover transition-colors ${selectedUser === item._id ? "bg-sidebar-selected" : ""
                                    }`}
                                key={item._id}
                                onClick={() => handleUserClick(item)}
                            >
                                <SidebarMenuButton size="lg">
                                    <div className="relative">
                                        <Avatar>
                                            <AvatarImage src={item.profilePhoto} />
                                        </Avatar>
                                        {
                                            onlineUser?.includes(item?._id) && <span class="absolute top-1 left-8 transform -translate-y-1/2 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                                        }
                                    </div>
                                    <div className="flex flex-col gap-0.5 leading-none">
                                        <span className="font-semibold mr-2">{item.fullName}</span>
                                        <span>{item.email}</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
