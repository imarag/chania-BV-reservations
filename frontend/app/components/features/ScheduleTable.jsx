import Button from "../ui/Button";
import Symbol from "../ui/Symbol";
import { GiTennisCourt } from "react-icons/gi";
import { IoMdTime } from "react-icons/io";

function ScheduleColumn({ courts }) {
    const headerClass = "font-bold";
    const headerLabelClass =
        "flex items-center justify-center gap-2 text-base-content/50";
    return (
        <thead>
            <tr>
                <th></th>
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
        <>
            <p className="font-bold">{booking.booking_user}</p>
            <hr className="border border-t border-base-content/5" />
            <p className="font-bold">Players</p>
            <ul className="space-y-1">
                {booking.players.map((player) => (
                    <li key={player.id}>{player.full_name}</li>
                ))}
            </ul>
        </>
    );
}

function NotBookedContent() {
    return (
        <>
            <p>Book this court</p>
            <Button size="small" outline={true} variant="primary">
                Book
            </Button>
        </>
    );
}

function ReservationCell({ booking, cellKey }) {
    const cellClass =
        "h-56 border border-base-content/5 px-4 py-2 text-base-content/80";
    return (
        <td className={cellClass} key={cellKey}>
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
    const headerClass = "font-bold";
    const headerLabelClass =
        "flex flex-col items-center justify-center gap-2 text-base-content/50";
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
                <tr key={timeslot.id}>
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
