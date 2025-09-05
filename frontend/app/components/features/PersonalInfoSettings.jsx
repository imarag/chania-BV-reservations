import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints, pagePaths } from "../../utils/appUrls";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Message from "../utils/Message";

export default function PersonalInfoSettings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
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

  async function handleUpdateData(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { resData, errorMessage } = await apiRequest({
      url: apiEndpoints.UPDATE_USER_INFO.replace(":id", userInfo.id),
      method: "post",
      requestData: userInfo,
    });

    setLoading(false);

    if (errorMessage) {
      setSuccess(null);
      setError(errorMessage);
      return;
    }

    setSuccess("User has been successfully updated");
    setError(null);

    // Clear success after 3 seconds
    setTimeout(() => setSuccess(null), 3000);
  }

  return (
    <form onSubmit={handleUpdateData} className="space-y-4 w-md">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">full name</Label>
        <Input
          id="full_name"
          type="text"
          name="full_name"
          value={userInfo?.full_name || ""}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="phone_number">phone number</Label>
        <Input
          id="phone_number"
          type="text"
          name="phone_number"
          value={userInfo?.phone_number || ""}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="address">home address</Label>
        <Input
          id="address"
          type="text"
          name="address"
          value={userInfo?.address || ""}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">date of birth</Label>
        <Input
          id="date_of_birth"
          type="date"
          name="date_of_birth"
          value={userInfo?.date_of_birth || ""}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">profession</Label>
        <Input
          id="profession"
          type="text"
          name="profession"
          value={userInfo?.profession || ""}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      {error && <Message type="error" message={error} />}
      {success && <Message type="success" message={success} />}
      <div className="mt-6">
        <Button type="submit" variant="primary" outline={true}>
          Update
        </Button>
      </div>
    </form>
  );
}
