import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                navigate("/dashboard");
            } else {
                setError(data.message || "Login failed");
            }
        }
        // eslint-disable-next-line no-unused-vars
        catch (err) {
            setError("Server error");
        }

        setLoading(false);
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-6 rounded-xl shadow w-80 space-y-4">

                <h2 className="text-lg font-semibold text-center">
                    Login
                </h2>

                <input
                    placeholder="Email"
                    className="w-full border p-2 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-sm text-center text-gray-500">
                    Don't have an account?{" "}
                    <span
                        onClick={() => navigate("/signup")}
                        className="text-blue-500 cursor-pointer"
                    >
                        Sign up
                    </span>
                </p>

            </div>
        </div>
    );
};

export default Login;