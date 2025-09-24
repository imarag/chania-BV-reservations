export default function Collapse({
  label = "my collapse",
  collapseIcon = "arrow",
  className,
  children,
}) {
  const baseClass = "collapse border rounded-sm";
  const contentClass = `collapse-content text-sm`;
  const labelClass = "collapse-title text-start font-semibold text-sm";
  const globalClass = `${baseClass} ${
    collapseIcon === "arrow" ? "collapse-arrow" : "collapse-plus"
  } ${className || ""}`;
  return (
    <div className={globalClass}>
      <input type="checkbox" />
      <div className={labelClass}>{label}</div>
      <div className={contentClass}>{children}</div>
    </div>
  );
}
