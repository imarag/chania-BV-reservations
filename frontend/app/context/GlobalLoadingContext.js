import { createContext, useContext } from "react";

export const GlobalLoadingContext = createContext(true);

export function useGlobalLoading() {
  return useContext(GlobalLoadingContext);
}
