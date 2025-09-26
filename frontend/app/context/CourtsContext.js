import { createContext, useContext } from "react";

export const CourtsContext = createContext([]);

export function useCourts() {
  return useContext(CourtsContext);
}
