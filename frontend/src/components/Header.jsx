import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Header = () => {
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/signin");
                    return;
                }
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log("Full token payload:", payload);
                
                setUser({
                    firstName: payload.firstName || payload.username?.split('@')[0] || 'User',
                    lastName: payload.lastName || '',
                    username: payload.username
                });
            } catch (error) {
                console.error("Error fetching user:", error);
                navigate("/signin");
            }
        };
        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/signin");
    };

    const getInitials = (user) => {
        if (!user || !user.firstName) {
            const token = localStorage.getItem("token");
            if (!token) return "";
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.firstName?.[0]?.toUpperCase() || "";
            } catch (error) {
                return "";
            }
        }
        return user.firstName[0].toUpperCase();
    };

    return (
        <div className="shadow h-14 flex justify-between bg-white">
            <div className="flex flex-col justify-center h-full ml-4 text-xl font-bold">
              GooglePay
            </div>
            <div className="flex items-center relative">
                <div className="flex flex-col justify-center h-full mr-4">
                    Hello, {user?.firstName || "User"}
                </div>
                <div 
                    className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2 cursor-pointer"
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    <div className="flex flex-col justify-center h-full text-xl">
                        {getInitials(user)}
                    </div>
                </div>
                {showDropdown && (
                    <div className="absolute right-0 top-14 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <button
                            onClick={() => {
                                setShowDropdown(false);
                                navigate("/profile");
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Profile Settings
                        </button>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};