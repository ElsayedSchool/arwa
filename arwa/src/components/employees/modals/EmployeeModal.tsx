import React, { useEffect, useState } from "react";
import { Modal } from "../../common/Modal";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import type {
  CreateEmployeeData,
  UpdateEmployeeData,
  Employee,
} from "../models/employee";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateEmployeeData | UpdateEmployeeData) => Promise<boolean>;
  employee?: Employee | null;
  loading?: boolean;
  error?: string | null;
}

const EmployeeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  employee,
  loading = false,
  error = null,
}) => {
  const isEditing = Boolean(employee);
  const [form, setForm] = useState<{
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    salary: string; // keep as string for input
    isActive: boolean;
    isAdmin: boolean;
    roles: string[];
    password: string;
    confirmPassword: string;
  }>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    salary: "0",
    isActive: true,
    isAdmin: false,
    roles: ["Staff"],
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      const nameParts = (employee.name || "").split(" ");
      const firstName = nameParts.slice(0, -1).join(" ") || employee.name;
      const lastName = nameParts.slice(-1).join(" ");
      setForm((prev) => ({
        ...prev,
        username: employee.name.replace(/\s+/g, ".").toLowerCase(),
        firstName,
        lastName,
        email: "",
        phoneNumber: employee.phone || "",
        salary: String(employee.salary ?? 0),
        isActive: employee.isActive,
        isAdmin: Boolean(employee.isAdmin),
        roles:
          employee.roles && employee.roles.length ? employee.roles : ["Staff"],
        password: "",
        confirmPassword: "",
      }));
    } else {
      setForm({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        salary: "0",
        isActive: true,
        isAdmin: false,
        roles: ["Staff"],
        password: "",
        confirmPassword: "",
      });
    }
    setErrors({});
  }, [employee, isOpen]);

  type FormKeys = keyof typeof form;
  const setField = (k: FormKeys, v: string | boolean | string[]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k as string]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "الاسم الأول مطلوب";
    if (!form.lastName.trim()) e.lastName = "الاسم الثاني مطلوب";
    if (!form.username.trim()) e.username = "اسم المستخدم مطلوب";
    if (!form.email.trim()) e.email = "البريد الإلكتروني مطلوب";
    const digits = form.phoneNumber.replace(/\D/g, "");
    if (!digits) e.phoneNumber = "رقم الهاتف مطلوب";
    else if (!/^01\d{9}$/.test(digits)) e.phoneNumber = "رقم الهاتف غير صحيح";
    const salaryNum = Number(form.salary || 0);
    if (Number.isNaN(salaryNum) || salaryNum < 0) e.salary = "الراتب غير صالح";
    // Password rules (backend requires strong password always on upsert)
    if (!isEditing || form.password) {
      const pw = form.password;
      if (
        pw.length < 8 ||
        !/[a-z]/.test(pw) ||
        !/[A-Z]/.test(pw) ||
        !/\d/.test(pw)
      ) {
        e.password =
          "كلمة المرور يجب أن تحتوي على حروف كبيرة وصغيرة وأرقام و8 أحرف على الأقل";
      }
      if (form.confirmPassword !== form.password)
        e.confirmPassword = "تأكيد كلمة المرور غير مطابق";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const base = {
      username: form.username,
      password: form.password,
      confirmPassword: form.confirmPassword,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phoneNumber: form.phoneNumber,
      isActive: form.isActive,
      salary: Number(form.salary || 0),
      roles: form.roles,
      isAdmin: form.isAdmin,
    };
    const payload: CreateEmployeeData | UpdateEmployeeData = employee
      ? { id: employee.id, ...base }
      : base;
    const ok = await onSave(payload);
    if (ok) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "تعديل موظف" : "إضافة موظف جديد"}
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم المستخدم *
            </label>
            <Input
              value={form.username}
              onChange={(e) => setField("username", e.target.value)}
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني *
            </label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الاسم الأول *
            </label>
            <Input
              value={form.firstName}
              onChange={(e) => setField("firstName", e.target.value)}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الاسم الثاني *
            </label>
            <Input
              value={form.lastName}
              onChange={(e) => setField("lastName", e.target.value)}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رقم الهاتف *
            </label>
            <Input
              value={form.phoneNumber}
              onChange={(e) => setField("phoneNumber", e.target.value)}
              className={errors.phoneNumber ? "border-red-500" : ""}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الراتب
            </label>
            <Input
              type="number"
              value={form.salary}
              onChange={(e) => setField("salary", e.target.value)}
              className={errors.salary ? "border-red-500" : ""}
            />
            {errors.salary && (
              <p className="text-red-500 text-sm mt-1">{errors.salary}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور {isEditing ? "(اتركها فارغة لعدم التغيير)" : "*"}
            </label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تأكيد كلمة المرور
            </label>
            <Input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setField("confirmPassword", e.target.value)}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الأدوار
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                "Admin",
                "Staff",
                "Supervisor",
                "Analysis",
                "Financial",
                "Visitor",
                "User",
              ].map((role) => (
                <label key={role} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.roles.includes(role)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setField(
                        "roles",
                        checked
                          ? Array.from(new Set([...(form.roles || []), role]))
                          : (form.roles || []).filter((r) => r !== role)
                      );
                    }}
                  />
                  <span className="text-sm">{role}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isAdmin}
                onChange={(e) => setField("isAdmin", e.target.checked)}
              />
              <span className="text-sm">منح صلاحيات المدير (isAdmin)</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            إلغاء
          </Button>
          <Button type="submit" disabled={loading} className="min-w-[120px]">
            {loading ? "جاري الحفظ..." : isEditing ? "تحديث" : "إضافة"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeModal;
