import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints } from "../../utils/appUrls";
import Input from "../ui/Input";
import Collapse from "../ui/Collapse";
import Title from "../ui/Title";
import SubTitle from "../ui/SubTitle";
import Symbol from "../ui/Symbol";
import Loading from "../ui/Loading";
import { LuUserRound } from "react-icons/lu";
import { LuIdCard } from "react-icons/lu";
import { MdAlternateEmail } from "react-icons/md";
import { MdOutlineLocalPhone } from "react-icons/md";
import { LuUser } from "react-icons/lu";
import { LuSearch } from "react-icons/lu";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { BiHome } from "react-icons/bi";

function UserInfoItem({ label, value, IconComponent }) {
  return (
    <div className="p-4 flex items-center gap-4">
      <Symbol IconComponent={IconComponent} className="mb-2" />
      <div>
        <p className="font-semibold">{label}:</p>
        <p className="text-base-content/50">{value || "-"}</p>
      </div>
    </div>
  );
}

function UserInfoLabel({ user }) {
  return (
    <p className="flex items-center gap-2">
      <Symbol IconComponent={LuUserRound} size="small" />
      <span className="ms-4">{user.full_name}</span>
      <span className="text-base-content/50">{user.email}</span>
    </p>
  );
}

function UsersList({ usersData }) {
  return (
    <ul className="space-y-2 bg-base-300 p-8">
      {usersData.map((user) => (
        <li key={user.id}>
          <Collapse
            className={"bg-base-100"}
            label={<UserInfoLabel user={user} />}
          >
            <UserInfoItem
              IconComponent={LuIdCard}
              label="Full Name"
              value={user.full_name}
            />
            <UserInfoItem
              IconComponent={MdAlternateEmail}
              label="Email"
              value={user.email}
            />
            <UserInfoItem
              IconComponent={MdOutlineLocalPhone}
              label="Phone Number"
              value={user.phone_number}
            />
            <UserInfoItem
              IconComponent={LuUser}
              label="User Role"
              value={user.role}
            />
            <UserInfoItem
              IconComponent={BiHome}
              label="Home Address"
              value={user.address}
            />
            <UserInfoItem
              IconComponent={MdOutlineBusinessCenter}
              label="Profession"
              value={user.profession}
            />
            <UserInfoItem
              IconComponent={LiaBirthdayCakeSolid}
              label="Birth Date"
              value={user.date_of_birth}
            />
          </Collapse>
        </li>
      ))}
    </ul>
  );
}

function SearchUserInput({ searchTerm, setSearchTerm }) {
  return (
    <div className="w-lg mx-auto mb-12 flex items-center gap-2 border border-base-content/20 text-base-content/80 rounded-md px-4">
      <label htmlFor="search">
        <Symbol IconComponent={LuSearch} className="text-base-content/50" />
      </label>
      <Input
        type="search"
        placeholder="search users by any detail..."
        id="search"
        className={
          "border-0 outline-0 hover:outline-0 focus:outline-0 bg-base-300"
        }
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}

function NoUsersFound() {
  return (
    <div className="size-full text-center">
      <p>No users found...</p>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetch_all_users() {
      setLoading(true);
      const { resData, errorMessage } = await apiRequest({
        url: apiEndpoints.GET_ALL_USERS,
        method: "get",
      });

      if (errorMessage) {
        setError(errorMessage);
        setLoading(false);
        return;
      }
      setUsers(resData);
      setLoading(false);
    }
    fetch_all_users();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const filteredUsers = users.filter((user) => {
    const termLower = searchTerm.toLowerCase();

    // Check every key/value in the user object
    return Object.values(user).some((value) => {
      if (value === null || value === undefined) return false;
      return value.toString().toLowerCase().includes(termLower);
    });
  });

  return (
    <div>
      <Title className="text-center mb-4">Users Information</Title>
      <SubTitle className="text-center mb-12" variant="page">
        Search across all registered users by any of their details
      </SubTitle>
      <SearchUserInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {filteredUsers.length > 0 ? (
        <UsersList usersData={filteredUsers} />
      ) : (
        <NoUsersFound />
      )}
    </div>
  );
}
