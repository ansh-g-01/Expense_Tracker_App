import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const { signOut, user } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-6">
            <Link
              to="/"
              className={`font-medium ${isActive("/") ? "text-black" : "text-gray-500 hover:text-black"
                }`}
            >
              Home
            </Link>
            <Link
              to="/tags"
              className={`font-medium ${isActive("/tags")
                  ? "text-black"
                  : "text-gray-500 hover:text-black"
                }`}
            >
              Tags
            </Link>
            <Link
              to="/stats"
              className={`font-medium ${isActive("/stats")
                  ? "text-black"
                  : "text-gray-500 hover:text-black"
                }`}
            >
              Stats
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-black"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
