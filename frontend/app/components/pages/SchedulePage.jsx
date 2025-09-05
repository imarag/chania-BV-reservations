import { apiEndpoints } from "../../utils/appUrls";
import { apiRequest } from "../../utils/apiRequest";
import { useEffect, useState } from "react";
import ScheduleTable from "../features/ScheduleTable";

export default function schedule() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetch_courts_timeslots() {
      const { resData, errorMessage } = await apiRequest({
        url: apiEndpoints.GET_BOOKING_CELLS,
        method: "get",
      });
      setData(resData);
    }
    fetch_courts_timeslots();
  }, []);
  return (
    <div>
      <div>
        {data && (
          <ScheduleTable
            courts={data.courts}
            timeslots={data.timeslots}
            bookings={data.bookings}
          />
        )}
      </div>
    </div>
  );
}
