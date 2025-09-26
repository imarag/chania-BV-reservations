import { createContext, useContext } from "react";

export const TimeSlotsContext = createContext([]);

export function useTimeSlots() {
  return useContext(TimeSlotsContext);
}
