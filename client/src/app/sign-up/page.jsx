"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export const containerClassName = "w-full h-screen flex items-center justify-center px-4";

export default function Signup() {
    const [profilePicture, setProfilePicture] = useState(null);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        fullName: "",
    });

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePicture(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Step 1: Upload image to Cloudinary
            let profilePhotoUrl = "";
            if (profilePicture) {
                const imageFormData = new FormData();
                imageFormData.append("file", profilePicture);
                imageFormData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESENT); 

                const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/dzgtgpypu/image/upload", {
                    method: "POST",
                    body: imageFormData,
                });

                const cloudinaryData = await cloudinaryRes.json();
                profilePhotoUrl = cloudinaryData.secure_url;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, profilePhoto: profilePhotoUrl }),
            });

            const result = await res.json();
            if (result.success) {
                toast.success(result.message || "Registration successful!");
                router.push('/sign-in')
            } else {
                toast.error(result.message || "Registration failed.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("An error occurred during registration.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={containerClassName}>
            <Card className="max-w-sm w-full mx-4">
                <CardHeader>
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription>Create an account by filling in your details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="flex justify-center mb-4">
                            {profilePicture ? (
                                <img
                                    src={URL.createObjectURL(profilePicture)}
                                    alt="Profile Preview"
                                    className="w-20 h-20 rounded-full object-cover"
                                />
                            ) : (
                                <FaUserCircle className="text-gray-500 w-20 h-20" />
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
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Signing up..." : "Sign Up"}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="underline">
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
