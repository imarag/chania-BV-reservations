import Spinner from "./Spinner";

export default function Loading() {
  return (
    <div className="size-full flex items-center justify-center">
      <Spinner size="extraLarge" type="dots" />
    </div>
  );
}
