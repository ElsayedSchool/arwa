import api from "../../../services/api";
import type {
  Employee,
  CreateEmployeeData,
  UpdateEmployeeData,
} from "../models/employee";

type RawUser = Record<string, unknown> & {
  roles?: string[];
  isAdmin?: boolean;
};

const normalizeEmployee = (raw: RawUser): Employee => {
  const profile = (raw.userProfile as Record<string, unknown>) ?? {};
  const first =
    (raw.firstName as string) ?? (profile.firstName as string) ?? "";
  const last = (raw.lastName as string) ?? (profile.lastName as string) ?? "";
  const name = (profile.name as string) ?? `${first} ${last}`.trim();
  return {
    id: String(raw.id as string),
    name,
    phone: String((profile?.phoneNumber as string) ?? ""),
    salary: Number((profile.salary as number) ?? 0),
    isActive: Boolean(raw.isActive as boolean),
    joinDate: raw.createdAt
      ? new Date(raw.createdAt as string).toISOString()
      : new Date().toISOString(),
    roles: Array.isArray(raw.roles) ? raw.roles : undefined,
    isAdmin: typeof raw.isAdmin === "boolean" ? raw.isAdmin : undefined,
  };
};

export const employeeApi = {
  async getAll(): Promise<Employee[]> {
    try {
      const res = await api.get("/user/all");
      const payload: unknown = res.data;
      const getArray = (obj: unknown, key: string): unknown[] | null => {
        if (obj && typeof obj === "object") {
          const value = (obj as Record<string, unknown>)[key];
          return Array.isArray(value) ? value : null;
        }
        return null;
      };
      const arrUnknown = Array.isArray(payload)
        ? (payload as unknown[])
        : getArray(payload, "data") ??
          getArray(payload, "items") ??
          getArray(payload, "users") ??
          [];
      const arr = arrUnknown as RawUser[];
      return arr.map(normalizeEmployee);
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: unknown } };
        message?: string;
      };
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "حدث خطأ أثناء تحميل الموظفين";
      throw new Error(Array.isArray(msg) ? msg.join("\n") : String(msg));
    }
  },

  async create(data: CreateEmployeeData): Promise<boolean> {
    try {
      const res = await api.post("/user", {
        username: data.username,
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        roles: data.roles && data.roles.length ? data.roles : ["Staff"],
        isAdmin: Boolean(data.isAdmin),
        coinsBalance: 0,
        isActive: data.isActive,
        salary: data.salary,
      });
      return Boolean(res.data);
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: unknown } };
        message?: string;
      };
      const msg =
        e?.response?.data?.message || e?.message || "تعذر إنشاء الموظف";
      throw new Error(Array.isArray(msg) ? msg.join("\n") : String(msg));
    }
  },

  async update(data: UpdateEmployeeData): Promise<boolean> {
    try {
      const res = await api.post("/user", {
        id: data.id,
        username: data.username,
        password: data.password,
        confirmPassword: data.confirmPassword ?? data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        roles: data.roles && data.roles.length ? data.roles : undefined,
        isAdmin: typeof data.isAdmin === "boolean" ? data.isAdmin : undefined,
        coinsBalance: 0,
        isActive: data.isActive,
        salary: data.salary,
      });
      return Boolean(res.data);
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: unknown } };
        message?: string;
      };
      const msg =
        e?.response?.data?.message || e?.message || "تعذر تحديث بيانات الموظف";
      throw new Error(Array.isArray(msg) ? msg.join("\n") : String(msg));
    }
  },

  async deactivate(id: string, isActive: boolean): Promise<boolean> {
    try {
      const res = await api.post("/user/deactive", { id, isActive });
      return Boolean(res.data);
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: unknown } };
        message?: string;
      };
      const msg =
        e?.response?.data?.message || e?.message || "تعذر تغيير حالة الموظف";
      throw new Error(Array.isArray(msg) ? msg.join("\n") : String(msg));
    }
  },

  async remove(id: string): Promise<boolean> {
    try {
      const res = await api.put("/user/remove", { id });
      return Boolean(res.data);
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: unknown } };
        message?: string;
      };
      const msg = e?.response?.data?.message || e?.message || "تعذر حذف الموظف";
      throw new Error(Array.isArray(msg) ? msg.join("\n") : String(msg));
    }
  },

  async resetPassword(id: string, newPassword: string): Promise<boolean> {
    try {
      const res = await api.put("/user/changepassword", {
        id,
        newPassword,
        passwordConfirm: newPassword,
      });
      return Boolean(res.data);
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: unknown } };
        message?: string;
      };
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "تعذر إعادة تعيين كلمة المرور";
      throw new Error(Array.isArray(msg) ? msg.join("\n") : String(msg));
    }
  },
};
