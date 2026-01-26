import { useState } from "react";

export default function AuthForm({ onSignIn, onSignUp }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            if (isLogin) {
                await onSignIn(email, password);
                // Success - user will be automatically logged in
            } else {
                await onSignUp(email, password);
                setSuccess("Account created! You're now logged in.");
                // Clear form
                setEmail("");
                setPassword("");
            }
        } catch (err) {
            console.error("Auth error:", err);

            // Better error messages
            let errorMessage = err.message || "Authentication failed";

            if (errorMessage.includes("Email rate limit exceeded")) {
                errorMessage = "Too many signup attempts. Please wait a few minutes or disable email confirmation in Supabase settings.";
            } else if (errorMessage.includes("Invalid login credentials")) {
                errorMessage = "Invalid email or password. Please try again.";
            } else if (errorMessage.includes("User already registered")) {
                errorMessage = "This email is already registered. Try logging in instead.";
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">💰 Expense Tracker</h1>
                    <p className="text-gray-600">
                        {isLogin ? "Welcome back!" : "Create your account"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
                            ✅ {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 disabled:opacity-50 font-medium"
                        disabled={loading}
                    >
                        {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        className="text-sm text-gray-600 hover:text-black"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                            setSuccess("");
                        }}
                    >
                        {isLogin
                            ? "Don't have an account? Sign up"
                            : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
}
