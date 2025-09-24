import { useState, useEffect, Fragment } from "react";
import { pagePaths } from "../../utils/appUrls";
import { useNavigate } from "react-router";
import { useNotification } from "../../context/NotificationContext";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints } from "../../utils/appUrls";
import { useCurrentUser } from "../../context/CurrentUserContext";
import Collapse from "../ui/Collapse";

function ReserveButton({
  children,
  booked = false,
  disabled = false,
  ...rest
}) {
  const baseClass = `
    w-40
    rounded-md
    px-4 py-2
    font-bold
    text-white
    transition
    disabled:opacity-60
    disabled:cursor-not-allowed
  `;

  const bookedClass = `
    bg-error/70
    cursor-not-allowed
  `;

  const availableClass = `
    bg-black/50
    cursor-pointer
    hover:bg-black
  `;

  return (
    <button
      disabled={booked || disabled}
      className={`${baseClass} ${booked ? bookedClass : availableClass}`}
      {...rest}
    >
      {children}
    </button>
  );
}

function BookedContent({ booking }) {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  return (
    <div className="text-sm">
      <ReserveButton booked={true}>
        <span className="">reserved</span>
      </ReserveButton>
      {showMoreInfo && (
        <div className="absolute rounded-md p-4 bg-base-100/80 text-base-content mt-2 space-y-4">
          <p>
            Booked by <span className="font-bold">{booking.booking_user}</span>{" "}
          </p>
          <ul className="space-y-1">
            {booking.players.map((player) => (
              <li key={player.id}>{player.full_name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function NotBookedContent({ courtId, timeslotId, label, loading, setLoading }) {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { currentUser, setCurrentUser } = useCurrentUser();

  async function handleNavigate() {
    setLoading(true);
    console.log("what");
    const { resData, resError } = await apiRequest({
      url: apiEndpoints.VALIDATE_USER_CREATE_RESERVATION,
    });
    setLoading(false);

    if (resError) {
      showNotification(resError, "error");
      return;
    }

    const queryPath = `court_id=${courtId}&timeslot_id=${timeslotId}&user_id=${currentUser?.id}`;
    navigate(`${pagePaths.reserve.path}?${queryPath}`);
  }

  return (
    <div className="text-sm">
      <ReserveButton onClick={handleNavigate} disabled={loading}>
        {label}
      </ReserveButton>
    </div>
  );
}

function TimeSlotList({ timeslots, courtId, bookings, loading, setLoading }) {
  return (
    <ul className="flex flex-col justify-center items-center gap-2 mt-4">
      {timeslots.map((timeslot) => {
        const bookingKey = `${courtId}-${timeslot.id}`;
        const booking = bookings[bookingKey];
        return (
          <li key={timeslot.id}>
            {booking.booked ? (
              <BookedContent booking={booking} />
            ) : (
              <NotBookedContent
                courtId={courtId}
                timeslotId={timeslot.id}
                label={timeslot.name}
                loading={loading}
                setLoading={setLoading}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function CourtRectangle({
  timeslots,
  courtId,
  bookings,
  title,
  loading,
  setLoading,
}) {
  return (
    <div className="p-4 lg:p-8 z-50 bg-white/8 border-4 border-white/50 rounded-md">
      <h2 className="flex-none text-base lg:text-xl uppercase text-center font-bold text-base-content mb-4 lg:mb-8">
        {title}
      </h2>
      <div className="flex lg:hidden">
        <Collapse
          label={"Show Timeslots"}
          className={"bg-base-100/0 border-white/20 border-2"}
        >
          <TimeSlotList
            timeslots={timeslots}
            courtId={courtId}
            bookings={bookings}
            loading={loading}
            setLoading={setLoading}
          />
        </Collapse>
      </div>
      <div className="hidden lg:flex lg:items-center lg:justify-center">
        <TimeSlotList
          timeslots={timeslots}
          courtId={courtId}
          bookings={bookings}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}
{
}
export default function ScheduleTable({ courts, timeslots, bookings }) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="h-screen flex flex-col items-stretch gap-2 lg:gap-8 relative">
      <img
        src="/bv-courts.png"
        className="absolute size-full object-cover brightness-35"
      />
      <div className="flex-grow-1 grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-8">
        <CourtRectangle
          timeslots={timeslots}
          courtId={courts.find((court) => court.name === "Court 4").id}
          bookings={bookings}
          title="Court 4"
          loading={loading}
          setLoading={setLoading}
        />
        <CourtRectangle
          timeslots={timeslots}
          courtId={courts.find((court) => court.name === "Court 5").id}
          bookings={bookings}
          title="Court 5"
          loading={loading}
          setLoading={setLoading}
        />
      </div>
      <div className="flex-grow-1 grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-8">
        <CourtRectangle
          timeslots={timeslots}
          courtId={courts.find((court) => court.name === "Court 3").id}
          bookings={bookings}
          title="Court 3"
          loading={loading}
          setLoading={setLoading}
        />
        <CourtRectangle
          timeslots={timeslots}
          courtId={courts.find((court) => court.name === "Court 2").id}
          bookings={bookings}
          title="Court 2"
          loading={loading}
          setLoading={setLoading}
        />
        <CourtRectangle
          timeslots={timeslots}
          courtId={courts.find((court) => court.name === "Court 1").id}
          bookings={bookings}
          title="Court 1"
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}
