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
  import("./components/suppliers/SuppliersPage.tsx").then((module) => ({
    default: module.default,
  }))
);
const SellersPage = lazy(() =>
  import("./components/sellers/SellersPage.tsx").then((module) => ({
    default: module.SellersPage,
  }))
);
const OrdersPage = lazy(() =>
  import("./components/orders/OrdersPage.tsx").then((module) => ({
    default: module.OrdersPage,
  }))
);
const CategoriesPage = lazy(() =>
  import("./components/categories/CategoriesPage.tsx").then((module) => ({
    default: module.CategoriesPage,
  }))
);
const ProfitsPage = lazy(() =>
  import("./components/profits/ProfitsPage.tsx").then((module) => ({
    default: module.ProfitsPage,
  }))
);
const AnalyticsPage = lazy(() =>
  import("./components/analytics/AnalyticsPage.tsx").then((module) => ({
    default: module.AnalyticsPage,
  }))
);
const ReviewOrdersPage = lazy(() =>
  import("./components/reviews/ReviewOrdersPage.tsx").then((module) => ({
    default: module.ReviewOrdersPage,
  }))
);
const DeliveriesPage = lazy(() =>
  import("./components/deliveries/DeliveriesPage.tsx").then((module) => ({
    default: module.DeliveriesPage,
  }))
);
const CustomersPage = lazy(
  () => import("./components/customers/CustomersPage.tsx")
);
const EmployeesPage = lazy(
  () => import("./components/employees/EmployeesPage.tsx")
);
const CustomerPaymentsPage = lazy(
  () => import("./components/customer-payments/CustomerPaymentsPage.tsx")
);
const InventoryPage = lazy(
  () => import("./components/inventory/InventoryPage.tsx")
);
const PricingPage = lazy(() => import("./components/pricing/PricingPage.tsx"));
const PeriodProfitsPage = lazy(
  () => import("./components/period-profits/PeriodProfitsPage.tsx")
);
const CustomerDebtsPage = lazy(
  () => import("./components/customer-debts/CustomerDebtsPage.tsx")
);
const InventoryMovementPage = lazy(
  () => import("./components/inventory-movement/InventoryMovementPage.tsx")
);
const SettingsPage = lazy(
  () => import("./components/settings/SettingsPage.tsx")
);
const UsersPage = lazy(() => import("./components/users/UsersPage.tsx"));
const SupplierAnalysisPage = lazy(() =>
  import("./components/supplier-analysis/SupplierAnalysisPage.tsx").then(
    (module) => ({
      default: module.default,
    })
  )
);
const ExpensesPage = lazy(() =>
  import("./components/expenses/ExpensesPage.tsx").then((module) => ({
    default: module.default,
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
              <Route path="customers" element={<CustomersPage />} />
              <Route path="employees" element={<EmployeesPage />} />
              <Route
                path="customer-payments"
                element={<CustomerPaymentsPage />}
              />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="period-profits" element={<PeriodProfitsPage />} />
              <Route path="customer-debts" element={<CustomerDebtsPage />} />
              <Route
                path="inventory-movement"
                element={<InventoryMovementPage />}
              />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route
                path="supplier-analysis"
                element={<SupplierAnalysisPage />}
              />
              <Route path="expenses" element={<ExpensesPage />} />
            </Route>
            {/* 404 catch-all - redirect to dashboard home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
