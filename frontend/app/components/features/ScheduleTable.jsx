import Button from "../ui/Button";
import Symbol from "../ui/Symbol";
import { GiTennisCourt } from "react-icons/gi";
import { IoMdTime } from "react-icons/io";
import Collapse from "../ui/Collapse";

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

function NotBookedContent() {
    return (
        <div className="text-sm">
            <p>Book this court</p>
            <Button variant="ghost" className="font-bold">
                Reserve
            </Button>
        </div>
    );
}

function ReservationCell({ booking, cellKey }) {
    const cellClass =
        "w-40 h-56 border border-base-content/5 px-4 py-2 text-base-content/80";
    return (
        <td className={`${cellClass} ${booking.booked ? "bg-error/80" : "bg-base-200"}`} key={cellKey}>
            <div className={"space-y-2 text-center"}>
                {booking.booked ? (
                    <BookedContent booking={booking} />
                ) : (
                    <NotBookedContent />
                )}
            </div>
        </td>
    );
}

function ScheduleIndex({ timeslot }) {
    const headerClass =
        "font-bold bg-base-300  border border-base-100";
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

function ScheduleBody({ timeslots, courts, bookings }) {
    return (
        <tbody>
            {timeslots.map((timeslot, ind) => (
                <tr
                    key={timeslot.id}
                >
                    <ScheduleIndex timeslot={timeslot} />
                    {courts.map((court) => {
                        const booking = bookings[`${court.id}-${timeslot.id}`];
                        return (
                            <ReservationCell
                                booking={booking}
                                cellKey={`${court.id}-${timeslot.id}`}
                            />
                        );
                    })}
                </tr>
            ))}
        </tbody>
    );
}

export default function ScheduleTable({ courts, timeslots, bookings }) {
    const tableClass = "table text-base-content/80";
    return (
        <table className={tableClass}>
            <ScheduleColumn courts={courts} />
            <ScheduleBody
                timeslots={timeslots}
                courts={courts}
                bookings={bookings}
            />
        </table>
    );
}
