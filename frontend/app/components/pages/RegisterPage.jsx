import { useState } from "react";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Anchor from "../ui/Anchor";
import FormContainer from "../utils/FormContainer";
import { apiEndpoints, pagePaths } from "../../utils/appUrls";
import { apiRequest } from "../../utils/apiRequest";
import Message from "../utils/Message";
import { useNavigate } from "react-router";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formInfo, setFormInfo] = useState({
    full_name: "",
    email: "",
    password: "",
    password_confirm: "",
  });
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
      url: apiEndpoints.REGISTER_USER,
      method: "post",
      requestData: formInfo,
    });

    setLoading(false);

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    navigate(pagePaths.login.path);
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <FormContainer
        title="Create Your Account"
        handleFormSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="full_name">full name</Label>
          <Input
            id="full_name"
            type="text"
            name="full_name"
            value={formInfo.full_name}
            onChange={handleChange}
            disabled={loading}
            className="w-full"
          />
        </div>
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
        <div className="flex flex-col gap-2">
          <Label htmlFor="password_confirm">confirm password</Label>
          <Input
            id="password_confirm"
            type="password"
            name="password_confirm"
            value={formInfo["password_confirm"]}
            onChange={handleChange}
            disabled={loading}
            className="w-full"
          />
        </div>
        {error && <Message message={error} />}
        <p className="text-center text-sm flex flex-col md:flex-row items-center justify-center gap-2">
          <span>Already have an account?</span>
          <Anchor href={pagePaths.login.path}>Login now!</Anchor>
        </p>
      </FormContainer>
    </div>
  );
}
