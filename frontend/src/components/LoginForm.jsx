import { useForm } from "@hooks/useForm";
import Input from "@react-components/Input";
import Label from "@react-components/Label";
import FormContainer from "@react-components/FormContainer";
import { AppUrls } from "@utils/enumerators";

export default function LoginForm() {
    const {
        formInfo,
        handleChange,
        handleSubmit,
        error,
        success,
        loading
    } = useForm({ email: "giannis.marar@hotmail.com", password: "123456" }, AppUrls.LoginAPI, AppUrls.HomePage);

    return (
        <div className="h-screen flex items-center justify-center">
            <FormContainer title="Sign In" error={error} success={success} handleSubmit={handleSubmit} loading={loading}>
                <>
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
                    <p className="text-center text-sm flex flex-col md:flex-row items-center justify-center gap-2"><span>Don't have an account ?</span> <a className="underline text-blue-900" href="/auth/register">Register now!</a></p>
                </>
            </FormContainer>
        </div>
    );
}
