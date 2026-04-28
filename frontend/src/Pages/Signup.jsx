import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignup = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                navigate("/dashboard");
            } else {
                setError(data.message || "Signup failed");
            }
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Server error");
        }

        setLoading(false);
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-xl shadow w-80 space-y-4">

                <h2 className="text-lg font-semibold text-center">Sign Up</h2>

                <input
                    placeholder="Name"
                    className="w-full border p-2 rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

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
                    onClick={handleSignup}
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 rounded"
                >
                    {loading ? "Creating..." : "Sign Up"}
                </button>

                <p className="text-sm text-center text-gray-500">
                    Already have account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-blue-500 cursor-pointer"
                    >
                        Login
                    </span>
                </p>

            </div>
        </div>
    );
};

export default Signup;