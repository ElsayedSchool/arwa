import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
// import { Button, Input } from "../ui";
import { useAuthStore } from "../../stores/authStore";
import { loginWithCredentials } from "../../services/auth";

interface LoginPageProps {
  onForgotPassword?: () => void;
}

interface FormData {
  username: string;
  password: string;
}

interface Errors {
  username?: string;
  password?: string;
  general?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onForgotPassword }) => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.username.trim()) {
      newErrors.username = "اسم المستخدم مطلوب";
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const auth = await loginWithCredentials(
        formData.username,
        formData.password
      );
      localStorage.setItem("token", auth.token);
      const mockUser = { id: "1", username: formData.username, role: "Admin" };
      login(mockUser);
      navigate("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "حدث خطأ أثناء تسجيل الدخول";
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Right Side - Login Form - Full Width */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">مرحباً بك</h2>
            <p className="text-gray-600 mb-4">
              قم بتسجيل الدخول للوصول إلى حسابك
            </p>

            {/* Demo Credentials Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-medium mb-2">بيانات تجريبية للدخول:</p>
              <div className="space-y-1 text-right">
                <p>admin / 123456</p>
                <p>user / password</p>
                <p>demo / demo123</p>
              </div>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  اسم المستخدم
                </label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="أدخل اسم المستخدم"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  كلمة المرور
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="أدخل كلمة المرور"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right pr-10 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                <button
                  type="button"
                  className="absolute left-3 top-9 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="mr-2 block text-sm text-gray-900"
                >
                  تذكرني
                </label>
              </div>

              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ليس لديك حساب؟{" "}
              <button className="font-medium text-blue-600 hover:text-blue-500">
                إنشاء حساب جديد
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Left Side - Image Background - Full Width */}
      <div className="hidden lg:block w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-blue-900 bg-opacity-75"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center h-full px-12 text-white">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold mb-6">
              نظام إدارة موردي الأسماك
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              تتبع مخزونك وموردينك ومبيعاتك بكل سهولة ودقة
            </p>
            <div className="space-y-4 text-blue-100">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-300 rounded-full ml-3"></div>
                <span>إدارة شاملة للموردين والمخزون</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-300 rounded-full ml-3"></div>
                <span>تقارير مفصلة عن المبيعات والأرباح</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-300 rounded-full ml-3"></div>
                <span>واجهة سهلة الاستخدام باللغة العربية</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { LoginPage };
