import { useState, useEffect, Fragment } from "react";
import { pagePaths } from "../../utils/appUrls";
import { useNavigate } from "react-router";
import { useNotification } from "../../context/NotificationContext";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints } from "../../utils/appUrls";
import { useCurrentUser } from "../../context/CurrentUserContext";
import Collapse from "../ui/Collapse";
import Label from "../ui/Label";

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

function BookedContent({ booking, showInfo }) {
  return (
    <div className="text-sm">
      {showInfo ? (
        <ul className="text-center bg-neutral/80 p-2 rounded-md">
          <li className="font-bold">{booking.booking_user}</li>
          {booking.players.map((player) => (
            <li key={player.id}>{`${player.name} ${player.surname}`}</li>
          ))}
        </ul>
      ) : (
        <ReserveButton booked={true}>
          <span className="">reserved</span>
        </ReserveButton>
      )}
    </div>
  );
}

function NotBookedContent({
  courtId,
  timeslotId,
  label,
  loading,
  setLoading,
  showInfo,
}) {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { currentUser, setCurrentUser } = useCurrentUser();

  async function handleNavigate() {
    setLoading(true);

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
    <div
      className={`size-full text-sm flex items-center justify-center ${
        showInfo && "bg-base-100/70 p-2 rounded-md"
      }`}
    >
      {showInfo ? (
        <p>{label}</p>
      ) : (
        <ReserveButton onClick={handleNavigate} disabled={loading}>
          {label}
        </ReserveButton>
      )}
    </div>
  );
}

function TimeSlotList({
  timeSlots,
  courtId,
  reservations,
  loading,
  setLoading,
  showInfo,
}) {
  return (
    <ul
      className={`flex ${
        showInfo ? "flex-row flex-wrap" : "flex-col"
      } justify-center items-center gap-2 mt-4`}
    >
      {timeSlots.map((ts) => {
        const bookingKey = `${courtId}-${ts.id}`;
        console.log(bookingKey, reservations);
        const booking = reservations[bookingKey] || null;
        return (
          <li key={ts.id} className={`${showInfo ? "size-28" : ""}`}>
            {booking?.booked ? (
              <BookedContent booking={booking} showInfo={showInfo} />
            ) : (
              <NotBookedContent
                courtId={courtId}
                timeslotId={ts.id}
                label={ts.name}
                loading={loading}
                setLoading={setLoading}
                showInfo={showInfo}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function CourtRectangle({
  timeSlots,
  courtId,
  reservations,
  title,
  loading,
  setLoading,
  showInfo,
}) {
  return (
    <div className="p-4 lg:p-4 z-50 bg-white/8 border-4 border-white/50 rounded-md">
      <h2 className="flex-none text-base lg:text-xl uppercase text-center font-bold text-base-content mb-4 ">
        {title}
      </h2>
      <div className="flex lg:hidden">
        <Collapse
          label={"Show timeslots"}
          className={"bg-base-100/0 border-white/20 border-2"}
        >
          <TimeSlotList
            timeSlots={timeSlots}
            courtId={courtId}
            reservations={reservations}
            loading={loading}
            setLoading={setLoading}
            showInfo={showInfo}
          />
        </Collapse>
      </div>
      <div className="hidden lg:flex lg:items-center lg:justify-center">
        <TimeSlotList
          timeSlots={timeSlots}
          courtId={courtId}
          reservations={reservations}
          loading={loading}
          setLoading={setLoading}
          showInfo={showInfo}
        />
      </div>
    </div>
  );
}
{
}
export default function ScheduleTable({ courts, timeSlots, reservations }) {
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="size-full flex flex-col items-stretch">
      <div className="flex-grow-0 flex-shrink-0 p-4">
        <div className="flex items-center gap-2">
          <Label className="flex items-center gap-2">schedule</Label>
          <input
            type="checkbox"
            onClick={() => setShowInfo(!showInfo)}
            className="toggle"
          />
          <Label className="flex items-center gap-2">info</Label>
        </div>
      </div>
      <div className="h-full flex flex-col items-stretch gap-2 lg:gap-8 relative">
        <img
          src="/bv-courts.png"
          className="absolute size-full object-cover brightness-35"
        />
        <div className="flex-grow-1 grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-8">
          <CourtRectangle
            timeSlots={timeSlots}
            courtId={courts.find((court) => court.name === "Court 4").id}
            reservations={reservations}
            title="Court 4"
            loading={loading}
            setLoading={setLoading}
            showInfo={showInfo}
          />
          <CourtRectangle
            timeSlots={timeSlots}
            courtId={courts.find((court) => court.name === "Court 5").id}
            reservations={reservations}
            title="Court 5"
            loading={loading}
            setLoading={setLoading}
            showInfo={showInfo}
          />
        </div>
        <div className="flex-grow-1 grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-8">
          <CourtRectangle
            timeSlots={timeSlots}
            courtId={courts.find((court) => court.name === "Court 3").id}
            reservations={reservations}
            title="Court 3"
            loading={loading}
            setLoading={setLoading}
            showInfo={showInfo}
          />
          <CourtRectangle
            timeSlots={timeSlots}
            courtId={courts.find((court) => court.name === "Court 2").id}
            reservations={reservations}
            title="Court 2"
            loading={loading}
            setLoading={setLoading}
            showInfo={showInfo}
          />
          <CourtRectangle
            timeSlots={timeSlots}
            courtId={courts.find((court) => court.name === "Court 1").id}
            reservations={reservations}
            title="Court 1"
            loading={loading}
            setLoading={setLoading}
            showInfo={showInfo}
          />
        </div>
      </div>
    </div>
  );
}
