export default function Symbol({
  IconComponent,
  size = "medium",
  className = "",
}) {
  const sizeMapping = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8",
    extraLarge: "w-12 h-12",
  };

  const globalClass =
    `${sizeMapping[size] || sizeMapping.medium}` +
    (className ? ` ${className}` : "");

  return <IconComponent className={globalClass} />;
}
