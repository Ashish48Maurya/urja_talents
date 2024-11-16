import { useAuth } from '@/app/context/store'
import React, { useState } from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { SidebarTrigger } from './ui/sidebar'
import { FaUserEdit } from 'react-icons/fa'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export default function Header() {
    const { selectedUser, setSelectedUser, setUserInfo, searchMsg,fetchOtherUsers, userInfo, setSearchMsg, onlineUser, isTyping, messages } = useAuth()
    const router = useRouter();
    const [profilePicture, setProfilePicture] = useState(null);
    const [editing, setEditing] = useState(false)
    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        password: '',
        photo:''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePicture(file);
        }
    };

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

    const toggle = () => {
        setFormData({
            email: userInfo.email,
            fullName: userInfo.fullName,
            photo: userInfo?.profilePhoto
        })
        setOpen(!open)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setEditing(true);
            let profilePhotoUrl = "";
            if (profilePicture) {
                const imageFormData = new FormData();
                imageFormData.append("file", profilePicture);
                imageFormData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESETS);

                const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`, {
                    method: "POST",
                    body: imageFormData,
                });

                const cloudinaryData = await cloudinaryRes.json();
                profilePhotoUrl = cloudinaryData.secure_url;
            }
            console.log(profilePhotoUrl);

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/user`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ ...formData, profilePhoto: profilePhotoUrl }),
            });

            const result = await res.json();
            if (result.success) {
                toast.success(result.message || "Profile Updated!");
                setEditing(false)
                setOpen(!open)
                fetchOtherUsers();
            } else {
                toast.error(result.message || "Updation failed.");
            }
        }
        catch (err) {
            toast.error(err.message);
        }
        finally {
            setEditing(false)
        }
    }

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

            {open &&
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click Edit when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-center mb-4">
                            {profilePicture ? (
                                <img
                                    src={URL.createObjectURL(profilePicture)}
                                    alt="Profile Preview"
                                    className="w-20 h-20 rounded-full object-cover"
                                />
                            ) : (
                                <img
                                    src={formData.photo || '/default.png'}
                                    alt="Profile Preview"
                                    className="w-20 h-20 rounded-full object-cover"
                                />
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                type="text"
                                name="fullName"
                                placeholder="Your full name"
                                required
                                value={formData.fullName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="m@example.com"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="profile-picture">Profile Picture</Label>
                            <Input
                                id="profile-picture"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={editing} className="font-bold" onClick={handleSubmit} >{editing ? "Editing Profile..." : "Edit"}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            }

            <Button onClick={toggle}><FaUserEdit /></Button>
            <Button onClick={handleLogout}>Logout</Button>
        </header >
    )
}
