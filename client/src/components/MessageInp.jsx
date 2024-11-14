import React from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import { IoSendSharp } from 'react-icons/io5';
import { useAuth } from '@/app/context/store';
import toast from 'react-hot-toast';

export default function MessageInp({ message, setMessage }) {
    const {selectedUser,setMessages} = useAuth();
    
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
        } finally {
            setMessage("");
        }
    };
    return (
        <div className="flex items-center p-2 border-t bg-white sticky bottom-0">
            <Input
                type="text"
                placeholder="Enter Message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleMessageSend();
                    }
                }}
            />
            <Button className="mr-1" onClick={handleMessageSend}>
                <IoSendSharp />
            </Button>
        </div>
    )
}
