function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Tailwind is working 🚀
        </h1>
        <p className="text-gray-600 mb-6">
          Your setup is clean and ready.
        </p>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Continue
        </button>
      </div>
    </div>
  )
}

export default App