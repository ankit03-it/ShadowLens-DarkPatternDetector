export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-8 py-4 bg-black shadow">
        <h1 className="text-xl font-bold">ShopSphere</h1>
        <div className="space-x-4">
          <button className="text-sm">Login</button>
          <button className="bg-white text-black px-3 py-1 rounded">
            Sign Up
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="text-center py-16 bg-gradient-to-r from-purple-600 to-indigo-700">
        <h2 className="text-4xl font-bold mb-4">
          Upgrade Your Lifestyle
        </h2>
        <p className="text-lg mb-6">
          Premium products curated just for you
        </p>

        {/* DARK PATTERN: urgency */}
        <p className="text-red-200 font-semibold">
          Hurry! Offer ends in 2 hours
        </p>

        <button className="mt-6 bg-black px-6 py-2 rounded">
          Shop Now
        </button>
      </div>

      {/* PRODUCTS */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* NORMAL */}
        <div className="bg-gray-800 p-5 rounded">
          <h3 className="font-bold text-lg">Wireless Headphones</h3>
          <p className="text-sm text-gray-400">
            High-quality noise cancellation
          </p>
          <p className="mt-2">Price starts at ₹1999</p>
        </div>

        {/* DARK PATTERN: scarcity */}
        <div className="bg-gray-800 p-5 rounded border border-red-500">
          <h3 className="font-bold text-lg text-red-400">
            Only 3 items left in stock!
          </h3>
          <button className="mt-3 bg-red-600 px-3 py-1 rounded">
            Buy Now
          </button>
        </div>

        {/* NORMAL */}
        <div className="bg-gray-800 p-5 rounded">
          <h3 className="font-bold text-lg">Smart Watch</h3>
          <p className="text-sm text-gray-400">
            Track your fitness daily
          </p>
          <p className="mt-2">Up to 20% OFF</p>
        </div>

      </div>

      {/* SUBSCRIPTION */}
      <div className="p-8 bg-gray-800 mt-8 text-center">
        <h2 className="text-2xl font-bold mb-3">
          Try Premium Membership
        </h2>

        {/* DARK PATTERN: forced continuity */}
        <p className="text-gray-400">
          Start your free trial now
        </p>
        <p className="text-sm text-gray-500">
          Auto-renews after 3 days unless cancelled
        </p>

        <button className="mt-4 bg-purple-600 px-5 py-2 rounded">
          Start Free Trial
        </button>

        {/* DARK PATTERN: confirmshaming */}
        <p className="mt-4 text-xs text-gray-500">
          No, I don't want to improve my experience
        </p>
      </div>

      {/* OBSTRUCTION */}
      <div className="p-8 text-center">
        <h3 className="font-semibold">Cancellation Policy</h3>
        <p className="text-sm text-gray-400">
          You can cancel anytime.
        </p>

        {/* DARK PATTERN */}
        <p className="text-xs text-gray-500 mt-2">
          To cancel, contact support via email and wait 48 hours
        </p>
      </div>

      {/* FOOTER */}
      <div className="bg-black text-center py-4 mt-10 text-sm text-gray-500">
        © 2026 ShopSphere. All rights reserved.
      </div>

    </div>
  );
}