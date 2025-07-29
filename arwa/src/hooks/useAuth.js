import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (credentials) => {
    // Demo credentials
    const validCredentials = [
      { username: "admin", password: "123456" },
      { username: "user", password: "password" },
      { username: "demo", password: "demo123" },
    ];

    const isValid = validCredentials.some(
      (cred) =>
        cred.username === credentials.username &&
        cred.password === credentials.password
    );

    if (!isValid) {
      throw new Error("اسم المستخدم أو كلمة المرور غير صحيحة");
    }

    // Simulate login logic
    const userData = {
      id: 1,
      username: credentials.username,
      name: credentials.username === "admin" ? "المدير العام" : "المستخدم",
      email: `${credentials.username}@example.com`,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };
};
