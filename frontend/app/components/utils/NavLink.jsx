import Anchor from "../ui/Anchor";

export default function NavLink({ path, children, className }) {
  const globalClass = `inline-flex items-center gap-4 text-base-content/60 no-underline hover:text-base-content ${className}`;

  if (path) {
    return (
      <Anchor className={globalClass} href={path}>
        {children}
      </Anchor>
    );
  }

  // fallback: just a <div> wrapper
  return <div className={globalClass}>{children}</div>;
}
