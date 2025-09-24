import ScheduleTable from "../features/ScheduleTable";
import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints } from "../../utils/appUrls";

export default function schedule() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetch_courts_timeslots() {
      const { resData, resError } = await apiRequest({
        url: apiEndpoints.GET_BOOKING_CELLS,
        method: "get",
      });
      setData(resData);
    }
    fetch_courts_timeslots();
  }, []);

  return (
    <div>
      {data && (
        <ScheduleTable
          courts={data.courts}
          timeslots={data.timeslots}
          bookings={data.bookings}
        />
      )}
    </div>
  );
}
