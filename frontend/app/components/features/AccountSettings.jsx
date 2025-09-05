import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints } from "../../utils/appUrls";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function AccountSettings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
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
        <Label htmlFor="email">email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          value={userInfo?.email || ""}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">current password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          value={userInfo?.password || ""}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">confirm password</Label>
        <Input
          id="password_confirm"
          type="password"
          name="password_confirm"
          value={userInfo?.password_confirm || ""}
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
