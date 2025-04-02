export default function EmailCredentials() {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">📧 Email Credentials</h2>
        <p className="text-gray-600 mb-2">Not stored in the cloud. Local only.</p>
  
        <div className="space-y-2">
          <input
            type="email"
            placeholder="Email address"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="password"
            placeholder="App password"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
  
        <button className="mt-4 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded">
          Save (Coming Soon)
        </button>
      </div>
    );
  }
  