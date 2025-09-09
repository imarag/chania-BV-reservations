import { useState } from "react";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Anchor from "../ui/Anchor";
import FormContainer from "../utils/FormContainer";
import { apiEndpoints, pagePaths } from "../../utils/appUrls";
import { apiRequest } from "../../utils/apiRequest";
import Message from "../utils/Message";
import { useNavigate } from "react-router";
import { saveToken } from "../../utils/authentication";
import { useCurrentUser } from "../../context/CurrentUserContext";

export default function LoginPage() {
  const { refreshUser } = useCurrentUser();
  const navigate = useNavigate();
  const [formInfo, setFormInfo] = useState({
    email: "",
    password: "",
    stay_logged_in: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setFormInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { resData, resError } = await apiRequest({
      url: apiEndpoints.LOGIN_USER,
      method: "post",
      requestData: formInfo,
    });

    setLoading(false);

    if (resError) {
      setError(resError);
      return;
    }

    if (resData.token) {
      saveToken(
        resData.token.access_token,
        formInfo.stay_logged_in ? "local" : "session"
      );
    }
    refreshUser();
    window.location.replace(pagePaths.home.path);
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <FormContainer
        title="Sign In to Your Account"
        handleFormSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={formInfo.email}
            onChange={handleChange}
            disabled={loading}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            value={formInfo.password}
            onChange={handleChange}
            disabled={loading}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            size="small"
            type="checkbox"
            id="stay_logged_in"
            name="stay_logged_in"
            checked={formInfo.stay_logged_in}
            onChange={handleChange}
          />
          <Label htmlFor="stay_logged_in">stay logged in</Label>
        </div>
        {error && <Message type="error" message={error} />}
        <p className="text-center text-sm flex flex-col md:flex-row items-center justify-center gap-2">
          <span>Don't have an account?</span>{" "}
          <Anchor href={pagePaths.register.path}>Register now!</Anchor>
        </p>
      </FormContainer>
    </div>
  );
}
