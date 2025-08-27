import RegisterPage from "../components/pages/RegisterPage";

export function meta() {
    return [
        { title: "Register - React Router App" },
        {
            name: "description",
            content:
                "Create an account to access your data and manage your preferences.",
        },
    ];
}

export default function Register() {
    return <RegisterPage />;
}
