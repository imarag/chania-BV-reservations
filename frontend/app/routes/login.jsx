import LoginPage from "../components/pages/LoginPage";

export function meta() {
    return [
        { title: "Login - React Router App" },
        {
            name: "description",
            content: "Log in to access your account and manage your data.",
        },
    ];
}

export default function Login() {
    return <LoginPage />;
}
