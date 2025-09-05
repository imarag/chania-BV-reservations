import Tabs from "../ui/Tabs";
import AccountSettings from "../features/AccountSettings";
import PersonalInfoSettings from "../features/PersonalInfoSettings";

export default function AccountPage() {
  const tabsItems = [
    {
      label: "Accout Settings",
      content: <AccountSettings />,
    },
    {
      label: "Personal Information",
      content: <PersonalInfoSettings />,
    },
  ];
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Account Page</h1>
      <Tabs tabsItems={tabsItems} />
    </div>
  );
}
