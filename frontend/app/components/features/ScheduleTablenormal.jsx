import Button from "../ui/Button";
import Anchor from "../ui/Anchor";
import Symbol from "../ui/Symbol";
import { GiTennisCourt } from "react-icons/gi";
import { IoMdTime } from "react-icons/io";
import Collapse from "../ui/Collapse";
import { useContext } from "react";
import { currentUserContext } from "../../context/currentUserContext.js";
import { useState } from "react";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints, pagePaths } from "../../utils/appUrls";

function ScheduleColumn({ courts }) {
    const headerClass = "font-bold bg-base-300 border border-base-100";
    const headerLabelClass =
        "flex items-center justify-center gap-2 text-base-content/50";
    return (
        <thead>
            <tr>
                <th className={headerClass}></th>
                {courts.map((court) => (
                    <th className={headerClass} key={`${court.id}`}>
                        <span className={headerLabelClass}>
                            <Symbol IconComponent={GiTennisCourt} />
                            {court.name}
                        </span>
                    </th>
                ))}
            </tr>
        </thead>
    );
}

function BookedContent({ booking }) {
    return (
        <div className="text-sm space-y-4">
            <p>
                Booked by{" "}
                <span className="font-semibold">{booking.booking_user}</span>
            </p>
            <Collapse
                label="Players"
                collapseIcon="plus"
                className="font-light bg-transparent"
            >
                <ul className="space-y-1">
                    {booking.players.map((player) => (
                        <li key={player.id}>{player.full_name}</li>
                    ))}
                </ul>
            </Collapse>
        </div>
    );
}

function NotBookedContent({ courtId, timeslotId, currentUser }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function hanldeReserveCourt(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        console.log({
            court_id: courtId,
            timeslot_id: timeslotId,
            user_id: currentUser.id,
        });
        return;
        const { resData, errorMessage } = await apiRequest({
            url: apiEndpoints.CREATE_RESERVATION,
            method: "post",
            requestData: {
                court_id: courtId,
                timeslot_id: timeslotId,
                user_id: currentUser.id,
            },
        });

        setLoading(false);

        if (errorMessage) {
            setError(errorMessage);
            return;
        }
    }
    return (
        <div className="text-sm">
            <p>Book this court</p>
            <Anchor
                type="button"
                variant="ghost"
                className="font-bold"
                href={pagePaths.reserve.path
                    .replace(":court_id", courtId)
                    .replace(":timeslot_id", timeslotId)
                    .replace(":user_id", currentUser.id)}
            >
                Reserve
            </Anchor>
        </div>
    );
}

function ReservationCell({
    booking,
    courtId,
    timeslotId,
    cellKey,
    currentUser,
}) {
    const cellClass =
        "w-40 h-56 border border-base-content/5 px-4 py-2 text-base-content/80";
    return (
        <td
            className={`${cellClass} ${booking.booked ? "bg-error/80" : "bg-base-200"}`}
            key={cellKey}
        >
            <div className={"space-y-2 text-center"}>
                {booking.booked ? (
                    <BookedContent booking={booking} />
                ) : (
                    <NotBookedContent
                        courtId={courtId}
                        timeslotId={timeslotId}
                        currentUser={currentUser}
                    />
                )}
            </div>
        </td>
    );
}

function ScheduleIndex({ timeslot }) {
    const headerClass = "font-bold bg-base-300  border border-base-100";
    const headerLabelClass =
        "flex flex-col items-center justify-center gap-2 text-base-content/50 ";
    return (
        <td className={`w-20 ${headerClass}`}>
            <span className={headerLabelClass}>
                <Symbol IconComponent={IoMdTime} />
                {timeslot.name}
            </span>
        </td>
    );
}

function ScheduleBody({ timeslots, courts, bookings, currentUser }) {
    return (
        <tbody>
            {timeslots.map((timeslot, ind) => (
                <tr key={timeslot.id}>
                    <ScheduleIndex timeslot={timeslot} />
                    {courts.map((court) => {
                        const bookingKey = `${court.id}-${timeslot.id}`;
                        const booking = bookings[bookingKey];
                        return (
                            <ReservationCell
                                booking={booking}
                                courtId={court.id}
                                timeslotId={timeslot.id}
                                cellKey={bookingKey}
                                currentUser={currentUser}
                            />
                        );
                    })}
                </tr>
            ))}
        </tbody>
    );
}

export default function ScheduleTable({ courts, timeslots, bookings }) {
    const currentUser = useContext(currentUserContext);
    const tableClass = "table text-base-content/80";
    return (
        <table className={tableClass}>
            <ScheduleColumn courts={courts} />
            <ScheduleBody
                timeslots={timeslots}
                courts={courts}
                bookings={bookings}
                currentUser={currentUser}
            />
        </table>
    );
}
