import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import Dashboard from "../Pages/dashboard";
import LandingDashboard from "../Pages/landingDashboard";
import Layout from "../Component/Layout";
import Auth from "../Pages/Auth";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = (props) => {
    const token = localStorage.getItem("token");
    const isAuth = token !== null;
    const [searchParams] = useSearchParams();
    const authMode = searchParams.get("mode") || "login";

    return (
        <Routes>

            {/* ROOT */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/login" element={<Navigate to="/dashboard?mode=login" replace />} />

            <Route path="/signup" element={<Navigate to="/dashboard?mode=signup" replace />} />

            {/* DASHBOARD */}
            <Route
                path="/dashboard"
                element={
                    isAuth ? (
                        <Layout {...props}>
                            <LandingDashboard />
                        </Layout>
                    ) : (
                        <Auth initialMode={authMode} />
                    )
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

            <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
    );
};
export default AppRoutes;