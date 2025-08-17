import { useState } from "react";

type UseFormReturn<T> = {
    formInfo: T;
    setFormInfo: React.Dispatch<React.SetStateAction<T>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    error: string;
    success: string;
    loading: boolean;
};

export function useForm<T extends Record<string, any>>(
    initialValues: T,
    submitUrl: string,
    onSuccessRedirect: string = "/"
): UseFormReturn<T> {
    const [formInfo, setFormInfo] = useState<T>(initialValues);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const res = await fetch(submitUrl, {
            method: "POST",
            body: new FormData(e.target as HTMLFormElement),
        });

        const resMessage = await res.json();

        if (!res.ok) {
            setError(resMessage.message || "Something went wrong.");
            setLoading(false);
        } else {
            setSuccess(resMessage.message + ". Redirecting...");
            setTimeout(() => {
                window.location.href = onSuccessRedirect;
            }, 2000);
        }
    };

    return { formInfo, setFormInfo, handleChange, handleSubmit, error, success, loading };
}
