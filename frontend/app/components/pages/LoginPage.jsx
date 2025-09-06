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

export default function LoginPage() {
  const navigate = useNavigate();
  const [formInfo, setFormInfo] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormInfo((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { resData, errorMessage } = await apiRequest({
      url: apiEndpoints.LOGIN_USER,
      method: "post",
      requestData: formInfo,
    });

    setLoading(false);

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    if (resData.token) {
      saveToken(resData.token.access_token);
    }
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
          />
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
