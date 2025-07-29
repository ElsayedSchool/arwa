import React, { useState } from "react";
import { ArrowRight, Mail, CheckCircle } from "lucide-react";
import { Button, Input } from "../ui";

export const ForgotPasswordPage = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrors({ email: "البريد الإلكتروني مطلوب" });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: "يرجى إدخال بريد إلكتروني صحيح" });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } catch (error) {
      setErrors({
        general: "حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex" dir="rtl">
        {/* Right Side - Success Message - Full Width */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                تم إرسال الرابط بنجاح
              </h2>
              <p className="text-gray-600 mb-6">
                تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
              </p>
              <p className="text-sm text-gray-500 mb-8">{email}</p>
            </div>

            <div className="space-y-4">
              <Button onClick={onBackToLogin} className="w-full">
                <ArrowRight size={16} className="ml-2" />
                العودة لتسجيل الدخول
              </Button>

              <button
                onClick={() => setIsSuccess(false)}
                className="w-full text-sm text-blue-600 hover:text-blue-500"
              >
                إرسال الرابط مرة أخرى
              </button>
            </div>
          </div>
        </div>

        {/* Left Side - Image Background - Full Width */}
        <div className="hidden lg:block w-1/2 relative">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`,
            }}
          >
            <div className="absolute inset-0 bg-green-900 bg-opacity-75"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center h-full px-12 text-white">
            <div className="max-w-lg">
              <Mail className="h-16 w-16 mb-6 text-green-300" />
              <h1 className="text-4xl font-bold mb-6">
                تحقق من بريدك الإلكتروني
              </h1>
              <p className="text-xl text-green-100">
                ستجد رابط إعادة تعيين كلمة المرور في صندوق الوارد الخاص بك
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Right Side - Forgot Password Form - Full Width */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              نسيت كلمة المرور؟
            </h2>
            <p className="text-gray-600">
              أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            <Input
              label="البريد الإلكتروني"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({});
              }}
              placeholder="أدخل بريدك الإلكتروني"
              error={errors.email}
              className="text-right"
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
              >
                <ArrowRight size={16} className="ml-1" />
                العودة لتسجيل الدخول
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Left Side - Image Background - Full Width */}
      <div className="hidden lg:block w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-orange-900 bg-opacity-75"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center h-full px-12 text-white">
          <div className="max-w-lg">
            <Mail className="h-16 w-16 mb-6 text-orange-300" />
            <h1 className="text-4xl font-bold mb-6">استعادة كلمة المرور</h1>
            <p className="text-xl mb-8 text-orange-100">
              لا تقلق، يحدث هذا للجميع. سنساعدك في استعادة الوصول إلى حسابك
            </p>
            <div className="space-y-4 text-orange-100">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-300 rounded-full ml-3"></div>
                <span>أدخل بريدك الإلكتروني المسجل</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-300 rounded-full ml-3"></div>
                <span>تحقق من صندوق الوارد</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-300 rounded-full ml-3"></div>
                <span>اتبع الرابط لإعادة تعيين كلمة المرور</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
