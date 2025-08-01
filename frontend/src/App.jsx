//FRONTEND/src/app.jsx
import EmailList from "./components/EmailList";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold"> OneBox Inbox</h1>
          <p className="text-gray-400 mt-1">All your emails in one place</p>
        </header>
        
        <EmailList />
      </div>
    </div>
  );
}

export default App;
