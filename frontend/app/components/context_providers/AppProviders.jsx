import CurrentUserProvider from "./CurrentUserProvider";
import NotificationProvider from "./NotificationProvider";

export default function AppProviders({ children }) {
  return (
    <NotificationProvider>
      <CurrentUserProvider>{children}</CurrentUserProvider>
    </NotificationProvider>
  );
}
