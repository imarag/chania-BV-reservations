import CurrentUserProvider from "./CurrentUserProvider";
import NotificationProvider from "./NotificationProvider";
import GlobalLoadingProvider from "./GlobalLoadingProvider";

export default function AppProviders({ children }) {
  return (
    <NotificationProvider>
      <GlobalLoadingProvider>
        <CurrentUserProvider>{children}</CurrentUserProvider>
      </GlobalLoadingProvider>
    </NotificationProvider>
  );
}
