"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from "socket.io-client"
export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [socket, setSocket] = useState(null);
    const [userInfo, setUserInfo] = useState(null)
    const [onlineUser, setOnlineuser] = useState(null)
    const [otherUsers, setOtherUsers] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        {
            message: "",
            date: ""
        }
    ]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/user`, {
                    method: "GET",
                    credentials: "include",
                });
                const result = await response.json();
                if (result.success) {
                    setUserInfo(result.user[0]);
                }
            } catch (error) {
                console.error("Failed to fetch user" + error.message);
            }
        };
        fetchUserInfo();
    }, []);

    useEffect(() => {
        if (userInfo && userInfo._id) {
            const socketInstance = io("http://localhost:8000", {
                query: {
                    userId: userInfo._id
                }
            });
            setSocket(socketInstance);
            socketInstance.on('getOnlineUsers', (onlineUsers) => {
                setOnlineuser(onlineUsers)
            });

            socketInstance.on('receiveMessage', (messageData) => {
                setMessages((prevMessages) => [...prevMessages, messageData]);
            });

            socketInstance.on("userTyping", ({ userId }) => {
                if (selectedUser && selectedUser._id === userId) {
                    setIsTyping(true);
                }
            });

            socketInstance.on("userStoppedTyping", ({ userId }) => {
                if (selectedUser && selectedUser._id === userId) {
                    setIsTyping(false);
                }
            });

            return () => {
                socketInstance.disconnect();
            };
        } else {
            console.log("Waiting for user info...");
        }
    }, [userInfo,selectedUser]);

    const fetchOtherUsers = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/users`, {
                method: "GET",
                credentials: "include",
            });
            const result = await response.json();
            if (result.success) {
                setOtherUsers(result.otherUsers);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    useEffect(() => {
        fetchOtherUsers();
    }, []);

    return (
        <AuthContext.Provider
            value={{ selectedUser, isTyping, onlineUser, socket, fetchOtherUsers, setSelectedUser, messages, otherUsers, setOtherUsers, setMessages, userInfo, setUserInfo }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error('useAuth used outside of the Provider');
    }
    return authContextValue;
};