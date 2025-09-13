import { useState, useEffect, useMemo } from "react";
import { apiEndpoints } from "../../utils/appUrls";
import { apiRequest } from "../../utils/apiRequest";
import Input from "../ui/Input";
import Collapse from "../ui/Collapse";
import Title from "../ui/Title";
import SubTitle from "../ui/SubTitle";
import Symbol from "../ui/Symbol";
import Loading from "../ui/Loading";
import { LuUserRound, LuUser, LuSearch } from "react-icons/lu";
import { LuIdCard } from "react-icons/lu";
import { waitSec } from "../../utils/fetch-tools";
import {
  MdAlternateEmail,
  MdOutlineLocalPhone,
  MdOutlineBusinessCenter,
} from "react-icons/md";
import { BiHome } from "react-icons/bi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import FetchErrorMessage from "../utils/FetchErrorMessage";

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

function UsersList({ users }) {
  if (users.length === 0) {
    return <NoUsersFound />;
  }

  return (
    <div className="p-8 space-y-4">
      <p className="text-end">{`${users.length} user${users.length > 1 ? "s" : ""} found`}</p>
      <ul className="space-y-2 bg-base-300">
        {users.map((user) => (
          <li key={user.id}>
            <Collapse
              className="bg-base-100"
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
    </div>
  );
}

function SearchUserInput({ searchTerm, setSearchTerm, disabled }) {
  return (
    <div className="w-lg mx-auto mb-12 flex items-center gap-2 border border-base-content/20 text-base-content/80 rounded-md px-4">
      <label htmlFor="search">
        <Symbol IconComponent={LuSearch} className="text-base-content/50" />
      </label>
      <Input
        type="search"
        placeholder="search users by any detail..."
        id="search"
        className="border-0 outline-0 hover:outline-0 focus:outline-0 bg-base-300 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}

function NoUsersFound() {
  return (
    <div className="size-full text-center">
      <p>No users found. Try a different search term.</p>
    </div>
  );
}

function MainBody() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchUsers(mounted) {
    await waitSec(3);

    setLoading(true);

    const { resData, resError, canceled } = await apiRequest({
      url: apiEndpoints.GET_ALL_USERS,
    });

    if (!mounted) return;

    setLoading(false);

    if (resError) {
      setError(resError);
      setUsers([]);
      return;
    }

    setError(null);
    setUsers(Array.isArray(resData) ? resData : []);
  }

  useEffect(() => {
    let mounted = true;
    fetchUsers(mounted);
    return () => (mounted = false);
  }, []);

  const filteredUsers = useMemo(() => {
    if (!users?.length) return [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) =>
      Object.values(user).some(
        (v) => v != null && v.toString().toLowerCase().includes(term)
      )
    );
  }, [users, searchTerm]);

  function handleRetry() {
    return apiRequest({
      url: apiEndpoints.GET_ALL_USERS,
    });
  }

  if (error) {
    return (
      <FetchErrorMessage
        errorMessage={`Cannot get users: ${error}`}
        fetchFunc={handleRetry}
        setData={setUsers}
        setError={setError}
      />
    );
  }

  return (
    <>
      <SearchUserInput
        disabled={loading || users.length === 0}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      {loading ? <Loading /> : <UsersList users={filteredUsers} />}
    </>
  );
}

export default function UsersPage() {
  return (
    <div>
      <Title className="text-center mb-4">Users Information</Title>
      <SubTitle className="text-center mb-12" variant="page">
        Search across all registered users by any of their details
      </SubTitle>
      <MainBody />
    </div>
  );
}
