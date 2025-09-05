export default function Message({ type = "success", message }) {
  const bgClassMapping = {
    success: "bg-success",
    error: "bg-error",
  };
  return (
    <p
      className={`${
        bgClassMapping[type] || bgClassMapping["success"]
      } text-error-content px-4 py-2 rounded-md`}
    >
      {message}
    </p>
  );
}
