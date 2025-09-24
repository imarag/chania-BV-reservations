import Button from "../ui/Button";
import { getIcon } from "../../utils/iconMap";
import Symbol from "../ui/Symbol";
import { useState } from "react";

export default function Notification({
  message = "",
  type = "critical",
  show,
  hideNotification = () => {},
}) {
  const positionClass = "fixed top-4 left-0 right-0 sm:right-4 sm:left-auto";
  const shapeClass =
    "rounded-md sm:w-68 py-6 px-4 shadow-lg border border-white/10";
  const baseClass = `text-base-content z-50 overflow-scroll bg-base-300 transition-all ease-in-out duration-800 `;
  const showHideClass = show ? "" : "translate-x-[200%]";
  const bgMapping = {
    success: "text-black/80 bg-success",
    error: "text-black/80 bg-error",
    info: "text-black/80 bg-info",
    warning: "text-black/80 bg-warning",
    critical: "text-black/80 bg-error",
  };
  const titleMapping = {
    success: "Success",
    error: "Error",
    info: "Information",
    warning: "Warning",
    critical: "Critical",
  };
  const globalClass = `${
    bgMapping[type] || bgMapping["success"]
  } ${showHideClass} ${baseClass} ${positionClass} ${shapeClass}`;
  return (
    <div className={globalClass}>
      <Button
        className="absolute top-2 right-2"
        size="extraSmall"
        onClick={hideNotification}
        variant="ghost"
      >
        <Symbol size="small" IconComponent={getIcon("close")} />
      </Button>
      <div className="flex items-center gap-4">
        <Symbol
          className={`flex-shrink-0`}
          size=""
          IconComponent={getIcon(type)}
        />
        <div className="overflow-y-scroll">
          <h3 className={`text-start font-bold`}>
            {titleMapping[type] || titleMapping["info"]}
          </h3>
          <p className="text-sm text-start">{message}</p>
        </div>
      </div>
    </div>
  );
}
