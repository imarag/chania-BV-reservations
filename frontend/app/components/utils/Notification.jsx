export default function Notification({ message, type = "info" }) {
  const typeMapping = {
    success: "alert-success",
    error: "alert-error",
    info: "alert-info",
    warning: "alert-warning",
    critical: "alert-error",
  };

  return (
    <div className="toast">
      <div className={`alert ${typeMapping[type] || "alert-info"}`}>
        <span>{message}</span>
      </div>
    </div>
  );
}
