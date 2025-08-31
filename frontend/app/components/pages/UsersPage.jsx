import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints } from "../../utils/appUrls";
import Input from "../ui/Input";
import Collapse from "../ui/Collapse";
import Title from "../ui/Title";
import SubTitle from "../ui/SubTitle";
import Symbol from "../ui/Symbol";

import { LuIdCard } from "react-icons/lu";
import { MdAlternateEmail } from "react-icons/md";
import { MdOutlineLocalPhone } from "react-icons/md";
import { LuUser } from "react-icons/lu";
import { LuSearch } from "react-icons/lu";

function UserInfoItem({ label, value, IconComponent }) {
    return (
        <div className="p-4 flex items-center gap-4">
            <Symbol IconComponent={IconComponent} className="mb-2" />
            <div>
                <p className="font-semibold">{label}:</p>
                <p className="text-base-content/70">{value}</p>
            </div>
        </div>
    );
}

function UsersList({ usersData }) {
    return (
        <ul className="space-y-2">
            {usersData.map((user) => (
                <li key={user.id}>
                    <Collapse label={user.full_name}>
                        <UserInfoItem
                            IconComponent={LuIdCard}
                            label="Full Name"
                            value={user.full_name}
                        />
                        <UserInfoItem
                            IconComponent={MdAlternateEmail}
                            label="Email"
                            value={user.email}
                        />
                        <UserInfoItem
                            IconComponent={MdOutlineLocalPhone}
                            label="Phone Number"
                            value={user.phone_number}
                        />
                        <UserInfoItem
                            IconComponent={LuUser}
                            label="User Role"
                            value={user.role}
                        />
                    </Collapse>
                </li>
            ))}
        </ul>
    );
}

function SearchUserInput({ searchTerm, setSearchTerm }) {
    return (
        <div className="w-lg mx-auto mb-12 flex items-center gap-2 border border-base-content/20 text-base-content/80 rounded-md px-4">
            <Symbol IconComponent={LuSearch} className="text-base-content/50" />
            <Input
                type="search"
                className={"border-0 outline-0 hover:outline-0 focus:outline-0"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
}

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        async function fetch_all_users() {
            const { resData, errorMessage } = await apiRequest({
                url: apiEndpoints.GET_ALL_USERS,
                method: "get",
            });
            setUsers(resData);
        }
        fetch_all_users();
    }, []);

    const filteredUsers = users.filter((user) => {
        const termLower = searchTerm.toLowerCase();

        // Check every key/value in the user object
        return Object.values(user).some((value) => {
            if (value === null || value === undefined) return false;
            return value.toString().toLowerCase().includes(termLower);
        });
    });

    return (
        <div>
            <Title className="text-center mb-4">Users Information</Title>
            <SubTitle className="text-center mb-8" variant="page">
                Search across all registered users by any of their details
            </SubTitle>
            <SearchUserInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
            {filteredUsers ? (
                <UsersList usersData={filteredUsers} />
            ) : (
                <p>Loading players...</p>
            )}
        </div>
    );
}
