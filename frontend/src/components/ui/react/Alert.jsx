export default function Alert({ variant = "info", outline = false, className, children }) {
    const iconClass = "h-6 w-6 shrink-0";
    const variantMapping = {
        primary: "alert-primary",
        secondary: "alert-secondary",
        accent: "alert-accent",
        neutral: "alert-neutral",
        info: "alert-info",
        success: "alert-success",
        warning: "alert-warning",
        error: "alert-error"
    };
    const iconMapping = {
        primary: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class={`stroke-info ${iconClass}`}>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        ),
        secondary: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class={`stroke-info ${iconClass}`}>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        ),
        accent: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class={`stroke-info ${iconClass}`}>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        ),
        neutral: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class={`stroke-info ${iconClass}`}>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        ),
        info: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class={`stroke-current ${iconClass}`}>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        ),
        success: (
            <svg xmlns="http://www.w3.org/2000/svg" class={`stroke-current ${iconClass}`} fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        warning: (
            <svg xmlns="http://www.w3.org/2000/svg" class={`stroke-current ${iconClass}`} fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        error: (
            <svg xmlns="http://www.w3.org/2000/svg" class={`stroke-current ${iconClass}`} fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    };
    const baseClass = "alert";
    const globalClass = `${baseClass} ${variantMapping[variant] || ""} ${outline ? "alert-outline" : ""} ${className || ""}`;
    return (
        <div role="alert" className={globalClass}>
            {iconMapping[variant]}
            <div>{children}</div>
        </div>
    )
}
