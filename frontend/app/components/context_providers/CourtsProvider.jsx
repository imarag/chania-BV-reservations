import { useState, useEffect } from "react";
import { CourtsContext } from "../../context/CourtsContext";
import { apiRequest } from "../../utils/apiRequest";
import { apiEndpoints } from "../../utils/appUrls";

// Exported function
export async function fetchCourts() {
  const { resData, resError } = await apiRequest({
    url: apiEndpoints.GET_ALL_COURTS,
  });
  if (resError) {
    throw new Error(resError);
  }
  return resData;
}

export default function CourtsProvider({ children }) {
  const [courts, setCourts] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetchCourts().then((data) => {
      if (mounted) setCourts(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <CourtsContext.Provider value={{ courts, setCourts }}>
      {children}
    </CourtsContext.Provider>
  );
}
