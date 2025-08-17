export default function Select({ placeholder, options, className, ...rest }) {
    const baseClass = `select inline-block`;
    const globalClass = `${baseClass} ${className || ""}`;
    return (
        <select className={globalClass} {...rest}>
            {
                placeholder && (
                    <option disabled={true}>{placeholder}</option>
                )
            }
            {
                options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))
            }
        </select>
    );
}