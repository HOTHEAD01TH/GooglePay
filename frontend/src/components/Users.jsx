import { useEffect, useState } from "react"
import { Button } from "./Button"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react"
import debounce from "lodash/debounce"

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");

    const getCurrentUserId = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.userId;
        } catch (error) {
            console.error("Error parsing token:", error);
            return null;
        }
    };

    const debouncedFetch = useCallback(
        debounce(async (filter) => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/v1/user/bulk?filter=${filter}`,
                    {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token")
                        }
                    }
                );
                const currentUserId = getCurrentUserId();
                const filteredUsers = response.data.user.filter(user => 
                    user._id !== currentUserId
                );
                setUsers(filteredUsers)
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }, 500),
        []
    );

    useEffect(() => {
        debouncedFetch(filter)
        return () => debouncedFetch.cancel();
    }, [filter, debouncedFetch])

    return <>
        <div className="font-bold mt-6 text-lg">
            Users
        </div>
        <div className="my-2">
            <input onChange={(e) => {
                setFilter(e.target.value)
            }} type="text" placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200"></input>
        </div>
        <div>
        {users.map(user => <User key={user._id} user={user} />)}
        </div>
    </>
}

function User({user}) {
    const navigate = useNavigate();

    return <div className="flex justify-between">
        <div className="flex">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstName[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center h-ful">
                <div>
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center h-ful">
            <Button onClick={(e) => {
                navigate("/send?id=" + user._id + "&name=" + user.firstName);
            }} label={"Send Money"} />
        </div>
    </div>
}