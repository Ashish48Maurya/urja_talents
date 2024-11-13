"use client"
import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [selectedUser,setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([
        {
          message: "",
          date: ""
        }
      ]);
    return (
        <AuthContext.Provider
            value={{ selectedUser,setSelectedUser,messages, setMessages }}
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