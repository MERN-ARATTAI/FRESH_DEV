import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setUser({ token }); // minimal
        }
        setLoading(false);
    }, []);

    const isLoggedIn = () => {
        return !!localStorage.getItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
