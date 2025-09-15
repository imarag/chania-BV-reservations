import Spinner from "./Spinner";

export default function Loading() {
  return (
    <div className="w-full flex items-center justify-center">
      <Spinner size="extraLarge" type="dots" />
    </div>
  );
}
