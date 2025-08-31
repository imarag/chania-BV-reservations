import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints } from "../../utils/appUrls";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function PersonalInfoSettings() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState({
        full_name: "",
        phone_number: "",
    });
    useEffect(() => {
        async function fetch_user_info() {
            const { resData, errorMessage } = await apiRequest({
                url: apiEndpoints.GET_CURRENT_USER,
                method: "get",
            });
            setUserInfo(resData);
        }
        fetch_user_info();
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setUserInfo((prev) => ({ ...prev, [name]: value }));
    }

    return (
        <div className="space-y-4 w-md">
            <div className="flex flex-col gap-2">
                <Label htmlFor="email">full name</Label>
                <Input
                    id="full_name"
                    type="text"
                    name="full_name"
                    value={userInfo.full_name}
                    onChange={handleChange}
                    disabled={loading}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="password">phone number</Label>
                <Input
                    id="phone_number"
                    type="text"
                    name="phone_number"
                    value={userInfo.phone_number}
                    onChange={handleChange}
                    disabled={loading}
                />
            </div>
            <div className="mt-6">
                <Button variant="primary" outline={true}>
                    Update
                </Button>
            </div>
        </div>
    );
}
