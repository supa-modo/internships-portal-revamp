// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InternshipApplications from "./pages/Applications";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoginPage from "./components/auth/Login";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}

          <Route path="/" element={<InternshipApplications />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/manage-applications"
            element={
              <ProtectedRoute>
                <InternshipApplications />
              </ProtectedRoute>
            }
          />

          {/* Add more protected routes here */}
          {/* Example:
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            /> 
            */}

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
