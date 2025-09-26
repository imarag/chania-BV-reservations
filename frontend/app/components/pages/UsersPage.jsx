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
import DataFetchRetry from "../utils/DataFetchRetry";
import { getIcon } from "../../utils/iconMap";

function UserInfoItem({ label, value, IconComponent }) {
  return (
    <div className="p-4 flex items-center gap-4">
      <Symbol IconComponent={IconComponent} />
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
      <span className="ms-4">{`${user.name} ${user.surnmae}`}</span>
      <span className="text-base-content/50">{user.email}</span>
    </p>
  );
}

function UsersList({ users }) {
  if (users.length === 0) {
    return <NoUsersFound />;
  }

  // items to exclude showing in the UI
  const userInfoItemsExclude = ["id", "active", "role"];

  return (
    <div className="p-8 space-y-4">
      <p className="text-end text-sm">{`${users.length} user${
        users.length > 1 ? "s" : ""
      } found`}</p>
      <ul className="space-y-2 bg-base-300">
        {users.map((user) => (
          <li key={user.id}>
            <Collapse
              className="bg-base-100 border border-white/20"
              label={<UserInfoLabel user={user} />}
            >
              {Object.keys(user)
                .filter((key) => !userInfoItemsExclude.includes(key))
                .map((key) => (
                  <UserInfoItem
                    IconComponent={getIcon(key)}
                    label={key}
                    value={String(user[key])}
                  />
                ))}
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

  useEffect(() => {
    let mounted = true;
    async function fetchUsers() {
      setLoading(true);

      const { resData, resError } = await apiRequest({
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
    fetchUsers();
    return () => (mounted = false);
  }, []);

  async function handleRetry() {
    try {
      const { resData, resError } = await apiRequest({
        url: apiEndpoints.GET_ALL_USERS,
      });
      if (resError) {
        setUsers([]);
        setError(resError);
      } else {
        setUsers(Array.isArray(resData) ? resData : []);
        setError(null);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch users.");
      setUsers([]);
    }
  }

  if (error) {
    return (
      <DataFetchRetry
        errorMessage={`Cannot get the users. Try again!`}
        retryFetchDataFunc={handleRetry}
      />
    );
  }

  const searchTermEdited = searchTerm.trim().toLowerCase();
  const usersArrayInvalid = !Array.isArray(users) || users.length === 0;
  const searchTermEmpty = searchTermEdited === "";

  const filteredUsers = usersArrayInvalid
    ? []
    : searchTermEmpty
    ? users
    : users.filter((user) =>
        Object.values(user).some(
          (v) =>
            v != null &&
            String(v).toLowerCase().trim().includes(searchTermEdited)
        )
      );

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
    <>
      <Title className="text-center mb-4 mt-12" variant="page">
        Users Information
      </Title>
      <SubTitle className="text-center mb-12" variant="page">
        Search across all registered users by any of their details
      </SubTitle>
      <MainBody />
    </>
  );
}
