import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints } from "../../utils/appUrls";
import ScheduleTable from "../features/ScheduleTable";
import DataFetchRetry from "../utils/DataFetchRetry";
import Loading from "../ui/Loading";
import { useCourts } from "../../context/CourtsContext";
import { useTimeSlots } from "../../context/TimeSlotsContext";
import { fetchCourts } from "../context_providers/CourtsProvider";
import { fetchTimeSlots } from "../context_providers/TimeSlotsProvider";

export default function schedule() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const { courts, setCourts } = useCourts();
  const { timeSlots, setTimeSlots } = useTimeSlots();

  useEffect(() => {
    let mounted = true;
    async function loadCourts() {
      setLoading(true);
      try {
        const data = await fetchCourts();
        if (mounted) setCourts(data);
      } catch (error) {
        if (mounted) setError(error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (!courts || courts.length === 0) {
      loadCourts();
    }
    return () => {
      mounted = false;
    };
  }, [courts, setCourts]);

  useEffect(() => {
    let mounted = true;
    async function loadTimeSlots() {
      setLoading(true);
      try {
        const data = await fetchTimeSlots();
        if (mounted) setTimeSlots(data);
      } catch (error) {
        if (mounted) setError(error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (!timeSlots || timeSlots.length === 0) {
      loadTimeSlots();
    }
    return () => {
      mounted = false;
    };
  }, [timeSlots, setTimeSlots]);

  useEffect(() => {
    let mounted = true;
    async function fetchReservations() {
      setLoading(true);

      const { resData, resError } = await apiRequest({
        url: apiEndpoints.GET_BOOKING_CELLS,
      });

      setLoading(false);

      if (!mounted) return;

      if (resError) {
        setError(resError);
        setReservations([]);
        return;
      }

      setError(null);
      setReservations(resData);
    }
    fetchReservations();
    return () => (mounted = false);
  }, []);

  async function handleRetryAll() {
    return Promise.all([
      fetchCourts(),
      fetchTimeSlots(),
      apiRequest({ url: apiEndpoints.GET_BOOKING_CELLS }),
    ])
      .then(([courtsData, timeSlotsData, reservationsResult]) => {
        setCourts(courtsData);
        setTimeSlots(timeSlotsData);

        const { resData, resError } = reservationsResult;

        if (resError) {
          setReservations([]);
          setError(resError);
        } else {
          setReservations(resData);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch data.");
      });
  }

  if (error) {
    return (
      <DataFetchRetry
        errorMessage={`Cannot get the courts and timeslots. Try again!`}
        retryFetchDataFunc={handleRetryAll}
      />
    );
  }

  if (loading) {
    return <Loading />;
  }
  console.log(reservations);
  return (
    <>
      {courts && timeSlots && reservations && (
        <ScheduleTable
          courts={courts}
          timeSlots={timeSlots}
          reservations={reservations}
        />
      )}
    </>
  );
}
