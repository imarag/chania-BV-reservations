import Tabs from "../ui/Tabs";
import AdminCourts from "../features/admin/AdminCourts";
import AdminTimeSlots from "../features/admin/AdminTimeSlots";
import AdminUsers from "../features/admin/AdminUsers";
import AdminReservations from "../features/admin/AdminReservations";
import AdminReservationPlayers from "../features/admin/AdminReservationPlayers";

export default function AdminPage() {
    const tabsItems = [
        {
            label: "Courts",
            content: <AdminCourts />,
        },
        {
            label: "Time Slots",
            content: <AdminTimeSlots />,
        },
        {
            label: "Users",
            content: <AdminUsers />,
        },
        {
            label: "Reservations",
            content: <AdminReservations />,
        },
        {
            label: "Reservation Players",
            content: <AdminReservationPlayers />,
        },
    ];
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Admin Page</h1>
            <Tabs tabsItems={tabsItems} />
        </div>
    );
}
