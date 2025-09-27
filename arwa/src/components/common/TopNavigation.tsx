import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface TopNavigationProps {
  /** Current page title - optional, used for breadcrumb styling */
  currentPage?: string;
  /** Show all section links or just home link */
  showSectionLinks?: boolean;
  /** Custom class names for container */
  className?: string;
}

const TopNavigation: React.FC<TopNavigationProps> = ({
  currentPage,
  showSectionLinks = false,
  className = "",
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sectionLinks = [
    { key: "home", label: "الرئيسية", path: "/" },
    { key: "suppliers", label: "الموردين", path: "/dashboard/suppliers" },
    { key: "orders", label: "الطلبات", path: "/dashboard/orders" },
    { key: "categories", label: "الفئات", path: "/dashboard/categories" },
    { key: "reviews", label: "مراجعة الطلبات", path: "/dashboard/reviews" },
  ];

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {showSectionLinks ? (
        <>
          {sectionLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => navigate(link.path)}
              className={`text-sm font-medium px-2 py-1 rounded transition-colors ${
                currentPage === link.key
                  ? "text-blue-800 bg-blue-50"
                  : "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              }`}
            >
              {link.label}
            </button>
          ))}
        </>
      ) : (
        <button
          type="button"
          onClick={() => {
            console.log("Navigating to home from:", location.pathname);
            navigate("/");
          }}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm cursor-pointer hover:underline"
        >
          العودة للرئيسية
        </button>
      )}
    </div>
  );
};

export { TopNavigation };
