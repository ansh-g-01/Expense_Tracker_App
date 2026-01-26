import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Tags from "./pages/Tags";
import Stats from "./pages/Stats";

function AppContent() {
  const { user, loading, signIn, signUp } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onSignIn={signIn} onSignUp={signUp} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
