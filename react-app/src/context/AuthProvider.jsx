import {useEffect, useState} from "react";
import {userDetails} from "../services/api.js";
import {AuthContext} from "./AuthContext.jsx";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const isTokenExpired = checkTokenExpiry(parsedUser.token);
            if (!isTokenExpired) {
                setUser(parsedUser);
            } else {
                logout();
            }
        }
    }, []);

    const logged = async (token) => {
        try {
            const response = await userDetails(token);
            const userData = { ...response.data, token };
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
            console.error("Failed to fetch user details:", error);
            alert("Session expired or invalid token. Please log in again.");
            logout();
        }
    };

    // Logout and clear user data
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    // Check if token is expired (assuming JWT)
    const checkTokenExpiry = (token) => {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const expiry = payload.exp * 1000;
            return Date.now() > expiry;
        } catch (error) {
            console.error("Invalid token:", error);
            return true;
        }
    };

    return (
        <AuthContext.Provider value={{ user, logged, logout }}>
            {children}
        </AuthContext.Provider>
    );
};