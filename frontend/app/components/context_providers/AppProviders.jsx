import CurrentUserProvider from "./CurrentUserProvider";
import NotificationProvider from "./NotificationProvider";
import GlobalLoadingProvider from "./GlobalLoadingProvider";
import CourtsProvider from "./CourtsProvider";
import TimeSlotsProvider from "./TimeSlotsProvider";

export default function AppProviders({ children }) {
  return (
    <NotificationProvider>
      <GlobalLoadingProvider>
        <CourtsProvider>
          <TimeSlotsProvider>
            <CurrentUserProvider>{children}</CurrentUserProvider>
          </TimeSlotsProvider>
        </CourtsProvider>
      </GlobalLoadingProvider>
    </NotificationProvider>
  );
}
