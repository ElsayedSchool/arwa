// Ambient module declarations for JS/JSX components used in TS files
import type * as React from "react";

declare module "../suppliers/components/SuppliersTable" {
  export const SuppliersTable: React.FC<Record<string, unknown>>;
}

declare module "../suppliers/components/AddSupplierProductForm" {
  export const AddSupplierProductForm: React.FC<Record<string, unknown>>;
}

declare module "../suppliers/modals/EditPaymentModal" {
  export const EditPaymentModal: React.FC<Record<string, unknown>>;
}

declare module "../suppliers/modals/EditPriceModal" {
  export const EditPriceModal: React.FC<Record<string, unknown>>;
}
