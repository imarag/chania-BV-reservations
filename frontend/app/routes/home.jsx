import HomePage from "../components/pages/HomePage";
export function meta() {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Home() {
    return <HomePage />;
}
