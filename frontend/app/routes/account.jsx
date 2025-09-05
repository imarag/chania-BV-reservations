import AccountPage from "../components/pages/AccountPage";
import ProtectedPage from "../components/utils/ProtectedPage";
export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Account() {
  return (
    <ProtectedPage>
      <AccountPage />
    </ProtectedPage>
  );
}
