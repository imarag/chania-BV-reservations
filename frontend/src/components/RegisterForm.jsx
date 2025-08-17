import { useForm } from "@hooks/useForm";
import Input from "@react-components/Input";
import FormContainer from "@react-components/FormContainer";
import Label from "@react-components/Label";
import { AppUrls } from "@utils/enumerators";

export default function RegisterForm() {
    const {
        formInfo,
        handleChange,
        handleSubmit,
        error,
        success,
        loading
    } = useForm({ email: "giannis.marar@hotmail.com", password: "123456", "password-confirm": "123456" }, AppUrls.RegisterAPI, AppUrls.LoginPage);

    return (
        <div className="h-screen flex items-center justify-center">
            <FormContainer title="Register" error={error} success={success} handleSubmit={handleSubmit} loading={loading}>
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
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password-confirm">confirm password</Label>
                        <Input
                            id="password-confirm"
                            type="password"
                            name="password-confirm"
                            value={formInfo["password-confirm"]}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>
                    <p className="text-center text-sm flex flex-col md:flex-row items-center justify-center  gap-2"><span>Already have an account ?</span><a className="underline text-blue-900" href="/auth/login">Login now!</a></p>
                </>
            </FormContainer>
        </div>
    );
}
