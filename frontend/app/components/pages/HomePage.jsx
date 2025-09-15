import Title from "../ui/Title";
import SubTitle from "../ui/SubTitle";
import Anchor from "../ui/Anchor";

export default function HomePage() {
  return (
    <section className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <Title variant="page">Welcome to Chania Beach Volleyball</Title>
        <SubTitle variant="page">
          Book your court and enjoy the sun, sand, and game!
        </SubTitle>
        <p className="mt-4 text-gray-700 text-lg leading-relaxed">
          Our reservation app makes it easy to find and book beach volleyball
          courts in Chania. Stay active, have fun, and connect with other
          players in your area.
        </p>
        <Anchor
          href="/reservation"
          className="mt-6 inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
        >
          Book a Court
        </Anchor>
      </div>

      {/* How It Works Section */}
      <div className="grid md:grid-cols-3 gap-6 text-center">
        <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">Choose Your Court</h3>
          <p className="text-gray-600">
            Browse available courts and select the one that fits your schedule.
          </p>
        </div>
        <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">Reserve Online</h3>
          <p className="text-gray-600">
            Reserve your court instantly using our fast and simple online
            system.
          </p>
        </div>
        <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">Enjoy the Game</h3>
          <p className="text-gray-600">
            Arrive, play, and have fun! Your court is ready when you are.
          </p>
        </div>
      </div>

      {/* Community or Info Section */}
      <div className="text-center mt-12">
        <h2 className="text-2xl font-bold mb-4">Join the Community</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Meet other beach volleyball enthusiasts in Chania, participate in
          tournaments, and stay updated on events and special promotions.
        </p>
      </div>
    </section>
  );
}
