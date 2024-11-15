import React, { useEffect, useRef, useState } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import { IoAddCircle, IoSendSharp } from 'react-icons/io5';
import { useAuth } from '@/app/context/store';
import toast from 'react-hot-toast';

export default function MessageInp({ message, setMessage }) {
    const { selectedUser, setMessages, socket, userInfo } = useAuth();
    const [file, setFile] = useState(null)
    const sendImg = useRef();

    const handleInpClick = () => {
        sendImg.current.click();
    }

    const handleMessageSend = async () => {
        if (file) {
            try {
                let imgMsg = "";
                if (file) {
                    const imageFormData = new FormData();
                    imageFormData.append("file", file);
                    imageFormData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESENT);

                    const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/dzgtgpypu/image/upload", {
                        method: "POST",
                        body: imageFormData,
                    });

                    const cloudinaryData = await cloudinaryRes.json();
                    imgMsg = cloudinaryData.secure_url;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/message?id=${selectedUser?._id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ message:imgMsg }),
                });
                const data = await response.json();
                if (data.success) {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { message: imgMsg, createdAt: new Date() },
                    ]);

                    const messageData = {
                        user: userInfo._id,
                        receiverId: selectedUser?._id,
                        message: imgMsg,
                        createdAt: new Date(),
                    }
                    socket?.emit('sendMessage', messageData);
                } else {
                    toast.error("Message send failed:", data.message);
                }
            } catch (error) {
                toast.error("Error sending message:" + error.message);
            } finally {
                setFile(null);
            }
        }
        else {
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

                    const messageData = {
                        user: userInfo._id,
                        receiverId: selectedUser?._id,
                        message,
                        createdAt: new Date(),
                    }
                    socket?.emit('sendMessage', messageData);

                } else {
                    toast.error("Message send failed:", data.message);
                }
            } catch (error) {
                toast.error("Error sending message:" + error.message);
            } finally {
                setMessage("");
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
        }
    };

    let typingTimer;
    const handleTyping = (e) => {
        setFile(null)
        setMessage(e.target.value);
        clearTimeout(typingTimer);
        if (socket && selectedUser) {
            socket.emit('typing', { userId: userInfo._id, receiverId: selectedUser?._id });
        }
        typingTimer = setTimeout(() => {
            if (socket && selectedUser) {
                socket.emit('stopTyping', { userId: userInfo._id, receiverId: selectedUser?._id });
            }
        }, 1000);
    };

    useEffect(() => {
        return () => clearTimeout(typingTimer);
    }, []);

    return (
        <div className="flex items-center p-2 border-t bg-white sticky bottom-0">
            <Input
                type="text"
                placeholder="Enter Message..."
                value={message}
                onChange={handleTyping}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleMessageSend();
                    }
                }}
            />

            <Input
                ref={sendImg}
                className="hidden"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleMessageSend();
                    }
                }}
            />
            <Button className="mx-1" onClick={handleInpClick}>
                <IoAddCircle className='text-xl' />
            </Button>
            <Button className="mr-1" onClick={handleMessageSend}>
                <IoSendSharp />
            </Button>
        </div>
    )
}
