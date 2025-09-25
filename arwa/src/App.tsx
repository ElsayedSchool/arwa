import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import ErrorBoundary from "./components/common/ErrorBoundary";
import "./App.css";

// Lazy load components for code splitting
const LandPage = lazy(() => import("./components/LandPage"));
const LoginPage = lazy(() =>
  import("./components/auth/LoginPage").then((module) => ({
    default: module.LoginPage,
  }))
);
const SuppliersPage = lazy(() =>
  import("./components/suppliers/SuppliersPage").then((module) => ({
    default: module.SuppliersPage,
  }))
);
const SellersPage = lazy(() =>
  import("./components/sellers/SellersPage").then((module) => ({
    default: module.SellersPage,
  }))
);
const OrdersPage = lazy(() =>
  import("./components/orders/OrdersPage").then((module) => ({
    default: module.OrdersPage,
  }))
);
const CategoriesPage = lazy(() =>
  import("./components/categories/CategoriesPage").then((module) => ({
    default: module.CategoriesPage,
  }))
);
const ProfitsPage = lazy(() =>
  import("./components/profits/ProfitsPage").then((module) => ({
    default: module.ProfitsPage,
  }))
);
const AnalyticsPage = lazy(() =>
  import("./components/analytics/AnalyticsPage").then((module) => ({
    default: module.AnalyticsPage,
  }))
);
const ReviewOrdersPage = lazy(() =>
  import("./components/reviews/ReviewOrdersPage").then((module) => ({
    default: module.ReviewOrdersPage,
  }))
);
const DeliveriesPage = lazy(() =>
  import("./components/deliveries/DeliveriesPage").then((module) => ({
    default: module.DeliveriesPage,
  }))
);

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Layout component for dashboard pages
const DashboardLayout: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router basename="/arwa">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <LandPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="suppliers" element={<SuppliersPage />} />
              <Route path="sellers" element={<SellersPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="profits" element={<ProfitsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="reviews" element={<ReviewOrdersPage />} />
              <Route path="deliveries" element={<DeliveriesPage />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
