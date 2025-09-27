import { create } from "zustand";
import { categoryApi } from "../components/categories/api/categoryApi";
import type {
  CategoryDTO,
  UpsertCategoryPayload,
} from "../components/categories/api/categoryApi";

type State = {
  categories: CategoryDTO[];
  loading: boolean;
  error?: string | null;
};

type Actions = {
  fetch: () => Promise<void>;
  upsert: (payload: UpsertCategoryPayload) => Promise<boolean>;
  removeCategory: (id: number) => Promise<boolean>;
  removeSubCategory: (mainId: number, subId: number) => Promise<boolean>;
};

export const useCategoryStore = create<State & Actions>((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  async fetch() {
    set({ loading: true, error: null });
    try {
      const data = await categoryApi.getAll();
      set({ categories: data, loading: false });
    } catch (e) {
      const message = e instanceof Error ? e.message : "فشل تحميل الفئات";
      set({ error: message, loading: false });
    }
  },

  async upsert(payload: UpsertCategoryPayload) {
    try {
      const ok = await categoryApi.upsert(payload);
      if (ok) {
        // refetch to sync counts/relations
        await get().fetch();
      }
      return ok;
    } catch {
      set({ error: "تعذر حفظ البيانات" });
      return false;
    }
  },

  async removeCategory(id: number) {
    try {
      const ok = await categoryApi.removeCategory(id);
      if (ok) {
        await get().fetch();
      }
      return ok;
    } catch {
      set({ error: "تعذر حذف الفئة" });
      return false;
    }
  },

  async removeSubCategory(mainId: number, subId: number) {
    try {
      const ok = await categoryApi.removeSubCategory(mainId, subId);
      if (ok) {
        await get().fetch();
      }
      return ok;
    } catch {
      set({ error: "تعذر حذف الفئة الفرعية" });
      return false;
    }
  },
}));
