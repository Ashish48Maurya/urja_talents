"use client"
import { useAuth } from '@/app/context/store'
import Fuse from 'fuse.js';
import Link from 'next/link';
import React, { useEffect, useMemo, useRef } from 'react'
import toast from 'react-hot-toast';

export default function Messages() {
    const { messages, selectedUser, userInfo, setMessages, socket, searchMsg } = useAuth();
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
                    setMessages([]);
                }
            } catch (error) {
                toast.error("Error fetching messages: " + error.message);
            }
        };
        fetchMessages();
    }, [selectedUser]);

    const fuse = useMemo(() => new Fuse(messages, { keys: ["message"], threshold: 0.5 }), [messages]);
    const filteredData = useMemo(() => {
        const trimmedQuery = searchMsg.trim();
        return trimmedQuery && fuse
            ? fuse.search(trimmedQuery).map((result) => result.item)
            : messages;
    }, [searchMsg, fuse]);

    return (
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {messages.length === 0 ? (
                <div className="flex flex-col h-full items-center justify-center text-center mt-10 p-4">
                    <img
                        src={"/message.png" || "/default-image.png"}
                        alt="No messages"
                        className="w-24 h-24 mb-4 opacity-75"
                    />
                    <h2 className="text-lg font-semibold text-gray-600">No messages yet!</h2>
                    <p className="text-gray-500">Start the conversation by sending a message below.</p>
                </div>
            ) : filteredData.length === 0 && searchMsg.trim() ? (
                <div className="flex flex-col h-full items-center justify-center text-center mt-10 p-4">
                    <img
                        src={"/message.png" || "/default-image.png"}
                        alt="No results"
                        className="w-24 h-24 mb-4 opacity-75"
                    />
                    <h2 className="text-lg font-semibold text-gray-600">No matching messages found</h2>
                    <p className="text-gray-500">Try searching with different keywords.</p>
                </div>
            ) : (
                filteredData.map((item, index) => (
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
                            {
                                item?.message?.startsWith("https://")

                                    ? <Link href={item.message || "/default-profile.png"} target='_blank' className="block m-0 p-0 w-1/4">
                                        <img
                                            src={item.message || "/default-profile.png"}
                                            alt="img"
                                            className="w-full rounded-lg"
                                        />
                                    </Link>
                                    : <div className={`chat-bubble ${item?.user !== selectedUser._id ? 'chat-bubble-success' : ''}`}>{item?.message}</div>
                            }

                            <span className="text-xs text-black font-semibold">
                                {new Date(item?.createdAt).toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                })}
                            </span>
                            {/* {
                                item?.user === userInfo._id && <span>{item?.seen ? 'Seen' : 'Unseen'}</span>
                            } */}
                        </div>

                    </div>
                ))
            )}
        </div>
    )
}
