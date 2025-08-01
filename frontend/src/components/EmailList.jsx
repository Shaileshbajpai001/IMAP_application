/// frontend/src/components/EmailList.js
// frontend/src/components/EmailList.js

import { useEffect, useState } from "react";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;



function EmailList() {
  const [emails, setEmails] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState("Account 1"); 

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const url = query
      ? `${backendUrl}/emails/search?query=${query}`
      : `${backendUrl}/emails`;
      const res = await axios.get(url);

      setEmails(res.data);
    } catch (err) {
      console.error("Failed to load emails", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmails();
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      {/* Title + Dropdown bnaya hai*/}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-400">Your Emails</h1>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-1"
        >
          <option value="Account 1">Account 1</option>
          <option value="Account 2">Account 2</option>
        </select>
      </div>

      {/* Seach bar*/}
      <form onSubmit={handleSearch} className="mb-8 flex gap-4">
        <input
          type="text"
          placeholder="Search by subject, sender, recipient..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          🔍 Search
        </button>
      </form>

      {/* List */}
      <div className="space-y-4">
        {emails
          .filter((email) => email.account === selectedAccount) // NEW
          .map((email) => (
            <div
              key={email._id}
              className="bg-gray-800 border border-gray-700 p-4 rounded-xl shadow-md hover:bg-gray-700 transition cursor-pointer"
              onClick={() => setSelectedEmail(email)}
            >
              <p className="text-lg font-semibold text-blue-300">
                {email.subject || "(No Subject)"}
              </p>
              <p className="text-sm text-gray-400 mt-1">From: {email.from}</p>
              <p className="text-sm text-gray-400">To: {email.to?.join(", ")}</p>
              <p className="text-sm mt-2 text-gray-300">
                {(email.text || "").slice(0, 120)}
                {email.text?.length > 120 ? "..." : ""}
              </p>
              <p className="text-sm mt-1">
                Category:{" "}
                <span className="text-green-400">
                  {email.category || "Uncategorized"}
                </span>
              </p>
              <p className="text-xs text-blue-500 mt-1">Click to expand ⬇️</p>
            </div>
          ))}
      </div>

      {/* mail Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl text-black relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedEmail(null)}
              className="absolute top-2 right-2 text-gray-900 hover:text-black text-xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-2">
              {selectedEmail.subject || "(No Subject)"}
            </h2>
            <p className="text-sm text-gray-700 mb-1">From: {selectedEmail.from}</p>
            <p className="text-sm text-gray-700 mb-1">To: {selectedEmail.to?.join(", ")}</p>
            <p className="text-sm text-gray-700 mb-3">
              Date: {new Date(selectedEmail.date).toLocaleString()}
            </p>

            {/*  Body */}
            <div className="max-h-[400px] overflow-auto p-4 bg-gray-100 rounded-lg shadow">
              <p className="whitespace-pre-wrap overflow-auto text-gray-800">
                {selectedEmail.text}
              </p>
            </div>

            
            <div className="flex gap-4 mt-6">
              {/* <button
                onClick={async () => {
                  setSelectedEmail({ ...selectedEmail, loading: "categorizing" });
                  const res = await axios.post(`${backendUrl}/emails/categorize`, {
                    id: selectedEmail._id,
                    text: selectedEmail.text || selectedEmail.body || " ",
                  });
                  setSelectedEmail({
                    ...selectedEmail,
                    category: res.data.category,
                    loading: null,
                  });
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Categorize
              </button> */}

              <button
                onClick={async () => {
                  setSelectedEmail({ ...selectedEmail, loading: "suggesting" });
                  const res = await axios.post(`${backendUrl}/emails/suggest-reply`, {
                    id: selectedEmail._id,
                    text: selectedEmail.text || selectedEmail.body || " ",
                  });
                  setSelectedEmail({
                    ...selectedEmail,
                    suggestedReply: res.data.reply,
                    loading: null,
                  });
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Suggest Reply
              </button>
            </div>

            {/*  Category */}
            {selectedEmail.loading === "categorizing" && (
              <p className="mt-4 text-sm text-gray-500">⏳ Categorizing...</p>
            )}
            {selectedEmail.category && (
              <p className="mt-2 text-sm text-green-600">
                Category: {selectedEmail.category}
              </p>
            )}

            {/* Suggested Reply */}
            {selectedEmail.loading === "suggesting" && (
              <p className="mt-4 text-sm text-gray-500">💬 Generating reply...</p>
            )}
            {selectedEmail.suggestedReply && (
              <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
                <p className="font-semibold mb-2 text-gray-800">Suggested Reply:</p>
                <div className="whitespace-pre-wrap text-sm text-gray-800">
                  {selectedEmail.suggestedReply}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailList;
