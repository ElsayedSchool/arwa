// Global ambient declarations for JS/JSX modules imported in TS files
import type * as React from "react";

declare module "../components/suppliers/components/SuppliersTable" {
  export const SuppliersTable: React.FC<Record<string, unknown>>;
}

declare module "../components/suppliers/components/AddSupplierProductForm" {
  export const AddSupplierProductForm: React.FC<Record<string, unknown>>;
}

declare module "../components/suppliers/modals/EditPaymentModal" {
  export const EditPaymentModal: React.FC<Record<string, unknown>>;
}

declare module "../components/suppliers/modals/EditPriceModal" {
  export const EditPriceModal: React.FC<Record<string, unknown>>;
}
