import Anchor from "../ui/Anchor";

export default function NavLink({ path, children, className }) {
  const globalClass = `inline-flex items-center gap-4 text-base-content/60 no-underline hover:text-base-content ${className}`;
  return (
    <Anchor className={globalClass} href={path}>
      {children}
    </Anchor>
  );
}
