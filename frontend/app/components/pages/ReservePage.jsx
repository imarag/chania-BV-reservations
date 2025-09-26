import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints } from "../../utils/appUrls";
import Input from "../ui/Input";
import Title from "../ui/Title";
import Button from "../ui/Button";
import SubTitle from "../ui/SubTitle";
import Symbol from "../ui/Symbol";
import { LuSearch } from "react-icons/lu";
import { pagePaths } from "../../utils/appUrls";

function AvailableUsersList({ availableUsers, handleUserClicked }) {
  return (
    <ul className="space-y-2">
      {availableUsers.map((user) => (
        <li key={user.id}>
          <Button
            onClick={() => handleUserClicked(user.id)}
            size="small"
            className={"w-full"}
          >
            {`${user.name} ${user.surname}`}
          </Button>
        </li>
      ))}
    </ul>
  );
}

function SelectedUsersList({ selectedUsers, handleUserClicked }) {
  return (
    <ul className="space-y-2 overflow-y-scroll">
      {selectedUsers.map((user) => (
        <li key={user.id}>
          <Button
            variant="secondary"
            onClick={() => handleUserClicked(user.id)}
            size="small"
            className={"w-full"}
          >
            {`${user.name} ${user.surname}`}
          </Button>
        </li>
      ))}
    </ul>
  );
}

function SearchUserInput({ searchTerm, setSearchTerm }) {
  return (
    <div className="mx-auto mb-12 flex items-center gap-2 border border-base-content/20 text-base-content/80 rounded-md px-4 bg-base-100">
      <label htmlFor="search">
        <Symbol IconComponent={LuSearch} className="text-base-content/50" />
      </label>
      <Input
        type="search"
        placeholder="search players..."
        id="search"
        className={"border-0 outline-0 hover:outline-0 focus:outline-0"}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}

function LeftPanel({ users, setUsers }) {
  function handleUserClicked(userId) {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, available: !user.available } : user
      )
    );
  }

  const selectedUsers = users.filter((user) => !user.available);
  return (
    <div className="border border-base-content/5 p-8 rounded-md min-h-96 h-[75vh]">
      <SelectedUsersList
        selectedUsers={selectedUsers}
        handleUserClicked={handleUserClicked}
      />
    </div>
  );
}

function RightPanel({ users, setUsers }) {
  const [searchTerm, setSearchTerm] = useState("");

  const availableUsers = users.filter((user) => user.available);
  const filteredUsers = availableUsers.filter((user) => {
    const termLower = searchTerm.toLowerCase();

    return Object.values(user).some((value) => {
      if (value === null || value === undefined) return false;
      return value.toString().toLowerCase().includes(termLower);
    });
  });

  function handleUserClicked(userId) {
    if (availableUsers.length <= users.length - 3) {
      return;
    }
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, available: !user.available } : user
      )
    );
  }

  return (
    <div className="border border-base-content/5 p-8 rounded-md flex flex-col min-h-96 h-[75vh]">
      <div className="flex-none">
        <SearchUserInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <div className="flex-grow-1 overflow-scroll">
        {filteredUsers.length > 0 ? (
          <AvailableUsersList
            availableUsers={filteredUsers}
            handleUserClicked={handleUserClicked}
          />
        ) : (
          <p>No players found...</p>
        )}
      </div>
    </div>
  );
}

function PlayersPanel({ courtId, timeslotId, userId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch_all_users() {
      const { resData, resError } = await apiRequest({
        url: apiEndpoints.GET_ALL_USERS,
        method: "get",
      });
      setUsers(
        resData.map((user) => {
          user["available"] = true;
          return user;
        })
      );
    }
    fetch_all_users();
  }, []);

  async function createReservation(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const requestData = {
      reservation: {
        court_id: courtId,
        timeslot_id: timeslotId,
        user_id: userId,
      },
      reservation_users: users
        .filter((user) => !user.available)
        .map((user) => user.id),
    };

    const { resData, resError } = await apiRequest({
      url: apiEndpoints.CREATE_RESERVATION,
      method: "post",
      requestData: requestData,
    });

    setLoading(false);

    if (resError) {
      setError(resError);
      return;
    }

    window.location.replace(pagePaths.schedule.path);
  }

  return (
    <>
      <div className="grid grid-cols-2 items-stretch gap-4">
        <LeftPanel users={users} setUsers={setUsers} />
        <RightPanel users={users} setUsers={setUsers} />
      </div>
      <div className="text-center">
        <Button onClick={createReservation} className="mt-8">
          Confirm Reservation
        </Button>
      </div>
    </>
  );
}

export default function ReservePage({ courtId, timeslotId, userId }) {
  return (
    <>
      <Title className="text-center mb-4">Users Information</Title>
      <SubTitle className="text-center mb-8" variant="page">
        Search across all registered users by any of their details
      </SubTitle>
      <PlayersPanel courtId={courtId} timeslotId={timeslotId} userId={userId} />
    </>
  );
}
