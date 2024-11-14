"use client"
import { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [userInfo,setUserInfo] = useState(null)
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

    return (
        <AuthContext.Provider
            value={{ selectedUser, setSelectedUser, messages, setMessages,userInfo,setUserInfo }}
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