import { useAuth } from '@/app/context/store'
import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function Header() {
    const { selectedUser, setSelectedUser, setUserInfo, onlineUser } = useAuth()
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
                            onlineUser?.includes(selectedUser?._id) && <span>Online</span>
                        }
                    </div>
                </div>
            )}
            <Button onClick={handleLogout}>Logout</Button>
        </header>
    )
}
