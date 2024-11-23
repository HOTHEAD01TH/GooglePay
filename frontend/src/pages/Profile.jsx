import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/signin");
                return;
            }
            
            const payload = JSON.parse(atob(token.split('.')[1]));
            setFirstName(payload.firstName || '');
            setLastName(payload.lastName || '');
            setEmail(payload.username || '');
        } catch (error) {
            console.error("Error parsing token:", error);
            navigate("/signin");
        }
    }, [navigate]);

    const handleUpdate = async () => {
        try {
            if (!firstName.trim() || !lastName.trim()) {
                alert("First name and last name are required");
                return;
            }

            const response = await axios.put("http://localhost:3000/api/v1/user", {
                firstName: firstName.trim(),
                lastName: lastName.trim()
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
            navigate("/dashboard");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(error.response?.data?.message || "Failed to update profile");
        }
    };

    return (
        <div className="min-h-screen bg-slate-300 flex justify-center py-8">
            <div className="w-96 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Profile Settings</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            className="w-full px-3 py-2 border rounded-md bg-gray-50"
                            disabled
                            readOnly
                        />
                    </div>
                    <button
                        onClick={handleUpdate}
                        className="w-full bg-green-500 text-white rounded-md py-2 hover:bg-green-600 mb-2"
                    >
                        Update Profile
                    </button>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full bg-gray-500 text-white rounded-md py-2 hover:bg-gray-600"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}; 