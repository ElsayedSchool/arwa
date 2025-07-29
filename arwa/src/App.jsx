import React, { useState } from 'react';
import { LoginPage, ForgotPasswordPage } from './components/auth';
import LandPage from './components/LandPage';
import { useAuth } from './hooks/useAuth';
import './App.css';

function App() {
  const { user, isLoading, login, logout, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('login'); // 'login' | 'forgot-password' | 'dashboard'

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (currentPage === 'forgot-password') {
      return (
        <ForgotPasswordPage
          onBackToLogin={() => setCurrentPage('login')}
        />
      );
    }

    return (
      <LoginPage
        onLogin={(credentials) => {
          login(credentials);
          setCurrentPage('dashboard');
        }}
        onForgotPassword={() => setCurrentPage('forgot-password')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logout */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16" dir="rtl">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                مرحباً، {user.name}
              </h1>
            </div>
            <button
              onClick={logout}
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <LandPage />
      </main>
    </div>
  );
}

export default App;