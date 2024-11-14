"use client"
import { useAuth } from '@/app/context/store'
import React, { useEffect, useRef } from 'react'
import toast from 'react-hot-toast';

export default function Messages() {
    const { messages, selectedUser, userInfo, setMessages } = useAuth();
    const scroll = useRef();
    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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
                    setMessages([]);
                }
            } catch (error) {
                toast.error("Error fetching messages: " + error.message);
            }
        };
        fetchMessages();
    }, [selectedUser]);


    return (
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {messages.length === 0 ? (
                <h1>No Message</h1>
            ) : (
                messages.map((item, index) => (
                    <div ref={scroll} key={index}>
                        <div className={`chat ${item?.user === selectedUser._id ? 'chat-start' : 'chat-end'} m-1`}>
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Profile"
                                        src={
                                            item?.user === selectedUser?._id
                                                ? selectedUser?.profilePhoto || '/default-profile.png'
                                                : userInfo?.profilePhoto || '/default-profile.png'
                                        }
                                    />
                                </div>
                            </div>
                            <div className={`chat-bubble ${item?.user !== selectedUser._id ? 'chat-bubble-success' : ''}`}>{item?.message}</div>
                            <span className="text-xs text-black font-semibold">
                                {new Date(item?.createdAt).toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                })}
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
