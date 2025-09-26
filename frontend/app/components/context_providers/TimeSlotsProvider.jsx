import { useState, useEffect } from "react";
import { TimeSlotsContext } from "../../context/TimeSlotsContext";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints } from "../../utils/appUrls";

// Exported function
export async function fetchTimeSlots() {
  const { resData, resError } = await apiRequest({
    url: apiEndpoints.GET_ALL_TIMESLOTS,
  });
  if (resError) {
    throw new Error(resError);
  }
  return resData;
}

export default function TimeSlotsProvider({ children }) {
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetchTimeSlots().then((data) => {
      if (mounted) setTimeSlots(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <TimeSlotsContext.Provider value={{ timeSlots, setTimeSlots }}>
      {children}
    </TimeSlotsContext.Provider>
  );
}
