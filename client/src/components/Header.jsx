import { useAuth } from '@/app/context/store'
import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Input } from './ui/input'
import { SidebarTrigger } from './ui/sidebar'

export default function Header() {
    const { selectedUser, setSelectedUser, setUserInfo,searchMsg, setSearchMsg, onlineUser, isTyping, messages } = useAuth()
    const router = useRouter();
    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/logout`, {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                setSelectedUser(null);
                setUserInfo(null);
                router.push("/sign-in");
            } else {
                toast.error("Logout failed: " + response.statusText);
            }
        } catch (error) {
            toast.error("Logout failed:" + error.message);
        }
    };
    return (
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 z-50 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            {selectedUser && (
                <div className="flex-1 flex gap-1 my-auto">
                    <div className="relative">
                        <Avatar>
                            <AvatarImage src={selectedUser?.profilePhoto} />
                        </Avatar>
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                        <span className="font-semibold mr-2 text-xl">{selectedUser?.fullName}</span>
                        {
                            onlineUser?.includes(selectedUser?._id) ? (
                                isTyping ? <span>Typing...</span> : <span>Online</span>
                            ) : <span>Offline</span>
                        }
                    </div>
                </div>
            )}
            {
                messages.length > 0 && <Input
                    type="text"
                    placeholder="Search Message..."
                    className=" w-[150px] text-center"
                    value={searchMsg}
                    onChange={(e) => setSearchMsg(e.target.value)}
                />
            }
            <Button onClick={handleLogout}>Logout</Button>
        </header>
    )
}
