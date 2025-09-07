import Tabs from "../ui/Tabs";
import AccountSettings from "../features/AccountSettings";
import PersonalInfoSettings from "../features/PersonalInfoSettings";
import Title from "../ui/Title";
import SubTitle from "../ui/SubTitle";

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
    <div className="p-8 space-y-4">
      <Title className="mb-4">Account Page</Title>
      <SubTitle className="mb-12">
        Configure your account and personal settings
      </SubTitle>
      <Tabs tabsItems={tabsItems} />
    </div>
  );
}
