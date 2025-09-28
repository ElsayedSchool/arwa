export interface Employee {
  id: string; // UUID from backend
  name: string; // composed from firstName + lastName or profile.name
  phone: string;
  salary: number;
  isActive: boolean;
  joinDate: string; // ISO string
  roles?: string[];
  isAdmin?: boolean;
}

export interface CreateEmployeeData {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  salary?: number; // optional, stored on profile
  roles?: string[]; // roles to assign
  isAdmin?: boolean;
}

export interface UpdateEmployeeData extends Partial<CreateEmployeeData> {
  id: string;
}
