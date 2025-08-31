import { useEffect, useState } from "react";
import { apiRequest } from "../../../utils/apiRequest";
import { apiEndpoints, pagePaths } from "../../../utils/appUrls";
import Collapse from "../../ui/Collapse";
import Button from "../../ui/Button";

export default function AdminUsers() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [data, setData] = useState(null);

    // Fetch users function
    async function fetchUsers() {
        setLoading(true);
        const { resData, errorMessage } = await apiRequest({
            url: apiEndpoints.GET_ALL_USERS,
            method: "get",
        });
        if (errorMessage) setError(errorMessage);
        else setData(resData);
        setLoading(false);
    }

    // Initial fetch
    useEffect(() => {
        fetchUsers();
    }, []); // empty dependency array → run only once on mount

    async function handleRemoveUser(user_id) {
        const { resData, errorMessage } = await apiRequest({
            url: apiEndpoints.DELETE_USER.replace(":id", user_id),
            method: "get",
        });

        if (!errorMessage) {
            // Refresh the data after deletion
            fetchUsers();
        }
    }

    return (
        <ul className="space-y-4">
            {loading && <p>Loading...</p>}
            {data &&
                data.map((user) => (
                    <li key={user.id} className="space-y-2">
                        <Button
                            variant="error"
                            size="extraSmall"
                            onClick={() => handleRemoveUser(user.id)}
                        >
                            remove user
                        </Button>
                        <Collapse label={user.full_name}>
                            {Object.keys(user).map((key) => (
                                <p key={key}>
                                    <span className="font-semibold">{key}</span>
                                    : {String(user[key])}
                                </p>
                            ))}
                        </Collapse>
                    </li>
                ))}
        </ul>
    );
}
