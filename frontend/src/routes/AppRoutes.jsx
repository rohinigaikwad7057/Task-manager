import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../Pages/dashboard";
import LandingDashboard from "../Pages/landingDashboard";
import Layout from "../Component/Layout";


const AppRoutes = (props) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />

      <Route
        path="/dashboard"
        element={
          <Layout {...props}>
            <LandingDashboard />
          </Layout>
        }
      />

      <Route
        path="/tasks"
        element={
          <Layout {...props}>
            <Dashboard {...props} />
          </Layout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;