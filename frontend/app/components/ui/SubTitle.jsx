export default function SubTitle({
  variant = "page",
  className,
  children,
  ...rest
}) {
  const variantMapping = {
    page: "text-lg",
    section: "text-base font-light",
    hero: "text-xl font-semibold",
  };
  const baseClass = "text-base-content/70";
  const variantClass = variantMapping[variant] || "";
  const globalClass = `${baseClass} ${variantClass} ${className || ""}`;
  return (
    <p className={globalClass} {...rest}>
      {children}
    </p>
  );
}
