import Symbol from "./Symbol";

export default function Tabs({ tabsItems }) {
    return (
        <div className="tabs tabs-lift">
            {tabsItems.map((item, index) => (
                <>
                    <label className="tab">
                        <input type="radio" name={`tab`} />
                        {item.icon && (
                            <Symbol IconComponent={item.IconComponent} />
                        )}
                        {item.label}
                    </label>
                    <div className="tab-content border-base-300 p-6 w-full">
                        {item.content}
                    </div>
                </>
            ))}
        </div>
    );
}
