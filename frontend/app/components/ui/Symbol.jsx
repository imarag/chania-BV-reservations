export default function Symbol({ IconComponent, className = "" }) {
    const globalClass = `w-6 h-6` + (className ? ` ${className}` : "");
    return <IconComponent className={globalClass} />;
}
