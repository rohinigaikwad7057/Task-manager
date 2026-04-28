import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../Pages/dashboard";
import LandingDashboard from "../Pages/landingDashboard";
import Layout from "../Component/Layout";
import Login from "../Pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import Signup from "../Pages/Signup";

const AppRoutes = (props) => {
    const token = localStorage.getItem("token");
    const isAuth = token !== null;

    return (
        <Routes>

            {/* ROOT */}
            <Route
                path="/"
                element={
                    isAuth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
                }
            />

            <Route
                path="/login"
                element={
                    isAuth ? <Navigate to="/dashboard" /> : <Login />
                }
            />

            <Route
                path="/signup"
                element={
                    isAuth ? <Navigate to="/dashboard" /> : <Signup />
                }
            />

            {/* DASHBOARD */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Layout {...props}>
                            <LandingDashboard />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* TASKS */}
            <Route
                path="/tasks"
                element={
                    <ProtectedRoute>
                        <Layout {...props}>
                            <Dashboard {...props} />
                        </Layout>
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
};
export default AppRoutes;