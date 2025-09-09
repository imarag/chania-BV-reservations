import { Fragment, useState } from "react";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { pagePaths } from "../../utils/appUrls";
import { useNavigate } from "react-router";

function ReserveButton({ children, booked = false, ...rest }) {
  const baseClass = `
    w-40
    rounded-md
    px-4 py-2
    font-bold
    text-white
    transition
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
      disabled={booked}
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

function NotBookedContent({ courtId, timeslotId, currentUser, label }) {
  const navigate = useNavigate();
  function handleNavigate() {
    const path = pagePaths.reserve.path
      .replace(":court_id", courtId)
      .replace(":timeslot_id", timeslotId)
      .replace(":user_id", currentUser?.id);
    navigate(path);
  }

  return (
    <div className="text-sm">
      <ReserveButton onClick={handleNavigate}>{label}</ReserveButton>
    </div>
  );
}

function CourtRectangle({ timeslots, courtId, currentUser, bookings, title }) {
  return (
    <div className="p-8 z-50  bg-white/5 border-4 border-white/40 rounded-md flex flex-col">
      <h2 className="flex-none text-xl uppercase text-center font-bold text-base-content mb-8">
        {title}
      </h2>
      <div className="flex-grow-1 flex flex-col justify-center items-center gap-2">
        {timeslots.map((timeslot) => {
          const bookingKey = `${courtId}-${timeslot.id}`;
          const booking = bookings[bookingKey];
          return (
            <Fragment key={timeslot.id}>
              {booking.booked ? (
                <BookedContent booking={booking} />
              ) : (
                <NotBookedContent
                  courtId={courtId}
                  timeslotId={timeslot.id}
                  currentUser={currentUser}
                  label={timeslot.name}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default function ScheduleTable({ courts, timeslots, bookings }) {
  const { currentUser } = useCurrentUser();

  return (
    <div className="text-center">
      <div className="h-screen relative mx-auto">
        <img
          src="/bv-courts.png"
          className="size-full object-cover brightness-40"
        />
        <div className="absolute inset-0 flex flex-col gap-8 p-8">
          <div className="flex-grow-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CourtRectangle
              timeslots={timeslots}
              courtId={courts.find((court) => court.name === "Court 4").id}
              currentUser={currentUser}
              bookings={bookings}
              title="Court 4"
            />
            <CourtRectangle
              timeslots={timeslots}
              courtId={courts.find((court) => court.name === "Court 5").id}
              currentUser={currentUser}
              bookings={bookings}
              title="Court 5"
            />
          </div>
          <div className="flex-grow-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <CourtRectangle
              timeslots={timeslots}
              courtId={courts.find((court) => court.name === "Court 3").id}
              currentUser={currentUser}
              bookings={bookings}
              title="Court 3"
            />
            <CourtRectangle
              timeslots={timeslots}
              courtId={courts.find((court) => court.name === "Court 2").id}
              currentUser={currentUser}
              bookings={bookings}
              title="Court 2"
            />
            <CourtRectangle
              timeslots={timeslots}
              courtId={courts.find((court) => court.name === "Court 1").id}
              currentUser={currentUser}
              bookings={bookings}
              title="Court 1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
