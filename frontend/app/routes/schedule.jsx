import SchedulePage from "../components/pages/SchedulePage";
import ProtectedPage from "../components/utils/ProtectedPage";

export default function Schedule() {
    return (
        <ProtectedPage>
            <SchedulePage />
        </ProtectedPage>
    );
}
