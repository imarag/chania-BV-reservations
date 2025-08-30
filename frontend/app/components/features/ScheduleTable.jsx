import Button from "../ui/Button";
import Symbol from "../ui/Symbol";
import { GiTennisCourt } from "react-icons/gi";
import { IoMdTime } from "react-icons/io";

export default function ScheduleTable({ courts, timeslots, bookings }) {
    const headerClass = "font-bold";
    const cellClass = "h-56 border border-base-content/5 px-4 py-2 text-base-content/80";
    return (
        <table className={`table text-base-content/80`}>
            <thead>
                <tr>
                    <th></th>
                    {courts.map((court) => (
                        <th className={`${headerClass}`} key={`${court.id}`}>
                            <span className="flex items-center justify-center gap-2 text-base-content/50">
                                <Symbol IconComponent={GiTennisCourt} />
                                {court.name}
                            </span>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {timeslots.map((timeslot, ind) => (
                    <tr key={timeslot.id}>
                        <td className={`w-20 ${headerClass}`}>
                            <span
                                className={
                                    "flex flex-col items-center justify-center gap-2 text-base-content/50"
                                }
                            >
                                <Symbol IconComponent={IoMdTime} />
                                {timeslot.name}
                            </span>
                        </td>
                        {courts.map((court) => {
                            const booking =
                                bookings[`${court.id}-${timeslot.id}`];
                            return (
                                <td className={cellClass} key={court.id}>
                                    <div className={"space-y-2 text-center"}>
                                        {booking.booked ? (
                                            <>
                                                <p className="font-bold">
                                                    {booking.booking_user}
                                                </p>
                                                <hr className="border border-t border-base-content/5" />
                                                <p className="font-bold">
                                                    Players
                                                </p>
                                                <ul className="space-y-1">
                                                    {booking.players.map(
                                                        (player) => (
                                                            <li key={player.id}>
                                                                {
                                                                    player.username
                                                                }
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </>
                                        ) : (
                                            <>
                                                <p>Book this court</p>
                                                <Button
                                                    size="small"
                                                    outline={true}
                                                    variant="primary"
                                                >
                                                    Book
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
