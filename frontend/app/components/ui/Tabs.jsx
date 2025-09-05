import Symbol from "./Symbol";
import { Fragment, useState } from "react";

export default function Tabs({ tabsItems }) {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="tabs tabs-border">
      {tabsItems.map((item, index) => (
        <Fragment key={item.label}>
          <label className="tab">
            <input
              type="radio"
              name={`tab`}
              checked={activeIndex === index}
              onChange={() => setActiveIndex(index)}
            />
            {item.icon && <Symbol IconComponent={item.IconComponent} />}
            {item.label}
          </label>
          <div className="tab-content border-base-300 p-6 w-full">
            {item.content}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
