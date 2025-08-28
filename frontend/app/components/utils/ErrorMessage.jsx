export default function errorMessage({ errorMessage }) {
    return (
        <p className="bg-error text-error-content px-4 py-2 rounded-md">
            {errorMessage}
        </p>
    );
}
