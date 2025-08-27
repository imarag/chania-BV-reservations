import Title from "../ui/Title";
import SubTitle from "../ui/SubTitle";

export default function HomePage() {
    return (
        <section className="max-w-4xl mx-auto p-6">
            <Title variant="page"> Welcome to PostHub </Title>
            <SubTitle variant="page">
                {" "}
                Connect with amazing content and authors{" "}
            </SubTitle>

            <p className="mt-6 text-lg leading-relaxed text-gray-700">
                Explore a growing community of writers sharing their stories,
                ideas, and insights. Read the latest posts or create your own to
                join the conversation!
            </p>
        </section>
    );
}
